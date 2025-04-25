import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GraphQLService {
  private readonly apiUrl = 'https://takelessons.com/graphql/';

  async fetchReviews(id:string) {
    const query = `
      query GetReviews(
        $serviceProviderId: String!,
        $size: Int! = 1000,
        $skip: Int!,
        $reviewFilter: ReviewFilterInput,
        $reviewOrderBy: [ReviewOrderBy!]
      ) {
        reviews: ReviewsQueries_GetReviews(
          serviceProviderId: $serviceProviderId
          size: $size
          skip: $skip
          reviewFilter: $reviewFilter
          reviewOrderBy: $reviewOrderBy
        ) {
          reviewCount
          results {
            id
            serviceProviderId
            rating
            title
            body
            createdTime
            lastUpdatedTime
            isDeleted
            locationType
            userName
            user {
              displayName
              profileImage
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;

    const variables = {
      size: 1000,
      serviceProviderId: id,
      skip: 0,
      reviewOrderBy: ['NONE'],
      reviewFilter: {
        rating: 0,
      },
    };

    try {
      const response = await axios.post(this.apiUrl, {
        query,
        variables,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Data:', response.data);
      return response.data.data.reviews.results;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getSearchResults(subject:any): Promise<any> {
    const query = `
      query getSearchResults(
        $query: String!,
        $size: Int!,
        $skip: Int!,
        $scopes: [ServiceScope!],
        $gender: GenderType,
        $minPrice: Int,
        $maxPrice: Int,
        $onSale: Boolean,
        $backgroundCheck: Boolean,
        $availability: [DayOfWeek!],
        $timeRanges: [TimeRangeOfDayInput!],
        $orderBy: ServiceOfferingOrderBy!,
        $services: [String!],
        $locations: [LocationType!],
        $studentFavorite: Boolean,
        $consumerPromiseIds: [String!],
        $currentLocation: CoordinatesInput,
        $timeZoneId: String,
        $postalCode: String,
        $preferLocal: Boolean,
        $rankName: String,
        $curriculums: [Curriculum!],
        $grades: [Grade!],
        $categories: [Category!],
        $searchInAffiliates: Boolean,
        $skillLevel: [String!],
        $skipInferredServiceFilter: Boolean
      ) {
        searchResults: ServiceOfferingSpecsQueries_GetSearchResults(
          query: $query,
          size: $size,
          skip: $skip,
          scopes: $scopes,
          orderBy: $orderBy,
          postalCode: $postalCode,
          preferLocal: $preferLocal,
          rankName: $rankName,
          filter: {
            gender: $gender,
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            backgroundCheck: $backgroundCheck,
            availableDaysOfWeek: $availability,
            availableTimeRangesOfDay: $timeRanges,
            services: $services,
            locations: $locations,
            studentFavorite: $studentFavorite,
            consumerPromiseIds: $consumerPromiseIds,
            onSale: $onSale,
            timeZoneId: $timeZoneId,
            curriculums: $curriculums,
            grades: $grades,
            categories: $categories,
            searchInAffiliates: $searchInAffiliates,
            skillLevelNames: $skillLevel
          },
          currentLocation: $currentLocation,
          skipInferredServiceFilter: $skipInferredServiceFilter
        ) {
          totalCount
          inferredService
          isClassifiedService
          isAcademicSubject
          facets {
            key
            value {
              value
            }
          }
          results {
            document {
              destinationHref
              isWhatsAppOptedIn
              isPaidProvider
              serviceProviderLocation {
                locationType
                location {
                  state
                  city
                  normalCoordinates {
                    latitude
                    longitude
                  }
                }
              }
              startPrice {
                currency
                priceUnit
                price
                numberOfUnit
              }
              serviceOffering {
                tagLine
                description
                studentFavorite
                onSale
                providedLocationTypes
                curriculums
                grades
                service {
                  id
                  name
                }
                serviceProvider {
                  id
                  slug
                  tampaProviderId
                  displayName
                  profileImage
                  firstName
                  enableAskQuestion
                  providingStartFrom
                }
                service {
                  tampaServiceId
                  isClassified
                }
                serviceSpecialties {
                  name
                }
                serviceExperience {
                  unit
                  numberOfUnit
                }
                reviewSummary {
                  meanScore
                  reviewCount
                  scoreDistribution {
                    key
                    value
                  }
                }
                backgroundCheck {
                  performed
                  lastPerformed
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: subject,
      size: 20000,
      skip: 0,
      orderBy: "NONE",
      currentLocation: null,
      searchInAffiliates: false,
      skillLevel: [],
      skipInferredServiceFilter: true,
      services: [subject],
      backgroundCheck: true,
      scopes: ["TAKELESSONS"],
    };

    try {
      const response = await axios.post(this.apiUrl, {
        query,
        variables,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required
        },
      });
      return response;
    } catch (error) {
      for(let err of error.response?.data?.errors){
        console.log(err)
      }
      console.error('Error fetching search results:', {
        message: error.message,
        response: error.response?.data?.errors,
        config: error.config
      });
      throw error;
    }
  }

  async getProviderProfile(id: string) {
    try {
      const response = await axios.get(`https://takelessons.com/_next/data/0c7743c5d815a62c6eb8dbcab137fac0c11dc17f/en/profile/${id}.json`);
      const data = response.data.pageProps;
      delete data['_nextI18Next'];
      console.log(data);
      return data; // Return the processed data if needed
    } catch (error) {
      // Handle errors
      console.error('Error fetching provider profile:', error);
      throw error; // Or handle the error as appropriate
    }
  }
}
