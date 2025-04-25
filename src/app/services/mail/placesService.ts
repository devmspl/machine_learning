import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);
  private readonly keyFile: string = path.join(__dirname, '/../purple.json');

  constructor(private readonly config: ConfigService) {
    
  }

  async searchPlaces(query: string): Promise<any[]> {
    const apiKey = this.config.get("MAP_KEY");
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    try {
      const response = await axios.get(url, {
        params: {
          query: query,
          key: apiKey,
        },
      });
      return response.data.results;
    } catch (error) {
      this.logger.error('Error searching for places:', error.message);
      throw new HttpException('Error searching for places', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchWebsite(query,ctyName): Promise<any[]> {
    let lat,lng;
    if(ctyName == 'Hoboken'){
      lat = 40.745255;
      lng = -74.034775;
    }if(ctyName == 'Jersey City'){
      lat = 40.719074;
      lng = -74.050552;
    }
    const apiKey = this.config.get("MAP_KEY");
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    const request = {
      // location: { lat: 40.745255, lng: -74.034775 },  // Coordinates for Jersey City or nearby
      location: { lat: lat, lng: lng },
      radius: 50000,  // 50 km radius
      keyword: query,  // Search for studios
      types: ["establishment", "point_of_interest"],  // Search for establishments
  };

    try {
      const response = await axios.get(url, {
        params: {
          location: `${request.location.lat},${request.location.lng}`,  // Convert location to string
          radius: request.radius,
          keyword: request.keyword,
          type: request.types.join('|'),  // Join types as a pipe-separated string
          key: apiKey, // Replace with your actual API key
      },
      });
      return response.data.results;
    } catch (error) {
      this.logger.error('Error searching for places:', error.message);
      throw new HttpException('Error searching for places', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchPlacesAll(query: string): Promise<any[]> {
    const apiKey = this.config.get("MAP_KEY");
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const results = [];
    let nextPageToken = null;
  
    try {
      let response = await axios.get(url, {
        params: {
          query: query,
          key: apiKey
        }
      });
  
      // Collect initial results
      results.push(...response.data.results);
      console.log(results.length)
      // Check if there are more results
      nextPageToken = response.data.next_page_token;
  
      // Fetch additional pages if available
      while (nextPageToken) {
        // Wait for a short period before requesting the next page
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
  
        response = await axios.get(url, {
          params: {
            query: query,
            key: apiKey,
            pagetoken: nextPageToken
          }
        });
  
        results.push(...response.data.results);
  
        // Update the next page token
        nextPageToken = response.data.next_page_token;
      }
      console.log(results.length)
      return results;
  
    } catch (error) {
      console.error('Error searching for places:', error);
      throw error;
    }
  }
  async getPlaceDetails(placeId: string): Promise<any> {
    const apiKey = this.config.get("MAP_KEY");
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
    try {
      const response = await axios.get(url, {
        params: {
          place_id: placeId,
          key: apiKey,
        },
      });
      return response.data.result;
    } catch (error) {
      this.logger.error('Error fetching place details:', error.message);
      throw new HttpException('Error fetching place details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPlaceByWebsite(websiteUrl: string, query: string,ctyName): Promise<any> {
    try {
      // const places = await this.searchPlaces(`${query} in usa`);
      const places = await this.searchWebsite(query,ctyName);
      for (const place of places) {
        let details = await this.getPlaceDetails(place.place_id);
        if (details.website && this.matchesWebsiteUrl(websiteUrl, details.website)) {
          details['place_id'] = place.place_id;
          details['mapsLink'] = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
          return details;
        }
      }
      return null;
    } catch (error) {
      this.logger.error('Error finding place by website:', error.message);
      throw new HttpException('Error finding place by website', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async findPlaceByQuery(query: string,cityName:string): Promise<any> {
    try {
      const places = await this.searchPlacesAll(`${query} in ${cityName} in usa`);
      const result=[]
      for (const place of places) {
        const details = await this.getPlaceDetails(place.place_id);
        if (details.website) {
          result.push(details)
        }
      }
      return result;
    } catch (error) {
      this.logger.error('Error finding place by website:', error.message);
      throw new HttpException('Error finding place by website', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  matchesWebsiteUrl(websiteUrl: string, placeWebsite: string): boolean {
    const cleanUrl = (url: string) => {
      url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return url;
    };
    return cleanUrl(placeWebsite) === cleanUrl(websiteUrl);
  }

  async getBusinessProfile(locationId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locationId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      this.logger.log('Business Profile Details:', response.data);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching business profile:', error.message);
      throw new HttpException('Error fetching business profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const keyFileContent = fs.readFileSync(this.keyFile, 'utf8');
      const auth = new GoogleAuth({
        keyFile: this.keyFile,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      this.logger.log('Access Token:', accessToken.token);
      return accessToken.token;
    } catch (error) {
      this.logger.error('Error obtaining access token:', error.message);
      throw new HttpException('Error obtaining access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findDetails(website,ctyName?): Promise<any> {
    // for (const web of websites) {
      try {
        const details = await this.findPlaceByWebsite(this.cleanUrl(website), this.extractDomainName(website),ctyName);
        if (details) {
          this.logger.log('Place Details:');
          this.logger.log(`Name: ${details.name}`);
          this.logger.log(`Address: ${details.formatted_address}`);
          this.logger.log(`Phone Number: ${details.formatted_phone_number}`);
          this.logger.log(`Website: ${details.website}`);
          this.logger.log(`Rating: ${details.rating}`);
          this.logger.log(`Total Ratings: ${details.user_ratings_total}`);
          this.logger.log(`Location lat: ${details.geometry.location.lat}`);
          this.logger.log(`Location lng: ${details.geometry.location.lng}`);
          const providerData={
            name: details.name,
            addressLine1: details.formatted_address,
            phoneNumber: details.formatted_phone_number,
            website: details.website,
            rating: details.rating,
            totalRatings: details.user_ratings_total,
            location: {
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng
            },
            reviews:details.reviews,
            place_id:details.place_id,
            mapsLink:details.mapsLink
          }
          return providerData
        } else {
          this.logger.log('No matching place found for the given website URL:', website);
        }
      } catch (error) {
        this.logger.error('Error finding details for website:', website, error.message);
      }
    // }
  }
  async findProvidersByQuery(query,cityName): Promise<any[]> {
    // for (const web of websites) {
      try {
        const details = await this.findPlaceByQuery(query,cityName);
        const providers=[]
        if (details) {
          for(const detail of details){
          this.logger.log('Place detail:');
          this.logger.log(`Name: ${detail.name}`);
          this.logger.log(`Address: ${detail.formatted_address}`);
          this.logger.log(`Phone Number: ${detail.formatted_phone_number}`);
          this.logger.log(`Website: ${detail.website}`);
          this.logger.log(`Rating: ${detail.rating}`);
          this.logger.log(`Total Ratings: ${detail.user_ratings_total}`);
          this.logger.log(`Location lat: ${detail.geometry.location.lat}`);
          this.logger.log(`Location lng: ${detail.geometry.location.lng}`);
          const providerData={
            name: detail.name,
            addressLine1: detail.formatted_address,
            phoneNumber: detail.formatted_phone_number,
            website: detail.website,
            rating: detail.rating,
            totalRatings: detail.user_ratings_total,
            location: {
              lat: detail.geometry.location.lat,
              lng: detail.geometry.location.lng
            },
            reviews:detail.reviews
          }
          providers.push(providerData)
        }
          return providers
        } 
      } catch (error) {
        this.logger.error('Error finding details :', error.message);
      }
    // }
  }
  private extractDomainName(url: string): string {
    url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    return url.split('.')[0];
  }

  private cleanUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}
