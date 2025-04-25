import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path, { join } from 'path';
const fs = require('fs');
import * as XLSX from 'xlsx';
// const cron = require('node-cron');
import cron from 'node-cron';
const validUrl = require('valid-url');
const credPath = join(
  process.cwd(),
  'src',
  'app',
  'gemini',
  'cred',
  'cred.json',
);
import { Types } from 'mongoose';
import { UrlInterface } from 'src/@types/interfaces/url';
import { Url } from 'src/schemas/url.schema';
// import axios from 'axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom, queue, Subject } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { Webdump } from 'src/schemas/webdump.schema';
import { Queue } from 'src/schemas/queue.schema';
import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import { Cleandump } from 'src/schemas/cleandump.schema';
import { ChatGPT } from '@app/service/chatgpt';
import axios from 'axios';
import { Dummyprovider } from 'src/schemas/dummyprovider.schema';
import { isString } from 'util';
import { PlacesService } from '../services/mail/placesService';
import * as puppeteer from 'puppeteer';
import { createFieldSetDto } from './dto/fieldset.dto';
import { User } from 'src/schemas/user.schema';
import { Provider } from 'src/schemas/provider.schema';

import { Tags } from 'src/schemas/tags.schema';

import { Takelessionsubject } from 'src/schemas/takelessionsubject.schema';
import { Takelessioncategory } from 'src/schemas/takelessioncategory.schema';
import { UpdateTakeLessionCategoryDto } from './dto/takelessioncategory.dto';
import { UpdateTakeLessionSubjectDto } from './dto/takelessionsubject.dto';
import { Takelessiondump } from 'src/schemas/takelessiondump.schema';
import { Takelessionprovider } from 'src/schemas/takelessionprovider.schema';
const ObjectId = require('mongoose').Types.ObjectId;
import { GraphQLService } from './graphql.service';
import { Tasklessonreview } from 'src/schemas/tasklessonreview.schema';
import { Takelessonproviderjson } from 'src/schemas/takelessonproviderjson.schema';
import { Subjectprovider } from 'src/schemas/subjectprovider.schema';
import { TakelessonsubjectLessonsjson } from 'src/schemas/takelessonsubjectLessonsjson.schema';
import { Eventlink } from 'src/schemas/eventlink.schema';
import { Event } from 'src/schemas/event.schema ';
import { City } from './dto/organizer.dto';
import { Citymanagement } from 'src/schemas/citymanagement.schema';
// import { is } from 'cheerio/lib/api/traversing';
import moment from 'moment';
import { Event_source } from 'src/schemas/event_source.schema';
import * as mongoose from 'mongoose';
import slug from 'slugify';
import slugify from 'slugify';
import { Allschoolteacherinfojson } from 'src/schemas/allschoolteacherinfojson.schema';
// import { data } from 'cheerio/lib/api/attributes';
import { Allschoolprogramdump } from 'src/schemas/allschoolprogramdump.schema';
import { Allschoolproviderdump } from 'src/schemas/allschoolproviderdump.schema';
import { Schoolproviderreview } from 'src/schemas/schoolproviderreview.schema';
import { Schoolproviderintro } from 'src/schemas/schoolproviderintro.schema';
import { Schoolproviderprogram } from 'src/schemas/schoolproviderprogram.schema';
import { Schoolproviderprograminfo } from 'src/schemas/schoolproviderprograminfo.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Dummyprogram } from 'src/schemas/dummyprogram.schema';
// import { create } from 'domain';
const API_KEY = process.env.MAP_KEY;
function getCookieFromHeaders(
  headers: Record<string, string>,
  name: string,
): string | undefined {
  const cookieHeader = headers['cookie'] || '';
  const cookies = cookieHeader
    .split('; ')
    .reduce<Record<string, string>>((acc, cookie) => {
      const [cookieName, cookieValue] = cookie.split('=');
      acc[cookieName] = cookieValue;
      return acc;
    }, {});
  return cookies[name];
}

interface Organizer {
  name?: string;
  url?: string;
  orgWebsite?: string;
  description?: string;
  thumbnailLogo160?: string;
}

@Injectable()
export class UrlService {
  static filesFolder = 'excel_files';
  static ProviderfilesFolder = 'files';
  private readonly logger = new Logger(UrlService.name);
  private readonly httpService: HttpService = new HttpService();
  private cronJob: cron.ScheduledTask | null = null;
  private cronJobEvent: cron.ScheduledTask | null = null;
  private cronJobEventHobokenLibrary: cron.ScheduledTask | null = null;
  private cronJobEventHobokenPublicLibrary: cron.ScheduledTask | null = null;
  private cronJobEventJerseyCityCulture: cron.ScheduledTask | null = null;
  private cronJobEventHobokenMuseum: cron.ScheduledTask | null = null;
  private cronJobFamily: cron.ScheduledTask | null = null;
  private startCronarchiveOldEvents: cron.ScheduledTask | null = null;
  // private executeScrapingAndEventCreation :cron.ScheduledTask | null = null;
  constructor(
    @InjectModel(Url.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly urlModel: Model<Url>,
    @InjectModel(Event_source.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly event_sourceModel: Model<Event_source>,
    @InjectModel(Queue.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly queueModel: Model<Queue>,
    @InjectModel(User.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly userModel: Model<User>,
    @InjectModel(Provider.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly providerModel: Model<Provider>,
    @InjectModel(Webdump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly webdumpModel: Model<Webdump>,
    @InjectModel(Cleandump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly cleandumpModel: Model<Cleandump>,
    @InjectModel(Dummyprovider.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly dummyproviderModel: Model<Dummyprovider>,
  
    @InjectModel(Takelessiondump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessiondumpModel: Model<Takelessiondump>,
    @InjectModel(Takelessionsubject.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessionsubjectModel: Model<Takelessionsubject>,
    @InjectModel(Takelessioncategory.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessioncategoryModel: Model<Takelessioncategory>,
    @InjectModel(Takelessionprovider.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessionproviderModel: Model<Takelessionprovider>,
    @InjectModel(Tasklessonreview.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessionreviewModel: Model<Tasklessonreview>,
    @InjectModel(Takelessonproviderjson.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessonproviderjsonModel: Model<Takelessonproviderjson>,
    @InjectModel(Subjectprovider.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly subjectproviderModel: Model<Subjectprovider>,

    @InjectModel(Allschoolteacherinfojson.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly allschoolteacherinfojsonModel: Model<Allschoolteacherinfojson>,

    @InjectModel(Allschoolproviderdump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly allschoolproviderdumpModel: Model<Allschoolproviderdump>,

    @InjectModel(Schoolproviderreview.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly schoolproviderreviewModel: Model<Schoolproviderreview>,

    @InjectModel(Schoolproviderintro.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly schoolproviderintroModel: Model<Schoolproviderintro>,

    @InjectModel(Schoolproviderprogram.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly schoolproviderprogramModel: Model<Schoolproviderprogram>,

    @InjectModel(
      Schoolproviderprograminfo.name,
      DATABASE_CONNECTION.WEBSCRAPING,
    )
    private readonly schoolproviderprograminfoModel: Model<Schoolproviderprograminfo>,

    @InjectModel(Allschoolprogramdump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly allschoolprogramdumpModel: Model<Allschoolprogramdump>,
    @InjectModel(Dummyprogram.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly dummyprogramModel: Model<Dummyprogram>,
    @InjectModel(Citymanagement.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly citymanagementModel: Model<Citymanagement>,
    @InjectModel(
      TakelessonsubjectLessonsjson.name,
      DATABASE_CONNECTION.WEBSCRAPING,
    )
    private readonly takelessonsubjectLessonsjsonModel: Model<TakelessonsubjectLessonsjson>,
    @InjectModel(Eventlink.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly eventlinkModel: Model<Eventlink>,
    @InjectModel(Event.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly eventModel: Model<Event>,
    private placeService: PlacesService,
   
    @InjectModel(Tags.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly TagsModel: Model<Tags>,
    private graphQLService: GraphQLService,
  ) {
    this.startCron();
    this.startCron_jc_free_public_library();
    this.startCron_hoboken_city_library();
    this.startCron_hoboken_public_library();
    this.startCron_jersey_city_culture();
    this.startCron_hoboken_museum();
    this.startCronFamily();
    this.startCronarchiveOldEventss();
  }
  async createUrl(url: string): Promise<UrlInterface> {
    try {
      const res = await this.urlModel.findOne({ Fromurl: url });
      if (res) {
        return res;
      }
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:8000/crawl-website/', {
          params: { url },
        }),
      );
      const data = await new this.urlModel({
        Fromurl: url,
        urls: response.data.urls,
      }).save();
      return data;
    } catch (error) {
      console.log(error);
      throw error.response;
    }
  }

  async deleteUrl(id: string) {
    try {
      const res = await this.urlModel.findOneAndDelete({ _id: id });
      if (res) {
        return res;
      }
      return res;
    } catch (error) {
      console.log(error);
      throw error.response;
    }
  }

  async scratch_data(id: string): Promise<any[]> {
    console.log(id, 'id', id);
    try {
      const user = await this.userModel.findOne({ _id: id });
      console.log(user, 'user');
      const provider = await this.providerModel.findOne({ user: id });
      console.log(provider.website, 'provider');
      if (!provider && !user) {
        throw new Error('Provider not found 11111');
      }
      // if (wb) {
      //   return ['Dump Data already exists'];
      // }

      const providerDataFromGoogle = await this.placeService.findDetails(
        provider.website,
      );
      if (providerDataFromGoogle) {
        const dt = await this.webdumpModel.find({
          provider: user._id,
          source: 'google',
          url: 'googleapi',
          modifiedBy: 'google',
        });
        if (dt.length === 0) {
          await this.webdumpModel.create({
            url: 'googleapi',
            content: JSON.stringify(providerDataFromGoogle),
            provider: user._id,
            modifiedBy: 'google',
            source: 'google',
          });
        } else {
          console.log('Dump Data already exists');
        }
      }

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:8000/scrping/', {
          params: { url: provider.website },
        }),
      );

      if (!response || !response.data || !response.data.data) {
        // throw new Error('Invalid response structure from the scraping service 1');
        console.log('Invalid response structure from the scraping service 1');
      }

      const dta = response.data.data;
      let urls = [];
      for (let key in dta) {
        // Check if the URL starts with 'http://' or 'https://'
        if (key.startsWith('http://') || key.startsWith('https://')) {
          try {
            urls.push({ url: key, value: dta[key] });
            const d = await axios.get(key);
            const dt = await this.webdumpModel.find({
              provider: user._id,
              url: key,
              source: 'website',
              modifiedBy: 'python script',
            });
            if (dt.length === 0) {
              await this.webdumpModel.create({
                url: key,
                content: d.data,
                provider: user._id,
                modifiedBy: 'python script',
                source: 'website',
              });
            } else {
              console.log('Dump Data already exists');
            }
          } catch (axiosError) {
            console.error(
              `Failed to fetch or save data for URL ${key}:`,
              axiosError.message,
            );
          }
        } else {
          console.warn(`Skipped unsupported URL protocol: ${key}`);
        }
      }
      await this.getSocialMediaLink(user._id.toString());
      console.log('urls', urls);
      return urls;
    } catch (error) {
      console.error('An error occurred 1 :', error.message);
      throw error;
    }
  }

  async getSocialMediaLink(id: string): Promise<any> {
    try {
      const wb = await this.webdumpModel.find({ provider: id });

      if (!wb.length) {
        return ['Dump Data not exists'];
      }

      function extractSocialLinks(htmlContent: string) {
        const $ = cheerio.load(htmlContent);

        return {
          instagram: $("a[href*='instagram.com']").attr('href') || null,
          facebook: $("a[href*='facebook.com']").attr('href') || null,
          yelp: $("a[href*='yelp.com']").attr('href') || null,
          twitter: $("a[href*='twitter.com']").attr('href') || null,
          youtube: $("a[href*='youtube.com']").attr('href') || null,
        };
      }

      function isValidUrl(url: string | null): boolean {
        if (!url) return false;
        return (
          !url.includes('intent') &&
          !url.includes('redirect') &&
          !url.includes('url=')
        );
      }

      const uniqueLinks = {
        instagram: null,
        facebook: null,
        yelp: null,
        twitter: null,
        youtube: null,
      };

      for (let data of wb) {
        const htmlContent = data.content;
        const links = extractSocialLinks(htmlContent);

        for (const [platform, url] of Object.entries(links)) {
          if (!uniqueLinks[platform] && isValidUrl(url)) {
            uniqueLinks[platform] = url;
          }
        }

        // If all platforms have been found, break out of the loop
        if (Object.values(uniqueLinks).every((link) => link !== null)) {
          break;
        }
      }
      if (
        uniqueLinks.facebook !== null ||
        uniqueLinks.instagram !== null ||
        uniqueLinks.yelp !== null ||
        uniqueLinks.youtube !== null ||
        uniqueLinks.twitter !== null
      ) {
        const dt = await this.webdumpModel.find({
          provider: id,
          url: 'socialmedia',
          source: 'website',
          modifiedBy: 'Js script',
        });

        if (dt.length === 0) {
          await this.webdumpModel.create({
            url: 'socialmedia',
            content: JSON.stringify(uniqueLinks),
            modifiedBy: 'Js script',
            provider: id,
            source: 'website',
          });
        } else {
          console.log('Dump Data already exists');
        }
      }
      return uniqueLinks;
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async getDumpDataByQueueId(id: string) {
    try {
      const res = await this.webdumpModel.find({ provider: id });
      if (!res) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }
      return res;
    } catch (error) {
      console.log(error);
      throw error.response;
    }
  }

  async extractVisibleContent(html) {
    const $ = await cheerio.load(html);
    $(
      'style, noscript, iframe, footer, header, .adsbygoogle, .adsense, #disqus_thread, #disqus_thread *, nav, .wp-pagenavi, .wp-pagenavi *, script[src^="https://www.googletagmanager.com"], script[src^="https://www.clarity.ms"], script[src^="https://connect.facebook.net"]',
    ).remove();
    $('head').remove(); // Separate selector to remove the head element
    $('script').remove();
    return $('body').text().replace(/\s+/g, ' ').trim();
  }

  createEmptyFieldsString(provider) {
    let result = '';

    for (let key in provider) {
      if (!provider[key] || provider[key] === null) {
        if (result) result += ', '; // Add a comma and space if the result string is not empty
        result += key;
      }
    }

    return result;
  }

  createShareableLink(name, lat, lng) {
    // Encode the place name to ensure it's URL-safe
    const encodedName = encodeURIComponent(name);

    // Construct the Google Maps link using the name, latitude, and longitude
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedName},${lat},${lng}`;

    return googleMapsLink;
  }

  async cleanDumpDataById(id: string) {
    try {
      const res = await this.webdumpModel.findById({ _id: id });

      if (!res) {
        return;
        // throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      let dummyprovider = await this.dummyproviderModel.findOne({
        provider: res.provider,
      });
      if (!dummyprovider) {
        dummyprovider = await this.dummyproviderModel.create({
          provider: res.provider,
        });
      }
      const existingEntry = await this.cleandumpModel.findOne({ dumpId: id });

      if (existingEntry) {
        return 'Dump Data already exists';
      }

      if (res.source !== 'website') {
        if (res.source === 'google') {
          const content = JSON.parse(res.content);
          dummyprovider.businessName = [content.name];
          dummyprovider.recommended_businessName = content.name;
          dummyprovider.address = [content.addressLine1];
          dummyprovider.recommended_address = content.addressLine1;
          dummyprovider.phonenumbers = content.phoneNumber
            ? [content.phoneNumber]
            : [];
          dummyprovider.recommended_phonenumbers = content.phoneNumber;
          dummyprovider.google_rating = content.rating;
          dummyprovider.google_rating_count = content.totalRatings;
          dummyprovider.website = content.website;
          dummyprovider.lat = content.location.lat;
          dummyprovider.lng = content.location.lng;
          dummyprovider.place_id = content.place_id || '';
          dummyprovider.google_url = content.mapsLink
            ? content.mapsLink
            : this.createShareableLink(
                content.name,
                content.location.lat,
                content.location.lng,
              );
          // dummyprovider.location=content.location
          dummyprovider.google_reviews = content.reviews;
          await dummyprovider.save();
        }
        const dt = await this.cleandumpModel.create({
          url: res.url,
          source: res.source,
          content: res.content,
          provider: res.provider,
          dumpId: res._id,
          filter_detail: [res.content],
        });
        return dt;
      }
      if (res.url == 'socialmedia') {
        await this.updateDummyProviderLikesAndFollowers(res.provider);
        const dt = await this.cleandumpModel.create({
          url: res.url,
          source: res.source,
          content: res.content,
          provider: res.provider,
          dumpId: res._id,
          filter_detail: [res.content],
        });
        const content = JSON.parse(res.content);
        console.log('content ====>>>>', content);
        dummyprovider.twitter_url = content.twitter;
        dummyprovider.facebook_url = content.facebook;
        dummyprovider.instagram_url = content.instagram;
        dummyprovider.yelp_url = content.yelp;
        dummyprovider.youtube_url = content.youtube;
        await dummyprovider.save();
        return dt;
      }

      // Extract text only, removing all tags and extra whitespace
      let text = await this.extractVisibleContent(res.content);

      // Clean up the text
      text = text.replace(/\s+/g, ' ').trim();
      // Remove CDATA sections
      text = text.replace(/<!\[CDATA\[.*?\]\]>/gs, '');

      // Remove any remaining scripts or JS code blocks
      text = text.replace(/<script.*?>.*?<\/script>/gs, '');

      // Further clean up any other unwanted patterns
      text = text.replace(/\/\*.*?\*\//gs, ''); // Removes CSS or JS comments

      text = text.replace(/var\s+\w+\s*=\s*{.*?};/gs, ''); // Removes JS variable declarations

      text = text.replace(
        /\"(ajax_url|gf_currency_config|base_url|number_formats|spinnerUrl)\":\".*?\"/gs,
        '',
      ); // Removes specific variable assignments

      // Trim any leading/trailing whitespace
      let Dtext = text.trim().toLowerCase();

      const Providerkeywords = [
        'name',
        'email',
        'phone',
        'website',
        'location',
        'address',
        'businessName',
        'businessname',
        'addressLine1',
        'rating',
        'contact',
        'phoneNumber',
        'contactNumber',
        'service',
        'hours',
        'services',
        'company',
        'organization',
        'locationDetails',
        'contactInfo',
        'emailAddress',
        'websiteURL',
        'socialMedia',
        'businessAddress',
        'mainOffice',
        'headquarters',
        'branch',
      ];

      const Programkeywords = [
        'education',
        'activity',
        'games',
        'events',
        'children',
        'kids',
        'child care',
        'curriculum',
        'class',
        'workshop',
        'session',
        'training',
        'tutorial',
        'lesson',
        'enrollment',
        'course',
        'preschool',
        'toddler',
        'early learning',
        'after school',
        'summer camp',
        'program',
        'age',
        'agegroup',
        'ages',
        'ages group',
        'age groups',
        'dropout',
        'dropin',
        'activities',
        'learning',
        'development',
        'educationProgram',
        'specialNeeds',
        'playgroup',
        'preschoolProgram',
        'caregiver',
        'open',
        'close',
        'childDevelopment',
        'learningCenter',
        'afterschoolCare',
        'childhoodEducation',
        'youthProgram',
        'earlyEducation',
        'parentingClass',
        'enrichment',
      ];

      const isKeywordPresent = (keywords: string[], text: string) => {
        return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
      };

      const isProvider = isKeywordPresent(Providerkeywords, Dtext);
      console.log('isProvider ====>>>', isProvider);

      const isProgram = isKeywordPresent(Programkeywords, Dtext);
      console.log('isProgram ====>>>', isProgram);
      if (!isProvider && !isProgram) {
        return 'Not Found';
      }
      if (isProvider) {
        const checkMainPage = !res.url.split('/')[3];
        const searchValue1 = `Extract the following details from the content below:{${
          !checkMainPage && !dummyprovider.discription ? "about:''" : ''
        },email:'', phoneNumber:'',addressLine1:'',partyServices :boolean,privateInstructionTutoring :boolean,earlyDropOffLatePickup :boolean,transportServices :boolean , category: string[], subcategory: string[]}  in json format like please provide me data only inside my text not self made data {about:'',partyServices :boolean,privateInstructionTutoring :boolean,earlyDropOffLatePickup :boolean,transportServices :boolean, category: string[], subcategory: string[]}".
            Content: ${Dtext}`;
        console.log('searchValue1 ====>>>', searchValue1);

        // const searchValue = `${queue.urls[0]} country ${city.country} state ${city.state} city ${city.city} and zipcode ${city.zipcode} with valid location valid email and proper landmark Please find valid and correct provider details from this url i need fields as it is "firstName, email, phoneNumber, location, addressLine1,
        // in json format like {firstName:'',email:'', phoneNumber:'',location:{lng:'',lat:''},addressLine1:''}"`;

        const chatgpt = new ChatGPT(
          'YOUR_OPENAI_KEY',
        );

        let [err, chat_response] = await chatgpt.createCompletion(searchValue1);
        if (err) {
          return;
        }
        let responseData = chat_response[0].message.content;
        if (isString(responseData)) {
          const jsonDataString = this.getDateStringToJSON(responseData);
          // Parsing the JSON string into a JavaScript object
          try {
            responseData = jsonDataString
              ? JSON.parse(jsonDataString)
              : JSON.parse(responseData);
            if (responseData) {
              const providerData = {
                about: responseData.about,
                email: responseData.email,
                phoneNumber: responseData.phoneNumber,
                addressLine1: responseData.addressLine1,
                partyServices: responseData.partyServices,
                privateInstructionTutoring:
                  responseData.privateInstructionTutoring,
                earlyDropOffLatePickup: responseData.earlyDropOffLatePickup,
                transportServices: responseData.transportServices,
                category: responseData.category,
                subcategory: responseData.subcategory,
              };
              console.log('providerData====>>>>', providerData);
              if (!dummyprovider.discription)
                dummyprovider.discription = providerData.about
                  ? providerData.about
                  : '';
              providerData.email &&
              !dummyprovider.emails.includes(providerData.email) &&
              providerData.email !== 'N/A' &&
              providerData.email !== '[email protected]'
                ? dummyprovider.emails.push(providerData.email)
                : '';
              providerData.phoneNumber &&
              !dummyprovider.phonenumbers.includes(providerData.phoneNumber) &&
              providerData.phoneNumber !== 'N/A'
                ? dummyprovider.phonenumbers.push(providerData.phoneNumber)
                : '';
              providerData.addressLine1 &&
              !dummyprovider.address.includes(providerData.addressLine1) &&
              providerData.addressLine1 !== 'N/A'
                ? dummyprovider.address.push(providerData.addressLine1)
                : '';
              //  providerData.category && !dummyprovider.category.includes(providerData.category)?dummyprovider.category.push(providerData.category):''
              //  providerData.subcategory && !dummyprovider.subcategory.includes(providerData.subcategory)?dummyprovider.subcategory.push(providerData.subcategory):''
              if (!dummyprovider.partyServices)
                dummyprovider.partyServices = providerData.partyServices;
              if (!dummyprovider.privateInstructionTutoring)
                dummyprovider.privateInstructionTutoring =
                  providerData.privateInstructionTutoring;
              if (!dummyprovider.earlyDropOffLatePickup)
                dummyprovider.earlyDropOffLatePickup =
                  providerData.earlyDropOffLatePickup;
              if (!dummyprovider.transportServices)
                dummyprovider.transportServices =
                  providerData.transportServices;
              dummyprovider.subcategory = [
                ...dummyprovider.subcategory,
                ...providerData.subcategory,
              ];
              dummyprovider.category = [
                ...dummyprovider.category,
                ...providerData.category,
              ];
              await dummyprovider.save();
            } else {
            }
          } catch (error) {
            console.error('Error parsing JSON data:', error);
          }
        } else {
          console.error(
            'contentString isString(contentString) No JSON data found in the Markdown string.',
            responseData,
          );
        }
        // const responseData = await this.geminiService.searchVertexAi(searchValue1, res.queue);
        // console.log('responseData ====>>>', responseData);

        if (responseData) {
          // discription:"",partyServices :boolean,privateInstructionTutoring :boolean,earlyDropOffLatePickup :boolean,transportServices :boolean

          const dt = this.cleandumpModel.create({
            url: res.url,
            source: res.source,
            content: Dtext.trim(),
            provider: res.provider,
            dumpId: res._id,
            filter_detail: responseData,
            isProvider: isProvider,
            isProviderDataAvailable: isProvider,
            isProgramDataAvailable: isProgram,
            isProgram: isProgram,
          });
          return dt;
        }
      } else {
        return;
      }

      // Return cleaned text
    } catch (error) {
      console.log(error);
      // throw error.response;
    }
  }
  async cleanDumpDataByQueue(id: string, status?) {
    try {
      const res = await this.webdumpModel
        .find({ provider: id })
        .sort({ source: 1 });
      if (!res || res.length === 0) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }
      const user = await this.userModel.findOne({ _id: id });
      console.log('res length ==> ', res.length);
      let ii = 0;
      // Iterate over the results and clean the text
      if (status !== 'cleansed') {
        for (let dta of res) {
          await this.cleanDumpDataById(dta._id.toString());
          if (ii < 4) {
            ii++;
            if (dta.source === 'website')
              await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait for 15 seconds
          } else {
            ii = 0;
            if (dta.source === 'website')
              await new Promise((resolve) => setTimeout(resolve, 80000)); // Wait for 80 seconds
          }
        }
        try {
          await this.getAllWebsiteImages(id);
        } catch (error) {
          console.log(error);
        }
        user.stage = 'cleansed';
        await user.save();
      }
      // Return success after processing all items
      this.cleanCategoryAndSubcategory(id);
      return { message: 'Cleaned all dump data successfully' };
    } catch (error) {
      console.log(error);
      // throw new HttpException(
      //   error.message || 'Internal Server Error',
      //   error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async cleanCategoryAndSubcategory(id) {
    let provider = await this.dummyproviderModel.findOne({ provider: id });
    if (!provider)
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    const { category, subcategory } = provider;
    this.providerCategoryScript(provider._id, category, subcategory, id);
    return provider;
  }

  async providerCategoryScript(
    providerId: any,
    categories: any[],
    subcategories: any[],
    userId,
  ) {
    try {
      // Fetch queues with status 'accepted'
      

      // Process each queue
      // Construct searchValue from queue URLs and required fields
      const searchValue = `Please find categories name from this list :-${categories} and  only select from this list  and else give null  in json format { categories : string[]}"`;
      // Call Google AI API and fetch response
      // const responseData = await this.callGoogleAI(searchValue);

      // const responseData = await this.geminiService.searchVertexAi(searchValue, providerId);

      // let contentString = responseData;
      const chatgpt = new ChatGPT(
        'YOUR_OPENAI_KEY',
      );

      let [err, chat_response] = await chatgpt.createCompletion(searchValue);

      let contentString = chat_response[0].message.content;
      console.log('contentString ===>>>>', contentString);
      if (isString(contentString)) {
        const jsonRegex =
          /```json([\s\S]+?)```|{[^{}]*}|```markdown\n({[\s\S]*})\n```|```(?:json)?\n([\s\S]+?)```|\{(?:[^{}]|(?:\{(?:[^{}]|)*\}))*\}/;

        // Extracting the JSON string from the Markdown string
        const jsonDataMatch = contentString.match(jsonRegex);

        if (jsonDataMatch) {
          const jsonDataString =
            jsonDataMatch[1] ||
            jsonDataMatch[2] ||
            jsonDataMatch[3] ||
            jsonDataMatch[4];

          contentString = jsonDataString
            ? JSON.parse(jsonDataString)
            : JSON.parse(contentString);

          try {
            if (contentString) {
              const regexPatterns = this.generateRegexPatterns(
                contentString.categories,
              );

            }
          } catch (error) {
            console.error('Error processing provider data:', error);
            // throw new Error("Error processing provider data.");
          }
        } else {
          console.error('No JSON data found in the Markdown string.');
          // throw new Error("No JSON data found.");
        }
      }
      // Return success message if all queues are processed
      return 'All queues processed successfully.';
    } catch (error) {
      // Handle errors
      console.error('Error processing queues:', error);
      // return error.message;
    }
  }
  generateRegexPatterns(content) {
    const words = content.flatMap((item) => item.split(' '));
    return words.map((word) => new RegExp(`\\b${word}\\b`, 'i')); // "i" for case-insensitive matching
  }

  async providerSubCategoryScript(
    providerId: string,
    categories,
    subcategories,
    userId,
  ) {
    try {
      // Fetch queues with status 'accepted'
      const category = await this.TagsModel.aggregate([
        {
          $match: {
            isActivated: true,
            categoryIds: { $in: categories },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
          },
        },
      ]);
      console.log('Tags====>>>>>>>', category);
      // Process each queue
      // Construct searchValue from queue URLs and required fields
      const searchValue = `Please find subjects name from this list :-${subcategories} and select from this list :- ${category.map(
        (tag) => tag.name,
      )} else give null in json format { subjects : string[]}"`;
      // Call Google AI API and fetch response
      // const responseData = await this.callGoogleAI(searchValue);

      // const responseData = await this.geminiService.searchVertexAi(searchValue,providerId);

      // let contentString = responseData;
      const chatgpt = new ChatGPT(
        'YOUR_OPENAI_KEY',
      );

      let [err, chat_response] = await chatgpt.createCompletion(searchValue);

      let contentString = chat_response[0].message.content;
      console.log('contentString ===>>>>', contentString);
      if (isString(contentString)) {
        const jsonRegex =
          /```json([\s\S]+?)```|{[^{}]*}|```markdown\n({[\s\S]*})\n```|```(?:json)?\n([\s\S]+?)```|\{(?:[^{}]|(?:\{(?:[^{}]|)*\}))*\}/;

        // Extracting the JSON string from the Markdown string
        const jsonDataMatch = contentString.match(jsonRegex);

        if (jsonDataMatch) {
          const jsonDataString =
            jsonDataMatch[1] ||
            jsonDataMatch[2] ||
            jsonDataMatch[3] ||
            jsonDataMatch[4];

          contentString = jsonDataString
            ? JSON.parse(jsonDataString)
            : JSON.parse(contentString);

          try {
            if (contentString) {
              console.log('dddaa====>>>>>>>', contentString);
              const regexPatterns = this.generateRegexPatterns(
                contentString.subjects,
              );

              // Find documents where any word in name field matches any regex pattern
              const result = await this.TagsModel.find({
                $or: regexPatterns.map((regex) => ({
                  name: { $regex: regex },
                })),
              });

              console.log(
                'tag====>>>>>>>',
                result.map((tag) => tag._id),
              );
              const user = await this.dummyproviderModel.findByIdAndUpdate(
                { _id: providerId },
                {
                  $set: {
                    finalSubcategory: result.length
                      ? result.map((tag) => tag._id)
                      : [],
                  },
                },
                { new: true },
              );
              // Update Provider
              // }
              // this.setProviderDataFromFinal(userId);
            }
          } catch (error) {
            console.error('Error processing provider data:', error);
            // throw new Error("Error processing provider data.");
          }
        } else {
          console.error('No JSON data found in the Markdown string.');
          // throw new Error("No JSON data found.");
        }
      }

      // Return success message if all queues are processed
      return 'All queues processed successfully.';
    } catch (error) {
      // Handle errors
      console.error('Error processing queues:', error);
      // return error.message;
    }
  }

  async getCleanDumpDataByQueueId(id: string) {
    try {
      const provider = await this.userModel.findOne({ _id: id });
      if (!provider) {
        throw new Error('Provider not found 22222');
      }
      const res = await this.cleandumpModel.find({ provider: provider._id });

      if (!res) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      return res;
    } catch (error) {
      console.log(error);
      throw error.response;
    }
  }
  async dumpDataByProviderId(id: string, req) {
    try {
      let provider = await this.userModel.findOne({ _id: id });
      console.log('provider 357====>>>>>>>', provider);
      if (!provider) {
        throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
      }
      if (!provider.stage || provider.stage === 'pending') {
        console.log('create refreshscratch_data start====>>>>>>>');
        const rcd = await this.refreshscratch_data(id, 'all');
        console.log('rcd====>>>>>>>', rcd);
        const rcd1 = await this.refreshscratch_data(id, 'socialmedia');
        console.log('rcd1====>>>>>>>', rcd1);
        const sdcgpt = await this.scratchDataByChatGpt(id);
        console.log('sdcgpt====>>>>>>>', sdcgpt);
        try {
          const sdcgmini = await this.scratchDataByGemini(id, req);
          console.log('sdcgmini====>>>>>>>', sdcgmini);
        } catch (error) {
          console.log(' Gemini dump not created');
        }
        provider.stage = 'dumped';
        await provider.save();
        const clrdata = await this.cleanDumpDataByQueue(id);
        console.log('clrdata====>>>>>>>', clrdata);
        return 'All Data processed successfully.';
      } else if (provider.stage === 'dumped' || provider.stage === 'cleansed') {
        const clrdata1 = await this.cleanDumpDataByQueue(id, provider.stage);
        console.log('clrdata1====>>>>>>>', clrdata1);
        return 'All Data processed successfully.';
      } else {
        return 'Already scrapped data';
      }
    } catch (error) {}
  }
  async dumpDataByCityId(id: string, req) {
    const users = await this.userModel
      .find({
        status: 'Unverfied',
        role: 'provider',
        cityId: id,
        $or: [{ stage: { $exists: false } }, { stage: { $ne: 'completed' } }],
      })
      .sort({ firstName: 1 });
    console.log(users.length, id);
    for (let user of users) {
      await this.dumpDataByProviderId(user._id.toString(), req);
    }
  }
  async setProviderDataFromFinal(id) {
    console.log('setProviderDataFromFinal', id);
    let user = await this.userModel.findById(id);
    const dummyprovider = await this.dummyproviderModel.findOne({
      provider: user._id,
    });
    const provider = await this.providerModel.findOne({ user: id });
    if (!provider && !user && !dummyprovider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }
    if (dummyprovider.recommended_businessName) {
      user.firstName = dummyprovider.recommended_businessName;
    } else {
      if (dummyprovider.businessName && dummyprovider.businessName.length)
        user.firstName = dummyprovider.businessName[0];
    }
    if (dummyprovider.recommended_address) {
      
      
    } else {
      if (dummyprovider.address && dummyprovider.address.length) {
        
      }
    }
    if (dummyprovider.recommended_phonenumbers) {
      
    } else {
      if (dummyprovider.phonenumbers && dummyprovider.phonenumbers.length) {
        
      }
    }
    if (dummyprovider.recommended_emails) {
      console.log('recommended_emails', dummyprovider.recommended_emails);
      
    } else {
      if (dummyprovider.emails && dummyprovider.emails.length) {
        console.log('dummyprovider.emails', dummyprovider.emails);
        
      }
    }
    provider.rating.googleLink = dummyprovider.google_url;
    provider.rating.numberOfGoogle = dummyprovider.google_rating_count;
    provider.rating.googleRating = dummyprovider.google_rating;
    provider.rating.facebookLink = dummyprovider.facebook_url;
    provider.rating.numberOfFacebook = dummyprovider.facebook_followers;
    provider.rating.facebookRating = dummyprovider.facebook_rating;
    provider.rating.yelpLink = dummyprovider.yelp_url;
    provider.rating.numberOfYelp = dummyprovider.yelp_followers;
    provider.rating.yelpRating = dummyprovider.yelp_rating;
    provider.rating.instagramLink = dummyprovider.instagram_url;
    provider.rating.instagramFollowers = dummyprovider.instagram_followers;
    user.note = dummyprovider.discription;
    user.avatarImages = dummyprovider.facebook_profile_image;
    provider.providePartyServices = dummyprovider.partyServices;
    provider.providePrivateInstruction =
      dummyprovider.privateInstructionTutoring;
    provider.earlyDrop_off_LatePick_up = dummyprovider.earlyDropOffLatePickup;
    provider.provideTransportServicesToAndFromTheVenue =
      dummyprovider.transportServices;
    provider.categories = dummyprovider.finalCategory;
    provider.last_reviewed = dummyprovider.createdOn;
    provider.subCategoryIds = dummyprovider.finalSubcategory;
    provider.provider_gallery = dummyprovider.website_images;
    user.stage = 'completed';
    await provider.save();
    await user.save();
    return 'All Data processed successfully.';
  }
  getDateStringToJSON(contentString) {
    const jsonRegex =
      /```json([\s\S]+?)```|{[^{}]*}|```markdown\n({[\s\S]*})\n```|```(?:json)?\n([\s\S]+?)```|\{(?:[^{}]|(?:\{(?:[^{}]|)*\}))*\}/;

    // Extracting the JSON string from the first Markdown string
    const jsonDataMatch = contentString.match(jsonRegex);

    console.log('jsonDataMatch====>>>>', jsonDataMatch);
    // Extracting the JSON string from the Markdown string
    // let jsonDataMatch = programDetail.match(jsonRegex);
    if (jsonDataMatch) {
      const jsonDataString =
        jsonDataMatch[1] ||
        jsonDataMatch[2] ||
        jsonDataMatch[3] ||
        jsonDataMatch[4];

      if (jsonDataString) {
        return jsonDataString;
      }
      return null;
    }
    return null;
  }
  async extractData(textContent: string) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
    const likesRegex = /(\d+(\.\d+)?[KM]?)\s*likes/i;
    const followersRegex = /(\d+(\.\d+)?[KM]?)\s*followers/i;
    const ratingRegex = /(\d+(\.\d+)?%)\s*recommend/i;
    const reviewsRegex = /\((\d+)\s*reviews?\)/i;
    const reviewDetailRegex = /([\w\s]+):\s*([^"]+)/g;

    const emailMatches = textContent.match(emailRegex) || [];
    const likesMatch = textContent.match(likesRegex);
    const followersMatch = textContent.match(followersRegex);
    const ratingMatch = textContent.match(ratingRegex);
    const reviewsMatch = textContent.match(reviewsRegex);
    let reviewDetails = [];
    let match;
    while ((match = reviewDetailRegex.exec(textContent)) !== null) {
      const reviewer = match[1].trim();
      const review = match[2].trim();

      // Filter out reviews that contain too many "Facebook" mentions or other unwanted text
      if (review.includes('Facebook') || review.includes('Like')) {
        continue;
      }
      console.log('reviewer====>>>>', reviewer);
      console.log('review====>>>>', review);
      reviewDetails.push({ reviewer, review });
    }
    function convertToNumber(str: string): number | null {
      if (!str) return null;
      const factor = str.includes('K') ? 1000 : str.includes('M') ? 1000000 : 1;
      return parseFloat(str.replace(/[KM]/, '')) * factor;
    }
    function convertPercentage(str: string): number | null {
      return str ? parseFloat(str.replace('%', '')) : null;
    }
    console.log('emailMatches====>>>>', emailMatches);
    return {
      emails: emailMatches,
      recommended_emails: emailMatches,
      likes: likesMatch ? convertToNumber(likesMatch[1]) : null,
      followers: followersMatch ? convertToNumber(followersMatch[1]) : null,
      rating: ratingMatch ? convertPercentage(ratingMatch[1]) : null,
      reviews: reviewsMatch ? parseInt(reviewsMatch[1], 10) : null,
      reviewDetails: reviewDetails,
    };
  }
  async getTextContent(url: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      ignoreHTTPSErrors: true,
      executablePath: '/usr/bin/chromium-browser',
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const extractedData = await page.evaluate(() => {
      const textContent = document.body.innerText;

      const facebookProfileImage =
        document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute('content') || '';
      const facebookBannerImage =
        document
          .querySelector('meta[property="og:image:secure_url"]')
          ?.getAttribute('content') || facebookProfileImage; // Default to profile image if banner is not found

      return {
        textContent,
        facebookProfileImage,
        facebookBannerImage,
      };
    });

    console.log('extractedData====>>>>', extractedData);
    await browser.close();

    // Extract data from textContent if needed
    const dataFromTextContent = await this.extractData(
      extractedData.textContent,
    );

    return {
      ...dataFromTextContent,
      facebookProfileImage: extractedData.facebookProfileImage,
      facebookBannerImage: extractedData.facebookBannerImage,
    };
  }
  convertRatingToScale(ratingOutOf100: number): number {
    if (ratingOutOf100 < 0 || ratingOutOf100 > 100) {
      throw new Error('Rating out of 100 must be between 0 and 100.');
    }
    return (ratingOutOf100 / 100) * 5;
  }
  async updateDummyProviderLikesAndFollowers(id: string) {
    const dt = await this.webdumpModel.find({
      provider: id,
      url: 'socialmedia',
    });
    console.log('dt ====>>>>', dt);
    if (!dt || dt.length === 0) {
      throw new Error('Data not found or missing content');
    }

    try {
      let providerData = {
        emails: [],
        recommended_emails: '',
        facebook_likes: 0,
        facebook_followers: 0,
        yelp_likes: 0,
        yelp_followers: 0,
        twitter_likes: 0,
        twitter_followers: 0,
        youtube_likes: 0,
        youtube_followers: 0,
        instagram_likes: 0,
        instagram_followers: 0,
        facebook_rating: 0,
        facebook_reviews: 0,
        yelp_rating: 0,
        yelp_reviews: 0,
        facebook_review_details: [],
        facebook_profile_image: '',
        facebook_banner_image: '',
        instagram_profile_image: '',
        instagram_banner_image: '',
      };

      for (const doc of dt) {
        const content = JSON.parse(doc.content);
        console.log('content ====>>>>', content);

        const urls = [
          { type: 'twitter', url: content.twitter },
          { type: 'facebook', url: content.facebook },
          { type: 'instagram', url: content.instagram },
          { type: 'yelp', url: content.yelp },
          { type: 'youtube', url: content.youtube },
        ];

        for (const { type, url } of urls) {
          if (url) {
            const extractedData = await this.getTextContent(url);
            console.log('extractedData ====>>>>', extractedData);

            if (type === 'twitter') {
              providerData.twitter_likes = extractedData.likes;
              providerData.twitter_followers = extractedData.followers;
            }
            if (type === 'facebook') {
              providerData.facebook_likes = extractedData.likes;
              providerData.facebook_followers = extractedData.followers;
              providerData.facebook_rating =
                this.convertRatingToScale(extractedData.rating) ||
                extractedData.rating;
              providerData.facebook_reviews = extractedData.reviews;
              providerData.facebook_review_details =
                extractedData.reviewDetails;
              providerData.facebook_profile_image =
                extractedData.facebookProfileImage; // Assign profile image
              providerData.facebook_banner_image =
                extractedData.facebookBannerImage; // Assign banner image
            }
            if (type === 'instagram') {
              providerData.instagram_likes = extractedData.likes;
              providerData.instagram_followers = extractedData.followers;
              providerData.instagram_profile_image =
                extractedData.facebookProfileImage; // Assign profile image
              providerData.instagram_banner_image =
                extractedData.facebookBannerImage; // Assign banner image
            }
            if (type === 'yelp') {
              providerData.yelp_likes = extractedData.likes;
              providerData.yelp_followers = extractedData.followers;
              providerData.yelp_rating = extractedData.rating;
              providerData.yelp_reviews = extractedData.reviews;
            }
            if (type === 'youtube') {
              providerData.youtube_likes = extractedData.likes;
              providerData.youtube_followers = extractedData.followers;
            }
            if (extractedData.emails.length > 0) {
              providerData.emails.push(...extractedData.emails);
              providerData.recommended_emails = extractedData.emails.join(', ');
            }
          }
        }
      }

      const provider = await this.dummyproviderModel.updateOne(
        { provider: id },
        {
          $set: {
            facebook_likes: providerData.facebook_likes,
            facebook_followers: providerData.facebook_followers,
            facebook_rating: providerData.facebook_rating,
            facebook_reviews: providerData.facebook_reviews,
            instagram_likes: providerData.instagram_likes,
            instagram_followers: providerData.instagram_followers,
            twitter_likes: providerData.twitter_likes,
            twitter_followers: providerData.twitter_followers,
            youtube_likes: providerData.youtube_likes,
            youtube_followers: providerData.youtube_followers,
            yelp_likes: providerData.yelp_likes,
            yelp_followers: providerData.yelp_followers,
            yelp_rating: providerData.yelp_rating,
            yelp_reviews: providerData.yelp_reviews,
            facebook_review_details: providerData.facebook_review_details,
            recommended_emails: providerData.recommended_emails,
            facebook_profile_image: providerData.facebook_profile_image,
            facebook_banner_image: providerData.facebook_banner_image, // Update new image URLs
            instagram_profile_image: providerData.instagram_profile_image,
            instagram_banner_image: providerData.instagram_banner_image,
          },
          $addToSet: { emails: { $each: providerData.emails } },
        },
      );
      console.log('provider ====>>>>', provider);
      return provider;
    } catch (error) {
      console.error('Error updating provider ======>>>>:', error);
      // throw new Error("Error updating provider");
    }
  }

  async updateDummyProvider(id: string) {
    const dt = await this.cleandumpModel.findById({ _id: id });

    if (!dt || !dt.content) {
      throw new Error('Data not found or missing content');
    }
    console.log('dt.content.length====>>>>', dt.content);

    console.log('dt====>>>>', dt);
    if (dt.isprovider == true) {
      throw new Error('Provider already created');
    }

    const searchValue = `Extract the following details from the content below: "firstName, emails, phoneNumbers, addresses, category, subcategory  if you get any another fields please add them in JSON format like {firstName:[],emails:[], phoneNumbers:[], addresses:[], category:[], subcategory:[]}". Content: ${dt.content}`;

    const chatgpt = new ChatGPT(
      'YOUR_OPENAI_KEY',
    );

    let [err, chat_response] = await chatgpt.createCompletion(searchValue);

    let contentString = chat_response[0].message.content;
    if (typeof contentString === 'string') {
      const jsonDataString = this.getDateStringToJSON(contentString);
      try {
        const parsedData = jsonDataString
          ? JSON.parse(jsonDataString)
          : JSON.parse(contentString);

        if (parsedData) {
          const providerData = {
            firstName: Array.isArray(parsedData?.firstName)
              ? parsedData.firstName
              : [],
            businessName: Array.isArray(parsedData?.firstName)
              ? parsedData.firstName
              : [],
            emails: Array.isArray(parsedData?.emails) ? parsedData.emails : [],
            phoneNumbers: Array.isArray(parsedData?.phoneNumbers)
              ? parsedData.phoneNumbers
              : [],
            addresses: Array.isArray(parsedData?.addresses)
              ? parsedData.addresses
              : [],
            categories: Array.isArray(parsedData?.category)
              ? parsedData.category
              : [],
            subcategories: Array.isArray(parsedData?.subcategory)
              ? parsedData.subcategory
              : [],
          };

          console.log('providerData====>>>>', providerData);

          const provider = await this.dummyproviderModel.findOneAndUpdate(
            { provider: dt.provider },
            {
              $set: {
                url: dt.url,
              },
              $addToSet: {
                userName: { $each: providerData.firstName },
                businessName: { $each: providerData.firstName },
                emails: { $each: providerData.emails },
                phonenumbers: { $each: providerData.phoneNumbers },
                address: { $each: providerData.addresses },
                category: { $each: providerData.categories },
                subcategory: { $each: providerData.subcategories },
              },
            },
            { new: true },
          );
          dt.isprovider = true;
          await dt.save();
          return provider;
        }
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
    } else {
      console.error('No JSON data found in the response:', contentString);
    }
  }

  async getDummyProviderByQueueId(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    const provider = await this.providerModel.findOne({ user: id });
    if (!provider && !user) {
      throw new Error('Provider not found 3333');
    }
    const dt = await this.dummyproviderModel.find({ provider: user._id });

    if (!dt) {
      throw new Error('Dummy Provider Not Found 4444');
    }

    return dt;
  }

  async createFieldSet(model: createFieldSetDto) {
    const {
      businessName,
      emails,
      PhoneNumbers,
      primaryPhoneNumbers,
      address,
      primaryAddress,
      subCategory,
      websiteUrl,
      categories,
      instructor,
      instructorImages,
      providePrivateInstruction,
      provideInHomeInstruction,
      provideBirthdaySpecificServices,
      providePartyServices,
      provideTransportServicesToAndFromTheVenue,
      earlyDrop_off_LatePick_up,
      activityTypes,
      privateVsGroup,
      inpersonOrVirtual,
      indoorOrOutdoor,
      description,
      skillGroups,
      gmb,
      teamSize,
      isChildCare,
      merchantVerified,
      isAssociate,
      govtIdUrl,
      govtIdNote,
      healthAndSafety,
      logo,
      cancellation_and_refund,
      cycle_time,
      proof_reader_notes,
      exceptionDates,
      joiningLink,
      city,
      maximumTravelDistance,
      about,
      bio,
      activeStatus,
      reviews,
      awards,
      taxNumber,
      sourceUrl,
      providerType,
      provider_video,
      additionalInformation,
      is_child_care,
      is_event,
      isVerified,
      isRequestVerified,
      isCallBooking,
      headline,
      languages,
    } = model;

    
    return;
  }

  async getDataByHtml(fieldSetId: string, dumpId: string) {
    const dump = await this.webdumpModel.findById(dumpId);


    // Extract data from HTML content
    const extractedData = this.extractDataFromHTMLContent(dump.content);
    console.log('extractedData ====>>>>>', extractedData);
    // Map extracted data based on fieldSet

    return 
  }

  private extractDataFromHTMLContent(html: string) {
    const $ = cheerio.load(html);

    console.log('HTML Content:', html);

    return {
      businessName: $('meta[name="title"]').attr('content') || '', // Adjust selector based on actual HTML
      emails: $('a[href^="mailto:"]').text().trim(),
      phoneNumbers: $('a[href^="tel:"]').text().trim(),
      primaryPhoneNumbers: $('p:contains("Primary Phone")').text().trim(),
      address: $('address').text().trim(),
      primaryAddress: $('p:contains("Primary Address")').text().trim(),
      subCategory: $('meta[name="subCategory"]').attr('content') || '',
      categories: $('meta[name="categories"]').attr('content') || '',
      websiteUrl: $('a[href^="http"]').attr('href') || '',
      instructor: $('p:contains("Instructor")').text().trim(),
      instructorImages: $('img.instructor').attr('src') || '',
      providePrivateInstruction: $('p:contains("Private Instruction")')
        .text()
        .trim(),
      provideInHomeInstruction: $('p:contains("In Home Instruction")')
        .text()
        .trim(),
      provideBirthdaySpecificServices: $(
        'p:contains("Birthday Specific Services")',
      )
        .text()
        .trim(),
      providePartyServices: $('p:contains("Party Services")').text().trim(),
      provideTransportServicesToAndFromTheVenue: $(
        'p:contains("Transport Services")',
      )
        .text()
        .trim(),
      earlyDrop_off_LatePick_up: $(
        'p:contains("Early Drop Off / Late Pick Up")',
      )
        .text()
        .trim(),
      activityTypes: $('p:contains("Activity Types")').text().trim(),
      privateVsGroup: $('p:contains("Private vs Group")').text().trim(),
      inpersonOrVirtual: $('p:contains("In-person or Virtual")').text().trim(),
      indoorOrOutdoor: $('p:contains("Indoor or Outdoor")').text().trim(),
      description: $('p:contains("Description")').text().trim(),
      skillGroups: $('p:contains("Skill Groups")').text().trim(),
      gmb: $('p:contains("GMB")').text().trim(),
      teamSize: $('p:contains("Team Size")').text().trim(),
      isChildCare: $('p:contains("Is Child Care")').text().trim(),
      merchantVerified: $('p:contains("Merchant Verified")').text().trim(),
      isAssociate: $('p:contains("Is Associate")').text().trim(),
      govtIdUrl: $('p:contains("Govt ID URL")').text().trim(),
      govtIdNote: $('p:contains("Govt ID Note")').text().trim(),
      healthAndSafety: $('p:contains("Health and Safety")').text().trim(),
      logo: $('img.logo').attr('src') || '',
      cancellation_and_refund: $('p:contains("Cancellation and Refund")')
        .text()
        .trim(),
      cycle_time: $('p:contains("Cycle Time")').text().trim(),
      proof_reader_notes: $('p:contains("Proof Reader Notes")').text().trim(),
      exceptionDates: $('p:contains("Exception Dates")').text().trim(),
      joiningLink: $('a:contains("Join Now")').attr('href') || '',
      city: $('p:contains("City")').text().trim(),
      maximumTravelDistance: $('p:contains("Maximum Travel Distance")')
        .text()
        .trim(),
      about: $('p:contains("About")').text().trim(),
      bio: $('p:contains("Bio")').text().trim(),
      activeStatus: $('p:contains("Active Status")').text().trim(),
      reviews: $('p:contains("Reviews")').text().trim(),
      awards: $('p:contains("Awards")').text().trim(),
      taxNumber: $('p:contains("Tax Number")').text().trim(),
      sourceUrl: $('meta[name="sourceUrl"]').attr('content') || '',
      providerType: $('p:contains("Provider Type")').text().trim(),
      provider_video: $('video.provider').attr('src') || '',
      additionalInformation: $('p:contains("Additional Information")')
        .text()
        .trim(),
      is_child_care: $('p:contains("Is Child Care")').text().trim(),
      is_event: $('p:contains("Is Event")').text().trim(),
      isVerified: $('p:contains("Is Verified")').text().trim(),
      isRequestVerified: $('p:contains("Is Request Verified")').text().trim(),
      isCallBooking: $('p:contains("Is Call Booking")').text().trim(),
      headline: $('p:contains("Headline")').text().trim(),
      languages: $('p:contains("Languages")').text().trim(),
    };
  }

  private mapDumpToFieldSet(fieldMappings: any, extractedData: any) {
    const mappedData: any = {};

    for (const [fieldName, index] of Object.entries(fieldMappings)) {
      switch (index) {
        case 0:
          mappedData[fieldName] = extractedData.address;
          break;
        case 1:
          mappedData[fieldName] = extractedData.businessName;
          break;
        case 2:
          mappedData[fieldName] = extractedData.phoneNumbers;
          break;
        case 3:
          mappedData[fieldName] = extractedData.primaryPhoneNumbers;
          break;
        case 4:
          mappedData[fieldName] = extractedData.address;
          break;
        case 5:
          mappedData[fieldName] = extractedData.primaryAddress;
          break;
        case 6:
          mappedData[fieldName] = extractedData.subCategory;
          break;
        case 7:
          mappedData[fieldName] = extractedData.categories;
          break;
        case 8:
          mappedData[fieldName] = extractedData.websiteUrl;
          break;
        case 9:
          mappedData[fieldName] = extractedData.instructor;
          break;
        case 10:
          mappedData[fieldName] = extractedData.instructorImages;
          break;
        case 11:
          mappedData[fieldName] = extractedData.providePrivateInstruction;
          break;
        case 12:
          mappedData[fieldName] = extractedData.provideInHomeInstruction;
          break;
        case 13:
          mappedData[fieldName] = extractedData.provideBirthdaySpecificServices;
          break;
        case 14:
          mappedData[fieldName] = extractedData.providePartyServices;
          break;
        case 15:
          mappedData[fieldName] =
            extractedData.provideTransportServicesToAndFromTheVenue;
          break;
        case 16:
          mappedData[fieldName] = extractedData.earlyDrop_off_LatePick_up;
          break;
        case 17:
          mappedData[fieldName] = extractedData.activityTypes;
          break;
        case 18:
          mappedData[fieldName] = extractedData.privateVsGroup;
          break;
        case 19:
          mappedData[fieldName] = extractedData.inpersonOrVirtual;
          break;
        case 20:
          mappedData[fieldName] = extractedData.indoorOrOutdoor;
          break;
        case 21:
          mappedData[fieldName] = extractedData.description;
          break;
        case 22:
          mappedData[fieldName] = extractedData.skillGroups;
          break;
        case 23:
          mappedData[fieldName] = extractedData.gmb;
          break;
        case 24:
          mappedData[fieldName] = extractedData.teamSize;
          break;
        case 25:
          mappedData[fieldName] = extractedData.isChildCare;
          break;
        case 26:
          mappedData[fieldName] = extractedData.merchantVerified;
          break;
        case 27:
          mappedData[fieldName] = extractedData.isAssociate;
          break;
        case 28:
          mappedData[fieldName] = extractedData.govtIdUrl;
          break;
        case 29:
          mappedData[fieldName] = extractedData.govtIdNote;
          break;
        case 30:
          mappedData[fieldName] = extractedData.healthAndSafety;
          break;
        case 31:
          mappedData[fieldName] = extractedData.logo;
          break;
        case 32:
          mappedData[fieldName] = extractedData.cancellation_and_refund;
          break;
        case 33:
          mappedData[fieldName] = extractedData.cycle_time;
          break;
        case 34:
          mappedData[fieldName] = extractedData.proof_reader_notes;
          break;
        case 35:
          mappedData[fieldName] = extractedData.exceptionDates;
          break;
        case 36:
          mappedData[fieldName] = extractedData.joiningLink;
          break;
        case 37:
          mappedData[fieldName] = extractedData.city;
          break;
        case 38:
          mappedData[fieldName] = extractedData.maximumTravelDistance;
          break;
        case 39:
          mappedData[fieldName] = extractedData.about;
          break;
        case 40:
          mappedData[fieldName] = extractedData.bio;
          break;
        case 41:
          mappedData[fieldName] = extractedData.activeStatus;
          break;
        case 42:
          mappedData[fieldName] = extractedData.reviews;
          break;
        case 43:
          mappedData[fieldName] = extractedData.awards;
          break;
        case 44:
          mappedData[fieldName] = extractedData.taxNumber;
          break;
        case 45:
          mappedData[fieldName] = extractedData.sourceUrl;
          break;
        case 46:
          mappedData[fieldName] = extractedData.providerType;
          break;
        case 47:
          mappedData[fieldName] = extractedData.provider_video;
          break;
        case 48:
          mappedData[fieldName] = extractedData.additionalInformation;
          break;
        case 49:
          mappedData[fieldName] = extractedData.is_child_care;
          break;
        case 50:
          mappedData[fieldName] = extractedData.is_event;
          break;
        case 51:
          mappedData[fieldName] = extractedData.isVerified;
          break;
        case 52:
          mappedData[fieldName] = extractedData.isRequestVerified;
          break;
        case 53:
          mappedData[fieldName] = extractedData.isCallBooking;
          break;
        case 54:
          mappedData[fieldName] = extractedData.headline;
          break;
        case 55:
          mappedData[fieldName] = extractedData.languages;
          break;
        default:
          mappedData[fieldName] = ''; // Handle unexpected indices
          break;
      }
    }

    return mappedData;
  }

  async scratchDataByChatGpt(id) {
    try {
      // Fetch provider data by ID
      const data = await this.providerModel.findOne({ user: id });
      if (!data) {
        throw new Error(`Provider with ID ${id} not found.`);
      }

      // Define the search query
      const searchQuery = `${data.website} Please find provider fields from this url in JSON format like {
            firstName:'',
            email:'', 
            phoneNumber:'',
            addressLine1:'',
            description: '',
            category: [], 
            subcategory: [],
            topGoogleReviews: 3 items in string[],
            bottomGoogleReviews: 3 items in string[],
            mostRecentGoogleReviews: 3 items in string[],
            yelpTopReviews: 3 items in string[],
            yelpBottomReviews: 3 items in string[],
            yelpMostRecentReviews: 3 items in string[],
            rating: {
                facebookRating: number;
                facebookLikes: number;
                facebookLink: '',
                googleRating: number;
                googleLink: '',
                yelpRating: number;
                yelpLink: '',
                instagramLink: '',
                numberOfYelp: number;
                instagramFollowers: number;
                numberOfFacebook: number;
                numberOfGoogle: number;
            } 
        }`;
      // Fetch data from the Gemini service
      const chatgpt = new ChatGPT(
        'YOUR_OPENAI_KEY',
      );

      let [err, chat_response] = await chatgpt.createCompletion(searchQuery);
      console.log('chat_response ====>>>>', chat_response);

      const existingWebDump = await this.webdumpModel.findOne({
        provider: id,
        source: 'chatgpt',
      });
      // Check if the document already exists

      if (existingWebDump) {
        // If document exists, update it
        const updatedWebDump = await this.webdumpModel.findOneAndUpdate(
          { provider: id, source: 'chatgpt' },
          {
            url: data.website,
            content: chat_response[0].message.content, // Save as string
            modifiedBy: 'chatgpt',
            source: 'chatgpt',
            lastChangedTime: new Date(),
            updated_at: new Date(),
          },
          { new: true }, // Return the updated document
        );

        console.log('Document updated successfully:');
        return updatedWebDump;
      } else {
        // If document does not exist, create it
        const newWebDump = new this.webdumpModel({
          provider: id,
          url: data.website,
          content: chat_response[0].message.content, // Save as string
          source: 'chatgpt',
          created_at: new Date(),
          lastChangedTime: new Date(),
          updated_at: new Date(),
          modifiedBy: 'chatgpt',
        });

        const savedWebDump = await newWebDump.save();

        console.log('Document created successfully:');
        return savedWebDump;
      }
    } catch (error) {
      console.error('Error in scratchDataByGemini 1 :', error);
      // throw error; // Re-throw the error after logging
    }
  }

  async saveGeminiHistory(question, answer, userId) {
    const historyModel = {
      question: question,
      answers: [answer],
      searchFrom: userId,
    };
  }

  async scratchDataByGemini(id, req) {
    console.log('scratchDataByGemini id ===>>>>', id);
    try {
      // Fetch provider data by ID
      const data = await this.providerModel.findOne({ user: id });
      if (!data) {
        throw new Error(`Provider with ID ${id} not found.`);
      }

      // Define the search query
      const searchQuery = `${data.website} Please find provider fields from this url in JSON format like {
            firstName:'',
            email:'', 
            phoneNumber:'',
            addressLine1:'',
            description: '',
            category: [], 
            subcategory: [],
            topGoogleReviews: 3 items in string[],
            bottomGoogleReviews: 3 items in string[],
            mostRecentGoogleReviews: 3 items in string[],
            yelpTopReviews: 3 items in string[],
            yelpBottomReviews: 3 items in string[],
            yelpMostRecentReviews: 3 items in string[],
            rating: {
                facebookRating: number;
                facebookLikes: number;
                facebookLink: '',
                googleRating: number;
                googleLink: '',
                yelpRating: number;
                yelpLink: '',
                instagramLink: '',
                numberOfYelp: number;
                instagramFollowers: number;
                numberOfFacebook: number;
                numberOfGoogle: number;
            } 
        }`;

      // Fetch data from the Gemini service
      
      console.log('req.user._id gemini ====>>>>', req.user._id);

      // Save the query and response in Gemini history
      // await this.saveGeminiHistory(searchQuery, responseData, req.user._id);

      // Check if the document already exists
      const existingWebDump = await this.webdumpModel.findOne({
        provider: id,
        source: 'gemini',
      });
      console.log('existingWebDump 1 =====>>>', existingWebDump);
      if (existingWebDump) {
        // If document exists, update it
        const updatedWebDump = await this.webdumpModel.findOneAndUpdate(
          { provider: id, source: 'gemini' },
          {
            url: data.website,
            modifiedBy: 'gemini',
            source: 'gemini',
            lastChangedTime: new Date(),
            updated_at: new Date(),
          },
          { new: true }, // Return the updated document
        );

        console.log('Document updated successfully:');
        return updatedWebDump;
      } else {
        // If document does not exist, create it
        const newWebDump = new this.webdumpModel({
          provider: id,
          url: data.website,
          source: 'gemini',
          created_at: new Date(),
          lastChangedTime: new Date(),
          updated_at: new Date(),
          modifiedBy: 'gemini',
        });
        console.log('newWebDump ====>>>', newWebDump);
        const savedWebDump = await newWebDump.save();
        console.log('savedWebDump ====>>>', savedWebDump);
        console.log('Document created successfully:');
        return savedWebDump;
      }
    } catch (error) {
      console.error('Error in scratchDataByGemini 2:', error);
      throw error; // Re-throw the error after logging
    }
  }

  async checkDataExistOrNot(fieldSetId: string, DumpId: string, req: any) {
    try {
      // Fetch fieldSet and dump data
      const dump = await this.cleandumpModel.findById(DumpId);
      if (!dump) {
        throw new Error(`Dump with ID ${DumpId} not found.`);
      }

      // Ensure dump.content is a string
      const content =
        typeof dump.content === 'string'
          ? dump.content
          : JSON.stringify(dump.content);
      console.log('content====>>>>>>>', content);
      // Define regex patterns
      const patterns = {
        businessName: /"name"\s*:\s*"([^"]+)"/,
        address: /"addressLine1"\s*:\s*"([^"]+)"/,
        phoneNumber: /"phoneNumber"\s*:\s*"([^"]+)"/,
        rating: /"rating"\s*:\s*([\d.]+)/,
        totalRatings: /"totalRatings"\s*:\s*(\d+)/,
        locationLat: /"lat"\s*:\s*([\d.]+)/,
        locationLng: /"lng"\s*:\s*([\d.]+)/,
        primaryAddress: /"primaryAddress"\s*:\s*"([^"]+)"/,
        subCategory: /"subCategory"\s*:\s*"([^"]+)"/,
        categories: /"categories"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        websiteUrl: /"websiteUrl"\s*:\s*"([^"]+)"/,
        instructor: /"instructor"\s*:\s*"([^"]+)"/,
        instructorImages: /"instructorImages"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        providePrivateInstruction:
          /"providePrivateInstruction"\s*:\s*(true|false)/,
        provideInHomeInstruction:
          /"provideInHomeInstruction"\s*:\s*(true|false)/,
        provideBirthdaySpecificServices:
          /"provideBirthdaySpecificServices"\s*:\s*(true|false)/,
        providePartyServices: /"providePartyServices"\s*:\s*(true|false)/,
        provideTransportServicesToAndFromTheVenue:
          /"provideTransportServicesToAndFromTheVenue"\s*:\s*(true|false)/,
        earlyDrop_off_LatePick_up:
          /"earlyDrop_off_LatePick_up"\s*:\s*(true|false)/,
        activityTypes: /"activityTypes"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        privateVsGroup: /"privateVsGroup"\s*:\s*"([^"]+)"/,
        inpersonOrVirtual: /"inpersonOrVirtual"\s*:\s*"([^"]+)"/,
        indoorOrOutdoor: /"indoorOrOutdoor"\s*:\s*"([^"]+)"/,
        description: /"description"\s*:\s*"([^"]+)"/,
        skillGroups: /"skillGroups"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        gmb: /"gmb"\s*:\s*"([^"]+)"/,
        teamSize: /"teamSize"\s*:\s*\d+/,
        isChildCare: /"isChildCare"\s*:\s*(true|false)/,
        merchantVerified: /"merchantVerified"\s*:\s*(true|false)/,
        isAssociate: /"isAssociate"\s*:\s*(true|false)/,
        govtIdUrl: /"govtIdUrl"\s*:\s*"([^"]+)"/,
        govtIdNote: /"govtIdNote"\s*:\s*"([^"]+)"/,
        healthAndSafety: /"healthAndSafety"\s*:\s*"([^"]+)"/,
        logo: /"logo"\s*:\s*"([^"]+)"/,
        cancellation_and_refund: /"cancellation_and_refund"\s*:\s*"([^"]+)"/,
        cycle_time: /"cycle_time"\s*:\s*"([^"]+)"/,
        proof_reader_notes: /"proof_reader_notes"\s*:\s*"([^"]+)"/,
        exceptionDates: /"exceptionDates"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        joiningLink: /"joiningLink"\s*:\s*"([^"]+)"/,
        city: /"city"\s*:\s*"([^"]+)"/,
        maximumTravelDistance: /"maximumTravelDistance"\s*:\s*\d+/,
        about: /"about"\s*:\s*"([^"]+)"/,
        bio: /"bio"\s*:\s*"([^"]+)"/,
        activeStatus: /"activeStatus"\s*:\s*(true|false)/,
        reviews: /"reviews"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        awards: /"awards"\s*:\s*\[\s*"([^"]+)"\s*\]/,
        taxNumber: /"taxNumber"\s*:\s*"([^"]+)"/,
        sourceUrl: /"sourceUrl"\s*:\s*"([^"]+)"/,
        providerType: /"providerType"\s*:\s*"([^"]+)"/,
        provider_video: /"provider_video"\s*:\s*"([^"]+)"/,
        additionalInformation: /"additionalInformation"\s*:\s*"([^"]+)"/,
        is_child_care: /"is_child_care"\s*:\s*(true|false)/,
        is_event: /"is_event"\s*:\s*(true|false)/,
        isVerified: /"isVerified"\s*:\s*(true|false)/,
        isRequestVerified: /"isRequestVerified"\s*:\s*(true|false)/,
        isCallBooking: /"isCallBooking"\s*:\s*(true|false)/,
        headline: /"headline"\s*:\s*"([^"]+)"/,
        languages: /"languages"\s*:\s*\[\s*"([^"]+)"\s*\]/,
      };

      // Initialize an object to store extracted data
      const existingFields = {};
      console.log('existingFields', existingFields);
      // Check each field with its regex pattern
      for (const [field, pattern] of Object.entries(patterns)) {
        const match = content.match(pattern);
        if (match) {
          existingFields[field] = match[1];
        }
      }
      console.log('existingFields', existingFields);
      return {
        isSuccess: true,
        data: {
          existingFields: existingFields, // Return fields with extracted data
        },
      };
    } catch (error) {
      console.error('Error in checkDataExistOrNot:', error);
      throw error; // Re-throw the error after logging
    }
  }

  private cleanKey(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+|[:\-]/g, '_');
  }

  private cleanValue(text: string): string {
    return text.trim();
  }

  private parseHtml(htmlContent: string): any {
    const $ = cheerio.load(htmlContent);
    const data: { [key: string]: string } = {};
    const seenKeys: Set<string> = new Set(); // Track seen keys to avoid duplicates

    // Iterate over all relevant tags and extract their text
    $('h1, h2, h3, p, a').each((i, element) => {
      const tag = $(element);
      const tagName = tag.get(0).tagName;
      let text = tag.text().trim();

      if (text) {
        // Construct a key for the current tag
        const keyBase = this.cleanKey(tagName);
        let key = keyBase;

        // Ensure the key is unique by appending an index if necessary
        let index = 1;
        while (seenKeys.has(key)) {
          key = `${keyBase}_${index++}`;
        }
        seenKeys.add(key);

        data[key] = this.cleanValue(text);
      }
    });

    return data;
  }

  async cleanByPython(id: string): Promise<any> {
    try {
      // Fetch the document from the MongoDB collection by ID
      const res = await this.webdumpModel.findById(id).exec();
      if (!res || !res.content) {
        throw new Error('No content found for the provided ID');
      }

      // Process the HTML content
      const cleanedData = this.parseHtml(res.content);
      console.log('req.provider ====>>>>', res.provider);
      const dt = this.cleandumpModel.create({
        url: res.url,
        source: res.source,
        content: cleanedData,
        dumpId: res._id,
        provider: res.provider,
      });
      // Return cleaned data with success status
      return {
        isSuccess: true,
        data: cleanedData,
        statusCode: 200,
        message: 'Data cleaned successfully',
      };
    } catch (error) {
      console.error('Error cleaning content:', error);
      return {
        isSuccess: false,
        data: {},
        statusCode: 500,
        message: 'Error cleaning content',
      };
    }
  }

  async getPageData(url: string): Promise<any> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const result: any = {};

      // Extract Site Logo
      const logoElement = document.querySelector(
        'img.site-logo',
      ) as HTMLImageElement;
      result.siteLogo = logoElement ? logoElement.src : '';

      // Extract Navigation Links
      const navLinks = Array.from(document.querySelectorAll('nav a')).map(
        (a) => {
          const link = a as HTMLAnchorElement;
          return {
            text: (link as HTMLElement).innerText.trim(),
            href: link.href,
          };
        },
      );
      result.navigationLinks = navLinks;

      // Extract Social Media Links
      const socialLinks = Array.from(document.querySelectorAll('footer a'))
        .map((a) => {
          const link = a as HTMLAnchorElement;
          return {
            text: (link as HTMLElement).innerText.trim(),
            href: link.href,
          };
        })
        .filter((link) =>
          /facebook|twitter|instagram|youtube|vimeo|pinterest/i.test(link.href),
        );
      result.socialMediaLinks = socialLinks;

      // Extract Images with Descriptions
      const images = Array.from(document.querySelectorAll('img')).map((img) => {
        const image = img as HTMLImageElement;
        return {
          src: image.src,
          alt: image.alt,
        };
      });
      result.images = images;

      // Extract Text Content by Specific Sections
      const sections = Array.from(document.querySelectorAll('section')).map(
        (section) => {
          const headingElement = section.querySelector('h2') as HTMLElement;
          return {
            heading: headingElement ? headingElement.innerText.trim() : '',
            content: (section as HTMLElement).innerText.trim(),
          };
        },
      );
      result.sections = sections;

      // Extract Text Content from Specific Classes
      const contentBlocks = Array.from(
        document.querySelectorAll('.text-image-block, .cta-full-width'),
      ).map((block) => {
        const headingElement = block.querySelector('h2') as HTMLElement;
        return {
          heading: headingElement ? headingElement.innerText.trim() : '',
          content: (block as HTMLElement).innerText.trim(),
          image: (block.querySelector('img') as HTMLImageElement)?.src || '',
        };
      });
      result.contentBlocks = contentBlocks;

      // Extract Footer Content
      const footerContent = {
        logo:
          document.querySelector('footer img.site-logo')?.getAttribute('src') ||
          '',
        links: Array.from(document.querySelectorAll('footer a')).map((a) => {
          const link = a as HTMLAnchorElement;
          return {
            text: (link as HTMLElement).innerText.trim(),
            href: link.href,
          };
        }),
      };
      result.footerContent = footerContent;

      return result;
    });

    await browser.close();
    return data;
  }

  async scratchUrl(url: string) {
    try {
      const data = await this.getPageData(url);
      // Handle or save the extracted data as needed

      return data;
    } catch (error) {
      console.error('Error fetching or parsing content:', error);
      throw new Error('Error fetching or parsing content');
    }
  }

  async refreshscratch_data(id: string, source: string='all'): Promise<any[]> {
    console.log(id, 'id', id);
    try {
      const user = await this.userModel.findOne({ _id: id });
      const ctyname = await this.citymanagementModel.findOne({_id: user.cityId,
      });
      console.log(user, 'user 202');
      const provider = await this.providerModel.findOne({ user: id });
      console.log(provider, 'provider 505');
      if (!provider && !user) {
        throw new Error('Provider not found 5555');
      }
      // if (wb) {
      //   return ['Dump Data already exists'];
      // }
      if (source === 'google' || source == 'all') {
        console.log('source 606 started', source);
        if (source === 'all') {
          const web = await this.webdumpModel.findOne({
            provider: id,
            source: 'google',
          });
          if (!web) {
            const providerDataFromGoogle =
              await this.placeService.findProvidersByQuery(
                provider.website,
                ctyname.city,
              );
            if (providerDataFromGoogle) {
              await this.webdumpModel.create({
                url: 'googleapi',
                content: JSON.stringify(providerDataFromGoogle),
                provider: user._id,
                modifiedBy: 'google',
                source: 'google',
              });
            }
          }
        } else {
          const web = await this.webdumpModel.findOneAndRemove({
            provider: id,
            source: 'google',
          });
          const providerDataFromGoogle = await this.placeService.findDetails(
            provider.website,
          );
          if (providerDataFromGoogle) {
            const final = await this.webdumpModel.create({
              url: 'googleapi',
              content: JSON.stringify(providerDataFromGoogle),
              provider: user._id,
              modifiedBy: 'google',
              source: 'google',
            });
            console.log(final, 'final');
          }
        }
      }
      if (source === 'website' || source == 'all') {
        console.log('source 707 started', source);
        const web = await this.webdumpModel.deleteMany({
          provider: id,
          source: 'website',
        });
        const response: AxiosResponse = await firstValueFrom(
          this.httpService.get('http://127.0.0.1:8000/scrping/', {
            params: { url: provider.website },
          }),
        );

        if (!response || !response.data || !response.data.data) {
          throw new Error(
            'Invalid response structure from the scraping service',
          );
        }
        console.log('Invalid response structure from the scraping service')

        const dta = response.data.data;
        let urls = [];
        for (let key in dta) {
          // Check if the URL starts with 'http://' or 'https://'
          if (key.startsWith('http://') || key.startsWith('https://')) {
            try {
              urls.push({ url: key, value: dta[key] });
              const d = await axios.get(key);
              await this.webdumpModel.create({
                url: key,
                content: d.data,
                provider: user._id,
                modifiedBy: 'python script',
                source: 'website',
              });
            } catch (axiosError) {
              console.error(
                `Failed to fetch or save data for URL ${key}:`,
                axiosError.message,
              );
            }
          } else {
            console.warn(`Skipped unsupported URL protocol: ${key}`);
          }
        }
        console.log('urls', urls);
        return urls;
      }
      if (source === 'socialmedia' || source == 'all') {
        console.log('source 708 started', source);
        const web = await this.webdumpModel.findOneAndRemove({
          provider: id,
          url: 'socialmedia',
        });
        const dta = await this.getSocialMediaLink(user._id.toString());
        console.log('dta', dta);
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async removeWebDumpById(id: string) {
    try {
      const data = await this.webdumpModel.findByIdAndDelete({ _id: id });
      return data;
    } catch (error) {
      console.error('Error fetching or parsing content:', error);
      throw new Error('Error fetching or parsing content');
    }
  }

  async refreshWebDumpById(id: string) {
    try {
      const data = await this.webdumpModel.findByIdAndRemove({ _id: id });
      if (data.source === 'website' && data.url !== 'socialmedia') {
        const d = await axios.get(data.url);
        await this.webdumpModel.create({
          url: data.url,
          content: d.data,
          provider: data.provider,
          modifiedBy: 'python script',
          source: 'website',
        });
        return data;
      }
      if (data.source !== 'website' && data.url === 'socialmedia') {
        const dta = await this.getSocialMediaLink(data.provider.toString());
        console.log('dta', dta);
      }
    } catch (error) {
      console.error('Error fetching or parsing content:', error);
      throw new Error('Error fetching or parsing content');
    }
  }

  async CheckProviderOrProgram(id: string) {
    try {
      const Providerkeywords = [
        'name',
        'email',
        'phone',
        'website',
        'location',
        'address',
        'businessName',
        'businessname',
        'addressLine1',
        'rating',
        'contact',
        'phoneNumber',
        'contactNumber',
        'service',
        'hours',
        'services',
        'company',
        'organization',
        'locationDetails',
        'contactInfo',
        'emailAddress',
        'websiteURL',
        'socialMedia',
        'businessAddress',
        'mainOffice',
        'headquarters',
        'branch',
      ];

      const Programkeywords = [
        'education',
        'activity',
        'games',
        'events',
        'children',
        'kids',
        'child care',
        'curriculum',
        'class',
        'workshop',
        'session',
        'training',
        'tutorial',
        'lesson',
        'enrollment',
        'course',
        'preschool',
        'toddler',
        'early learning',
        'after school',
        'summer camp',
        'program',
        'age',
        'agegroup',
        'ages',
        'ages group',
        'age groups',
        'dropout',
        'dropin',
        'activities',
        'learning',
        'development',
        'educationProgram',
        'specialNeeds',
        'playgroup',
        'preschoolProgram',
        'caregiver',
        'open',
        'close',
        'childDevelopment',
        'learningCenter',
        'afterschoolCare',
        'childhoodEducation',
        'youthProgram',
        'earlyEducation',
        'parentingClass',
        'enrichment',
      ];

      const data = await this.cleandumpModel.findById({ _id: id });
      console.log('data.content', data.content);

      let provider = {};
      let program = {};
      let content = '';

      // Handle the content based on its type
      if (typeof data.content === 'string') {
        content = data.content.toLowerCase();
      } else if (typeof data.content === 'object') {
        content = JSON.stringify(data.content).toLowerCase();
      } else {
        throw new Error('Content is neither a string nor an object');
      }

      // Function to extract data based on keyword patterns
      const extractData = (keywords: string[], content: string) => {
        let result = {};
        for (let keyword of keywords) {
          if (content.includes(keyword.toLowerCase())) {
            // Try to match a pattern like 'keyword: value'
            const match = content.match(
              new RegExp(`${keyword}\\s*[:|=]\\s*([^\\s,;]+)`, 'i'),
            );
            if (match) {
              result[keyword] = match[1]; // Capture the value after the keyword
            } else {
              result[keyword] = true; // If just the keyword is found, flag it as present
            }
          }
        }
        return result;
      };

      // Extract provider and program data
      provider = extractData(Providerkeywords, content);
      program = extractData(Programkeywords, content);

      // Determine what to return based on the extracted data
      const response: any = { isSuccess: true, statusCode: 200 };

      if (Object.keys(provider).length > 0) response.provider = provider;
      if (Object.keys(program).length > 0) response.program = program;

      if (
        Object.keys(provider).length === 0 &&
        Object.keys(program).length === 0
      ) {
        response.message = 'No relevant data found';
      } else {
        response.message = 'Urls Created Successfully';
      }

      return response;
    } catch (error) {
      console.error('Error fetching or parsing content:', error);
      throw new Error('Error fetching or parsing content');
    }
  }

  async getAllWebsiteImages(providerId: string) {
    try {
      function extractImagesFromContent(htmlContent: string): string[] {
        // Check if htmlContent is a string
        if (typeof htmlContent !== 'string') {
          console.error('Invalid content type:', typeof htmlContent);
          return [];
        }

        const $ = cheerio.load(htmlContent);

        // Set to store unique image URLs
        let imageUrls: Set<string> = new Set();

        // Extract URLs from <img> tags
        $('img').each((i, img) => {
          const src = $(img).attr('src');
          if (src && validUrl.isUri(src) && !src.startsWith('data:image')) {
            imageUrls.add(src);
          }
        });

        // Extract URLs from background images
        $('[style]').each((i, element) => {
          const style = $(element).attr('style');
          const backgroundImageMatch =
            style &&
            style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
          if (
            backgroundImageMatch &&
            validUrl.isUri(backgroundImageMatch[1]) &&
            !backgroundImageMatch[1].startsWith('data:image')
          ) {
            imageUrls.add(backgroundImageMatch[1]);
          }
        });

        return Array.from(imageUrls);
      }

      let dump = await this.webdumpModel.find({ provider: providerId });

      // Aggregate image URLs from all entries
      let allImageUrls: Set<string> = new Set();

      for (let dmp of dump) {
        // Log the content type and first 100 characters for debugging
        console.log('Processing content type:', typeof dmp.content);
        console.log(
          'First 100 characters of content:',
          dmp.content?.substring(0, 100),
        );

        const imageUrls = extractImagesFromContent(dmp.content);
        imageUrls.forEach((url) => allImageUrls.add(url));
      }

      // Convert Set to Array
      let imageUrlsArray: string[] = Array.from(allImageUrls);
      console.log('imageUrlsArray:', imageUrlsArray);

      // Save aggregated image URLs
      let provider = await this.dummyproviderModel.findOneAndUpdate(
        { provider: providerId },
        { $set: { website_images: imageUrlsArray } },
        { new: true, upsert: true }, // Use upsert to create if not exists
      );
    } catch (error) {
      console.error('Error fetching or parsing content:', error);
      throw new Error('Error fetching or parsing content');
    }
  }

  async fetchData(url: string) {
    const result = await axios.get(url);
    return cheerio.load(result.data);
  }
  async getProviderWebsiteData(url: string) {
    const weburl = url;
    const $ = await this.fetchData(weburl);
    $('script svg').remove();

    // Extract main data
    const dta = {
      skills: [],
      reviews: [],
    };

    // Extract skills
    $(
      '.grid.w-full.border-border-divider-light.gap-x-5.gap-y-5.rounded-xl',
    ).each((i, element) => {
      $(element)
        .find('.text-text-secondary')
        .each((i, skill) => {
          const skillText = $(skill).text().trim();
          const icon = $(skill).find('svg');
          const svgHtml = icon.length
            ? icon
                .toArray()
                .map((el) => $.html(el))
                .join('')
            : '';
          console.log(skillText, svgHtml);
          dta.skills.push({ skillText, icon: svgHtml });
          // dta.skills.push({ skillText, iconClass });
        });
    });
    // Regular expression to capture the ID from the URL
    const regex = /profile\/([^/?#]+)/;
    const match = url.match(regex);

    if (match) {
      const id = match[1];
      console.log('ID:', id);
      const reviews = await this.graphQLService.fetchReviews(id);
      dta.reviews = reviews;
    } else {
      console.log('ID not found');
    }

    return dta;
  }

  async scratchDataByUrl(url: string) {
    console.log(url, 'url', url);
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:8000/scraping-text/', {
          params: { url: url },
        }),
      );

      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response structure from the scraping service');
      }
      // const dta1 = await this.getProviderWebsiteData(url);
      const dta = response.data.data;
      // await this.takelessionproviderModel.create({ name: dta.about_title, rating: dta.rating, teaching_hours: dta.teaching_hours, price: dta.price, description: dta.about_text, experience: dta.experience, education: dta.education, });
      return dta;
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async getPopularTagWithImageByCategoryUrl(url: string): Promise<any[]> {
    console.log(url, 'url');
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:8000/scraping-subject/', {
          params: { url: url },
        }),
      );

      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response structure from the scraping service');
      }

      const dta = response.data.data;
      console.log(dta, 'dta');
      return dta;
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async getTakelessionproviderById(id: string) {
    const category = await this.takelessionproviderModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'subjectproviders',
          let: { providerId: '$_id' }, // Define variables to use in the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$providerId', '$$providerId'], // Use variables defined above
                },
              },
            },
            {
              $lookup: {
                from: 'takelessionsubjects',
                localField: 'subjectId',
                foreignField: '_id',
                as: 'subject',
              },
            },
            {
              $unwind: {
                path: '$subject', // Unwind the array if you expect only one document per join
                preserveNullAndEmptyArrays: true, // If no match, keep the original document
              },
            },
          ],
          as: 'reports',
        },
      },
    ]);
    return category.length > 0 ? category[0] : null;
  }

  async getAllTakelessionprovider(
    page_number: string,
    page_size: string,
    subjectId: string,
    reports: any,
  ) {
    const pageNumber = parseInt(page_number, 10); // Convert page_number to a number
    const pageSize = parseInt(page_size, 10);
    const skip = (pageNumber - 1) * pageSize;
    let match = {};

    if (subjectId) {
      match['subjects'] = new ObjectId(subjectId);
    }
    const query = [];
    if (reports) {
      query.push({
        $lookup: {
          from: 'subjectproviders',
          let: { providerId: '$_id' }, // Define variables to use in the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$providerId', '$$providerId'], // Use variables defined above
                },
              },
            },
            {
              $lookup: {
                from: 'takelessionsubjects',
                localField: 'subjectId',
                foreignField: '_id',
                as: 'subjectId',
              },
            },
            {
              $unwind: {
                path: '$subjectId', // Unwind the array if you expect only one document per join
                preserveNullAndEmptyArrays: true, // If no match, keep the original document
              },
            },
          ],
          as: 'reports',
        },
      });
      // query.push({
      //   $match: {
      //     $expr: {
      //       $gt: [{ $size: "$reports" }, 0]
      //     }
      //   }
      // })
    }

    const category = await this.takelessionproviderModel.aggregate([
      { $match: match },
      { $sort: { name: 1 } },
      {
        $facet: {
          result: [
            { $limit: pageSize + skip },
            { $skip: skip },
            ...query,
            { $sort: { created_at: -1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;
    const response = {
      pageNumber: page_number,
      pageSize: page_size,
      TotalCount: totalCount,
      category: items,
    };
    if (reports) {
      const reportsCount = await this.subjectproviderModel.count();
      response['reportsCount'] = reportsCount;
    }
    return response;
  }

  async removeTakelessionproviderById(id) {
    const category = await this.takelessionproviderModel.findByIdAndDelete({
      _id: id,
    });
    return category;
  }

  async getAllTagByCategoryUrl(url: string): Promise<any[]> {
    console.log(url, 'url');
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:8000/scraping-all-tags/', {
          params: { url: url },
        }),
      );

      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response structure from the scraping service');
      }

      const dta = response.data.data;
      console.log(dta, 'dta');

      let urls = [];
      for (let item of dta) {
        const urlKey = item.url;

        let fullUrl = urlKey;

        // Check if the URL starts with '/' (relative URL)
        if (urlKey.startsWith('/')) {
          const baseUrl = new URL(url); // Dynamically get the base URL from the input URL
          fullUrl = `${baseUrl.origin}${urlKey}`; // Construct the full URL
        }

        // Process the full URL if it's valid
        if (fullUrl.startsWith('http://') || fullUrl.startsWith('https://')) {
          try {
            urls.push({ url: fullUrl, value: item.name });

            // Fetch the page content
            const response = await axios.get(fullUrl);
            const htmlContent = response.data; // This is the HTML content

            // Save the HTML content into the database
            await this.takelessiondumpModel.create({
              url: fullUrl,
              content: htmlContent, // Save the HTML content
              modifiedBy: 'python script',
              source: 'website',
              type: 'take-lession-subject',
            });

            console.log(`Saved HTML content for URL: ${fullUrl}`);
          } catch (axiosError) {
            console.error(
              `Failed to fetch or save data for URL ${fullUrl}:`,
              axiosError.message,
            );
          }
        } else {
          console.warn(`Skipped unsupported URL protocol: ${urlKey}`);
        }
      }

      console.log('urls', urls);

      // Step 1: Extract base URL and tag category name
      const urlPath = new URL(url).pathname.split('/')[1];
      const categoryName = urlPath.replace('-lessons', '');

      // Step 2: Check if the tag category already exists
      let tagCategory = await this.takelessioncategoryModel.findOne({
        name: categoryName,
      });

      // Step 3: If it doesn't exist, create a new tag category
      if (!tagCategory) {
        tagCategory = await this.takelessioncategoryModel.create({
          name: categoryName,
          source: 'python-script',
          url: url,
        });
      }

      // Step 4: Loop through the tags, check if each tag already exists, and create if not
      for (const item of dta) {
        // Check if the tag already exists for this tag category
        let tag = await this.takelessionsubjectModel.findOne({
          name: item.name,
          takelessioncategory: tagCategory._id,
        });

        if (!tag) {
          // Tag doesn't exist, create it
          tag = await this.takelessionsubjectModel.create({
            name: item.name,
            image: item.image_url,
            logo: item.image_url, // You can update this if the logo is different
            takelessioncategory: tagCategory._id, // Associating the Tag with Tag_category
            isPopular: false, // Set any additional fields as needed
            isActivated: true, // Default values or custom logic
            source: 'python-script', // You can add other metadata if needed
            url: `https://takelessons.com${item.url}`,
            fromUrl: url,
          });
        }
      }

      return dta;
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async getTakelessionCategoryById(id: string) {
    const category = await this.takelessioncategoryModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
    ]);
    return category;
  }

  async getAllTakelessionCategory() {
    const category = await this.takelessioncategoryModel.aggregate([
      { $sort: { name: 1 } },
    ]);
    return category;
  }

  async TakelessionCategoryupdate(
    id: string,
    model: Partial<UpdateTakeLessionCategoryDto>,
  ) {
    const user = await this.takelessioncategoryModel.findById(id);

    if (!user) {
      throw new HttpException('category not found', HttpStatus.BAD_REQUEST);
    }
    // if (user.userUpdateFirstTime === false) {
    if (
      model.name !== 'string' &&
      model.name !== '' &&
      model.name !== undefined
    ) {
      user.name = model.name.trim();
    }
    if (
      model.description !== 'string' &&
      model.description !== '' &&
      model.description !== undefined
    ) {
      user.description = model.description;
    }
    if (
      model.source !== 'string' &&
      model.source !== '' &&
      model.source !== undefined
    ) {
      user.source = model.source;
    }
    if (model.url !== 'string' && model.url !== '' && model.url !== undefined) {
      user.url = model.url;
    }
    if (model.isPopular !== undefined) {
      user.isPopular = model.isPopular;
    }
    if (
      model.notes !== 'string' &&
      model.notes !== '' &&
      model.notes !== undefined
    ) {
      user.notes = model.notes;
    }
    if (
      model.admin_notes !== 'string' &&
      model.admin_notes !== '' &&
      model.admin_notes !== undefined
    ) {
      user.admin_notes = model.admin_notes;
    }
    await user.save();

    return user;
  }

  async searchTakeLessionCategory(name: string) {
    const matchCriteria: Record<string, any> = {};

    if (name) {
      matchCriteria.name = {
        $regex: new RegExp(
          `${name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
          'i',
        ),
      };
    }

    const data = await this.takelessioncategoryModel.aggregate([
      {
        $match: {
          $and: [matchCriteria],
        },
      },
      {
        $facet: {
          result: [],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      TotalCount: totalCount,
      data: items,
    };
  }

  async getTakelessionSubjectById(id: string) {
    const category = await this.takelessionsubjectModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'takelessioncategories',
          localField: 'takelessioncategory',
          foreignField: '_id',
          as: 'takelessioncategory',
        },
      },
    ]);
    return category;
  }

  async getAllTakelessionSubject(
    page_number: number,
    page_size: number,
    categoryId: string,
  ) {
    const skip = (page_number - 1) * page_size;
    let match = {};

    if (categoryId) {
      match['takelessioncategory'] = new ObjectId(categoryId);
    }
    const category = await this.takelessionsubjectModel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'takelessioncategories',
          localField: 'takelessioncategory',
          foreignField: '_id',
          as: 'takelessioncategory',
        },
      },
      { $sort: { name: 1 } },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { created_at: -1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;

    return {
      pageNumber: page_number,
      pageSize: page_size,
      TotalCount: totalCount,
      category: items,
    };
  }

  async getTakelessionCategoryBySubject(
    page_number: number,
    page_size: number,
    id: string,
  ) {
    const skip = (page_number - 1) * page_size;
    const category = await this.takelessionsubjectModel.aggregate([
      {
        $match: {
          takelessioncategory: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'takelessioncategories',
          localField: 'takelessioncategory',
          foreignField: '_id',
          as: 'takelessioncategory',
        },
      },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { name: 1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;

    return {
      TotalCount: totalCount,
      category: items,
    };
  }

  async TakelessionSubjectupdate(
    id: string,
    model: Partial<UpdateTakeLessionSubjectDto>,
  ) {
    const user = await this.takelessionsubjectModel.findById(id);

    if (!user) {
      throw new HttpException('category not found', HttpStatus.BAD_REQUEST);
    }
    // if (user.userUpdateFirstTime === false) {
    if (
      model.name !== 'string' &&
      model.name !== '' &&
      model.name !== undefined
    ) {
      user.name = model.name.trim();
    }
    if (
      model.description !== 'string' &&
      model.description !== '' &&
      model.description !== undefined
    ) {
      user.description = model.description;
    }
    if (
      model.takelessioncategory !== null &&
      model.takelessioncategory !== undefined
    ) {
      user.takelessioncategory = model.takelessioncategory;
    }
    if (
      model.source !== 'string' &&
      model.source !== '' &&
      model.source !== undefined
    ) {
      user.source = model.source;
    }
    if (model.url !== 'string' && model.url !== '' && model.url !== undefined) {
      user.url = model.url;
    }
    if (model.isPopular !== undefined) {
      user.isPopular = model.isPopular;
    }
    if (
      model.notes !== 'string' &&
      model.notes !== '' &&
      model.notes !== undefined
    ) {
      user.notes = model.notes;
    }
    if (
      model.admin_notes !== 'string' &&
      model.admin_notes !== '' &&
      model.admin_notes !== undefined
    ) {
      user.admin_notes = model.admin_notes;
    }
    await user.save();

    return user;
  }
  async getTakelessionAllSubject() {
    const subjects = await this.takelessionsubjectModel.find({});
    return subjects;
  }
  async searchTakeLessionSubject(name: string, categoryId: string) {
    const matchCriteria: Record<string, any> = {};

    if (name) {
      matchCriteria.name = {
        $regex: new RegExp(
          `${name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
          'i',
        ),
      };
    }

    if (categoryId) {
      matchCriteria.categoryId = new ObjectId(categoryId);
    }

    const data = await this.takelessionsubjectModel.aggregate([
      {
        $match: {
          $and: [matchCriteria],
        },
      },
      {
        $facet: {
          result: [
            {
              $lookup: {
                from: 'takelessioncategories',
                localField: 'takelessioncategory',
                foreignField: '_id',
                as: 'takelessioncategory',
              },
            },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      TotalCount: totalCount,
      data: items,
    };
  }

  async getProviderProfile(url: string): Promise<any[]> {
    console.log(url, 'url');
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:8000/scraping-all-provider/', {
          params: { url: url },
        }),
      );

      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response structure from the scraping service');
      }

      const dta = response.data.data;
      console.log(dta, 'dta');
      for (const item of dta) {
        // Check if the tag already exists for this tag category
        let tag = await this.takelessionproviderModel.findOne({
          name: item.name,
        });

        if (!tag) {
          // Tag doesn't exist, create it
          const regex = /profile\/([^/?#]+)/;
          const match = item.profile_link.match(regex);

          if (match) {
            const id = match[1];
            item['id'] = id;
          } else {
            console.log('ID not found');
          }
          const isProvider = await this.takelessionproviderModel.findOne({
            takelessonId: item.id,
          });
          if (!isProvider) {
            tag = await this.takelessionproviderModel.create({
              name: item.tutor_name,
              profile_link: item.profile_link,
              profileImage: `https://takelessons.com${item.image_url}`,
              rating: item.rating,
              review_count: item.review_count,
              lesson_description: item.lesson_description,
              takelessonId: item.id,
              lesson_type: item.lesson_type,
              skills: item.skill_levels,
              locations: item.location,
              class_price: item.price,
              class_duration: item.duration,
              from_url: url,
            });
            try {
              await this.getTakeLessionProviderProfileById(
                item.id,
                item.profile_link,
              );
            } catch (e) {}
          }
        }
      }

      return dta;
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async getTakeLessionProviderProfileById(
    id: string,
    url: string,
  ): Promise<any[]> {
    console.log(id, 'id');
    try {
      let baseUrl = `https://takelessons.com/_next/data/0c7743c5d815a62c6eb8dbcab137fac0c11dc17f/en/provider/${id}`;
      let profile = await axios.get(
        `https://takelessons.com/_next/data/0c7743c5d815a62c6eb8dbcab137fac0c11dc17f/en/profile/${id}.json`,
      );
      //  console.log(profile.data.pageProps.tutorModel)
      if (!profile || !profile.data || !profile.data.pageProps.tutorModel) {
        throw new Error('Invalid response structure from the scraping service');
      }
      const dta = profile.data.pageProps.tutorModel;
      const dta1 = await this.scratchDataByUrl(url);
      const dta2 = await this.getProviderWebsiteData(url);
      const services = dta.tutorBooking.tutorService;
      const servicesName = services.map((sub) => sub.service.name);
      const subjects = await this.takelessionsubjectModel.aggregate([
        { $match: { name: { $in: servicesName } } },
      ]);
      const isProvider = await this.takelessionproviderModel.findOne({
        takelessonId: id,
      });
      if (isProvider) {
        await this.takelessionproviderModel.updateOne(
          { takelessonId: id },
          {
            $set: {
              takelessonId: id,
              name: dta.tutorBasic.fullName,
              providerId: dta.tutorBasic.providerNameId,
              scopes: dta.tutorBasic.scopes,
              profileImage: dta.tutorInfo.image,
              tagline: dta.tutorInfo.tagline,
              serviceDescription: dta.tutorInfo.serviceDescription,
              tutorDescription: dta.tutorInfo.tutorDescription,
              level: dta.tutorInfo.level,
              Experience: dta.tutorInfo.qualifications.Experience,
              Language: dta.tutorInfo.qualifications.LanguageAcquisition,
              Education: dta.tutorInfo.qualifications.Education,
              locations: dta.tutorInfo.locations,
              gallery: dta.tutorInfo.media,
              AgeRange: dta.tutorInfo.acceptConsumerAgeRange,
              ProvideServices: dta.tutorBooking.tutorService,
              subjects: subjects.map((sub) => sub._id),
              profile_link: url,
              price: dta.tutorBookingFlow.prices,
              tutorBooking: dta.tutorBooking,
              rating: dta1.rating,
              education: dta.education,
              skills: dta2.skills,
              // reviews: dta2.reviews
            },
          },
        );
        await this.takelessionreviewModel.deleteMany({
          providerId: isProvider._id,
        });
        await this.takelessionreviewModel.insertMany(
          dta2.reviews.map((re) => {
            let review = re;
            delete review['id'];
            review['providerId'] = isProvider._id;
            return review;
          }),
        );
      } else {
        let fullProvider = await this.takelessionproviderModel.create({
          takelessonId: id,
          name: dta.tutorBasic.fullName,
          providerId: dta.tutorBasic.providerNameId,
          scopes: dta.tutorBasic.scopes,
          profileImage: dta.tutorInfo.image,
          tagline: dta.tutorInfo.tagline,
          serviceDescription: dta.tutorInfo.serviceDescription,
          tutorDescription: dta.tutorInfo.tutorDescription,
          level: dta.tutorInfo.level,
          Experience: dta.tutorInfo.qualifications.Experience,
          Language: dta.tutorInfo.qualifications.LanguageAcquisition,
          Education: dta.tutorInfo.qualifications.Education,
          locations: dta.tutorInfo.locations,
          gallery: dta.tutorInfo.media,
          AgeRange: dta.tutorInfo.acceptConsumerAgeRange,
          ProvideServices: dta.tutorBooking.tutorService,
          subjects: subjects.map((sub) => sub._id),
          profile_link: url,
          price: dta.tutorBookingFlow.prices,
          tutorBooking: dta.tutorBooking,
          rating: dta1.rating,
          education: dta.education,
          skills: dta2.skills,
          // reviews: dta2.reviews
        });
        await this.takelessionreviewModel.insertMany(
          dta2.reviews.map((re) => {
            let review = re;
            delete review['id'];
            review['providerId'] = fullProvider._id;
            return review;
          }),
        );
      }
      //  console.log('fullProvider', fullProvider)
      return dta;
    } catch (error) {
      console.error('An error occurred:', error.message);
      // throw error;
    }
  }
  async getReviewsByProviderId(id) {
    const reviews = await this.takelessionreviewModel.find({ providerId: id });
    return reviews;
  }
  async allProviders() {
    try {
      const allProviders = await this.takelessionproviderModel.find({});
      let i = 0;
      for (const provider of allProviders) {
        console.log('providerId', provider.takelessonId, i);
        const providerJson = await this.graphQLService.getProviderProfile(
          provider.takelessonId,
        );
        await this.takelessonproviderjsonModel.create({
          providerJson: providerJson,
          providerId: provider._id,
        });
        i++;
      }
      return 'All done';
    } catch (e) {
      console.error('error', e);
    }
  }

  async allSubjectProviders() {
    try {
      const allSubjects = await this.takelessionsubjectModel.find();
      console.log('allSubjects', allSubjects.length);
      for (const subject of allSubjects) {
        console.log('subject', subject.name);
        const reviews = await this.graphQLService.getSearchResults(
          `${subject.name}`,
        );
        let dta = reviews.data.data.searchResults;
        if (dta.results.length) {
          dta.results = dta.results.filter(
            (res) => res.document.serviceOffering.service.name === subject.name,
          );
          dta.totalCount = dta.results.length;
        }
        console.log('reviews.data.data.searchResults ====>>>>>>', dta);
        await this.takelessonsubjectLessonsjsonModel.create({
          lessonJson: dta,
          subjectId: subject._id,
        });
      }
      return 'all Done';
    } catch (e) {
      console.error('error', e);
    }
  }
  async getTakeLessonsSubjectsProviderById(id) {
    const subjects = await this.subjectproviderModel.aggregate([
      { $match: { providerId: new ObjectId(id) } },

      {
        $lookup: {
          from: 'takelessionsubjects',
          localField: 'subjectId',
          foreignField: '_id',
          as: 'subjectId',
        },
      },
      {
        $lookup: {
          from: 'takelessionproviders',
          localField: 'providerId',
          foreignField: '_id',
          as: 'providerId',
        },
      },
    ]);

    return { items: subjects, totalCount: subjects.length };
  }
  async createSubjectProvidersByJson() {
    try {
      let allSubjects = await this.takelessonsubjectLessonsjsonModel.find();
      console.log('allSubjects', allSubjects.length);
      for (const subject of allSubjects) {
        // console.log("subject",subject.lessonJson.results[0].document.serviceOffering.serviceProvider.displayName)
        // console.log("subject",subject.lessonJson.results[0].document.reviewSummary)

        let les = await this.takelessionsubjectModel.findOne({
          _id: subject.subjectId,
        });
        for (let provider of subject.lessonJson.results) {
          let pro = await this.takelessionproviderModel.findOne({
            takelessonId: provider.document.serviceOffering.serviceProvider.id,
          });
          if (pro) {
            let lespro = await this.subjectproviderModel.create({
              subjectId: les._id,
              providerId: pro._id,
              description: provider.document.serviceOffering.description || '',
              tag_line: provider.document.serviceOffering.tagLine || '',
              price: provider.document.startPrice || {},
              serviceProviderLocation:
                provider.document.serviceProviderLocation || {},
              providedLocationTypes:
                provider.document.providedLocationTypes || {},
              profile_image:
                provider.document.serviceOffering.serviceProvider
                  .profileImage || '',
              profile_link: `https://takelessons.com/profile/${provider.document.serviceOffering.serviceProvider.slug}?service=${provider.document.serviceOffering.service.id}`,
              serviceId: provider.document.serviceOffering.service.id || '',
              specialities:
                provider.document.serviceOffering.service.specialities || [],
              rating: provider.document.serviceOffering.reviewSummary
                ? provider.document.serviceOffering.reviewSummary.meanScore
                : '',
              reviewCount: provider.document.serviceOffering.reviewSummary
                ? provider.document.serviceOffering.reviewSummary.reviewCount
                : '',
            });
            // console.log("lespro",lespro)
          } else {
            await this.getTakeLessionProviderProfileById(
              provider.document.serviceOffering.serviceProvider.id,
              `https://takelessons.com/profile/${provider.document.serviceOffering.serviceProvider.slug}`,
            );
            const pr = await this.takelessionproviderModel.findOne({
              takelessonId:
                provider.document.serviceOffering.serviceProvider.id,
            });
            if (pr) {
              const providerJson = await this.graphQLService.getProviderProfile(
                provider.document.serviceOffering.serviceProvider.id,
              );
              await this.takelessonproviderjsonModel.create({
                providerJson: providerJson,
                providerId: pr._id,
              });
              let lespro = await this.subjectproviderModel.create({
                subjectId: les._id,
                providerId: pr._id,
                description:
                  provider.document.serviceOffering.description || '',
                tag_line: provider.document.serviceOffering.tagLine || '',
                price: provider.document.startPrice || {},
                serviceProviderLocation:
                  provider.document.serviceProviderLocation || {},
                providedLocationTypes:
                  provider.document.providedLocationTypes || {},
                profile_image:
                  provider.document.serviceOffering.serviceProvider
                    .profileImage || '',
                profile_link: `https://takelessons.com/profile/${provider.document.serviceOffering.serviceProvider.slug}?service=${provider.document.serviceOffering.service.id}`,
                serviceId: provider.document.serviceOffering.service.id || '',
                specialities:
                  provider.document.serviceOffering.service.specialities || [],
                rating: provider.document.serviceOffering.reviewSummary
                  ? provider.document.serviceOffering.reviewSummary.meanScore
                  : '',
                reviewCount: provider.document.serviceOffering.reviewSummary
                  ? provider.document.serviceOffering.reviewSummary.reviewCount
                  : '',
              });
              console.log(
                'provider Created',
                provider.document.serviceOffering.serviceProvider.id,
              );
            } else {
              console.log(
                'provider not found',
                provider.document.serviceOffering.serviceProvider.id,
              );
            }
          }
        }
      }
      return 'all Done';
    } catch (e) {
      console.error('error', e);
    }
  }

  async updateAwardAndAffiliation() {
    try {
      let allSubjects = await this.takelessonproviderjsonModel.find();

      // console.log("allSubjects",allSubjects)
      for (const subject of allSubjects) {
        let lespro = await this.takelessionproviderModel.findOneAndUpdate(
          { _id: subject.providerId },
          {
            $set: {
              award:
                subject.providerJson.tutorModel.tutorInfo.qualifications.Award,
              affiliation:
                subject.providerJson.tutorModel.tutorInfo.qualifications
                  .Affiliation,
              certification:
                subject.providerJson.tutorModel.tutorInfo.qualifications
                  .Certification,
              reviewSummary:
                subject.providerJson.tutorModel.tutorInfo.reviewSummary,
            },
          },
          { new: true },
        );
        // console.log("lespro",lespro)
      }
      return 'all Done';
    } catch (e) {
      console.error('error', e);
    }
  }

  async providerReport(page_number: number, page_size: number) {
    const skip = (page_number - 1) * page_size;
    const data = await this.takelessionproviderModel.aggregate([
      {
        $facet: {
          result: [
            {
              $lookup: {
                from: 'takelessionsubjects',
                let: { multiSubjectIds: '$subjects' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $in: [
                              '$_id',
                              { $ifNull: ['$$multiSubjectIds', []] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: 'multisubject',
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                subjectName: '$multisubject.name',
                subjectCount: { $size: '$multisubject' },
              },
            },
            { $sort: { created_at: -1 } },
            { $limit: page_size + skip },
            { $skip: skip },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async scrapProviderPrice() {
    try {
      const provider = await this.subjectproviderModel.find();
      for (const item of provider) {
        const response: AxiosResponse = await firstValueFrom(
          this.httpService.get(
            'http://127.0.0.1:8000/scraping-provider-price/',
            {
              params: { url: item.profile_link },
            },
          ),
        );

        if (!response || !response.data || !response.data.data) {
          throw new Error(
            'Invalid response structure from the scraping service',
          );
        }
        // const dta1 = await this.getProviderWebsiteData(url);
        const dta = response.data.data;
        if (dta) {
          console.log('dta', dta);
          let les = await this.subjectproviderModel.findOneAndUpdate(
            { _id: item._id },
            {
              $set: {
                profile_price: dta,
              },
            },
          );
        } else {
          console.log('dta not found');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }
  async reportAnalytics(): Promise<any> {
    const taskLessonReport = {
      providerCount: await this.takelessionproviderModel.count(),
      categoryCount: await this.takelessioncategoryModel.count(),
      subjectCount: await this.takelessionsubjectModel.count(),
      reviewCount: await this.takelessionreviewModel.count(),
      subjectLessonCount: await this.subjectproviderModel.count(),
    };
    return taskLessonReport;
  }
  async subjectReportAnalytics(): Promise<any> {
    const subjectsReport = this.takelessionsubjectModel.aggregate([
      {
        $project: {
          name: 1,
        },
      },
      {
        $lookup: {
          from: 'takelessionproviders',
          localField: '_id',
          foreignField: 'subjects',
          as: 'providers',
        },
      },
      {
        $set: {
          providerCount: { $size: '$providers' },
        },
      },
      {
        $project: {
          providers: false,
        },
      },
    ]);
    return subjectsReport;
  }

  async categorySubjectReportAnalytics(): Promise<any> {
    const subjectsReport = this.takelessioncategoryModel.aggregate([
      {
        $project: {
          name: 1,
        },
      },
      {
        $lookup: {
          from: 'takelessionsubjects',
          localField: '_id',
          foreignField: 'takelessioncategory',
          as: 'subjects',
        },
      },
      {
        $set: {
          subjectCount: { $size: '$subjects' },
        },
      },
      {
        $project: {
          subjects: false,
        },
      },
    ]);
    return subjectsReport;
  }

  async updateDummyProviderScript() {
    // Step 1: Define the list of unwanted emails
    const unwantedEmails = [
      'dataprivacy@brighthorizons.com',
      'dataprotection@yelp.com',
      '[email protected]', // Ensure this is formatted correctly
      '877-624-4532',
      'emailenrollment@gardenpreschoolcoop.org',
      'emailenrollment@yelp.com',
    ];

    try {
      // Step 2: Fetch providers from the database
      const providers = await this.providerModel.find({ is_child_care: true });
      if (!providers.length) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      // Step 3: Iterate over each provider
      for (let providerData of providers) {
        const provider = await this.dummyproviderModel.findOne({
          provider: providerData.user,
        });
        if (provider) {
          console.log('Original provider emails:', provider.emails || []);

          try {
            // Fetch details for Google link
            const detail = await this.placeService.findDetails(
              providerData.website,
            );
            console.log('detail', detail);

            // Update Google link
            await this.providerModel.findOneAndUpdate(
              { user: providerData.user },
              { $set: { 'rating.googleLink': detail.mapsLink } },
              { new: true },
            );
          } catch (err) {
            console.log(err);
          }
          // Step 4: Normalize and filter out unwanted emails
          const filteredEmails = (provider.emails || []).filter((email) => {
            const normalizedEmail = email.trim().toLowerCase(); // Normalize provider email
            return !unwantedEmails.some((unwanted) => {
              const normalizedUnwanted = unwanted.trim().toLowerCase(); // Normalize unwanted email
              if (unwanted.includes('protect')) return false;
              return normalizedUnwanted === normalizedEmail; // Check for match
            });
          });

          console.log('Filtered provider emails:', filteredEmails);
          console.log('Filtered provider length:', filteredEmails.length);
          const recommendedEmailsString = filteredEmails.join(', ');

          // Step 5: Update the provider only if there are changes
          const updateResult = await this.dummyproviderModel.updateOne(
            { provider: providerData.user },
            {
              $set: {
                emails: filteredEmails,
                recommended_emails: recommendedEmailsString,
              },
            },
            { new: true },
          );

          console.log(
            'Updated provider:',
            providerData.user,
            'with emails:',
            filteredEmails,
          );
          console.log('Update result:', updateResult);
        } else {
          console.log('No provider found for user:', providerData.user);
        }
      }

      return providers.length; // Return the number of providers processed
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        error.message || 'An error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchTakelessionprovider(
    name: string,
    institution: string,
    subjects: string,
  ) {
    let match = {};
    if (name) {
      match['name'] = { $regex: '.*' + name + '.*', $options: 'i' };
    }

    if (institution) {
      match['Education.institution'] = {
        $regex: '.*' + institution + '.*',
        $options: 'i',
      };
    }
    let subjectsArray = [];
    if (subjects) {
      subjectsArray = subjects.split(',');
      console.log('subjectsnames: ', subjectsArray);
    }
    console.log('match: ', match);
    const providers = await this.takelessionproviderModel.aggregate([
      { $match: match },
      ...(subjectsArray.length > 0
        ? [
            {
              $addFields: {
                subjectMatch: {
                  $anyElementTrue: {
                    $map: {
                      input: subjectsArray,
                      as: 'subject',
                      in: {
                        $anyElementTrue: {
                          $map: {
                            input: '$ProvideServices.service.name',
                            as: 'serviceName',
                            in: {
                              $regexMatch: {
                                input: '$$serviceName',
                                regex: {
                                  $concat: ['.*', '$$subject', '.*'], // Build regex dynamically
                                },
                                options: 'i', // Case-insensitive matching
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            { $match: { subjectMatch: true } },
          ]
        : []),
      { $sort: { name: 1 } },
    ]);

    return providers;
  }

  async extractedData(keywords: string[], text: string) {
    const extractedData: { [key: string]: string | null } = {};

    keywords.forEach((keyword) => {
      let value = '';

      switch (keyword) {
        case 'email':
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const emails = text.match(emailRegex);
          if (emails) value = emails.join(', ');
          break;
        case 'price':
          const priceRegex = /(?:\$[0-9,]+(?:\.[0-9]{2})?)(?=\s*per\s*month)/g;
          const prices = text.match(priceRegex);
          if (prices) value = [...new Set(prices)].join(', '); // Remove duplicates
          break;
        case 'hours':
          const hoursRegex =
            /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(.*?)(?=(monday|tuesday|wednesday|thursday|friday|saturday|sunday|$))/gi;
          const hoursMatches = text.match(hoursRegex);
          if (hoursMatches) {
            value = hoursMatches.join(', ').replace(/\s+/g, ' ').trim(); // Clean up whitespace
          }
          break;
        case 'age':
          const ageRegex =
            /(?:\b\d+\s*(?:years?|months?|weeks?|toddler|young)\b)/gi;
          const matchedAges = text.match(ageRegex);
          if (matchedAges) value = [...new Set(matchedAges)].join(', '); // Remove duplicates
          break;
        case 'ages':
          const agesRegex = /(\d+\s*(?:years?|months?|weeks?))/g;
          const matchedAgeValues = text.match(agesRegex);
          if (matchedAgeValues)
            value = [...new Set(matchedAgeValues)].join(', '); // Remove duplicates
          break;
        default:
          const regex = new RegExp(`${keyword}:?\\s*([\\w\\s,.]+)`, 'i');
          const match = text.match(regex);
          if (match && match[1]) {
            value = match[1].trim();
          }
          break;
      }

      if (value) {
        extractedData[keyword] = value;
      } else {
        extractedData[keyword] = null; // Set to null if not found
      }
    });

    return extractedData;
  }

  async checkProgramOrProviderDataByProviderId(providerId: string) {
    try {
      const proData = await this.cleandumpModel.find({ provider: providerId });
      // console.log('proData =====>>>>', proData);

      if (!proData) {
        throw new HttpException(
          'Program Dump Data not found',
          HttpStatus.NOT_FOUND,
        );
      }

      for (let data of proData) {
        let Dtext =
          typeof data.content === 'string'
            ? data.content
            : JSON.stringify(data.content);

        const Providerkeywords = [
          'name',
          'email',
          'phone',
          'website',
          'location',
          'address',
          'businessName',
          'businessname',
          'addressLine1',
          'rating',
          'contact',
          'phoneNumber',
          'contactNumber',
          'service',
          'hours',
          'services',
          'company',
          'organization',
          'locationDetails',
          'contactInfo',
          'emailAddress',
          'websiteURL',
          'socialMedia',
          'businessAddress',
          'mainOffice',
          'headquarters',
          'branch',
        ];

        const Programkeywords = [
          'education',
          'activity',
          'games',
          'events',
          'children',
          'kids',
          'child care',
          'curriculum',
          'class',
          'workshop',
          'session',
          'training',
          'tutorial',
          'lesson',
          'enrollment',
          'course',
          'preschool',
          'toddler',
          'early learning',
          'after school',
          'summer camp',
          'program',
          'age',
          'agegroup',
          'ages',
          'ages group',
          'age groups',
          'dropout',
          'dropin',
          'activities',
          'learning',
          'development',
          'educationProgram',
          'specialNeeds',
          'playgroup',
          'preschoolProgram',
          'caregiver',
          'open',
          'close',
          'childDevelopment',
          'learningCenter',
          'afterschoolCare',
          'childhoodEducation',
          'youthProgram',
          'earlyEducation',
          'parentingClass',
          'enrichment',
        ];

        const isKeywordPresent = (keywords: string[], text: string) => {
          return keywords.some((keyword) =>
            text.includes(keyword.toLowerCase()),
          );
        };

        const isProvider = isKeywordPresent(Providerkeywords, Dtext);
        console.log('isProvider ====>>>', isProvider);

        const isProgram = isKeywordPresent(Programkeywords, Dtext);
        console.log('isProgram ====>>>', isProgram);

        interface ProviderData {
          email?: string;
          price?: string;
          hours?: string;
        }

        interface ProgramData {
          age?: string;
          ages?: string;
        }

        let providerData: ProviderData = {};
        let programData: ProgramData = {};

        // Extract provider data if any keywords are present
        if (isProvider) {
          providerData = await this.extractedData(Providerkeywords, Dtext);
        }

        // Extract program data if any keywords are present
        if (isProgram) {
          programData = await this.extractedData(Programkeywords, Dtext);
        }

        const cleanDump = await this.cleandumpModel.findOneAndUpdate(
          { _id: data._id },
          {
            $set: {
              isProgramDataAvailable: isProgram,
              isProviderDataAvailable: isProvider,
              program_data: {
                age: programData.age,
                ages: programData.ages || null,
              },
              provider_data: {
                email: providerData.email || null,
                price: providerData.price || null,
                hours: providerData.hours || null,
              },
            },
          },
          { new: true },
        );
      }
      return 'Process Successfully';
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        error.message || 'An error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async scratchEventLinks(city: string, date: string) {
    try {
      let ctyId;
      let ctId;

      const cty = await this.citymanagementModel.findOne({
        _id: new ObjectId(city),
      });
      console.log('full cty: ', cty);

      if (!cty) {
        throw new Error('City not found');
      }

      switch (cty.city) {
        case 'Jersey City':
          ctyId = 'new+jersey';
          break;
        default:
          throw new Error('Unsupported city');
      }

      ctId = cty._id;
      console.log('ctyId: ', ctyId, 'ctId: ', ctId);
      let url = `https://jcitytimes.com/event-calendar/#/show?start=${date}&location=${ctyId}&distance=150`;
      const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

      // Scroll to the bottom of the page to load more events if needed
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      // Wait for a specific element to ensure all events are loaded
      await page.waitForSelector('.csEvWrap', { timeout: 10000 });

      // Use Puppeteer to extract the details you need for all events
      const eventDetails = await page.evaluate(() => {
        const events = [];
        const eventElements = document.querySelectorAll(
          '.csEvWrap.csEventTile',
        );

        eventElements.forEach((element) => {
          const title = element.querySelector('.csOneLine span')?.textContent;
          const venue = element.querySelector('.cityVenue')?.textContent;
          const time = element.querySelector('.csStaticSize span')?.textContent;
          const distance = element.querySelector(
            '.csStaticSize span:nth-child(2)',
          )?.textContent;
          const imageElement = element.querySelector(
            '.csimg.csImg',
          ) as HTMLElement;
          const backgroundImage = imageElement?.style.backgroundImage;
          const imageUrl = backgroundImage?.match(/url\("(.+)"\)/)?.[1]; // Extract URL inside the `url(...)`

          // Extract event link (href)
          const eventLink = (element.querySelector('a') as HTMLAnchorElement)
            ?.href;

          if (title && venue && time && distance && imageUrl && eventLink) {
            // Parse event date and city from the details
            const hrefParts = eventLink.split('/');
            const event_date = hrefParts[hrefParts.length - 1].slice(0, 10); // YYYY-MM-DD format

            // Extract event city from venue
            const venueParts = venue.split('|');
            const event_city = venueParts[venueParts.length - 1]?.trim();

            events.push({
              title,
              venue,
              time,
              distance,
              imageUrl,
              eventLink,
              event_date,
              event_city,
            });
          }
        });

        return events;
      });

      // Save event details one by one
      for (const event of eventDetails) {
        try {
          const existingEvent = await this.eventlinkModel.findOne({
            event_link: event.url,
            cityId: new ObjectId(ctId),
            'event_date.display': event.start_date,
          });
          if (!existingEvent) {
            const link = await this.eventlinkModel.create({
              image_url: event.imageUrl,
              title: event.title,
              venue: event.venue,
              time: event.time,
              distance: event.distance,
              event_link: event.eventLink,
              // event_date: event.event_date,
              event_date: {
                display: event.event_date,
                datetime: event.event_date,
              },
              event_city: ctyId,
              avalibility_dates: event.event_date,
              source: 'website jcitytimes',
              cityId: city,
              event_dates: event.event_date,
            });

            console.log(`Saved event: ${event.title}`);
          } else {
            console.log(`Event already exists: ${event.title}`);
          }
        } catch (saveError) {
          console.error(`Failed to save event: ${event.title}`, saveError);
        }
      }

      await browser.close();
      return 'Events Links Scratched and Saved Successfully';
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async saveEventDetails(event_link: string, eventId: string) {
    try {
      const { data } = await axios.get(event_link);
      const $ = cheerio.load(data);

      const title = $('h1').text().trim();

      let price = 'Price not specified';
      const priceElement = $('.ticket-card-compact-size__price');
      if (priceElement.length > 0) {
        price = priceElement.text().trim();
      }

      const description =
        $('.event-description').text().trim() || 'No description available.';
      const location =
        $('.location-info__address').text().trim() || 'Location not specified.';
      const duration =
        $('.event-duration').text().trim() || 'Duration not specified.';

      await this.eventModel.create({
        event_id: eventId,
        description: description,
        price: price,
        location: location,
        duration: duration,
      });

      console.log('Event details saved for event link: ', event_link);
    } catch (error) {
      console.error('Error fetching event details:', error.message);
    }
  }
  // async getEventsLinksByDateAndCity(
  //   source_id: string,
  //   start_date: string,
  //   end_date: string,
  //   keyword: string,
  // ) {
  //   console.log('city: ', source_id);
  //   const sour = await this.event_sourceModel.findOne({
  //     _id: new ObjectId(source_id),
  //   });

  //   let ctyId;
  //   let ctId;

  //   const cty = await this.citymanagementModel.findOne({
  //     _id: new ObjectId(sour.cityId),
  //   });
  //   console.log('full cty: ', cty);

  //   if (!cty) {
  //     throw new Error('City not found');
  //   }

  //   switch (cty.city) {
  //     case 'Weehawken':
  //       ctyId = 'nj--union-city';
  //       break;
  //     case 'Union City':
  //       ctyId = 'in--union-city';
  //       break;
  //     case 'West New York':
  //       ctyId = 'nj--secaucus';
  //       break;
  //     case 'Guttenberg':
  //       ctyId = 'nj--guttenberg';
  //       break;
  //     case 'Bayonne':
  //       ctyId = 'nj--bayonne';
  //       break;
  //     case 'Jersey City':
  //       ctyId = 'nj--jersey-city';
  //       break;
  //     case 'Phoenix':
  //       ctyId = 'ny--phoenix';
  //       break;
  //     case 'Secaucus':
  //       ctyId = 'nj--secaucus';
  //       break;
  //     case 'North Bergen':
  //       ctyId = 'nj--secaucus';
  //       break;
  //     case 'Hoboken':
  //       ctyId = 'nj--jersey-city';
  //       break;
  //     default:
  //       throw new Error('Unsupported city');
  //   }

  //   ctId = cty._id;
  //   console.log('ctyId: ', ctyId, 'ctId: ', ctId);

  //   let allEvents = [];
  //   let page = 1;
  //   let hasMoreEvents = true;
  //   const maxEventsPerRequest = 20;

  //   while (hasMoreEvents) {
  //     // const url = `https://www.eventbrite.com/d/${ctyId}/${keyword}/?page=${page}&start_date=${start_date}&end_date=${end_date}&page_size=${maxEventsPerRequest}`;

  //     const url = `https://www.eventbrite.com/d/${ctyId}/${keyword}/?page=${page}&start_date=${start_date}&end_date=${end_date}`;
  //     console.log('link_url: ', url);

  //     try {
  //       const { data, status } = await axios.get(url);

  //       if (status === 404) {
  //         console.warn(`Event URL not found: ${url}`);
  //         continue;
  //       }

  //       const $ = cheerio.load(data);
  //       let eventData;

  //       $('script').each((index, element) => {
  //         const scriptContent = $(element).html();
  //         if (
  //           scriptContent &&
  //           scriptContent.includes('window.__SERVER_DATA__')
  //         ) {
  //           const match = scriptContent.match(
  //             /window\.__SERVER_DATA__ = (\{.*?\});/s,
  //           );
  //           if (match) {
  //             const jsonString = match[1].trim();
  //             eventData = JSON.parse(jsonString);
  //           }
  //         }
  //       });

  //       if (
  //         !eventData ||
  //         !eventData.search_data ||
  //         !eventData.search_data.events
  //       ) {
  //         hasMoreEvents = false;
  //         continue;
  //       }

  //       const events = eventData.search_data.events.results || [];
  //       const filteredEvents = events.filter((event) => {
  //         const eventDate = new Date(event.start_date);
  //         return (
  //           eventDate >= new Date(start_date) && eventDate <= new Date(end_date)
  //         );
  //       });

  //       for (const event of filteredEvents) {
  //         console.log('Event:', event);

  //         const existingEvent = await this.eventlinkModel.findOne({
  //           event_link: event.url,
  //           source_id: new ObjectId(source_id),
  //           'event_date.display': event.start_date,
  //         });

  //         if (existingEvent) {
  //           console.log(`Event "${event.name}" already exists. Skipping...`);
  //           continue;
  //         }

  //         const slug = await this.generateUniqueSlug(event.name);

  //         const createdEventLink = await this.eventlinkModel.create({
  //           title: event.name,
  //           event_date: {
  //             display: event.start_date,
  //             datetime: event.start_date,
  //           },
  //           city: ctyId.trim(),
  //           cityId: sour.cityId,
  //           source_id: source_id,
  //           date: event.start_date,
  //           event_link: event.url,
  //           source: 'website eventbrite',
  //           type: keyword,
  //           avalibility_dates: event.start_date,
  //           slug: slug,
  //         });

  //         console.log(`Event Link for "${event.name}" created.`);

  //         await this.createAllEventLinksAndEventsEventBride(
  //           event.url,
  //           createdEventLink._id,
  //         );
  //         console.log(`Event detail for "${event.name}" created.`);

  //         allEvents.push({
  //           title: event.name,
  //           date: event.start_date,
  //           url: event.url,
  //           tickets_url: event.tickets_url,
  //         });
  //       }

  //       if (
  //         filteredEvents.length === 0
  //         //  ||
  //         // allEvents.length >= maxEventsPerRequest
  //       ) {
  //         hasMoreEvents = false;
  //       } else {
  //         page++;
  //       }
  //     } catch (error) {
  //       console.error('Error during event scraping:', error.message);
  //       if (error.response) {
  //         if (error.response.status === 429) {
  //           console.warn('Rate limit exceeded. Retrying...');
  //           await new Promise((resolve) => setTimeout(resolve, 60000));
  //         }
  //       } else {
  //         console.error('Unknown error:', error.message);
  //       }
  //       continue;
  //     }
  //   }

  //   return allEvents;
  // }

  async getEventsLinksByDateAndCity(
    source_id: string,
    start_date: string,
    end_date: string,
    keyword: string,
  ) {
    console.log('city: ', source_id);
    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full cty: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'nj--union-city';
        break;
      case 'Union City':
        ctyId = 'in--union-city';
        break;
      case 'West New York':
        ctyId = 'nj--secaucus';
        break;
      case 'Guttenberg':
        ctyId = 'nj--guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'nj--bayonne';
        break;
      case 'Jersey City':
        ctyId = 'nj--jersey-city';
        break;
      case 'Phoenix':
        ctyId = 'ny--phoenix';
        break;
      case 'Secaucus':
        ctyId = 'nj--secaucus';
        break;
      case 'North Bergen':
        ctyId = 'nj--secaucus';
        break;
      case 'Hoboken':
        ctyId = 'nj--jersey-city';
        break;
      default:
        throw new Error('Unsupported city');
    }

    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    let allEvents = [];
    let page = 1;
    let hasMoreEvents = true;
    const maxEventsPerRequest = 20;

    const eventIds: string[] = [];

    while (hasMoreEvents) {
      const url = `https://www.eventbrite.com/d/${ctyId}/${keyword}/?page=${page}&start_date=${start_date}&end_date=${end_date}&page_size=${maxEventsPerRequest}`;

      // const url = `https://www.eventbrite.com/d/${ctyId}/${keyword}/?page=${page}&start_date=${start_date}&end_date=${end_date}`;
      console.log('link_url: ', url);

      try {
        const { data, status } = await axios.get(url);

        if (status === 404) {
          console.warn(`Event URL not found: ${url}`);
          continue;
        }

        const $ = cheerio.load(data);
        let eventData;

        $('script').each((index, element) => {
          const scriptContent = $(element).html();
          if (
            scriptContent &&
            scriptContent.includes('window.__SERVER_DATA__')
          ) {
            const match = scriptContent.match(
              /window\.__SERVER_DATA__ = (\{.*?\});/s,
            );
            if (match) {
              const jsonString = match[1].trim();
              eventData = JSON.parse(jsonString);
            }
          }
        });

        if (
          !eventData ||
          !eventData.search_data ||
          !eventData.search_data.events
        ) {
          hasMoreEvents = false;
          continue;
        }

        const events = eventData.search_data.events.results || [];
        const filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.start_date);
          return (
            eventDate >= new Date(start_date) && eventDate <= new Date(end_date)
          );
        });

        for (const event of filteredEvents) {
          console.log('Event:', event);

          const existingEvent = await this.eventlinkModel.findOne({
            event_link: event.url,
            source_id: new ObjectId(source_id),
            'event_date.display': event.start_date,
          });

          if (existingEvent) {
            console.log(`Event "${event.name}" already exists. Skipping...`);
            continue;
          }

          const slug = await this.generateUniqueSlug(event.name);

          const createdEventLink = await this.eventlinkModel.create({
            title: event.name,
            event_date: {
              display: event.start_date,
              datetime: event.start_date,
            },
            city: ctyId.trim(),
            cityId: sour.cityId,
            source_id: source_id,
            date: event.start_date,
            event_link: event.url,
            source: 'website eventbrite',
            type: keyword,
            avalibility_dates: event.start_date,
            slug: slug,
          });

          console.log(`Event Link for "${event.name}" created.`);

          eventIds.push(createdEventLink._id.toString());

          await this.createAllEventLinksAndEventsEventBride(
            event.url,
            createdEventLink._id,
          );
          console.log(`Event detail for "${event.name}" created.`);

          allEvents.push({
            title: event.name,
            date: event.start_date,
            url: event.url,
            tickets_url: event.tickets_url,
          });
        }

        if (
          filteredEvents.length === 0 ||
          allEvents.length >= maxEventsPerRequest
        ) {
          hasMoreEvents = false;
        } else {
          page++;
        }
      } catch (error) {
        console.error('Error during event scraping:', error.message);
        if (error.response) {
          if (error.response.status === 429) {
            console.warn('Rate limit exceeded. Retrying...');
            await new Promise((resolve) => setTimeout(resolve, 120000));
          }
        } else {
          console.error('Unknown error:', error.message);
        }
        continue;
      }
    }

    if (eventIds.length > 0) {
      await this.updateEventsFriendly(eventIds);

      for (const eventId of eventIds) {
        const updatedEvent = await this.eventlinkModel.findById(eventId);

        if (
          updatedEvent &&
          updatedEvent.childFriendly === false &&
          updatedEvent.familyFriendly === false
        ) {
          console.log(
            `Deleting event "${updatedEvent.title}" because it's neither child nor family friendly.`,
          );

          await this.eventlinkModel.deleteOne({ _id: eventId });

          await this.eventModel.deleteOne({ event_link_id: eventId });

          console.log(
            `Event "${updatedEvent.title}" deleted from both models.`,
          );
        }
      }
    }

    return allEvents;
  }

  async fetchEventDetails(id: string) {
    if (!id) {
      throw new Error('Id is required');
    }

    try {
      const dta = await this.eventModel.findOne({ event_link_id: id });

      if (dta !== null) {
        throw new HttpException('Event Already Exists', HttpStatus.BAD_REQUEST);
      }
      console.log('dta ==>>>', dta);

      const evnt = await this.eventlinkModel.findById(id);
      if (!evnt) {
        throw new Error('Event not found.');
      }

      let url = evnt.event_link;
      if (!url) {
        throw new Error('Event URL not found.');
      }

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const title = $('h1').text().trim();

      await new Promise((resolve) => setTimeout(resolve, 5000));

      let price = 'Price not specified';
      const priceElement1 = $(
        '.Layout-module__module___2eUcs .conversion-bar__panel-info',
      );
      if (priceElement1.length > 0) {
        price = priceElement1.text().trim();
        console.log('Price found in first section:', price);
      }

      if (price === 'Price not specified') {
        const priceElement2 = $(
          '.Layout-module__module___2eUcs .TicketCard-module__pricing___38cNv',
        );
        if (priceElement2.length > 0) {
          let priceSegments = [];

          priceElement2.each(function () {
            const ticketName = $(this)
              .closest('.TicketCard-module__root___1Vb-2')
              .find('.TicketCard-module__headerLeft___3wI3k h3')
              .text()
              .trim();

            const basePrice = $(this)
              .find('.Typography_root__487rx')
              .first()
              .text()
              .trim();

            const feeAndTax = $(this)
              .find('.Typography_body-caption__487rx')
              .map(function () {
                return $(this).text().trim();
              })
              .get()
              .join(' ');

            if (ticketName && basePrice && feeAndTax) {
              priceSegments.push(
                ticketName + '\n' + basePrice + ' ' + feeAndTax,
              );
            }
          });

          price = priceSegments.join('\n\n');
          console.log('Price found in second section:', price);
        }
      }

      if (price === 'Price not specified') {
        const priceElement3 = $('.ticket-card-compact-size__price');
        if (priceElement3.length > 0) {
          price = priceElement3.text().trim();
          console.log('Price found in third section:', price);
        }
      }

      if (price === 'Price not specified') {
        console.warn('Price not found for the event');
      }

      const aboutThisEventSection = $(
        '.Layout-module__module___2eUcs[data-testid="aboutThisEvent"]',
      );
      const descriptionElements = aboutThisEventSection.find(
        '.has-user-generated-content.event-description__content *',
      );
      let description = '';

      descriptionElements.each((i, el) => {
        const elementText = $(el).text().trim();

        if (elementText && !description.includes(elementText)) {
          description += elementText + '\n';
        }
      });

      description = description.trim() || 'No description available.';

      const durationElement = aboutThisEventSection.find('ul.css-1i6cdnn li');
      const durationText =
        durationElement.text().trim() || 'Event duration not specified';

      const fullDescription = `About this event \nEvent lasts ${durationText} \n${description}`;

      const dateAndTimeSection = $(
        '.Layout-module__module___2eUcs[data-testid="dateAndTime"]',
      );
      const dateText =
        dateAndTimeSection.find('.date-info__full-datetime').text().trim() ||
        'Date and time not available';

      const locationDiv = $('.Layout-module__location___-D6BU');
      const locationText = locationDiv
        .find('.location-info__address-text')
        .text()
        .trim();
      let fullAddress = locationDiv
        .find('.location-info__address')
        .contents()
        .not(locationDiv.find('button'))
        .text()
        .trim();

      fullAddress = fullAddress.replace(/\s*Show\s*map\s*/i, '').trim();

      let Lat, Lng;
      if (fullAddress) {
        try {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                address: fullAddress,
                key: API_KEY,
              },
            },
          );

          if (response.data.status === 'OK') {
            Lat = response.data.results[0].geometry.location.lat;
            Lng = response.data.results[0].geometry.location.lng;
            console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
          } else {
            console.log('Geocoding API error:', response.data.status);
          }
        } catch (error) {
          console.error('Error fetching geocoding data:', error.message);
        }
      }

      let organizer: Organizer = {};

      const organizerNameElement = $(
        '.descriptive-organizer-info-mobile__name a',
      );
      if (organizerNameElement.length > 0) {
        organizer.name = organizerNameElement.text().trim();
        organizer.url = organizerNameElement.attr('href') || '';
      } else {
        console.warn('Organizer name not found');
      }

      const organizerDescriptionElement = $(
        '.descriptive-organizer-info-mobile__description',
      );

      if (organizerDescriptionElement.length > 0) {
        organizer.description = organizerDescriptionElement.text().trim();
      } else {
        organizer.description = 'No description available';
      }

      organizer.description = organizer.description.replace(/\s+/g, ' ').trim();

      const organizerThumbnailElement = $(
        '.descriptive-organizer-info-mobile__image img',
      );
      if (organizerThumbnailElement.length > 0) {
        organizer.thumbnailLogo160 =
          organizerThumbnailElement.attr('src') || '';
      }

      console.log('Organizer:', organizer);

      const agenda = [];
      const agendaSection = $(
        '.Layout-module__module___2eUcs[data-testid="agenda"]',
      );
      const sessions = agendaSection.find('[data-testid="SlotPreview"]');

      sessions.each((i, el) => {
        const time = $(el)
          .find('[data-testid="preview-slot__time"]')
          .text()
          .trim();
        const sessionTitle = $(el).find('.css-bh5t0l').text().trim();

        let sessionDescription = $(el)
          .find('[data-testid="preview-slot__description"]')
          .html()
          .trim();

        sessionDescription = sessionDescription
          .replace(/<button[^>]*>[^<]*<\/button>/g, '')
          .replace(/<style[^>]*>[^<]*<\/style>/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        sessionDescription = sessionDescription
          .replace(/\.css-[a-z0-9-]+/g, '')
          .replace(/{[^}]*}/g, '');

        if (!sessionDescription || sessionDescription.length < 50) {
          console.log(
            `Session description is too short for session: ${sessionTitle}, skipping.`,
          );
        }

        if (time && sessionTitle && sessionDescription) {
          agenda.push(`[${time}] ${sessionTitle} - ${sessionDescription}`);
        }
      });

      $('script').each((index, element) => {
        const scriptContent = $(element).html();

        if (scriptContent && scriptContent.includes('window.__SERVER_DATA__')) {
          try {
            const match = scriptContent.match(
              /window\.__SERVER_DATA__ = (\{.*?\});/s,
            );

            if (match) {
              const jsonString = match[1].trim();
              try {
                const eventData = JSON.parse(jsonString);
                if (eventData && eventData.organizer) {
                  organizer = eventData.organizer;
                }
              } catch (jsonError) {
                console.error(
                  'Error parsing JSON data from script:',
                  jsonError.message,
                );
              }
            }
          } catch (regexError) {
            console.error('Error matching script content:', regexError.message);
          }
        }
      });
      if (!organizer || !organizer.name) {
        console.warn('Organizer data not found or incomplete', organizer);
      }

      const priceLinkElement = $(
        '.Layout-module__module___2eUcs .conversion-bar--ticket-selection iframe',
      );
      let priceLink = '';

      if (priceLinkElement.length > 0) {
        priceLink = priceLinkElement.attr('src') || '';
        console.log('Price Link:', priceLink);
      }

      let refundPolicy = '';
      const refundPolicySection = $(
        '.Layout-module__module___2eUcs[data-testid="refundPolicy"]',
      );
      const refundPolicyContent = refundPolicySection.find('section div');

      refundPolicyContent.each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          refundPolicy += text + '\n';
        }
      });

      refundPolicy = refundPolicy.trim() || 'No refund policy available.';

      const sanitizedDescription =
        organizer.description && organizer.description.trim() !== '<P></P>'
          ? organizer.description
          : 'No description available';

      const eventDetails = {
        title,
        description: fullDescription,
        date: {
          display: dateText,
          datetime: dateText,
        },
        location: {
          name: locationText,
          fullAddress: fullAddress || 'Location not specified',
        },
        latitude: Lat,
        longitude: Lng,
        organizer: {
          name: organizer.name || 'Organizer not specified',
          url: organizer.url || '',
          orgWebsite: organizer.orgWebsite || '',
          description: sanitizedDescription,
          thumbnail: organizer.thumbnailLogo160 || '',
        },
        url,
        price,
        refundPolicy,
        agenda,
        priceLink,
      };

      await this.eventModel.create({
        title: eventDetails.title,
        venue: eventDetails.location.name,
        time: eventDetails.date.display,
        event_link: url,
        event_city: eventDetails.location.fullAddress,
        description: eventDetails.description,
        providerName: 'Event Brite',
        providerUrl: 'https://www.eventbrite.com/',
        providerImage: eventDetails.organizer.thumbnail,
        location: {
          name: eventDetails.location.name,
          fullAddress: eventDetails.location.fullAddress,
        },
        event_date: {
          display: eventDetails.date.display,
          datetime: eventDetails.date.datetime,
        },
        organizer: {
          name: eventDetails.organizer.name,
          url: eventDetails.organizer.url,
          orgWebsite: eventDetails.organizer.orgWebsite,
          description: eventDetails.organizer.description,
          thumbnail: eventDetails.organizer.thumbnail,
        },
        date: evnt['event_date']['display'],
        city: evnt.city,
        cityId: evnt.cityId,
        event_link_id: evnt._id,
        source: 'website eventbrite',
        price: eventDetails.price,
        refundPolicy: eventDetails.refundPolicy,
        latitude: Lat,
        longitude: Lng,
        priceLink: eventDetails.priceLink,
        agenda: eventDetails.agenda,
      });

      evnt.is_event_detail = true;
      await evnt.save();

      return eventDetails;
    } catch (error) {
      console.error('Error fetching event details:', error.message);
      throw new Error('Failed to fetch event details: ' + error.message);
    }
  }

  async updateEventDetails(eventLinkId: string) {
    if (!eventLinkId) {
      throw new Error('Event Link ID is required');
    }

    try {
      const event = await this.eventModel.findOne({
        event_link_id: eventLinkId,
      });

      if (!event) {
        throw new Error('Event not found.');
      }

      const url = event.event_link;
      if (!url) {
        throw new Error('Event URL not found.');
      }

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const priceLinkElement = $(
        '.Layout-module__module___2eUcs .conversion-bar--ticket-selection iframe',
      );
      let priceLink = '';

      if (priceLinkElement.length > 0) {
        priceLink = priceLinkElement.attr('src') || '';
        console.log('Price Link:', priceLink);
      }

      let price = 'Price not specified';
      const priceElement1 = $(
        '.Layout-module__module___2eUcs .conversion-bar__panel-info',
      );
      if (priceElement1.length > 0) {
        price = priceElement1.text().trim();
        console.log('Price found in first section:', price);
      }

      if (price === 'Price not specified') {
        const priceElement2 = $(
          '.Layout-module__module___2eUcs .TicketCard-module__pricing___38cNv',
        );
        if (priceElement2.length > 0) {
          let priceSegments = [];

          priceElement2.each(function () {
            const ticketName = $(this)
              .closest('.TicketCard-module__root___1Vb-2')
              .find('.TicketCard-module__headerLeft___3wI3k h3')
              .text()
              .trim();

            const basePrice = $(this)
              .find('.Typography_root__487rx')
              .first()
              .text()
              .trim();

            const feeAndTax = $(this)
              .find('.Typography_body-caption__487rx')
              .map(function () {
                return $(this).text().trim();
              })
              .get()
              .join(' ');

            if (ticketName && basePrice && feeAndTax) {
              priceSegments.push(
                ticketName + '\n' + basePrice + ' ' + feeAndTax,
              );
            }
          });

          price = priceSegments.join('\n\n');
          console.log('Price found in second section:', price);
        }
      }

      if (price === 'Price not specified') {
        const priceElement3 = $('.ticket-card-compact-size__price');
        if (priceElement3.length > 0) {
          price = priceElement3.text().trim();
          console.log('Price found in third section:', price);
        }
      }

      if (price === 'Price not specified') {
        console.warn('Price not found for the event');
      }

      const agenda = [];
      const agendaSection = $(
        '.Layout-module__module___2eUcs[data-testid="agenda"]',
      );
      const sessions = agendaSection.find('[data-testid="SlotPreview"]');

      sessions.each((i, el) => {
        const time = $(el)
          .find('[data-testid="preview-slot__time"]')
          .text()
          .trim();
        const sessionTitle = $(el).find('.css-bh5t0l').text().trim();

        let sessionDescription = $(el)
          .find('[data-testid="preview-slot__description"]')
          .html()
          .trim();

        sessionDescription = sessionDescription
          .replace(/<button[^>]*>[^<]*<\/button>/g, '')
          .replace(/<style[^>]*>[^<]*<\/style>/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        sessionDescription = sessionDescription
          .replace(/\.css-[a-z0-9-]+/g, '')
          .replace(/{[^}]*}/g, '');

        if (!sessionDescription || sessionDescription.length < 50) {
          console.log(
            `Session description is too short for session: ${sessionTitle}, skipping.`,
          );
        }

        if (time && sessionTitle && sessionDescription) {
          agenda.push(`[${time}] ${sessionTitle} - ${sessionDescription}`);
        }
      });

      let refundPolicy = '';
      const refundPolicySection = $(
        '.Layout-module__module___2eUcs[data-testid="refundPolicy"]',
      );
      const refundPolicyContent = refundPolicySection.find('section div');

      refundPolicyContent.each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          refundPolicy += text + '\n';
        }
      });

      refundPolicy = refundPolicy.trim() || 'No refund policy available.';

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const aboutThisEventSection = $(
        '.Layout-module__module___2eUcs[data-testid="aboutThisEvent"]',
      );
      const descriptionElements = aboutThisEventSection.find(
        '.has-user-generated-content.event-description__content *',
      );
      let description = '';

      descriptionElements.each((i, el) => {
        const elementText = $(el).text().trim();

        if (elementText && !description.includes(elementText)) {
          description += elementText + '\n';
        }
      });

      description = description.trim() || 'No description available.';

      const durationElement = aboutThisEventSection.find('ul.css-1i6cdnn li');
      const durationText =
        durationElement.text().trim() || 'Event duration not specified';

      const fullDescription = `About this event \nEvent lasts ${durationText} \n${description}`;

      const dateAndTimeSection = $(
        '.Layout-module__module___2eUcs[data-testid="dateAndTime"]',
      );
      const dateText =
        dateAndTimeSection.find('.date-info__full-datetime').text().trim() ||
        'Date and time not available';

      let updated = false;

      if (event.price !== price) {
        event.price = price;
        updated = true;
      }

      if (event.refundPolicy !== refundPolicy) {
        event.refundPolicy = refundPolicy;
        updated = true;
      }

      if (event.description !== fullDescription) {
        event.description = fullDescription;
        updated = true;
      }

      if (event.time !== dateText) {
        event.time = dateText;
        updated = true;
      }

      if (updated) {
        await event.save();
      }

      return {
        message: 'Event details updated successfully',
        event: {
          price: event.price,
          refundPolicy: event.refundPolicy,
          description: event.description,
          time: event.time,
          agenda: event.agenda,
        },
      };
    } catch (error) {
      console.error('Error updating event details:', error.message);
      throw new Error('Failed to update event details: ' + error.message);
    }
  }

  async createAllEventsDateWise(date: string, source_id: string) {
    console.log('date', date, 'city', source_id);
    if (!date) {
      throw new Error('Date is required');
    }

    try {
      const dta = await this.eventlinkModel.find({
        'event_date.display': date,
        source_id: new ObjectId(source_id),
        is_event_detail: false,
      });
      console.log('dta =====>>>>', dta);

      for (let scr of dta) {
        let url = scr.event_link;

        try {
          const { data } = await axios.get(url);
          const $ = cheerio.load(data);
          await new Promise((resolve) => setTimeout(resolve, 5000));

          const title = $('h1').text().trim();

          let price = 'Price not specified';
          const priceElement1 = $(
            '.Layout-module__module___2eUcs .conversion-bar__panel-info',
          );
          if (priceElement1.length > 0) {
            price = priceElement1.text().trim();
            console.log('Price found in first section:', price);
          }

          if (price === 'Price not specified') {
            const priceElement2 = $(
              '.Layout-module__module___2eUcs .TicketCard-module__pricing___38cNv',
            );
            if (priceElement2.length > 0) {
              let priceSegments = [];

              priceElement2.each(function () {
                const ticketName = $(this)
                  .closest('.TicketCard-module__root___1Vb-2')
                  .find('.TicketCard-module__headerLeft___3wI3k h3')
                  .text()
                  .trim();

                const basePrice = $(this)
                  .find('.Typography_root__487rx')
                  .first()
                  .text()
                  .trim();

                const feeAndTax = $(this)
                  .find('.Typography_body-caption__487rx')
                  .map(function () {
                    return $(this).text().trim();
                  })
                  .get()
                  .join(' ');

                if (ticketName && basePrice && feeAndTax) {
                  priceSegments.push(
                    ticketName + '\n' + basePrice + ' ' + feeAndTax,
                  );
                }
              });

              price = priceSegments.join('\n\n');
              console.log('Price found in second section:', price);
            }
          }

          if (price === 'Price not specified') {
            const priceElement3 = $('.ticket-card-compact-size__price');
            if (priceElement3.length > 0) {
              price = priceElement3.text().trim();
              console.log('Price found in third section:', price);
            }
          }

          if (price === 'Price not specified') {
            console.warn('Price not found for the event');
          }

          const aboutThisEventSection = $(
            '.Layout-module__module___2eUcs[data-testid="aboutThisEvent"]',
          );

          const descriptionElements = aboutThisEventSection.find(
            '.has-user-generated-content.event-description__content *',
          );
          let description = '';

          descriptionElements.each((i, el) => {
            const elementText = $(el).text().trim();

            if (elementText && !description.includes(elementText)) {
              description += elementText + '\n';
            }
          });

          description = description.trim() || 'No description available.';

          const durationElement =
            aboutThisEventSection.find('ul.css-1i6cdnn li');
          const durationText =
            durationElement.text().trim() || 'Event duration not specified';

          const fullDescription = `About this event \nEvent lasts ${durationText} \n${description}`;

          const dateAndTimeSection = $(
            '.Layout-module__module___2eUcs[data-testid="dateAndTime"]',
          );
          const dateText =
            dateAndTimeSection
              .find('.date-info__full-datetime')
              .text()
              .trim() || 'Date and time not available';

          const locationDiv = $('.Layout-module__location___-D6BU');
          const locationText = locationDiv
            .find('.location-info__address-text')
            .text()
            .trim();
          let fullAddress = locationDiv
            .find('.location-info__address')
            .contents()
            .not(locationDiv.find('button'))
            .text()
            .trim();

          fullAddress = fullAddress.replace(/\s*Show\s*map\s*/i, '').trim();

          let Lat, Lng;
          if (fullAddress) {
            try {
              const response = await axios.get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                {
                  params: {
                    address: fullAddress,
                    key: API_KEY,
                  },
                },
              );

              if (response.data.status === 'OK') {
                Lat = response.data.results[0].geometry.location.lat;
                Lng = response.data.results[0].geometry.location.lng;
                console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
              } else {
                console.log('Geocoding API error:', response.data.status);
              }
            } catch (geoError) {
              console.error('Error fetching geocoding data:', geoError.message);
            }
          }

          let organizer: Organizer = {};

          const organizerNameElement = $(
            '.descriptive-organizer-info-mobile__name a',
          );
          if (organizerNameElement.length > 0) {
            organizer.name = organizerNameElement.text().trim();
            organizer.url = organizerNameElement.attr('href') || '';
          } else {
            console.warn('Organizer name not found');
          }

          const organizerDescriptionElement = $(
            '.descriptive-organizer-info-mobile__description',
          );

          if (organizerDescriptionElement.length > 0) {
            organizer.description = organizerDescriptionElement.text().trim();
          } else {
            organizer.description = 'No description available';
          }

          organizer.description = organizer.description
            .replace(/\s+/g, ' ')
            .trim();

          const organizerThumbnailElement = $(
            '.descriptive-organizer-info-mobile__image img',
          );
          if (organizerThumbnailElement.length > 0) {
            organizer.thumbnailLogo160 =
              organizerThumbnailElement.attr('src') || '';
          }

          const agenda = [];
          const agendaSection = $(
            '.Layout-module__module___2eUcs[data-testid="agenda"]',
          );
          const sessions = agendaSection.find('[data-testid="SlotPreview"]');

          sessions.each((i, el) => {
            const time = $(el)
              .find('[data-testid="preview-slot__time"]')
              .text()
              .trim();
            const sessionTitle = $(el).find('.css-bh5t0l').text().trim();

            let sessionDescription = $(el)
              .find('[data-testid="preview-slot__description"]')
              .html()
              .trim();

            sessionDescription = sessionDescription
              .replace(/<button[^>]*>[^<]*<\/button>/g, '')
              .replace(/<style[^>]*>[^<]*<\/style>/g, '')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+/g, ' ')
              .trim();

            sessionDescription = sessionDescription
              .replace(/\.css-[a-z0-9-]+/g, '')
              .replace(/{[^}]*}/g, '');

            if (!sessionDescription || sessionDescription.length < 50) {
              console.log(
                `Session description is too short for session: ${sessionTitle}, skipping.`,
              );
            }

            if (time && sessionTitle && sessionDescription) {
              agenda.push(`[${time}] ${sessionTitle} - ${sessionDescription}`);
            }
          });

          const priceLinkElement = $(
            '.Layout-module__module___2eUcs .conversion-bar--ticket-selection iframe',
          );
          let priceLink = '';

          if (priceLinkElement.length > 0) {
            priceLink = priceLinkElement.attr('src') || '';
            console.log('Price Link:', priceLink);
          }

          let refundPolicy = '';
          const refundPolicySection = $(
            '.Layout-module__module___2eUcs[data-testid="refundPolicy"]',
          );
          const refundPolicyContent = refundPolicySection.find('section div');

          refundPolicyContent.each((i, el) => {
            const text = $(el).text().trim();
            if (text) {
              refundPolicy += text + '\n';
            }
          });

          refundPolicy = refundPolicy.trim() || 'No refund policy available.';

          const sanitizedDescription =
            organizer.description && organizer.description.trim() !== '<P></P>'
              ? organizer.description
              : 'No description available';

          const eventDetails = {
            title,
            description: fullDescription,
            date: {
              display: dateText,
              datetime: dateText,
            },
            location: {
              name: locationText,
              fullAddress: fullAddress || 'Location not specified',
            },
            latitude: Lat,
            longitude: Lng,
            organizer: {
              name: organizer.name || 'Organizer not specified',
              url: organizer.url || '',
              orgWebsite: organizer.orgWebsite || '',
              description: sanitizedDescription,
              thumbnail: organizer.thumbnailLogo160 || '',
            },
            url,
            price,
            refundPolicy,
            priceLink,
            agenda,
          };

          await this.eventModel.create({
            title: eventDetails.title,
            venue: eventDetails.location.name,
            time: eventDetails.date.display,
            event_link: url,
            event_city: eventDetails.location.fullAddress,
            description: eventDetails.description,
            providerName: 'Event Brite',
            providerUrl: 'https://www.eventbrite.com/',
            providerImage: eventDetails.organizer.thumbnail,
            location: {
              name: eventDetails.location.name,
              fullAddress: eventDetails.location.fullAddress,
            },
            event_date: {
              display: eventDetails.date.display,
              datetime: eventDetails.date.datetime,
            },
            organizer: {
              name: eventDetails.organizer.name,
              url: eventDetails.organizer.url,
              orgWebsite: eventDetails.organizer.orgWebsite,
              description: eventDetails.organizer.description,
              thumbnail: eventDetails.organizer.thumbnail,
            },
            date: date,
            source_id: source_id,
            cityId: scr.cityId,
            event_link_id: scr._id,
            source: 'website eventbrite',
            price: eventDetails.price,
            refundPolicy: eventDetails.refundPolicy,
            latitude: Lat,
            longitude: Lng,
            priceLink: eventDetails.priceLink,
            agenda,
          });

          scr.is_event_detail = true;
          await scr.save();
        } catch (eventError) {
          console.error(
            `Error processing event with URL ${url}:`,
            eventError.message,
          );
        }
      }

      return 'Created all events date wise successfully';
    } catch (error) {
      console.error('Error fetching event details:', error.message);
      throw new Error('Failed to fetch event details: ' + error.message);
    }
  }

  async getAllEventsLinksDateAndCityWise(
    city: string,
    source: string,
    Fromdate: string,
    Todate: string,
    page_number: number,
    page_size: number,
  ) {
    console.log(
      'city: ',
      city,
      'Fromdate: ',
      Fromdate,
      'Todate: ',
      Todate,
      'page_number: ',
      page_number,
      'page_size: ',
      page_size,
    );

    const skip = (page_number - 1) * page_size;

    const matchStage = {
      cityId: new ObjectId(city),
      source: source,
      is_deleted: false,
      $or: [
        {
          avalibility_dates: { $elemMatch: { $gte: Fromdate, $lte: Todate } },
        },
        {
          availability_dates: { $elemMatch: { $gte: Fromdate, $lte: Todate } },
        },
      ],
    };

    const data = await this.eventlinkModel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { 'event_date.display': 1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async getAllEventsDetailDateAndCityWise(
    city: string,
    date: string,
    page_number: number,
    page_size: number,
  ) {
    console.log(
      'city: ',
      city,
      'date: ',
      date,
      'page_number: ',
      page_number,
      'page_size: ',
      page_size,
    );

    const skip = (page_number - 1) * page_size;

    const data = await this.eventModel.aggregate([
      {
        $match: {
          $and: [{ cityId: new ObjectId(city), date: date }],
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      // {
      //   $lookup: {
      //     from: 'providers',
      //     localField: 'providerId',
      //     foreignField: '_id',
      //     as: 'providerId',
      //   },
      // },
      // {
      //   $lookup: {
      //     from: 'users',
      //     localField: 'providerUserId',
      //     foreignField: '_id',
      //     as: 'providerUserId',
      //   },
      // },
      {
        $lookup: {
          from: 'eventlinks',
          localField: 'event_link_id',
          foreignField: '_id',
          as: 'event_link_id',
        },
      },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { date: 1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async addCityIdInEventLinkScript(city: string) {
    try {
      console.log('city: ', city);

      const cityInput = city;
      console.log('cityInput: ', cityInput);
      const cityName = cityInput.split('--')[1].replace(/-/g, ' '); // This will give you "jersey city"
      console.log('cityName: ', cityName);
      let cityId = await this.citymanagementModel.findOne({
        city: { $regex: new RegExp(`^${cityName}$`, 'i') },
      });

      console.log('cityId: ', cityId);
      const link = await this.eventlinkModel.updateMany(
        { city: city },
        { $set: { cityId: cityId._id } },
      );
      return link;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async addEventLinkIdInEventsScript() {
    try {
      const link = await this.eventlinkModel.find();
      for (let links of link) {
        let eventId = await this.eventModel.findOne({
          event_link: links.event_link,
        });
        if (eventId) {
          await this.eventModel.updateOne(
            { _id: eventId._id },
            { $set: { event_link_id: links._id, cityId: links.cityId } },
          );
        }
      }
      return link;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async extractDomain(url) {
    if (!url) return null; // Return null if the URL is undefined or null
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+\.com)/i);
    return match ? match[1] : null; // Return the domain or null if not found
  }

  async addProviderIdInEventsScript() {
    try {
      // Fetch all providers
      const providers = await this.providerModel.find();

      // Create a mapping for easy lookup
      const providerMap = {};
      for (const provider of providers) {
        const domain = await this.extractDomain(provider.website);
        providerMap[domain] = provider;
      }

      // Fetch all events
      const events = await this.eventModel.find();

      // Iterate through each event to find matches
      for (let event of events) {
        const organizer = event.organizer;

        // Check if the orgWebsite is present and valid
        if (organizer && organizer.orgWebsite) {
          const eventDomain = await this.extractDomain(organizer.orgWebsite);
          const matchingProvider = providerMap[eventDomain];

          if (matchingProvider) {
            // Update the event with providerId and providerUserId
            await this.eventModel.updateOne(
              { _id: event._id },
              {
                $set: {
                  providerId: matchingProvider._id,
                  providerUserId: matchingProvider.user,
                },
              },
            );
            console.log(`Updated Event ID: ${event._id}`);

            // Update the event with providerId and providerUserId
            await this.providerModel.updateOne(
              { _id: matchingProvider._id },
              {
                $set: {
                  is_event: true,
                },
              },
            );
            console.log(`Updated Event ID: ${event._id}`);
          } else {
            // Create a new user since the domains do not match
            const newUser = new this.userModel({
              firstName: organizer.name,
              userName: organizer.name,
              role: 'provider',
              roles: 'purpleprovider',
            });

            // Save the new user first
            const savedUser = await newUser.save();

            // Create a new provider
            const newProvider = new this.providerModel({
              userName: organizer.name,
              businessName: organizer.name,
              website: organizer.orgWebsite || '', // Handle empty orgWebsite
              providerType: 'solo',
              user: savedUser._id,
              is_event: true,
            });

            // Save the new provider
            const savedProvider = await newProvider.save();
            console.log(`Created new user ID: ${savedUser._id}`);
            console.log(`Created new provider ID: ${savedProvider._id}`);

            // Update the event with the new providerId and user
            await this.eventModel.updateOne(
              { _id: event._id },
              {
                $set: {
                  providerId: savedProvider._id,
                  providerUserId: savedUser._id,
                },
              },
            );
            console.log(
              `Updated Event ID: ${event._id} with new provider due to domain mismatch`,
            );
          }
        } else if (organizer && organizer.name) {
          // Create a new user if orgWebsite is empty
          const newUser = new this.userModel({
            firstName: organizer.name,
            userName: organizer.name,
            role: 'provider',
            roles: 'purpleprovider',
          });

          // Save the new user first
          const savedUser = await newUser.save();

          // Create a new provider
          const newProvider = new this.providerModel({
            userName: organizer.name,
            businessName: organizer.name,
            website: '', // Empty since no orgWebsite
            providerType: 'solo',
            user: savedUser._id,
            is_event: true,
          });

          // Save the new provider
          const savedProvider = await newProvider.save();
          console.log(`Created new provider ID: ${savedProvider._id}`);

          // Update the event with the new providerId and user
          await this.eventModel.updateOne(
            { _id: event._id },
            {
              $set: {
                providerId: savedProvider._id,
                providerUserId: savedUser._id,
              },
            },
          );
          console.log(
            `Updated Event ID: ${event._id} with new provider due to empty orgWebsite`,
          );
        }
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async getEventsLinkById(id: string) {
    const data = await this.eventlinkModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
    ]);

    return data;
  }

  async getEventsDetailById(id: string) {
    const data = await this.eventModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      {
        $lookup: {
          from: 'eventlinks',
          localField: 'event_link_id',
          foreignField: '_id',
          as: 'event_link_id',
        },
      },
    ]);

    return data;
  }

  async getEventsDetailByLinkId(id: string) {
    const data = await this.eventModel.aggregate([
      {
        $match: { event_link_id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'event_link_id',
          as: 'event_link_id',
        },
      },
    ]);

    return data;
  }

  async removeEventsLinksById(id: string) {
    const data = await this.eventlinkModel.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { is_deleted: true } },
      { new: true },
    );

    return data;
  }

  async removeEventsLinksDateAndCityWise(city: string, date: string) {
    console.log('city: ', city, 'date: ', date);

    const data = await this.eventlinkModel.updateMany(
      { cityId: new ObjectId(city), 'event_date.display': date },
      { $set: { is_deleted: true } },
      { new: true },
    );

    return data;
  }

  async removeEventsById(id: string) {
    const data = await this.eventModel.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { is_deleted: true } },
      { new: true },
    );

    return data;
  }

  async removeEventsDateAndCityWise(city: string, date: string) {
    console.log('city: ', city, 'date: ', date);

    const data = await this.eventModel.updateMany(
      { cityId: new ObjectId(city), date: date },
      { $set: { is_deleted: true } },
      { new: true },
    );

    return data;
  }

  async script() {
    try {
      const data = await this.eventlinkModel.updateMany(
        {},
        { $set: { is_deleted: false } },
        { new: true },
      );
      return data;
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async scratchEventDetailByUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      // Navigate to the URL
      await page.goto(url);

      // Wait for the specific elements to load
      await page.waitForSelector('.csimg');
      await page.waitForSelector('.csTId .csName');
      await page.waitForSelector('div[data-v-1c0da6d3]'); // Wait for the date/time container
      await page.waitForSelector('.csMoreInfo'); // Wait for the provider link container
      await page.waitForSelector('.csSegment.csDescription'); // Wait for the description container
      await page.waitForSelector('.csAdditionalDates'); // Wait for the additional dates container
      await page.waitForSelector('.csLocation'); // Wait for the location container

      // Extract event details
      const eventDetails = await page.evaluate(() => {
        const imageElement = document.querySelector('.csimg') as HTMLElement;
        const nameElement = document.querySelector(
          '.csTId .csName',
        ) as HTMLElement;
        const dateTimeElement = document.querySelector(
          'div[data-v-1c0da6d3]',
        ) as HTMLElement;
        const providerLinkElement = document.querySelector(
          '.csMoreInfo .csPillLink',
        ) as HTMLAnchorElement;
        const descriptionElement = document.querySelector(
          '.csSegment.csDescription .csText p',
        ) as HTMLElement;

        const priceElement = document.querySelector('.csPrice') as HTMLElement;
        const contactElement = document.querySelector(
          '.csContact',
        ) as HTMLElement;
        const locationElement = document.querySelector(
          '.csLocation',
        ) as HTMLElement;

        const imageUrl = imageElement
          ? getComputedStyle(imageElement).backgroundImage
          : null;
        const eventName = nameElement ? nameElement.innerText : null;
        const dateTimeText = dateTimeElement ? dateTimeElement.innerText : null;
        const providerLink = providerLinkElement
          ? providerLinkElement.href
          : 'No provider link available';
        const description = descriptionElement
          ? descriptionElement.innerText
          : 'No description available';

        const additionalDatesElements = Array.from(
          document.querySelectorAll('.csAdditionalDates > div > div'),
        );
        const additionalDates = additionalDatesElements
          .map((div) => {
            const dateParts = Array.from(div.querySelectorAll('span')).map(
              (span) => (span as HTMLElement).innerText.trim(),
            );
            return dateParts.join(' ');
          })
          .join('\n');

        const locationNameElement = locationElement.querySelector(
          'div:nth-child(2) a',
        ) as HTMLAnchorElement;
        const locationName = locationNameElement
          ? locationNameElement.innerText.trim()
          : 'No location available';

        const addressParts = Array.from(
          locationElement.querySelectorAll(
            'div[data-v-1c0da6d3] div:nth-child(3) div',
          ),
        );

        const address =
          addressParts.length > 0
            ? (addressParts[0] as HTMLElement).innerText.trim()
            : 'No address available';
        const cityState =
          addressParts.length > 1
            ? (addressParts[1] as HTMLElement).innerText.trim()
            : 'No city/state available';
        const phone =
          addressParts.length > 2
            ? (addressParts[2] as HTMLElement).innerText.trim()
            : 'No phone available';

        const lines = dateTimeText
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line);
        const mainDate = lines.find((line) =>
          line.match(/^\w{3}, \w{3} \d{1,2}, \d{4}/),
        );

        const priceText = priceElement
          ? priceElement.querySelector('span')?.innerText
          : 'Not available';

        const contactName =
          contactElement && contactElement.children[1]
            ? (contactElement.children[1] as HTMLElement).innerText
            : 'Not available';
        const contactEmail =
          contactElement && contactElement.children[3]
            ? (contactElement.children[3] as HTMLElement).innerText
            : 'Not available';
        const contactPhone =
          contactElement && contactElement.children[4]
            ? (contactElement.children[4] as HTMLElement).innerText
            : 'Not available';

        return {
          imageUrl: imageUrl
            ? imageUrl
                .replace(/url\(["']?/, '')
                .replace(/["']?\)$/, '')
                .replace(/&quot;/g, '')
            : null,
          eventName: eventName,
          dateTime: mainDate || 'Date not available',
          AdditionalDates: additionalDates || 'No additional dates',
          Description: description,
          providerLink: providerLink,
          Location: {
            LocationName: locationName,
            Address: address,
            CityState: cityState,
            Phone: phone,
          },
          Price: priceText,
          Contact: {
            ContactName: contactName,
            ContactEmail: contactEmail,
            ContactPhone: contactPhone,
          },
        };
      });

      return eventDetails;
    } catch (error) {
      console.error('Error: ', error);
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await browser.close();
    }
  }

  async fetchAndSaveEventLinks(cityId: string): Promise<any> {
    if (!cityId) {
      throw new HttpException(
        'City ID parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    let city: string;

    const cityDoc = await this.citymanagementModel.findById(cityId);
    if (!cityDoc) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }
    city = cityDoc.city;

    let citySegment: string;

    switch (city) {
      case 'Weehawken':
        citySegment = 'weehawken';
        break;
      case 'Union City':
        citySegment = 'union%20city-nj';
        break;
      case 'West New York':
        citySegment = 'west%20new%20york';
        break;
      case 'Guttenberg':
        citySegment = 'guttenberg';
        break;
      case 'Bayonne':
        citySegment = 'bayonne-us';
        break;
      case 'Jersey City':
        citySegment = 'jersey%20city';
        break;
      case 'Phoenix':
        citySegment = 'phoenix-ny';
        break;
      case 'Secaucus':
        citySegment = 'secaucus';
        break;
      case 'North Bergen':
        citySegment = 'north%20bergen';
        break;
      case 'Hoboken':
        citySegment = 'hoboken';
        break;
      default:
        throw new HttpException('Unsupported city', HttpStatus.BAD_REQUEST);
    }

    const url = `https://allevents.in/${citySegment}/kids?ref=cityselect-eventlist`;

    return await this.fetchAndSaveEventLinksFromUrl(url);
  }

  private async fetchAndSaveEventLinksFromUrl(url: string): Promise<any> {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const eventLinks: Eventlink[] = [];

      $('.event-card').each((_, element) => {
        const title = $(element).find('h3').text().trim();
        const venue = $(element).find('.subtitle').text().trim();
        const eventLinkElement = $(element).find('.title a');

        const eventDetails = {
          title,
          location: {
            name: venue,
            fullAddress: '',
          },
          date: {
            display: $(element).find('.date').text().trim(),
            datetime: '',
          },
          description: '',
          organizer: {
            name: '',
            url: '',
            orgWebsite: '',
            description: '',
            thumbnail: '',
          },
          eventUrl: eventLinkElement.attr('href'),
        };

        const city_name = '';
        const date = new Date();

        if (
          eventDetails.title &&
          eventDetails.location.name &&
          eventDetails.eventUrl
        ) {
          const eventLink = new this.eventlinkModel({
            title: eventDetails.title,
            venue: eventDetails.location.name,
            time: eventDetails.date.display,
            event_link: eventDetails.eventUrl,
            event_city: eventDetails.location.fullAddress,
            description: eventDetails.description,
            providerName: eventDetails.organizer.name,
            providerUrl: eventDetails.organizer.url,
            providerImage: eventDetails.organizer.thumbnail,
            location: {
              name: eventDetails.location.name,
              fullAddress: eventDetails.location.name,
            },
            event_date: {
              display: eventDetails.date.display,
              datetime: eventDetails.date.display,
            },
            organizer: {
              name: eventDetails.organizer.name,
              url: eventDetails.organizer.url,
              orgWebsite: eventDetails.organizer.orgWebsite,
              description: eventDetails.organizer.description,
              thumbnail: eventDetails.organizer.thumbnail,
            },
            date: date,
            city: city_name,
            source: 'website allevents',
          });

          eventLinks.push(eventLink);
        } else {
          console.warn('Missing title, venue, or URL for an event card');
        }
      });

      if (eventLinks.length > 0) {
        await this.eventlinkModel.insertMany(eventLinks);
        console.log('Saved event links to database');
      } else {
        console.warn('No event links to save');
      }

      return {
        message: 'Event links fetched and saved successfully',
        count: eventLinks.length,
      };
    } catch (error) {
      console.error('Error fetching event links:', error);
      throw new HttpException(
        'Failed to fetch and save event links',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async extractDataFromEventLink(eventLink: string): Promise<any> {
    if (!eventLink) {
      throw new HttpException('Event link is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get(eventLink);
      const $ = cheerio.load(response.data);

      const eventDetails = {
        title: $('h1.overlay-h1').text().trim() || '',
        location: {
          name: $('span.full-venue').text().trim() || '',
          fullAddress: $('span.full-venue').text().trim() || '',
        },
        date: {
          display: $('span[data-recurring]').text().trim() || '',
          datetime: $('span[data-recurring]').attr('data-stime') || '',
        },
        description: $('div.event-description-html').text().trim() || '',
        imageUrl: $('img.event-banner-image').attr('src') || '',
        organizer: {
          name: $('div.name a').text().trim() || '',
          url: $('div.name a').attr('href') || '',
          orgWebsite: '',
          description: '',
          thumbnail: '',
        },
      };

      const city_name = `${eventDetails.location.fullAddress}, ${
        eventDetails.location.fullAddress.split(',')[1] || ''
      }`.trim();
      const date = new Date();

      const newEvent = await this.eventModel.create({
        title: eventDetails.title,
        venue: eventDetails.location.name,
        time: eventDetails.date.display,
        event_link: eventLink,
        event_city: city_name,
        description: eventDetails.description,
        imageUrl: eventDetails.imageUrl,
        providerName: eventDetails.organizer.name,
        providerUrl: eventDetails.organizer.url,
        providerImage: eventDetails.organizer.thumbnail,
        location: {
          name: eventDetails.location.name,
          fullAddress: eventDetails.location.fullAddress,
        },
        event_date: {
          display: eventDetails.date.display,
          datetime: eventDetails.date.datetime,
        },
        organizer: {
          name: eventDetails.organizer.name,
          url: eventDetails.organizer.url,
          orgWebsite: eventDetails.organizer.orgWebsite,
          description: eventDetails.organizer.description,
          thumbnail: eventDetails.organizer.thumbnail,
        },
        createdOn: date,
        updatedOn: date,
        city: city_name,
      });

      return {
        message: 'Data extracted and saved successfully',
        event: newEvent,
      };
    } catch (error) {
      console.error('Error extracting data from event link:', error);
      throw new HttpException(
        'Failed to extract and save data from event link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async formatDate(date: Date) {
    return date.toISOString().split('.')[0];
  }

  async fetchAndSaveMeetupEventLinks(
    source_id: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    console.log('source_id: ', source_id);
    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);

    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;
    const keywords = 'children%20event';

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full cty: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'us--nj--Weehawken';
        break;
      case 'Union City':
        ctyId = 'us--nj--Union';
        break;
      case 'West New York':
        ctyId = 'us--nj--West';
        break;
      case 'Guttenberg':
        ctyId = 'us--nj--Guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'us--nj--Bayonne';
        break;
      case 'Jersey City':
        ctyId = 'us--nj--Jersey City';
        break;
      case 'Phoenix':
        ctyId = 'us--ny--Phoenix';
        break;
      case 'Secaucus':
        ctyId = 'us--nj--Secaucus';
        break;
      case 'North Bergen':
        ctyId = 'us--nj--North';
        break;
      case 'Hoboken':
        ctyId = 'us--nj--Hoboken';
        break;
      default:
        throw new Error('Unsupported city');
    }
    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);
    console.log('ctyId ===>>>', ctyId);

    const now = new Date();
    const endsDate = endDate
      ? new Date(endDate)
      : new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const startsDate = startDate ? new Date(startDate) : now;

    const staticStartTime = 'T14:30:00-04:00';
    const staticEndTime = 'T14:29:00-04:00';

    const formattedStartDate =
      (startDate ? new Date(startDate) : now).toISOString().slice(0, 10) +
      'T13:30:00-05:00';
    const formattedEndDate =
      (endDate ? new Date(endDate) : endsDate).toISOString().slice(0, 10) +
      'T13:29:00-05:00';

    console.log('formattedStartDate ===>>>', formattedStartDate);
    console.log('formattedEndDate ===>>>', formattedEndDate);

    const constructMeetupUrl = (
      cityId: string,
      startDate: string,
      endDate: string,
    ): string => {
      return `https://www.meetup.com/find/?keywords=${encodeURIComponent(
        keywords,
      )}&location=${encodeURIComponent(
        cityId,
      )}&source=EVENTS&customStartDate=${encodeURIComponent(
        startDate,
      )}&customEndDate=${encodeURIComponent(endDate)}`;
    };

    const allEventDetails = [];
    const eventUrls = new Set();
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      ignoreHTTPSErrors: true,
      executablePath: '/usr/bin/chromium-browser',
    });
    const page = await browser.newPage();

    try {
      const url = constructMeetupUrl(
        ctyId,
        formattedStartDate,
        formattedEndDate,
      );
      console.log('Fetching URL: ', url);

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log('Page loaded successfully.');

      const scrollTimeout = 1000;
      const maxEvents = 200;

      while (allEventDetails.length < maxEvents) {
        const eventDetails = await page.evaluate(() => {
          const events = [];
          const eventCards = document.querySelectorAll(
            '.relative.flex.w-full.flex-col',
          );

          eventCards.forEach((card) => {
            const title = card.querySelector('h2')?.textContent?.trim();
            const groupName = card
              .querySelector('.line-clamp-1')
              ?.textContent?.trim();
            const onlineIndicator = card.querySelector(
              '[aria-label="Online Event"]',
            )
              ? 'Online Event'
              : '';
            const imageUrl = card.querySelector('img')?.src;
            const dateElements = card.querySelectorAll(
              '.swiper-slide a.button',
            );
            const dates = Array.from(dateElements).map((el) =>
              el.textContent.trim(),
            );
            const eventUrl = card.querySelector('a')?.href;

            if (title) {
              events.push({
                title,
                dates,
                groupName,
                onlineIndicator,
                eventUrl,
                imageUrl,
                location: { name: groupName || '', fullAddress: '' },
                organizer: { name: '', url: '' },
                event_dates: dates,
              });
            }
          });

          return events;
        });

        eventDetails.forEach(async (event) => {
          if (!eventUrls.has(event.eventUrl)) {
            const existingEvent = await this.eventlinkModel.findOne({
              event_link: event.eventUrl,
              // cityId: city,
            });

            if (!existingEvent) {
              event.slug = await this.generateUniqueSlug(event.title);
              allEventDetails.push(event);
              eventUrls.add(event.eventUrl);
            } else {
              console.log(`Event already exists: ${event.title}`);
            }
          }
        });

        const currentCount = allEventDetails.length;
        console.log(
          `Fetched ${eventDetails.length} new event(s). Total so far: ${currentCount}`,
        );

        if (eventDetails.length === 0) {
          console.log('No new events loaded. Stopping further scrolling.');
          break;
        }

        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise((resolve) => setTimeout(resolve, scrollTimeout));
      }

      if (allEventDetails.length > 0) {
        const eventLinks = allEventDetails.slice(0, maxEvents).map((event) => {
          const availabilitySet = new Set<string>();

          const formattedEventDates = event.dates.map((date) => {
            const [monthDay, time] = date.split('@').map((part) => part.trim());
            const [monthStr, day] = monthDay.split(' ');
            const month =
              new Date(Date.parse(monthStr + ' 1, 2021')).getMonth() + 1;
            return `${new Date().getFullYear()}-${month
              .toString()
              .padStart(2, '0')}-${day.padStart(2, '0')}`;
          });

          formattedEventDates.forEach((isoDate) =>
            availabilitySet.add(isoDate),
          );

          const venueParts = event.venue
            ? event.venue.split('·').map((part) => part.trim())
            : [];
          if (venueParts.length > 0) {
            const venueDateStr = venueParts[0];
            const dateMatch = venueDateStr.match(/(\w+), (\w+) (\d+)/);
            if (dateMatch) {
              const [_, weekday, monthStr, day] = dateMatch;
              const month =
                new Date(Date.parse(monthStr + ' 1, 2021')).getMonth() + 1;
              const formattedDate = `${new Date().getFullYear()}-${month
                .toString()
                .padStart(2, '0')}-${day.padStart(2, '0')}`;
              availabilitySet.add(formattedDate);
            }
          }

          const eventTime =
            event.time || (venueParts.length > 1 ? venueParts[1].trim() : '');

          return new this.eventlinkModel({
            image_url: event.imageUrl,
            title: event.title,
            venue: event.location.name || '',
            time: eventTime,
            event_link: event.eventUrl,
            slug: event.slug,
            event_city: event.location.fullAddress || '',
            description: '',
            city: ctyId.trim(),
            event_date: {
              display: event.dates.join(', '),
              datetime: event.dates.join(', '),
            },
            organizer: {
              name: event.organizer.name || '',
              url: event.organizer.url || '',
            },
            event_dates: formattedEventDates,
            avalibility_dates: formattedEventDates,
            source: 'website meetup',
            cityId: sour.cityId,
            source_id: source_id,
          });
        });

        try {
          await this.eventlinkModel.insertMany(eventLinks);
          console.log(
            `Inserted ${eventLinks.length} event links into the database.`,
          );
        } catch (error) {
          console.error('Error saving event links:', error);
          throw new Error('Failed to save event links: ' + error.message);
        }
      }

      return {
        message: 'Meetup event links fetched and saved successfully',
        count: allEventDetails.length,
      };
    } catch (error) {
      console.error('Error fetching event details:', error);
      throw new Error('Failed to fetch event details: ' + error.message);
    } finally {
      await browser.close();
    }
  }

  async generateUniqueSlug(title: string): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true });
    let count = 1;

    while (await this.eventlinkModel.findOne({ slug })) {
      slug = `${slugify(title, { lower: true, strict: true })}-${count}`;
      count++;
    }

    return slug;
  }

  async updateEventLinksWithoutSlug(source: string): Promise<any> {
    try {
      const eventLinks = await this.eventlinkModel.find({
        source,
        slug: { $exists: false },
      });

      const updatedLinks = await Promise.all(
        eventLinks.map(async (event) => {
          event.slug = await this.generateUniqueSlug(event.title);
          return event.save();
        }),
      );

      console.log(`Updated ${updatedLinks.length} event links with new slugs.`);
      return {
        message: 'Event links updated successfully with new slugs',
        updatedCount: updatedLinks.length,
      };
    } catch (error) {
      console.error('Error updating event links without slugs:', error);
      throw new Error(
        'Failed to update event links without slugs: ' + error.message,
      );
    }
  }

  async createMeetupEventDetailById(id: string) {
    console.log('id ====>>>>>', id);
    if (!id) {
      throw new HttpException('Id is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const res = await this.eventlinkModel.findById({ _id: id });
      console.log('res ====>>>', res);
      let eventLink = res.event_link;
      const response = await axios.get(eventLink);
      const $ = cheerio.load(response.data);

      const title =
        $('div.md\\:max-w-screen h1.overflow-hidden').text().trim() || '';

      const organizerElement = $('.mt-4.flex.lg\\:mt-5');
      const organizerName = organizerElement
        .find('span.font-medium')
        .text()
        .trim();
      const organizerImage = organizerElement.find('img').attr('src');

      const organizerUrl = `https://www.meetup.com/members/311970529/`;

      const venue =
        $('div[data-testid="venue-name-value"]').text().trim() || '';
      const venueDetails =
        $('div[data-testid="link-visible"]').text().trim() || '';

      const timeElement = $('time.block');
      const timeDisplay = timeElement.contents().first().text().trim() || '';
      const dateTime = timeElement.attr('datetime') || '';

      const recurrence = timeElement.next().text().trim() || '';

      const fullTime = `${timeDisplay} ${recurrence}`;

      const descriptionElement = $('.break-words');
      const eventDescription = descriptionElement.text().trim();

      const imageUrl = $('img.event-banner-image').attr('src') || '';

      const eventDetails = {
        title,
        location: {
          name: venue,
          fullAddress: venueDetails,
        },
        date: {
          display: timeDisplay,
          datetime: dateTime,
        },
        eventDescription,
        imageUrl,
        organizer: {
          name: organizerName,
          url: organizerUrl,
          orgWebsite: '',
          description: '',
          thumbnail: organizerImage,
        },
      };

      const city_name = `${eventDetails.location.name}, ${
        eventDetails.location.fullAddress.split(',')[1] || ''
      }`.trim();
      const date = new Date();

      const newEvent = await this.eventModel.create({
        title: eventDetails.title,
        venue: eventDetails.location.name,
        time: fullTime,
        event_link: eventLink,
        event_city: city_name,
        description: eventDescription,
        imageUrl: eventDetails.imageUrl,
        providerName: organizerName,
        providerUrl: organizerUrl,
        providerImage: organizerImage,
        location: {
          name: eventDetails.location.name,
          fullAddress: eventDetails.location.fullAddress,
        },
        event_date: {
          display: timeDisplay,
          datetime: dateTime,
        },
        organizer: {
          name: organizerName,
          url: organizerUrl,
          orgWebsite: eventDetails.organizer.orgWebsite,
          description: eventDetails.organizer.description,
          thumbnail: organizerImage,
        },
        city: city_name,
        cityId: res.cityId,
        event_link_id: res._id,
      });
      res.is_event_detail = true;
      await res.save();
      return {
        message: 'Data extracted and saved successfully',
        event: newEvent,
      };
    } catch (error) {
      console.error('Error extracting data from event link:', error);
      throw new HttpException(
        'Failed to extract and save data from event link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMeetupAllEventDetailByCityAndDate(
    city: string,
    Fromdate: string,
    Todate: string,
  ): Promise<any> {
    const res = await this.eventlinkModel.find({
      cityId: new ObjectId(city),
      avalibility_dates: { $elemMatch: { $gte: Fromdate, $lte: Todate } },
      source: 'website meetup',
      is_event_detail: false,
    });
    console.log('res.length =====>>>>>', res.length);
    try {
      for (let evt of res) {
        let eventLink = evt.event_link;
        const response = await axios.get(eventLink);
        const $ = cheerio.load(response.data);

        const title =
          $('div.md\\:max-w-screen h1.overflow-hidden').text().trim() || '';

        const organizerElement = $('.mt-4.flex.lg\\:mt-5');
        const organizerName = organizerElement
          .find('span.font-medium')
          .text()
          .trim();
        const organizerImage = organizerElement.find('img').attr('src');

        const organizerUrl = `https://www.meetup.com/members/311970529/`;

        const venue =
          $('div[data-testid="venue-name-value"]').text().trim() || '';
        const venueDetails =
          $('div[data-testid="link-visible"]').text().trim() || '';

        const timeElement = $('time.block');
        const timeDisplay = timeElement.contents().first().text().trim() || '';
        const dateTime = timeElement.attr('datetime') || '';

        const recurrence = timeElement.next().text().trim() || '';

        const fullTime = `${timeDisplay} ${recurrence}`;

        const descriptionElement = $('.break-words');
        const eventDescription = descriptionElement.text().trim();

        const imageUrl = $('img.event-banner-image').attr('src') || '';

        const eventDetails = {
          title,
          location: {
            name: venue,
            fullAddress: venueDetails,
          },
          date: {
            display: timeDisplay,
            datetime: dateTime,
          },
          eventDescription,
          imageUrl,
          organizer: {
            name: organizerName,
            url: organizerUrl,
            orgWebsite: '',
            description: '',
            thumbnail: organizerImage,
          },
        };

        const city_name = `${eventDetails.location.name}, ${
          eventDetails.location.fullAddress.split(',')[1] || ''
        }`.trim();
        const date = new Date();

        const newEvent = await this.eventModel.create({
          title: eventDetails.title,
          venue: eventDetails.location.name,
          time: fullTime,
          event_link: eventLink,
          event_city: city_name,
          description: eventDescription,
          imageUrl: eventDetails.imageUrl,
          providerName: organizerName,
          providerUrl: organizerUrl,
          providerImage: organizerImage,
          location: {
            name: eventDetails.location.name,
            fullAddress: eventDetails.location.fullAddress,
          },
          event_date: {
            display: timeDisplay,
            datetime: dateTime,
          },
          organizer: {
            name: organizerName,
            url: organizerUrl,
            orgWebsite: eventDetails.organizer.orgWebsite,
            description: eventDetails.organizer.description,
            thumbnail: organizerImage,
          },
          city: city_name,
          cityId: evt.cityId,
          event_link_id: evt._id,
        });

        evt.is_event_detail = true;
        await evt.save();
      }
      return 'Data extracted and saved successfully';
    } catch (error) {
      console.error('Error extracting data from event link:', error);
      throw new HttpException(
        'Failed to extract and save data from event link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cronToCreateNextEvents() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('672870307c7c60fb88405388'),
      );
      const ctyId = city._id.toString();

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ createdOn: -1 })
        .limit(1);

      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastScrapedDateStr = latestEvent[0].avalibility_dates[0];
      const lastScrapedDate = new Date(lastScrapedDateStr);

      const targetDays = 7;
      const eventDates = Array.from({ length: targetDays }, (_, i) => {
        const nextDate = new Date(lastScrapedDate);
        nextDate.setDate(lastScrapedDate.getDate() + i);
        return nextDate;
      });

      for (const startDate of eventDates) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        console.log(
          `Scraping events for date range: ${startDate.toISOString()} - ${endDate.toISOString()}`,
        );

        await this.scrapEventBriteEventWithDetailBySourceAndDate(
          ctyId,
          startDate.toISOString(),
          endDate.toISOString(),
          'kids',
        );
      }
    } catch (error) {
      console.error('Error in cronToCreateNextEvents:', error.message);
    }
  }

  async startCron() {
    try {
      if (process.env.NODE_ENV === 'do') {
        if (this.cronJob && this.cronJob.running) {
          console.log('Cron job is already running');
          return;
        }

        this.cronJob = cron.schedule(
          '30 15 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEvents();
              console.log('cronToCreateNextEvents completed.');
              this.cronJob.stop();
              console.log('Cron job stopped.');
            } catch (error) {
              console.error('Error executing cronToCreateNextEvents:', error);
            }
          },
          {
            scheduled: true,
            timezone: 'Asia/Kolkata',
          },
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error in startCron:', error.message);
    }
  }

  async cronToCreateNextEventsFamily() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('67287be37c7c60fb884053b5'),
      );
      const ctyId = city._id.toString();

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ createdOn: -1 })
        .limit(1);

      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastScrapedDateStr = latestEvent[0].avalibility_dates[0];
      const lastScrapedDate = new Date(lastScrapedDateStr);

      const targetDays = 7;
      const eventDates = Array.from({ length: targetDays }, (_, i) => {
        const nextDate = new Date(lastScrapedDate);
        nextDate.setDate(lastScrapedDate.getDate() + i);
        return nextDate;
      });

      for (const startDate of eventDates) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        console.log(
          `Scraping events for date range: ${startDate.toISOString()} - ${endDate.toISOString()}`,
        );

        await this.scrapEventBriteEventWithDetailBySourceAndDate(
          ctyId,
          startDate.toISOString(),
          endDate.toISOString(),
          'family',
        );
      }
    } catch (error) {
      console.error('Error in cronToCreateNextEvents:', error.message);
    }
  }

  async startCronFamily() {
    try {
      if (process.env.NODE_ENV === 'do') {
        this.cronJobFamily = cron.schedule(
          '00 17 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEventsFamily();
              console.log('cronToCreateNextEvents completed.');
              this.cronJobFamily?.stop();
              console.log('Cron job stopped.');
            } catch (error) {
              console.error('Error executing cronToCreateNextEvents:', error);
            }
          },
          {
            scheduled: true,
            timezone: 'Asia/Kolkata',
          },
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error in cronToCreateNextEvents 2:', error);
    }
  }

  async searchEvents(name: string, city: string) {
    let match = { is_deleted: false };

    if (name) {
      match['title'] = { $regex: name, $options: 'i' }; // Case-insensitive search by title
    }
    if (city) {
      match['cityId'] = new ObjectId(city);
    }
    try {
      const data = await this.eventlinkModel.aggregate([
        {
          $match: match,
        },
        {
          $lookup: {
            from: 'citymanagements',
            localField: 'cityId',
            foreignField: '_id',
            as: 'cityId',
          },
        },
        {
          $facet: {
            result: [],
            tasksCount: [
              {
                $group: {
                  _id: '',
                  total: { $sum: '$total' },
                },
              },
              {
                $project: {
                  _id: 0,
                  tasksCount: '$total',
                },
              },
            ],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ]);
      const totalCount = data[0].totalCount[0]
        ? data[0].totalCount[0].count
        : 0;
      const items = data[0].result;

      return {
        totalCount: totalCount,
        items: items,
      };
    } catch (error) {
      console.error('Error in cronToCreateNextEvents 3 :', error);
    }
  }

  async changeDateScript() {
    try {
      const event = await this.eventlinkModel.find({
        source: 'website eventbrite',
      });

      for (let evnt of event) {
        const displayDate = evnt['event_date']['display'];
        console.log('displayDate ===', displayDate);
        const res = await this.eventlinkModel.findByIdAndUpdate(
          { _id: evnt._id },
          { $set: { avalibility_dates: displayDate } },
        );
        console.log('res====>>>', res);
      }
      return 'update sucessfully';
    } catch (error) {
      console.error('Error in cronToCreateNextEvents 4 :', error);
    }
  }
  async fetchAndSaveActiveKidsEvents(
    source_id: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    console.log('source_id: ', source_id);

    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full city: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    const cityName = cty.city;

    switch (cityName) {
      case 'Weehawken':
        ctyId = 'Weehawken,NJ,USA';
        break;
      case 'Union City':
        ctyId = 'Union City,NJ,USA';
        break;
      case 'West New York':
        ctyId = 'West New York,NJ,USA';
        break;
      case 'Guttenberg':
        ctyId = 'Guttenberg,NJ,USA';
        break;
      case 'Bayonne':
        ctyId = 'Bayonne,NJ,USA';
        break;
      case 'Jersey City':
        ctyId = 'Jersey City,NJ,USA';
        break;
      case 'Phoenix':
        ctyId = 'Phoenix,NY,USA';
        break;
      case 'Secaucus':
        ctyId = 'Secaucus,NJ,USA';
        break;
      case 'North Bergen':
        ctyId = 'North Bergen,NJ,USA';
        break;
      case 'Hoboken':
        ctyId = 'Hoboken,NJ,USA';
        break;
      default:
        throw new Error('Unsupported city');
    }

    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    const radius = 20;
    const dayOfWeek =
      'monday,tuesday,wednesday,thursday,friday,saturday,sunday';
    const gender = 'all';
    const ageRange = 'all';
    const sort = 'relevance';
    const advantageEligible = 0;
    const includeVirtualEvents = 1;
    const category = 'Activities';
    const maxEvents = 200;
    const allEventDetails = [];
    let currentPage = 1;

    const existingEvents = await this.eventlinkModel.find({ ctId }).lean();

    while (allEventDetails.length < maxEvents) {
      const url = `https://www.activekids.com/search?day_of_week=${encodeURIComponent(
        dayOfWeek,
      )}&gender=${encodeURIComponent(gender)}&age_range=${encodeURIComponent(
        ageRange,
      )}&radius=${radius}&sort=${encodeURIComponent(
        sort,
      )}&advantage_eligible=${advantageEligible}&include_virtual_events=${includeVirtualEvents}&category=${encodeURIComponent(
        category,
      )}&location=${encodeURIComponent(ctyId)}&dateFrom=${encodeURIComponent(
        startDate,
      )}&dateTo=${encodeURIComponent(endDate)}&page=${currentPage}`;

      console.log(`Fetching URL: ${url}`);

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const eventCards = $('a.ie-article-link');

      if (eventCards.length === 0) {
        console.log('No more events found. Stopping further pagination.');
        break;
      }

      eventCards.each((_, element) => {
        const eventTitle = $(element).find('h5.title').text().trim();
        const eventUrl = $(element).attr('href');
        const event_date = $(element)
          .find('span[itemprop="startDate"]')
          .attr('content');
        const availabilityDate = event_date
          ? new Date(event_date).toISOString().split('T')[0]
          : null;

        const organizer = {
          name: $(element).find('.organizer-name').text().trim(),
          url:
            $(element)
              .find('.activity-feed__secondary_content span[itemprop="url"]')
              .attr('content') || '',
          orgWebsite: 'https://www.active.com',
          description: $(element)
            .find('.secondary-text[itemprop="description"]')
            .text()
            .trim(),
          thumbnail: '',
        };

        if (eventTitle && eventUrl) {
          const fullEventUrl = `https://www.activekids.com${eventUrl}`;

          const isDuplicate = existingEvents.some(
            (event) =>
              String((event.cityId as any).id) === sour.cityId &&
              event.event_link === fullEventUrl,
          );

          if (!isDuplicate) {
            const slug = slugify(eventTitle, { lower: true, strict: true });

            allEventDetails.push({
              title: eventTitle,
              event_link: fullEventUrl,
              organizer: organizer,
              event_date: `Start From ${availabilityDate} check link for Varied Dates`,
              avalibility_dates: availabilityDate,
              source: 'website activekids',
              cityId: sour.cityId,
              source_id: source_id,
              city: ctyId.trim(),
              slug, // Add the generated slug here
            });
          } else {
            console.log(
              `Duplicate event found: ${eventTitle} in ${cityName} with link ${fullEventUrl}`,
            );
          }
        }
      });

      console.log(
        `Fetched ${eventCards.length} event(s) from page ${currentPage}. Total so far: ${allEventDetails.length}`,
      );
      currentPage++;
    }

    if (allEventDetails.length === 0) {
      throw new Error('No events found in the response.');
    }

    const newEvents = allEventDetails.filter((event) => {
      return !existingEvents.some(
        (existingEvent) =>
          existingEvent.event_link === event.event_link &&
          existingEvent.cityId === event.cityId,
      );
    });

    if (newEvents.length > 0) {
      await this.eventlinkModel.insertMany(newEvents.slice(0, maxEvents));
    }

    return {
      message: 'ActiveKids events fetched successfully',
      events: newEvents.slice(0, maxEvents),
    };
  }

  async createEventDetailActiveKidsById(id: string): Promise<any> {
    try {
      const dta = await this.eventlinkModel.findById({ _id: id });
      if (!dta) {
        throw new HttpException(
          'Event link ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      let url = dta.event_link;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const eventTitle = $('.session_register_info h4').text().trim();
      const eventDate =
        $('.session_register_info p').eq(0).text().trim() || 'Varied Dates';
      const eventDescription = $('.sectioncontent .asset-summary')
        .text()
        .trim();
      const eventPrice =
        $('.session_register_info h3').text().trim() || 'Price not listed';

      const availabilitySection = $('.recurrence');
      const meetingDates = availabilitySection.find('p').first().text().trim();
      const meetingTimes = availabilitySection.find('.day').text().trim();
      const event_times = [meetingDates, meetingTimes];

      const organizer = {
        name: $('h5[itemprop="name"]').text().trim(),
        url: $('a[itemprop="url"]').attr('href') || '',
        orgWebsite: '',
        description: $('.secondary-text[itemprop="description"]').text().trim(),
        thumbnail: '',
      };

      const locationName = $('.ed-address-name').text().trim();
      const addressParts = $('.ed-address-text span')
        .map((i, el) => $(el).text().trim())
        .get();
      const fullAddress = addressParts.join(' ').replace(/\s+/g, ' ').trim();

      const location = {
        name: locationName,
        fullAddress: fullAddress,
      };

      const eventData = {
        title: eventTitle,
        event_date: eventDate,
        description: eventDescription,
        price: eventPrice,
        event_times: event_times,
        organizer: organizer,
        location: location,
        event_link_id: dta._id,
        cityId: dta.cityId,
      };

      const existingEvent = await this.eventModel.findOne({
        title: eventTitle,
        event_link_id: dta._id,
        event_times: { $all: event_times },
      });

      if (existingEvent) {
        throw new HttpException(
          'Event with the same title and times already exists',
          HttpStatus.CONFLICT,
        );
      }

      await this.eventModel.insertMany(eventData);
      dta.is_event_detail = true;
      await dta.save();

      return {
        message: 'Event data extracted successfully',
        event: eventData,
      };
    } catch (error) {
      console.error('Error fetching event data from URL:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAllEventDetailActiveKidsByCityAndDate(
    city: string,
    Startdate: string,
    Enddate: string,
  ): Promise<any> {
    try {
      const res = await this.eventlinkModel.find({
        cityId: new ObjectId(city),
        avalibility_dates: { $elemMatch: { $gte: Startdate, $lte: Enddate } },
        source: 'website activekids',
        is_event_detail: false,
      });
      console.log('res.length =====>>>>>', res.length);

      for (let resp of res) {
        let url = resp.event_link;

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const eventTitle = $('.session_register_info h4').text().trim();
        const eventDate =
          $('.session_register_info p').eq(0).text().trim() || 'Varied Dates';
        const eventDescription = $('.sectioncontent .asset-summary')
          .text()
          .trim();
        const eventPrice =
          $('.session_register_info h3').text().trim() || 'Price not listed';

        const availabilitySection = $('.recurrence');
        const meetingDates = availabilitySection
          .find('p')
          .first()
          .text()
          .trim();
        const meetingTimes = availabilitySection.find('.day').text().trim();
        const event_times = [meetingDates, meetingTimes];

        const organizer = {
          name: $('h5[itemprop="name"]').text().trim(),
          url: $('a[itemprop="url"]').attr('href') || '',
          orgWebsite: '',
          description: $('.secondary-text[itemprop="description"]')
            .text()
            .trim(),
          thumbnail: '',
        };

        const locationName = $('.ed-address-name').text().trim();
        const addressParts = $('.ed-address-text span')
          .map((i, el) => $(el).text().trim())
          .get();
        const fullAddress = addressParts.join(' ').replace(/\s+/g, ' ').trim();

        const location = {
          name: locationName,
          fullAddress: fullAddress,
        };

        const eventData = {
          title: eventTitle,
          event_date: eventDate,
          description: eventDescription,
          price: eventPrice,
          event_times: event_times,
          organizer: organizer,
          location: location,
          event_link_id: resp._id,
          cityId: resp.cityId,
        };

        const existingEvent = await this.eventModel.findOne({
          title: eventTitle,
          event_link_id: resp._id,
          event_times: { $all: event_times },
        });

        if (existingEvent) {
          console.log(
            `Duplicate event found: ${eventTitle} with link ${resp.event_link}`,
          );
          continue;
        }

        await this.eventModel.insertMany(eventData);

        resp.is_event_detail = true;
        await resp.save();
      }

      return 'Event data extracted successfully';
    } catch (error) {
      console.error('Error fetching event data from URL:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeDuplicateEvents(): Promise<any> {
    try {
      const events = await this.eventModel.find();

      const uniqueEvents = new Map<string, any>();

      for (const event of events) {
        if (event.event_link_id) {
          const eventLinkId = event.event_link_id.toString();

          if (!uniqueEvents.has(eventLinkId)) {
            uniqueEvents.set(eventLinkId, event);
          } else {
            await this.eventModel.deleteOne({ _id: event._id });
          }
        } else {
          console.warn(`Event with ID ${event._id} has no event_link_id.`);
        }
      }

      return {
        message: 'Duplicate events removed successfully',
        uniqueEventCount: uniqueEvents.size,
      };
    } catch (error) {
      console.error('Error removing duplicate events:', error);
      throw new HttpException(
        'Failed to remove duplicate events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteEventsBySource(source: string): Promise<any> {
    try {
      const result = await this.eventlinkModel.deleteMany({ source });

      return {
        message: `Deleted ${result.deletedCount} events from source: ${source}`,
      };
    } catch (error) {
      console.error('Error deleting events by source:', error);
      throw new HttpException(
        'Failed to delete events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private formatEventDate(month: string, day: string): string {
    const monthMap: { [key: string]: string } = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const year = new Date().getFullYear();
    const monthNumber = monthMap[month] || '01';
    const dayNumber = day.padStart(2, '0');

    return `${year}-${monthNumber}-${dayNumber}`;
  }

  async scrapeEventData(source_id: string, date: string = '0000-00-00') {
    console.log('city: ', source_id);
    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full cty: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'nj--union-city';
        break;
      case 'Union City':
        ctyId = 'in--union-city';
        break;
      case 'West New York':
        ctyId = 'united-states';
        break;
      case 'Guttenberg':
        ctyId = 'nj--guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'nj--bayonne';
        break;
      case 'Jersey City':
        ctyId = 'united-states--new-jersey';
        break;
      case 'Phoenix':
        ctyId = 'az--phoenix';
        break;
      case 'Secaucus':
        ctyId = 'nj--secaucus';
        break;
      case 'North Bergen':
        ctyId = 'united-states';
        break;
      case 'Hoboken':
        ctyId = 'nj--jersey-city';
        break;
      default:
        throw new Error('Unsupported city');
    }

    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    const baseUrl = `https://jclibrary.libcal.com/calendar/?cid=-1&t=g&d=${date}&cal=-1&audience=8475,9994,8477&inc=0`;
    console.log('baseUrl', baseUrl);

    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/usr/bin/chromium-browser',
      });
      const page = await browser.newPage();
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      let allEvents = [];
      let scrollCount = 0;
      const maxScrolls = 5;

      while (scrollCount < maxScrolls) {
        try {
          await page.waitForSelector('.s-lc-eventcard', { timeout: 30000 });

          const events = await page.evaluate(
            (cityId, sourceId) => {
              const eventCards = Array.from(
                document.querySelectorAll('.s-lc-eventcard'),
              );
              return eventCards.map((card) => {
                const title =
                  card
                    .querySelector('.s-lc-eventcard-title a')
                    ?.textContent?.trim() || '';
                const eventLink =
                  card
                    .querySelector('.s-lc-eventcard-title a')
                    ?.getAttribute('href') || '';
                const description =
                  card
                    .querySelector('.s-lc-eventcard-description')
                    ?.textContent?.trim() || '';
                const dateMonth =
                  card.querySelector('.s-lc-evt-date-m')?.textContent?.trim() ||
                  '';
                const dateDay =
                  card.querySelector('.s-lc-evt-date-d')?.textContent?.trim() ||
                  '';

                const audianceTags = Array.from(
                  card.querySelectorAll(
                    '.s-lc-eventcard-tags .s-lc-eventcard-tag',
                  ),
                ).map((tag) =>
                  tag
                    .querySelector('.s-lc-event-category-link')
                    ?.textContent?.trim(),
                );

                const inPersonLabel = card.querySelector(
                  '.s-lc-eventcard-heading-text-group .s-lc-eventcard-pill',
                );
                let inpersonOrVirtual = 'No data available';
                if (inPersonLabel) {
                  inpersonOrVirtual = inPersonLabel.textContent.trim();
                }

                let eventMode = '';
                if (inpersonOrVirtual.includes('In-Person')) {
                  eventMode = 'in-person';
                } else if (inpersonOrVirtual.includes('Virtual')) {
                  eventMode = 'virtual';
                }

                return {
                  title,
                  event_link: eventLink,
                  description,
                  event_date: {
                    display: `${dateMonth} ${dateDay}`,
                    datetime: '',
                  },
                  city: 'Jersey City,NJ,USA',
                  cityId: cityId,
                  source_id: sourceId,
                  source: 'website Jersey City Free Public Library',
                  avalibility_dates: [],
                  audiance: audianceTags,
                  slug: '',
                  ageGroup: 'No data available',
                  inpersonOrVirtual: eventMode,
                  events_type: audianceTags,
                };
              });
            },
            sour.cityId,
            source_id,
          );
          allEvents.push(...events);

          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
          });

          scrollCount++;
        } catch (error) {
          console.log(`Error while waiting for selector: ${error.message}`);
          break;
        }
      }

      let eventFound = false;
      let eventIdsToUpdate: string[] = [];

      for (const event of allEvents) {
        const [month, day] = event.event_date.display.split(' ');
        event.event_date.datetime = this.formatEventDate(month, day);

        const eventDate = new Date(event.event_date.datetime);
        const formattedEventDate = `${eventDate.getFullYear()}-${String(
          eventDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;

        event.avalibility_dates = [formattedEventDate];
        event.slug = slugify(event.title, { lower: true, strict: true });

        const existingEvent = await this.eventlinkModel.findOne({
          title: event.title.trim(),
          event_link: event.event_link.trim(),
          avalibility_dates: formattedEventDate,
        });

        if (!existingEvent) {
          const createdEvent = await this.eventlinkModel.create(event);
          console.log(`Event "${event.title}" saved successfully.`);
          eventIdsToUpdate.push(createdEvent._id.toString());
          eventFound = true;
        }
      }

      await this.createEventLinksAndEventsFromCityLinks();
      console.log('createEventLinksAndEventsFromCityLinks completed');

      if (eventIdsToUpdate.length > 0) {
        const updatedEvents = await this.updateEventsFriendly(eventIdsToUpdate);

        for (const eventId of eventIdsToUpdate) {
          const updatedEvent = await this.eventlinkModel.findById(eventId);

          if (
            updatedEvent &&
            !updatedEvent.childFriendly &&
            !updatedEvent.familyFriendly
          ) {
            await this.eventlinkModel.findByIdAndDelete(eventId);
            console.log(
              `Deleted eventLink: ${eventId} because both child_friendly and family_friendly are false`,
            );

            await this.eventModel.deleteOne({ event_link_id: eventId });
            console.log(
              `Deleted event from eventModel where event_link_id: ${eventId}`,
            );
          }
        }
      }

      await browser.close();

      if (!eventFound) {
        console.log(`No events found for date: ${date}`);
      }

      const responseMessage = eventFound
        ? `Events were successfully saved!`
        : `No new events found for the specified date.`;

      return responseMessage;
    } catch (error) {
      console.error('Error scraping event data:', error);
      throw new Error('Failed to scrape event data: ' + error.message);
    }
  }

  async getEventDetailsById(id: string): Promise<any> {
    try {
      const dta = await this.eventlinkModel.findById({ _id: id });
      if (!dta) {
        throw new HttpException(
          'Event link ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      let url = dta.event_link;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const metaOgUrl = $('meta[property="og:url"]').attr('content');
      if (!metaOgUrl) {
        throw new HttpException(
          'Meta og:url content not found in the page',
          HttpStatus.BAD_REQUEST,
        );
      }

      dta.event_link = metaOgUrl;
      await dta.save();

      const eventTitle = $('h1.media-heading')
        .contents()
        .filter(function () {
          return this.nodeType === 3;
        })
        .text()
        .trim();

      const eventDate =
        $('dd')
          .first()
          .contents()
          .filter(function () {
            return this.nodeType === 3;
          })
          .text()
          .trim() || 'Varied Dates';

      const time =
        $('dt')
          .filter(function () {
            return $(this).text().trim() === 'Time:';
          })
          .next('dd')
          .text()
          .trim() || 'Time not listed';

      const event_times = [time];

      const eventPrice =
        $('.session_register_info h3').text().trim() || 'Price not listed';

      const availabilitySection = $('.recurrence');
      const meetingDates = availabilitySection.find('p').first().text().trim();
      const meetingTimes = availabilitySection.find('.day').text().trim();
      const imageUrl = $('.media-left a img').attr('src') || '';
      const organizerName =
        $('#s-lc-profile-name-111864').text().trim() || 'Organizer not listed';

      const orgWebsite = $('a[href^="/profile/"]').attr('href') || '';

      const organizer = {
        name: organizerName,
        url: orgWebsite
          ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
          : '',
        orgWebsite: orgWebsite
          ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
          : '',
        description: $('.secondary-text[itemprop="description"]').text().trim(),
        thumbnail: '',
      };

      const addressParts = $('.ed-address-text span')
        .map((i, el) => $(el).text().trim())
        .get();
      const fullAddress = addressParts.join(' ').replace(/\s+/g, ' ').trim();

      let locationName = '';
      $('dt').each((index, element) => {
        if ($(element).text().trim() === 'Location:') {
          locationName = $(element).next('dd').text().trim();
        }
      });

      const eventDescription =
        $('#s-lc-event-desc')
          .text()
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/&nbsp;/g, ' ') || 'Description not listed';

      const location = {
        name: locationName || 'Location not listed',
        fullAddress: `${locationName} , Jersey City` || 'Location not listed',
      };

      let Lat, Lng;
      if (location.fullAddress) {
        try {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                address: location.fullAddress,
                key: API_KEY,
              },
            },
          );

          if (response.data.status === 'OK') {
            Lat = response.data.results[0].geometry.location.lat;
            Lng = response.data.results[0].geometry.location.lng;
            console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
          } else {
            console.log('Geocoding API error:', response.data.status);
          }
        } catch (error) {
          console.error('Error fetching geocoding data:', error.message);
        }
      }

      const cityId = dta.cityId || null;

      const audienceElements = $('dd')
        .filter(function () {
          return $(this).prev('dt').text().trim() === 'Audience:';
        })
        .find('.s-lc-event-category-link a');

      let audience = [];
      audienceElements.each((index, element) => {
        const audienceText = $(element).text().trim();
        if (audienceText === 'Juvenile') {
          audience.push('Juvenile');
        } else if (audienceText === 'Young Adult') {
          audience.push('Young Adult');
        } else if (audienceText === 'Adult') {
          audience.push('Adult');
        }
      });

      let ageGroup = { month: [], year: [] };

      audience.forEach((group) => {
        if (group === 'Juvenile') {
          for (let i = 1; i <= 17; i++) {
            ageGroup.year.push(i);
          }
        } else if (group === 'Young Adult') {
          for (let i = 18; i <= 25; i++) {
            ageGroup.year.push(i);
          }
        } else if (group === 'Adult') {
          for (let i = 26; i <= 64; i++) {
            ageGroup.year.push(i);
          }
        }
      });

      const eventData = {
        title: eventTitle,
        event_date: eventDate,
        description: eventDescription,
        time: time,
        event_city: 'Jersey City',
        event_times: event_times,
        organizer: organizer,
        location: location,
        event_link_id: dta._id,
        event_link: metaOgUrl,
        image_url: imageUrl,
        latitude: Lat,
        longitude: Lng,
        cityId: cityId,
        ageGroup: ageGroup,
        price: 'Price not specified',
        refundPolicy: 'No refund policy specified.',
        venue: `472 Jersey Avenue
Jersey City, New Jersey 07302`,
        providerName: 'Jersey City Free Public Library',
        providerUrl: 'https://jclibrary.libcal.com/',
        providerImage:
          'https://www.jclibrary.org/wp-content/uploads/2024/03/cropped-JCFPL-Logo-Navy_transparent-1.png',
      };

      const existingEvent = await this.eventModel.findOne({
        title: eventTitle,
        event_link_id: dta._id,
        event_times: { $all: event_times },
      });

      if (existingEvent) {
        throw new HttpException(
          'Event with the same title and times already exists',
          HttpStatus.CONFLICT,
        );
      }

      await this.eventModel.insertMany([eventData]);

      dta.is_event_detail = true;
      await dta.save();

      return {
        message: 'Event data extracted successfully',
        event: eventData,
      };
    } catch (error) {
      console.error('Error fetching event data from URL:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createEventsFromCityLinks(
    source_id: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    try {
      console.log('City:', source_id);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      const res = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        avalibility_dates: { $elemMatch: { $gte: startDate, $lte: endDate } },
        source: 'website Jersey City Free Public Library',
        is_event_detail: false,
      });

      if (res.length === 0) {
        console.warn(
          'No event links found for the specified city and date range',
        );
        return {
          message: 'No event links found for the specified city and date range',
          events: [],
        };
      }

      console.log('Event Links Found:', res);

      const createdEvents = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (const link of res) {
        if (
          !Array.isArray(link.avalibility_dates) ||
          link.avalibility_dates.length === 0
        ) {
          continue;
        }

        let url = link.event_link;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const metaOgUrl = $('meta[property="og:url"]').attr('content');
        if (!metaOgUrl) {
          throw new HttpException(
            'Meta og:url content not found in the page',
            HttpStatus.BAD_REQUEST,
          );
        }

        link.event_link = metaOgUrl;
        await link.save();

        const eventTitle = $('h1.media-heading')
          .contents()
          .filter(function () {
            return this.nodeType === 3;
          })
          .text()
          .trim();

        const rawEventDate =
          $('dd')
            .first()
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim() || 'Varied Dates';

        const eventDate =
          $('dd')
            .first()
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim() || 'Varied Dates';

        const time = $('dd').eq(1).text().trim() || 'Time not listed';
        const eventPrice =
          $('.session_register_info h3').text().trim() || 'Price not listed';

        const availabilitySection = $('.recurrence');
        const meetingDates = availabilitySection
          .find('p')
          .first()
          .text()
          .trim();
        const meetingTimes = availabilitySection.find('.day').text().trim();
        const event_times = [meetingDates, meetingTimes];

        const imageUrl = $('.media-left a img').attr('src') || '';
        const organizerName =
          $('#s-lc-profile-name-111864').text().trim() ||
          'Organizer not listed';

        const orgWebsite = $('a[href^="/profile/"]').attr('href') || '';

        const organizer = {
          name: organizerName,
          url: orgWebsite
            ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
            : '',
          orgWebsite: orgWebsite
            ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
            : '',
          description: $('.secondary-text[itemprop="description"]')
            .text()
            .trim(),
          thumbnail: '',
        };

        const addressParts = $('.ed-address-text span')
          .map((i, el) => $(el).text().trim())
          .get();
        const fullAddress = addressParts.join(' ').replace(/\s+/g, ' ').trim();

        let locationName = '';
        $('dt').each((index, element) => {
          if ($(element).text().trim() === 'Location:') {
            locationName = $(element).next('dd').text().trim();
          }
        });

        const eventDescription =
          $('#s-lc-event-desc')
            .text()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/g, ' ') || 'Description not listed';
        const location = {
          name: locationName || 'Location not listed',
          fullAddress: `${locationName} , Jersey City` || 'Address not listed',
        };

        let Lat, Lng;
        if (location.fullAddress) {
          try {
            const geoResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: location.fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geoResponse.data.status === 'OK') {
              Lat = geoResponse.data.results[0].geometry.location.lat;
              Lng = geoResponse.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
            } else {
              console.log('Geocoding API error:', geoResponse.data.status);
            }
          } catch (geoError) {
            console.error('Error fetching geocoding data:', geoError.message);
          }
        }

        const availabilityDates = link.avalibility_dates.map((dateStr) =>
          new Date(dateStr).toISOString(),
        );

        const audienceElements = $('dd')
          .filter(function () {
            return $(this).prev('dt').text().trim() === 'Audience:';
          })
          .find('.s-lc-event-category-link a');

        let audience = [];
        audienceElements.each((index, element) => {
          const audienceText = $(element).text().trim();
          if (audienceText === 'Juvenile') {
            audience.push('Juvenile');
          } else if (audienceText === 'Young Adult') {
            audience.push('Young Adult');
          } else if (audienceText === 'Adult') {
            audience.push('Adult');
          }
        });

        let ageGroup = { month: [], year: [] };

        audience.forEach((group) => {
          if (group === 'Juvenile') {
            for (let i = 1; i <= 17; i++) {
              ageGroup.year.push(i);
            }
          } else if (group === 'Young Adult') {
            for (let i = 18; i <= 25; i++) {
              ageGroup.year.push(i);
            }
          } else if (group === 'Adult') {
            for (let i = 26; i <= 64; i++) {
              ageGroup.year.push(i);
            }
          }
        });

        const eventData = {
          title: eventTitle,
          event_date: eventDate,
          description: eventDescription,
          time: time,
          event_times: event_times,
          organizer: organizer,
          location: location,
          event_link: metaOgUrl,
          event_link_id: link._id,
          cityId: link.cityId,
          event_city: 'Jersey City',
          image_url: $('.media-left a img').attr('src') || '',
          avalibility_dates: availabilityDates,
          source_id: source_id,
          latitude: Lat,
          longitude: Lng,
          ageGroup: ageGroup,
          price: 'Price not specified',
          refundPolicy: 'No refund policy specified.',
          venue: `472 Jersey Avenue
Jersey City, New Jersey 07302`,
          providerName: 'Jersey City Free Public Library',
          providerUrl: 'https://jclibrary.libcal.com/',
          providerImage:
            'https://www.jclibrary.org/wp-content/uploads/2024/03/cropped-JCFPL-Logo-Navy_transparent-1.png',
        };

        const existingEvent = await this.eventModel.findOne({
          title: eventTitle,
          event_link_id: link._id,
          event_times: { $all: event_times },
        });

        if (!existingEvent) {
          await this.eventModel.insertMany([eventData]);
          createdEvents.push(eventData);
          link.is_event_detail = true;
          await link.save();
        }
      }

      return {
        message: `${createdEvents.length} events created successfully`,
        events: createdEvents,
      };
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAllEventDetailsJerseyCityLibrary(
    source_id: string,
  ): Promise<any> {
    try {
      console.log('Source ID:', source_id);

      const res = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        source: 'website Jersey City Free Public Library',
        is_event_detail: true,
      });

      console.log('Event Links Found:', res);

      const updatedEvents = [];

      for (const link of res) {
        if (
          !Array.isArray(link.avalibility_dates) ||
          link.avalibility_dates.length === 0
        ) {
          continue;
        }

        let url = link.event_link;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const metaOgUrl = $('meta[property="og:url"]').attr('content');
        if (!metaOgUrl) {
          throw new HttpException(
            'Meta og:url content not found in the page',
            HttpStatus.BAD_REQUEST,
          );
        }

        link.event_link = metaOgUrl;
        await link.save();

        const eventTitle = $('h1.media-heading')
          .contents()
          .filter(function () {
            return this.nodeType === 3;
          })
          .text()
          .trim();

        const rawEventDate =
          $('dd')
            .first()
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim() || 'Varied Dates';

        const eventDate = new Date(rawEventDate);
        if (isNaN(eventDate.getTime())) {
          console.error('Invalid event date:', rawEventDate);
          continue;
        }

        const time = $('dd').eq(1).text().trim() || 'Time not listed';
        const eventPrice =
          $('.session_register_info h3').text().trim() || 'Price not listed';

        const availabilitySection = $('.recurrence');
        const meetingDates = availabilitySection
          .find('p')
          .first()
          .text()
          .trim();
        const meetingTimes = availabilitySection.find('.day').text().trim();
        const event_times = [meetingDates, meetingTimes];

        const imageUrl = $('.media-left a img').attr('src') || '';
        const organizerName =
          $('#s-lc-profile-name').text().trim() || 'Organizer not listed';

        const orgWebsite = $('a[href^="/profile/"]').attr('href') || '';

        const organizer = {
          name: organizerName,
          url: orgWebsite
            ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
            : '',
          orgWebsite: orgWebsite
            ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
            : '',
          description: $('.secondary-text[itemprop="description"]')
            .text()
            .trim(),
          thumbnail: '',
        };

        const addressParts = $('.ed-address-text span')
          .map((i, el) => $(el).text().trim())
          .get();
        const fullAddress = addressParts.join(' ').replace(/\s+/g, ' ').trim();

        let locationName = '';
        $('dt').each((index, element) => {
          if ($(element).text().trim() === 'Location:') {
            locationName = $(element).next('dd').text().trim();
          }
        });

        const eventDescription =
          $('#s-lc-event-desc')
            .text()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/g, ' ') || 'Description not listed';
        const location = {
          name: locationName || 'Location not listed',
          fullAddress: `${locationName} , Jersey City` || 'Address not listed',
        };

        let Lat, Lng;
        if (location.fullAddress) {
          try {
            const geoResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: location.fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geoResponse.data.status === 'OK') {
              Lat = geoResponse.data.results[0].geometry.location.lat;
              Lng = geoResponse.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
            } else {
              console.log('Geocoding API error:', geoResponse.data.status);
            }
          } catch (geoError) {
            console.error('Error fetching geocoding data:', geoError.message);
          }
        }

        const inpersonOrVirtual = $('h1.media-heading')
          .find('.label-info')
          .text()
          .trim();

        let eventMode = '';
        if (inpersonOrVirtual.includes('In-Person')) {
          eventMode = 'in-person';
        } else if (inpersonOrVirtual.includes('Virtual')) {
          eventMode = 'Virtual';
        } else {
          eventMode = 'No data available';
        }

        let ageGroup = 'No data available';

        const audienceText = $('dt:contains("Audience")')
          .next('dd')
          .text()
          .trim()
          .toLowerCase();

        console.log('Audience Text:', audienceText);

        if (audienceText.includes('juvenile')) {
          ageGroup = '1-17';
        } else if (audienceText.includes('young adult')) {
          ageGroup = '18-25';
        } else if (audienceText.includes('adult')) {
          ageGroup = '26+';
        }

        console.log('Age Group:', ageGroup);

        const availabilityDates = link.avalibility_dates.map((dateStr) =>
          new Date(dateStr).toISOString(),
        );

        const audienceElements = $('dd')
          .filter(function () {
            return $(this).prev('dt').text().trim() === 'Audience:';
          })
          .find('.s-lc-event-category-link a');

        let audience = [];
        audienceElements.each((index, element) => {
          const audienceText = $(element).text().trim();
          if (audienceText === 'Juvenile') {
            audience.push('Juvenile');
          } else if (audienceText === 'Young Adult') {
            audience.push('Young Adult');
          } else if (audienceText === 'Adult') {
            audience.push('Adult');
          }
        });

        let ageGroupWithAudience = { month: [], year: [] };

        audience.forEach((group) => {
          if (group === 'Juvenile') {
            for (let i = 1; i <= 17; i++) {
              ageGroupWithAudience.year.push(i);
            }
          } else if (group === 'Young Adult') {
            for (let i = 18; i <= 25; i++) {
              ageGroupWithAudience.year.push(i);
            }
          } else if (group === 'Adult') {
            for (let i = 26; i <= 64; i++) {
              ageGroupWithAudience.year.push(i);
            }
          }
        });

        const eventData = {
          title: eventTitle,
          event_date: {
            display: eventDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            datetime: eventDate.toISOString(),
          },
          description: eventDescription,
          time: time,
          event_times: event_times,
          organizer: organizer,
          location: location,
          event_link_id: link._id,
          cityId: link.cityId,
          image_url: $('.media-left a img').attr('src') || '',
          avalibility_dates: availabilityDates,
          source_id: source_id,
          event_link: metaOgUrl,
          event_city: 'Jersey City',
          latitude: Lat,
          longitude: Lng,
          venue: `472 Jersey Avenue
Jersey City, New Jersey 07302`,
          inpersonOrVirtual: eventMode,
          price: 'Price not specified',
          refundPolicy: 'No refund policy specified.',
          ageGroup: ageGroupWithAudience,
          providerName: 'Jersey City Free Public Library',
          providerUrl: 'https://jclibrary.libcal.com/',
          providerImage:
            'https://www.jclibrary.org/wp-content/uploads/2024/03/cropped-JCFPL-Logo-Navy_transparent-1.png',
        };

        const updatedEvent = await this.eventModel.findOneAndUpdate(
          { event_link_id: link._id },
          { $set: eventData },
          { new: true, upsert: true },
        );

        updatedEvents.push(updatedEvent);

        link.is_event_detail = true;
        link.inpersonOrVirtual = eventMode;
        link.ageGroup = ageGroup;
        await link.save();
      }

      return {
        message: `${updatedEvents.length} events updated successfully`,
        events: updatedEvents,
      };
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getEvents(source_id: string, startDate: string, endDate: string) {
    console.log('source_id: ', source_id);

    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    if (!sour) {
      throw new Error(`Event source with id ${source_id} not found`);
    }

    if (!sour.cityId) {
      throw new Error(`Event source with id ${source_id} has no cityId`);
    }

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });

    if (!cty) {
      throw new Error(`City with id ${sour.cityId} not found`);
    }

    console.log('full cty: ', cty);

    let ctyId;
    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'nj--union-city';
        break;
      case 'Union City':
        ctyId = 'in--union-city';
        break;
      case 'West New York':
        ctyId = 'united-states';
        break;
      case 'Guttenberg':
        ctyId = 'nj--guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'nj--bayonne';
        break;
      case 'Jersey City':
        ctyId = 'united-states--new-jersey';
        break;
      case 'Phoenix':
        ctyId = 'az--phoenix';
        break;
      case 'Secaucus':
        ctyId = 'nj--secaucus';
        break;
      case 'North Bergen':
        ctyId = 'united-states';
        break;
      case 'Hoboken':
        ctyId = 'nj--jersey-city';
        break;
      default:
        console.log('Unsupported city:', cty.city);
        throw new Error('Unsupported city');
    }

    const ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid startDate or endDate');
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (startDate === endDate) {
      days = 1;
    }

    const url = `https://hobokenlibrary.libnet.info/eeventcaldata?event_type=0&req=%7B%22private%22%3Afalse%2C%22date%22%3A%22${startDate}%22%2C%22days%22%3A${days}%2C%22locations%22%3A%5B%5D%2C%22ages%22%3A%5B%22Kids%22%2C%22Teens%252FTweens%22%5D%2C%22types%22%3A%5B%5D%7D`;

    console.log('url', url);

    const response = await this.httpService.get(url).toPromise();
    const events = response.data;

    const eventIds: string[] = [];

    const savePromises = events.map(async (event) => {
      const savedEvent = await this.saveEvent(event, sour.cityId, source_id);
      if (savedEvent) {
        eventIds.push(savedEvent._id.toString());
      }
    });

    await Promise.all(savePromises);

    await this.getAllHobokenLibraryLinksAndEvent();

    if (eventIds.length > 0) {
      await this.updateEventsFriendly(eventIds);

      const eventsToDelete = await this.eventModel.find({
        _id: { $in: eventIds },
        childFriendly: false,
        familyFriendly: false,
      });

      if (eventsToDelete.length > 0) {
        const deleteIds = eventsToDelete.map((event) => event._id);
        await this.eventModel.deleteMany({ _id: { $in: deleteIds } });
        console.log(`Deleted ${deleteIds.length} non-friendly events.`);
      }
    }

    return { message: 'Events saved and updated successfully' };
  }

  private async saveEvent(event: any, cityId: string, source_id: string) {
    const slug = await this.generateUniqueSlug(event.title);

    const ageGroupMap = {
      Kids: '0–12 years old',
      'Teens/Tweens': '13–17 years old',
      Adults: '18–64 years old',
      Seniors: '65 years and older',
    };

    let ageGroup: string = '';

    if (event.agesArray && event.agesArray.length > 0) {
      const firstAgeCategory = event.agesArray[0];
      ageGroup = ageGroupMap[firstAgeCategory] || firstAgeCategory;
    }

    const newEvent = {
      title: event.title,
      slug: slug,
      source: 'website Hoboken Library',
      avalibility_dates: event.event_start.split(' ')[0],
      event_date: {
        start: event.event_start,
        end: event.event_end,
      },
      event_link: `https://hobokenlibrary.libnet.info/event/${event.id}`,
      image_url: `https://static.libnet.info/images/events/hobokenlibrary/${event.event_image}`,
      location: {
        name: event.location,
        fullAddress: event.library,
      },
      type: event.event_type,
      source_id: source_id,
      ageGroup: ageGroup,
      cityId: cityId,
      events_type: event.tagsArray,
      audiance: event.agesArray,
    };

    console.log('newEvent before save: ', newEvent);

    if (!newEvent.event_date.start || !newEvent.event_date.end) {
      console.warn(
        'Skipping event creation for event due to missing date/time:',
        newEvent.title,
      );
      return null;
    }

    const existingEvent = await this.eventlinkModel.findOne({
      title: newEvent.title,
      event_link: newEvent.event_link,
      source: newEvent.source,
      avalibility_dates: newEvent.avalibility_dates,
    });

    if (existingEvent) {
      console.log('Event already exists, skipping save:', newEvent.title);
      return null;
    }

    const createdEvent = new this.eventlinkModel(newEvent);
    await createdEvent.save();
    console.log('Event saved:', newEvent.title);

    return createdEvent;
  }

  async updateEvents(source_id: string, startDate: string, endDate: string) {
    console.log('source_id: ', source_id);

    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    if (!sour) {
      throw new Error(`Event source with id ${source_id} not found`);
    }

    if (!sour.cityId) {
      throw new Error(`Event source with id ${source_id} has no cityId`);
    }

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });

    if (!cty) {
      throw new Error(`City with id ${sour.cityId} not found`);
    }

    console.log('full cty: ', cty);

    let ctyId;
    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'nj--union-city';
        break;
      case 'Union City':
        ctyId = 'in--union-city';
        break;
      case 'West New York':
        ctyId = 'united-states';
        break;
      case 'Guttenberg':
        ctyId = 'nj--guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'nj--bayonne';
        break;
      case 'Jersey City':
        ctyId = 'united-states--new-jersey';
        break;
      case 'Phoenix':
        ctyId = 'az-  -phoenix';
        break;
      case 'Secaucus':
        ctyId = 'nj--secaucus';
        break;
      case 'North Bergen':
        ctyId = 'united-states';
        break;
      case 'Hoboken':
        ctyId = 'nj--jersey-city';
        break;
      default:
        console.log('Unsupported city:', cty.city);
        throw new Error('Unsupported city');
    }

    const ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid startDate or endDate');
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const url = `https://hobokenlibrary.libnet.info/eeventcaldata?event_type=0&req=%7B%22private%22%3Afalse%2C%22date%22%3A%22${startDate}%22%2C%22days%22%3A${days}%2C%22locations%22%3A%5B%5D%2C%22ages%22%3A%5B%22Kids%22%2C%22Teens%252FTweens%22%5D%2C%22types%22%3A%5B%5D%7D`;

    console.log('url', url);

    const response = await this.httpService.get(url).toPromise();

    const events = response.data;

    const savePromises = events.map((event) =>
      this.saveUpdateEvent(event, source_id),
    );
    await Promise.all(savePromises);

    return { message: 'Events saved successfully' };
  }

  private async saveUpdateEvent(event: any, source_id: string) {
    const slug = await this.generateUniqueSlug(event.title);

    const ageGroupMap = {
      Kids: '0–12 years old',
      'Teens/Tweens': '13–17 years old',
      Adults: '18–64 years old',
      Seniors: '65 years and older',
    };

    let ageGroup: string = '';

    if (event.agesArray && event.agesArray.length > 0) {
      const firstAgeCategory = event.agesArray[0];
      ageGroup = ageGroupMap[firstAgeCategory] || firstAgeCategory;
    }

    const newEvent = {
      title: event.title,
      slug: slug,
      source: 'website Hoboken Library',
      avalibility_dates: event.event_start.split(' ')[0],
      event_date: {
        start: event.event_start,
        end: event.event_end,
      },
      event_link: `https://hobokenlibrary.libnet.info/event/${event.id}`,
      image_url: `https://static.libnet.info/images/events/hobokenlibrary/${event.event_image}`,
      location: {
        name: event.location,
        fullAddress: event.library,
      },
      type: event.event_type,
      source_id: source_id,
      ageGroup: ageGroup,
      events_type: event.tagsArray,
      audiance: event.agesArray,
    };

    console.log('newEvent before update: ', newEvent);

    const existingEvent = await this.eventlinkModel.findOne({
      event_link: newEvent.event_link,
      source_id: source_id,
    });

    if (existingEvent) {
      console.log('Event exists, updating event:', newEvent.title);

      existingEvent.event_date = newEvent.event_date;
      existingEvent.image_url = newEvent.image_url;
      existingEvent.location = newEvent.location;
      existingEvent.type = newEvent.type;
      existingEvent.ageGroup = newEvent.ageGroup;
      existingEvent.events_type = newEvent.events_type;
      existingEvent.audiance = newEvent.audiance;

      await existingEvent.save();
      console.log('Event updated:', newEvent.title);
    } else {
      console.log('Event not found for update:', newEvent.title);
    }
  }

  async getHobokenLibraryEventById(id: string): Promise<any> {
    try {
      const eventLinkData = await this.eventlinkModel.findById({ _id: id });
      if (!eventLinkData) {
        throw new HttpException(
          'Event link ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const eventLink = eventLinkData.event_link;

      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/usr/bin/chromium-browser',
      });

      const page = await browser.newPage();
      await page.goto(eventLink, { waitUntil: 'networkidle2' });

      const eventData = await page.evaluate((eventLinkId) => {
        const getElementText = (selector: string) => {
          const element = document.querySelector(selector) as HTMLElement;
          return element ? element.innerText.trim() : 'Not listed';
        };

        const getAllParagraphsText = (selector: string) => {
          const elements = Array.from(document.querySelectorAll(selector));
          return elements.map((el) => el.textContent?.trim() || '').join(' ');
        };

        const title = getElementText('.amh-block.amh-text h2');
        const eventDateTimeText = getElementText('.amh-block.amh-text h4');
        console.log('Event Date & Time Text:', eventDateTimeText);

        if (!eventDateTimeText) {
          throw new Error('Event date and time information not found');
        }

        const [dateText, timeText] = eventDateTimeText
          .split('\n')
          .map((text) => text.trim());
        console.log('Date Text:', dateText);
        console.log('Time Text:', timeText);

        if (!dateText || !timeText) {
          throw new Error('Date or time information is missing');
        }

        const dateMatch = dateText.match(/(\w+), (\w+) (\d+)/);
        const timeMatch = timeText.match(/(\d+:\d+)(am|pm) - (\d+:\d+)(am|pm)/);

        if (!dateMatch || !timeMatch) {
          throw new Error(
            `Invalid date or time format: "${eventDateTimeText}"`,
          );
        }

        const day = dateMatch[1];
        const month = dateMatch[2];
        const dayNum = dateMatch[3];
        const startTime = timeMatch[1] + timeMatch[2];
        const endTime = timeMatch[3] + timeMatch[4];

        const year = new Date().getFullYear();
        const monthNumber =
          new Date(Date.parse(month + ' 1, 2021')).getMonth() + 1;

        const formattedStartDate = `${year}-${monthNumber
          .toString()
          .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${startTime}`;
        const formattedEndDate = `${year}-${monthNumber
          .toString()
          .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${endTime}`;

        const eventPrice = getElementText('.session_register_info h3');
        const availabilitySection = document.querySelector('.recurrence');
        const meetingDates = availabilitySection
          ? getElementText('.recurrence p')
          : '';
        const meetingTimes = availabilitySection
          ? getElementText('.recurrence .day')
          : '';
        const event_times = [meetingDates, meetingTimes];

        const imageUrl =
          (
            document.querySelector(
              '.amh-block.amh-text .amh-content span div[style*="text-align: center"] img',
            ) as HTMLImageElement
          )?.src || '';

        const ogUrlMeta = document.querySelector(
          'meta[property="og:url"]',
        ) as HTMLMetaElement;
        const ogUrl = ogUrlMeta ? ogUrlMeta.content : '';

        const organizerName = getElementText('#s-lc-profile-name-111864');
        const organizerUrl =
          (document.querySelector('a[itemprop="url"]') as HTMLAnchorElement)
            ?.href || '';

        const description = getAllParagraphsText('.amh-content span p');

        const locationElement = document.querySelector(
          '.amh-block.amh-widget .amh-content a:last-child',
        ) as HTMLAnchorElement;
        const fullAddress = locationElement
          ? locationElement.innerText.replace(/\s+/g, ' ').trim()
          : 'Location not listed';

        const locationLinkElement = document.querySelector(
          '.amh-block.amh-widget .amh-content a:first-child',
        ) as HTMLAnchorElement;
        const locationLink = locationLinkElement
          ? locationLinkElement.href
          : '';

        const location = {
          name: 'Hoboken Library',
          fullAddress: '500 Park Avenue, Hoboken, NJ, 07030',
          link: locationLink,
        };

        const ageGroupElement = Array.from(
          document.querySelectorAll('.amh-block.amh-text p'),
        ).find((p) => p.textContent.includes('AGE GROUP:'));

        let ageGroupName = null;
        if (ageGroupElement) {
          const ageGroupLink = ageGroupElement.querySelector('a');
          ageGroupName = ageGroupLink ? ageGroupLink.textContent.trim() : null;
        }

        return {
          title,
          event_date: formattedStartDate,
          event_end_time: formattedEndDate,
          description,
          event_times,
          organizer: {
            name: 'Hoboken Public Library',
            url: 'https://hobokenlibrary.libnet.info/events',
            orgWebsite: 'https://hobokenlibrary.libnet.info/events',
            description,
            thumbnail:
              'https://hobokenlibrary.org/wp-content/uploads/2023/09/Hoboken-Public-Library-Logo-1.png',
          },
          location,
          image_url: imageUrl,
          event_link_id: eventLinkId,
          ageGroup: ageGroupName,
          venue: `500 Park Avenue,
Hoboken, NJ, 07030`,
          time: '10:30am - 11:00am',
          event_link: ogUrl,
          event_city: 'Hoboken',
          providerUrl: 'https://hobokenlibrary.libnet.info/',
          price: 'Price not specified',
          refundPolicy: 'No refund policy specified.',
        };
      }, eventLinkData._id);

      await browser.close();

      let ageGroup = { month: [], year: [] };

      const audience = eventData.ageGroup || [];

      if (audience === 'Kids') {
        for (let i = 1; i <= 17; i++) {
          ageGroup.year.push(i);
        }
      } else if (audience === 'Teens/Tweens') {
        for (let i = 13; i <= 17; i++) {
          ageGroup.year.push(i);
        }
      } else if (audience === 'Adults') {
        for (let i = 18; i <= 64; i++) {
          ageGroup.year.push(i);
        }
      } else if (audience === 'Seniors') {
        for (let i = 65; i <= 100; i++) {
          ageGroup.year.push(i);
        }
      }

      let latitude, longitude;
      if (eventData.location.fullAddress !== 'Location not listed') {
        try {
          const geocodeResponse = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                address: eventData.location.fullAddress,
                key: API_KEY,
              },
            },
          );

          if (geocodeResponse.data.status === 'OK') {
            const location = geocodeResponse.data.results[0].geometry.location;
            latitude = location.lat;
            longitude = location.lng;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          } else {
            console.log('Geocoding error:', geocodeResponse.data.status);
          }
        } catch (error) {
          console.error('Error fetching geocoding data:', error.message);
        }
      }

      const cityId = eventLinkData.cityId || null;

      const eventDataWithGeo = {
        ...eventData,
        latitude,
        longitude,
        cityId,
        ageGroup,
      };

      const existingEvent = await this.eventModel.findOne({
        title: eventDataWithGeo.title,
        event_link_id: eventLinkData._id,
        event_times: { $all: eventDataWithGeo.event_times },
      });

      if (existingEvent) {
        throw new HttpException(
          'Event with the same title and times already exists',
          HttpStatus.CONFLICT,
        );
      }

      await this.eventModel.insertMany(eventDataWithGeo);
      eventLinkData.is_event_detail = true;
      await eventLinkData.save();

      return {
        message: 'Event data extracted successfully',
        event: eventDataWithGeo,
      };
    } catch (error) {
      console.error('Error fetching event data from URL:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllHobokenLibraryEvent(source_id: string): Promise<any> {
    try {
      const eventLinkDataArray = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        source: 'website Hoboken Library',
        is_event_detail: false,
      });

      if (eventLinkDataArray.length === 0) {
        throw new HttpException(
          'No event links found for Hoboken Library',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log(
        `Found ${eventLinkDataArray.length} event links for Hoboken Library`,
      );

      const createdEvents = [];

      for (const eventLinkData of eventLinkDataArray) {
        const eventLink = eventLinkData.event_link;

        const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
          ignoreHTTPSErrors: true,
          executablePath: '/usr/bin/chromium-browser',
        });

        const page = await browser.newPage();
        await page.goto(eventLink, { waitUntil: 'networkidle2' });

        const eventData = await page.evaluate((eventLinkId) => {
          const getElementText = (selector: string) => {
            const element = document.querySelector(selector) as HTMLElement;
            return element ? element.innerText.trim() : 'Not listed';
          };

          const eventDateTimeText = getElementText('.amh-block.amh-text h4');

          if (!eventDateTimeText) {
            console.warn(`No date/time found for event ${eventLinkId}`);
            return null;
          }

          console.log('Event DateTime Text:', eventDateTimeText);

          const [dateText, timeText] = eventDateTimeText
            .split('\n')
            .map((text) => text.trim());

          if (!dateText || !timeText) {
            console.warn(
              `Malformed date or time for event ${eventLinkId}. Date: ${dateText}, Time: ${timeText}`,
            );
            return null;
          }

          const dateMatch = dateText.match(/(\w+), (\w+) (\d+)/);
          const timeMatch = timeText.match(
            /(\d{1,2}:\d{2})(am|pm) - (\d{1,2}:\d{2})(am|pm)/,
          );

          if (!dateMatch || !timeMatch) {
            console.error(
              `Failed to match date or time for event ${eventLinkId}. DateText: ${dateText}, TimeText: ${timeText}`,
            );
            return null;
          }

          const day = dateMatch[1];
          const month = dateMatch[2];
          const dayNum = dateMatch[3];
          const startTime = timeMatch[1] + timeMatch[2];
          const endTime = timeMatch[3] + timeMatch[4];

          const year = new Date().getFullYear();
          const monthNumber =
            new Date(Date.parse(month + ' 1, 2021')).getMonth() + 1;

          const formattedStartDate = `${year}-${monthNumber
            .toString()
            .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${startTime}`;
          const formattedEndDate = `${year}-${monthNumber
            .toString()
            .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${endTime}`;

          const getAllParagraphsText = (selector: string) => {
            const elements = Array.from(document.querySelectorAll(selector));
            return elements.map((el) => el.textContent?.trim() || '').join(' ');
          };

          const title = getElementText('.amh-block.amh-text h2');
          const eventPrice = getElementText('.session_register_info h3');
          const eventRefund = getElementText('.session_register_info h3');
          const availabilitySection = document.querySelector('.recurrence');
          const meetingDates = availabilitySection
            ? getElementText('.recurrence p')
            : '';
          const meetingTimes = availabilitySection
            ? getElementText('.recurrence .day')
            : '';
          const event_times = [meetingDates, meetingTimes];

          const imageUrl =
            (
              document.querySelector(
                '.amh-block.amh-text .amh-content span div[style*="text-align: center"] img',
              ) as HTMLImageElement
            )?.src || '';

          const ogUrlMeta = document.querySelector(
            'meta[property="og:url"]',
          ) as HTMLMetaElement;
          const ogUrl = ogUrlMeta ? ogUrlMeta.content : '';

          const organizerName = getElementText('#s-lc-profile-name-111864');
          const organizerUrl =
            (document.querySelector('a[itemprop="url"]') as HTMLAnchorElement)
              ?.href || '';

          const description = getAllParagraphsText('.amh-content span p');

          const locationElement = document.querySelector(
            '.amh-block.amh-widget .amh-content a:last-child',
          ) as HTMLAnchorElement;
          const fullAddress = locationElement
            ? locationElement.innerText.replace(/\s+/g, ' ').trim()
            : 'Location not listed';

          const locationLinkElement = document.querySelector(
            '.amh-block.amh-widget .amh-content a:first-child',
          ) as HTMLAnchorElement;
          const locationLink = locationLinkElement
            ? locationLinkElement.href
            : '';

          const location = {
            name: 'Hoboken Library',
            fullAddress: '500 Park Avenue, Hoboken, NJ, 07030',
            link: locationLink,
          };

          const ageGroupElement = Array.from(
            document.querySelectorAll('.amh-block.amh-text p'),
          ).find((p) => p.textContent.includes('AGE GROUP:'));

          let ageGroupName = null;
          if (ageGroupElement) {
            const ageGroupLink = ageGroupElement.querySelector('a');
            ageGroupName = ageGroupLink
              ? ageGroupLink.textContent.trim()
              : null;
          }

          return {
            title,
            event_date: formattedStartDate,
            event_end_time: formattedEndDate,
            description,
            price: 'Price not specified',
            refundPolicy: 'No refund policy specified.',
            event_times,
            organizer: {
              name: 'Hoboken Public Library',
              url: 'https://hobokenlibrary.libnet.info/events',
              orgWebsite: 'https://hobokenlibrary.libnet.info/events',
              description,
              thumbnail:
                'https://hobokenlibrary.org/wp-content/uploads/2023/09/Hoboken-Public-Library-Logo-1.png',
            },
            location,
            image_url: imageUrl,
            event_link_id: eventLinkId,
            ageGroup: ageGroupName,
            venue: `500 Park Avenue,
Hoboken, NJ, 07030`,
            time: '10:30am - 11:00am',
            event_link: ogUrl,
            event_city: 'Hoboken',
            providerUrl: 'https://hobokenlibrary.libnet.info/',
          };
        }, eventLinkData._id);

        if (!eventData) {
          console.log(
            `Skipping event creation for event ${eventLinkData._id} due to missing or malformed date/time.`,
          );
          await browser.close();
          continue;
        }

        await browser.close();

        let ageGroup = { month: [], year: [] };

        const audience = eventData.ageGroup || '';
        if (audience === 'Kids') {
          for (let i = 1; i <= 17; i++) {
            ageGroup.year.push(i);
          }
        } else if (audience === 'Teens/Tweens') {
          for (let i = 13; i <= 17; i++) {
            ageGroup.year.push(i);
          }
        } else if (audience === 'Adults') {
          for (let i = 18; i <= 64; i++) {
            ageGroup.year.push(i);
          }
        } else if (audience === 'Seniors') {
          for (let i = 65; i <= 100; i++) {
            ageGroup.year.push(i);
          }
        }

        let latitude, longitude;
        if (eventData.location.fullAddress !== 'Location not listed') {
          try {
            const geocodeResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: eventData.location.fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geocodeResponse.data.status === 'OK') {
              const location =
                geocodeResponse.data.results[0].geometry.location;
              latitude = location.lat;
              longitude = location.lng;
            } else {
              console.log('Geocoding error:', geocodeResponse.data.status);
            }
          } catch (error) {
            console.error('Error fetching geocoding data:', error.message);
          }
        }

        const cityId = eventLinkData.cityId || null;

        const eventDataWithGeo = {
          ...eventData,
          latitude,
          longitude,
          cityId,
          ageGroup,
        };

        const existingEvent = await this.eventModel.findOne({
          title: eventDataWithGeo.title,
          event_link_id: eventLinkData._id,
          event_times: { $all: eventDataWithGeo.event_times },
        });

        if (existingEvent) {
          console.log('Event already exists, skipping...');
          continue;
        }

        await this.eventModel.insertMany(eventDataWithGeo);
        createdEvents.push(eventDataWithGeo);
        eventLinkData.is_event_detail = true;
        await eventLinkData.save();
      }

      return {
        message: `${createdEvents.length} events created successfully`,
        events: createdEvents,
      };
    } catch (error) {
      console.error('Error fetching event data from URL:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAllHobokenLibraryEvent(source_id: string): Promise<any> {
    try {
      const eventLinkDataArray = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        source: 'website Hoboken Library',
        is_event_detail: true,
      });

      if (eventLinkDataArray.length === 0) {
        throw new HttpException(
          'No event links found for Hoboken Library',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log(
        `Found ${eventLinkDataArray.length} event links for Hoboken Library`,
      );

      const updatedEvents = [];

      for (const eventLinkData of eventLinkDataArray) {
        const eventLink = eventLinkData.event_link;

        const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
          ignoreHTTPSErrors: true,
          executablePath: '/usr/bin/chromium-browser',
        });

        const page = await browser.newPage();
        await page.goto(eventLink, { waitUntil: 'networkidle2' });

        const eventData = await page.evaluate((eventLinkId) => {
          const getElementText = (selector: string) => {
            const element = document.querySelector(selector) as HTMLElement;
            return element ? element.innerText.trim() : 'Not listed';
          };

          const getAllParagraphsText = (selector: string) => {
            const elements = Array.from(document.querySelectorAll(selector));
            return elements.map((el) => el.textContent?.trim() || '').join(' ');
          };

          const title = getElementText('.amh-block.amh-text h2');
          const eventDateTimeText = getElementText('.amh-block.amh-text h4');
          const dateText = eventDateTimeText.split('\n')[0].trim();
          const timeText = eventDateTimeText.split('\n')[1].trim();

          const dateMatch = dateText.match(/(\w+), (\w+) (\d+)/);
          const timeMatch = timeText.match(
            /(\d+:\d+)(am|pm) - (\d+:\d+)(am|pm)/,
          );

          const day = dateMatch[1];
          const month = dateMatch[2];
          const dayNum = dateMatch[3];
          const startTime = timeMatch[1] + timeMatch[2];
          const endTime = timeMatch[3] + timeMatch[4];

          const year = new Date().getFullYear();
          const monthNumber =
            new Date(Date.parse(month + ' 1, 2021')).getMonth() + 1;

          const formattedStartDate = `${year}-${monthNumber
            .toString()
            .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${startTime}`;
          const formattedEndDate = `${year}-${monthNumber
            .toString()
            .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${endTime}`;

          const eventPrice = getElementText('.session_register_info h3');
          const eventRefund = getElementText('.session_register_info h3');
          const imageUrl =
            (
              document.querySelector(
                '.amh-block.amh-text .amh-content span div[style*="text-align: center"] img',
              ) as HTMLImageElement
            )?.src || '';

          const organizerName = getElementText('#s-lc-profile-name-111864');
          const organizerUrl =
            (document.querySelector('a[itemprop="url"]') as HTMLAnchorElement)
              ?.href || '';

          const ogUrlMeta = document.querySelector(
            'meta[property="og:url"]',
          ) as HTMLMetaElement;
          const ogUrl = ogUrlMeta ? ogUrlMeta.content : '';

          const description = getAllParagraphsText('.amh-content span p');

          const locationElement = document.querySelector(
            '.amh-block.amh-widget .amh-content a:last-child',
          ) as HTMLAnchorElement;
          const fullAddress = locationElement
            ? locationElement.innerText.replace(/\s+/g, ' ').trim()
            : 'Location not listed';

          const locationLinkElement = document.querySelector(
            '.amh-block.amh-widget .amh-content a:first-child',
          ) as HTMLAnchorElement;
          const locationLink = locationLinkElement
            ? locationLinkElement.href
            : '';

          const location = {
            name: 'Hoboken Library',
            fullAddress: '500 Park Avenue, Hoboken, NJ, 07030',
            link: locationLink,
          };

          const ageGroupElement = Array.from(
            document.querySelectorAll('.amh-block.amh-text p'),
          ).find((p) => p.textContent.includes('AGE GROUP:'));

          let ageGroupName = null;
          if (ageGroupElement) {
            const ageGroupLink = ageGroupElement.querySelector('a');
            ageGroupName = ageGroupLink
              ? ageGroupLink.textContent.trim()
              : null;
          }

          let ageGroup = { month: [], year: [] };
          if (ageGroupName) {
            if (ageGroupName === 'Kids') {
              for (let i = 1; i <= 17; i++) {
                ageGroup.year.push(i);
              }
            } else if (ageGroupName === 'Teens/Tweens') {
              for (let i = 13; i <= 17; i++) {
                ageGroup.year.push(i);
              }
            } else if (ageGroupName === 'Adults') {
              for (let i = 18; i <= 64; i++) {
                ageGroup.year.push(i);
              }
            } else if (ageGroupName === 'Seniors') {
              for (let i = 65; i <= 100; i++) {
                ageGroup.year.push(i);
              }
            }
          }

          return {
            title,
            event_date: formattedStartDate,
            event_end_time: formattedEndDate,
            description,
            price: 'Price not specified',
            refundPolicy: 'No refund policy specified.',
            event_times: [],
            organizer: {
              name: organizerName,
              url: organizerUrl,
            },
            location,
            image_url: imageUrl,
            event_link_id: eventLinkId,
            ageGroup,
            venue: `
500 Park Avenue,
Hoboken, NJ, 07030
`,
            time: '10:30am - 11:00am',
            event_link: ogUrl,
            event_city: 'Hoboken',
            providerUrl: 'https://hobokenlibrary.libnet.info/',
          };
        }, eventLinkData._id);

        await browser.close();
        let latitude, longitude;
        if (eventData.location.fullAddress !== 'Location not listed') {
          try {
            const geocodeResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: eventData.location.fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geocodeResponse.data.status === 'OK') {
              const location =
                geocodeResponse.data.results[0].geometry.location;
              latitude = location.lat;
              longitude = location.lng;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            } else {
              console.log('Geocoding error:', geocodeResponse.data.status);
            }
          } catch (error) {
            console.error('Error fetching geocoding data:', error.message);
          }
        }

        const updatedEventData = {
          ...eventData,
          latitude,
          longitude,
        };

        const updatedEvent = await this.eventModel.findOneAndUpdate(
          { event_link_id: eventLinkData._id },
          { $set: updatedEventData },
          { new: true },
        );

        updatedEvents.push(updatedEvent);
        eventLinkData.is_event_detail = true;
        await eventLinkData.save();
      }

      return {
        message: `${updatedEvents.length} events updated successfully`,
        events: updatedEvents,
      };
    } catch (error) {
      console.error('Error updating event data:', error);
      throw new HttpException(
        'Failed to update event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEventLinksHobokenForHobokenMuseumWebsite(
    eventDate: string,
    source_id: string,
  ) {
    console.log('Date =====>>>>>>', eventDate);
    console.log('source_id: ', source_id);
    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full cty: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'Weehawken,NJ,USA';
        break;
      case 'Union City':
        ctyId = 'Union City,NJ,USA';
        break;
      case 'West New York':
        ctyId = 'West New York,NJ,USA';
        break;
      case 'Guttenberg':
        ctyId = 'Guttenberg,NJ,USA';
        break;
      case 'Bayonne':
        ctyId = 'Bayonne,NJ,USA';
        break;
      case 'Jersey City':
        ctyId = 'Jersey City,NJ,USA';
        break;
      case 'Phoenix':
        ctyId = 'Phoenix,NY,USA';
        break;
      case 'Secaucus':
        ctyId = 'Secaucus,NJ,USA';
        break;
      case 'North Bergen':
        ctyId = 'North Bergen,NJ,USA';
        break;
      case 'Hoboken':
        ctyId = 'Hoboken,NJ,USA';
        break;
      default:
        throw new Error('Unsupported city');
    }

    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    try {
      const url = `https://www.hobokenmuseum.org/events/list/?tribe-bar-date=
${eventDate}/`;
      console.log('Scraping URL: ', url);

      const response = await axios.get(url);
      const html = response.data;

      const $ = cheerio.load(html);

      if ($('.tribe-events-calendar-day').length === 0) {
        console.log(`No events found for the date: ${eventDate}`);
        return [];
      }

      const events = [];

      $('.tribe-events-calendar-day').each((index, element) => {
        const eventDateElement = $(element).find(
          '.tribe-events-calendar-day__time-separator time',
        );
        const eventTime = eventDateElement.attr('datetime');

        $(element)
          .find('.tribe-events-calendar-day__event')
          .each((i, eventElement) => {
            const title = $(eventElement)
              .find('.tribe-events-calendar-day__event-title-link')
              .text()
              .trim();
            const link = $(eventElement)
              .find('.tribe-events-calendar-day__event-title-link')
              .attr('href');

            const seriesLinkElement = $(eventElement).find(
              '.tribe-events-calendar-series-archive__link',
            );
            const seriesTitle = seriesLinkElement
              .find('.tec_series_marker__title')
              .text()
              .trim();
            const seriesLink = seriesLinkElement.attr('href');

            let description = $(eventElement)
              .find('.tribe-events-calendar-day__event-description p')
              .text()
              .trim();
            description = description.replace(/…\s*Continue reading\s.*/, '');

            const venueTitle = $(eventElement)
              .find('.tribe-events-calendar-day__event-venue-title')
              .text()
              .trim();
            const venueAddress = $(eventElement)
              .find('.tribe-events-calendar-day__event-venue-address')
              .text()
              .trim();

            const eventDatetimeRaw = $(eventElement)
              .find('.tribe-events-calendar-day__event-datetime')
              .text()
              .trim();

            const eventDatetime = this.convertToISODate(eventDatetimeRaw);

            events.push({
              eventTime,
              title,
              description,
              link,
              seriesTitle,
              seriesLink,
              venue: {
                title: venueTitle,
                address: venueAddress,
              },
              eventDatetime,
            });
          });
      });

      console.log('Scraped events for date:', eventDate, events);

      if (events.length === 0) {
        console.log('No events found for date:', eventDate);
        return [];
      }

      let eventFound = false;
      let eventIdsToUpdate: string[] = [];

      for (const evt of events) {
        const existingEvent = await this.eventlinkModel.findOne({
          event_link: evt.link,
          avalibility_dates: evt.eventDatetime,
          cityId: sour.cityId,
          source_id: sour._id,
        });

        if (existingEvent) {
          console.log('Event link already created for date', eventDate);
          continue;
        }

        const slug = await this.generateUniqueSlug(evt.title);
        const newEvent = await this.eventlinkModel.create({
          event_link: evt.link,
          avalibility_dates: evt.eventDatetime,
          slug,
          title: evt.title,
          venue: `Hoboken Historical Museum
          1301 Hudson St.
          Hoboken, New Jersey`,
          source: 'website hobokenmuseum',
          time: evt.eventDatetime,
          description: evt.description,
          series_link: evt.seriesLink,
          cityId: sour.cityId,
          source_id: sour._id,
          city: ctyId.trim(),
        });

        await this.createAllEventLinkAndDetailForHobokenMuseumWebsite(
          evt.link,
          newEvent._id,
          sour._id,
          sour.cityId,
        );
        console.log('Created new event for date', eventDate, newEvent);
        eventIdsToUpdate.push(newEvent._id.toString());
        eventFound = true;
      }

      if (eventIdsToUpdate.length > 0) {
        await this.updateEventsFriendly(eventIdsToUpdate);
        console.log(
          'updateEventsFriendly called with event IDs:',
          eventIdsToUpdate,
        );

        for (const eventId of eventIdsToUpdate) {
          const updatedEvent = await this.eventlinkModel.findById(eventId);

          if (
            updatedEvent &&
            updatedEvent.childFriendly === false &&
            updatedEvent.familyFriendly === false
          ) {
            await this.eventlinkModel.deleteOne({ _id: eventId });
            console.log(
              `Deleting event ${eventId} as it's not child or family friendly.`,
            );
            await this.eventModel.deleteOne({ event_link_id: eventId });
            console.log(
              `Deleted event from eventModel where event_link_id: ${eventId}`,
            );
          }
        }
      }

      return events;
    } catch (error) {
      console.error(
        'Error scraping events for date:',
        eventDate,
        error.message,
      );
      throw new Error(
        'Failed to scrape event links and create event details for date ' +
          eventDate +
          ': ' +
          error.message,
      );
    }
  }

  convertToISODate(rawDate) {
    try {
      const [monthDay, timeRange] = rawDate.split(' @ ');
      const [month, day] = monthDay.split(' ');
      const year = new Date().getFullYear();
      const monthNumber = new Date(`${month} 1`).getMonth() + 1;
      const formattedDate = `${year}-${monthNumber
        .toString()
        .padStart(2, '0')}-${day.padStart(2, '0')}`;
      return formattedDate;
    } catch (error) {
      console.error('Error converting date:', rawDate);
      return rawDate;
    }
  }

  async getEventDetailByIdHobokenMuseum(id: string): Promise<any> {
    try {
      const link = await this.eventlinkModel.findById(id);

      if (!link) {
        console.warn('Event link not found for the specified ID');
        throw new HttpException(
          'Event link not found for the specified ID',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Event Link Found:', link);

      let eventDetails = await this.eventModel.findOne({
        event_link_id: link._id,
      });

      if (!eventDetails) {
        console.log('Event details not found. Fetching data from URL...');

        let url = link.event_link;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const eventDetails = {
          title: $('h1.tribe-events-single-event-title').text().trim(),
          date: $('.tribe-events-start-date').attr('title') || '',
          time: $('.tribe-events-start-time').text().trim() || '',
          description:
            $('.tribe-events-single-event-description').text().trim() ||
            'No description available.',
          location: `1301 Hudson St.
PO Box 3296
Hoboken, NJ 07030`,
          address:
            $('.tribe-venue-location .tribe-street-address').text().trim() ||
            '',
          city: $('.tribe-locality').text().trim() || '',
          state: $('.tribe-region.tribe-events-abbr').attr('title') || '',
          postalCode: $('.tribe-postal-code').text().trim() || '',
          country: $('.tribe-country-name').text().trim() || '',
          phone: $('.tribe-venue-tel').text().trim() || '',
          imageUrl:
            $('.tribe-events-single-event-description img').attr('src') ||
            'No Image Available',
          googleMapUrl:
            $('.tribe-events-gmap a').attr('href') || 'No Google Map URL',
          eventCategories: $('.tribe-events-event-categories a')
            .map((i, el) => $(el).text().trim())
            .get(),
          event_full_date_time:
            $('.tribe-events-schedule .tribe-event-date-start').text().trim() +
            ' - ' +
            $('.tribe-events-schedule .tribe-event-time').text().trim(),
          fullAddress: `1301 Hudson St.
PO Box 3296
Hoboken, NJ 07030`,
        };
        console.log('eventDetails ====>>>>>>', eventDetails);

        let Lat, Lng;
        if (eventDetails.fullAddress) {
          try {
            const response = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: eventDetails.fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (response.data.status === 'OK') {
              Lat = response.data.results[0].geometry.location.lat;
              Lng = response.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
            } else {
              console.log('Geocoding API error:', response.data.status);
            }
          } catch (error) {
            console.error('Error fetching geocoding data:', error.message);
          }
        }
        let dt_detail = await this.eventModel.create({
          title: eventDetails.title,
          venue: `Hoboken Historical Museum
          1301 Hudson St.
          Hoboken, New Jersey`,
          time: eventDetails.time,
          event_link: link.event_link,
          event_categories: eventDetails.eventCategories,
          phone_number: eventDetails.phone,
          image_url: eventDetails.imageUrl,
          event_city: 'Hoboken',
          price: `Admission: $5
Free for children and members`,
          description: eventDetails.description,
          location: {
            name: eventDetails.location,
            fullAddress: `1301 Hudson St.
PO Box 3296
Hoboken, NJ 07030`,
          },
          event_date: {
            display: eventDetails.date,
            datetime: eventDetails.time,
          },
          organizer: {
            name: 'Hoboken Historical Museum',
            url: 'info@hobokenmuseum.org',
            orgWebsite: 'https://www.hobokenmuseum.org/',
            thumbnail:
              'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
          },
          date: eventDetails.date,
          providerName: 'Hoboken Historical Museum',
          providerUrl: 'https://www.hobokenmuseum.org/',
          providerImage:
            'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
          city: 'Hoboken',
          cityId: link.cityId,
          event_link_id: link._id,
          latitude: Lat,
          longitude: Lng,
        });

        link.is_event_detail = true;
        await link.save();
      }

      console.log('Event Details Found:', eventDetails);
      return eventDetails;
    } catch (error) {
      console.error('Error fetching event details by ID:', error);
      throw new HttpException(
        'Failed to fetch event details: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAllEventDetailForHobokenMuseumWebsite(
    source_id: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    try {
      console.log('source_id:', source_id);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      const res = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        avalibility_dates: { $elemMatch: { $gte: startDate, $lte: endDate } },
        source: 'website hobokenmuseum',
        is_event_detail: false,
      });

      if (res.length === 0) {
        console.warn(
          'No event links found for the specified city and date range',
        );
        throw new HttpException(
          'No event links found for the specified city and date range',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Event Links Found:', res);

      for (const link of res) {
        let dt = await this.eventModel.findOne({ event_link_id: link._id });
        if (dt) {
          console.log('Event Already Created');
          continue;
        }

        let url = link.event_link;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const eventDetails = {
          title: $('h1.tribe-events-single-event-title').text().trim(),
          date: $('.tribe-events-start-date').attr('title') || '',
          time: $('.tribe-events-start-time').text().trim() || '',
          description:
            $('.tribe-events-single-event-description').text().trim() ||
            'No description available.',
          location: $('.tribe-venue a').text().trim() || '',
          address:
            $('.tribe-venue-location .tribe-street-address').text().trim() ||
            '',
          city: $('.tribe-locality').text().trim() || '',
          state: $('.tribe-region.tribe-events-abbr').attr('title') || '',
          postalCode: $('.tribe-postal-code').text().trim() || '',
          country: $('.tribe-country-name').text().trim() || '',
          phone: $('.tribe-venue-tel').text().trim() || '',
          imageUrl:
            $('.tribe-events-single-event-description img').attr('src') ||
            'No Image Available',
          googleMapUrl:
            $('.tribe-events-gmap a').attr('href') || 'No Google Map URL',
          eventCategories: $('.tribe-events-event-categories a')
            .map((i, el) => $(el).text().trim())
            .get(),
          event_full_date_time:
            $('.tribe-events-schedule .tribe-event-date-start').text().trim() +
            ' - ' +
            $('.tribe-events-schedule .tribe-event-time').text().trim(),
        };

        console.log('eventDetails ====>>>>>>', eventDetails);

        let latitude = 0;
        let longitude = 0;
        const fullAddress = `1301 Hudson St.
PO Box 3296
Hoboken, NJ 07030`;
        0;

        if (fullAddress) {
          try {
            const geoResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geoResponse.data.status === 'OK') {
              latitude = geoResponse.data.results[0].geometry.location.lat;
              longitude = geoResponse.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            } else {
              console.log('Geocoding API error:', geoResponse.data.status);
            }
          } catch (geoError) {
            console.error('Error fetching geocoding data:', geoError.message);
          }
        }

        let dt_detail = await this.eventModel.create({
          title: eventDetails.title,
          venue: `Hoboken Historical Museum
1301 Hudson St.
Hoboken, New Jersey`,
          time: eventDetails.time,
          event_link: link.event_link,
          event_categories: eventDetails.eventCategories,
          phone_number: '201.656.2240',
          image_url: eventDetails.imageUrl,
          event_city: 'Hoboken',
          description: eventDetails.description,
          price: `Admission: $5
Free for children and members`,
          location: {
            name: eventDetails.location,
            fullAddress: fullAddress,
          },
          event_date: {
            display: eventDetails.date,
            datetime: eventDetails.time,
          },
          organizer: {
            name: 'Hoboken Historical Museum',
            url: 'info@hobokenmuseum.org',
            orgWebsite: 'https://www.hobokenmuseum.org/',
            thumbnail:
              'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
          },
          date: eventDetails.date,
          providerName: 'Hoboken Historical Museum',
          providerUrl: 'https://www.hobokenmuseum.org/',
          providerImage:
            'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
          city: 'Hoboken',
          cityId: link.cityId,
          event_link_id: link._id,
          latitude: latitude,
          longitude: longitude,
        });

        link.is_event_detail = true;
        await link.save();
      }

      return 'Event Detail Created Successfully';
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAllEventDetailForHobokenMuseumWebsite(
    source_id: string,
  ): Promise<any> {
    try {
      console.log('source_id:', source_id);

      const res = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        source: 'website hobokenmuseum',
        is_event_detail: true,
      });

      if (res.length === 0) {
        console.warn(
          'No event links found for the specified city and date range',
        );
        throw new HttpException(
          'No event links found for the specified city and date range',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Event Links Found:', res);

      for (const link of res) {
        let dt = await this.eventModel.findOne({ event_link_id: link._id });
        // if (dt) {
        //   console.log('Event Already Created');
        //   continue;
        // }

        let url = link.event_link;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const eventDetails = {
          title: $('h1.tribe-events-single-event-title').text().trim(),
          date: $('.tribe-events-start-date').attr('title') || '',
          time: $('.tribe-events-start-time').text().trim() || '',
          description:
            $('.tribe-events-single-event-description').text().trim() ||
            'No description available.',
          location: $('.tribe-venue a').text().trim() || '',
          address:
            $('.tribe-venue-location .tribe-street-address').text().trim() ||
            '',
          city: $('.tribe-locality').text().trim() || '',
          state: $('.tribe-region.tribe-events-abbr').attr('title') || '',
          postalCode: $('.tribe-postal-code').text().trim() || '',
          country: $('.tribe-country-name').text().trim() || '',
          phone: $('.tribe-venue-tel').text().trim() || '',
          imageUrl:
            $('.tribe-events-single-event-description img').attr('src') ||
            'No Image Available',
          googleMapUrl:
            $('.tribe-events-gmap a').attr('href') || 'No Google Map URL',
          eventCategories: $('.tribe-events-event-categories a')
            .map((i, el) => $(el).text().trim())
            .get(),
          event_full_date_time:
            $('.tribe-events-schedule .tribe-event-date-start').text().trim() +
            ' - ' +
            $('.tribe-events-schedule .tribe-event-time').text().trim(),
        };

        console.log('eventDetails ====>>>>>>', eventDetails);

        let latitude;
        let longitude;
        const fullAddress = `1301 Hudson St.
PO Box 3296
Hoboken, NJ 07030`;
        if (fullAddress) {
          try {
            const geoResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geoResponse.data.status === 'OK') {
              latitude = geoResponse.data.results[0].geometry.location.lat;
              longitude = geoResponse.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            } else {
              console.log('Geocoding API error:', geoResponse.data.status);
            }
          } catch (geoError) {
            console.error('Error fetching geocoding data:', geoError.message);
          }
        }

        let dt_detail = await this.eventModel.updateOne({
          title: eventDetails.title,
          venue: eventDetails.event_full_date_time,
          time: eventDetails.time,
          event_link: link.event_link,
          event_categories: eventDetails.eventCategories,
          phone_number: eventDetails.phone,
          image_url: eventDetails.imageUrl,
          event_city: 'Hoboken',
          description: eventDetails.description,
          location: {
            name: eventDetails.location,
            fullAddress: fullAddress,
          },
          event_date: {
            display: eventDetails.date,
            datetime: eventDetails.time,
          },
          organizer: {
            name: 'Hoboken Historical Museum',
            url: 'info@hobokenmuseum.org',
            orgWebsite: 'https://www.hobokenmuseum.org/',
            thumbnail:
              'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
          },
          providerUrl: 'https://www.hobokenmuseum.org/',
          date: eventDetails.date,
          city: 'Hoboken',
          cityId: link.cityId,
          event_link_id: link._id,
          latitude: latitude,
          longitude: longitude,
          price: 'Price not listed',
          refundPolicy: 'No refund policy specified.',
        });

        link.is_event_detail = true;
        await link.save();
      }

      return 'Event Detail Created Successfully';
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEventLinksHobokenForHobokenPublicLibrary(eventDateInput, source_id) {
    try {
      const sourc = await this.event_sourceModel.findOne({ _id: source_id });

      const url = `https://bccls.libcal.com/calendar/hoboken?cid=10293&t=d&d=${eventDateInput}&cal=10293&audience=1442,1443,1432,1444,1445,1433,1434,1435,1436,1437,1431,1438,1439,1440,1441,1419,1123,6410,1423,1424,1425,1426,1427,1428,1429,1430,1127,1422,1421,1420&inc=0`;

      console.log('url', url);
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/usr/bin/chromium-browser',
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

      await page.waitForSelector('#s-lc-c-list-results');

      const events = [];
      const eventElements = await page.$$(
        '#s-lc-c-list-results .media.s-lc-c-evt',
      );

      for (const element of eventElements) {
        console.log('element ====>>>>', element);
        const title = await element.$eval('.s-lc-c-evt-title a', (a) =>
          a.innerText.trim(),
        );
        const link = await element.$eval('.s-lc-c-evt-title a', (a) => a.href);
        const type = await element.$eval(
          '.label.label-info',
          (span: HTMLElement) => span.innerText.trim(),
        );
        const description = await element.$eval('.s-lc-c-evt-des', (el) => {
          const element = el as HTMLElement;
          return element.innerText.trim();
        });
        const date = await element.evaluate((el) => {
          const dt = Array.from(el.querySelectorAll('dt')).find((dt) =>
            dt.textContent.includes('Date:'),
          );
          return dt
            ? (dt.nextElementSibling as HTMLElement).innerText.trim()
            : null;
        });

        const cleanedDate = date.replace('Show more dates', '').trim();
        console.log('cleanedDate ===>>>>', cleanedDate);

        const formattedDate = moment(
          cleanedDate,
          'dddd, MMMM D, YYYY',
          true,
        ).format('YYYY-MM-DD');

        const eventDate = new Date(formattedDate);
        console.log('eventDate =====>>>>>', eventDate);
        const eventDateString = eventDate.toISOString().split('T')[0];
        console.log('eventDateString ====>>>>>', eventDateString);

        const time = await element.evaluate((el) => {
          const dt = Array.from(el.querySelectorAll('dt')).find((dt) =>
            dt.textContent.includes('Time:'),
          );
          return dt
            ? (dt.nextElementSibling as HTMLElement).innerText.trim()
            : null;
        });

        const location = await element.evaluate((el) => {
          const dt = Array.from(el.querySelectorAll('dt')).find((dt) =>
            dt.textContent.includes('Location:'),
          );
          return dt
            ? (dt.nextElementSibling as HTMLElement).innerText.trim()
            : null;
        });

        const allDates = [eventDateString];
        const dateWiseLinks = [];

        const futureDateLink = await element.$(
          'a[onclick^="return springyPublic.getFutureEventDates"]',
        );
        if (futureDateLink) {
          await futureDateLink.click();
          await page.waitForSelector(`#future_${link.split('/').pop()}`, {
            visible: true,
          });

          const futureDates = await element.$$(
            `#future_${link.split('/').pop()} a`,
          );
          for (const futureDate of futureDates) {
            const fDate = await futureDate.evaluate((a) => a.innerText.trim());
            const fLink = await futureDate.evaluate((a) => a.href);
            const formattedFutureDate = new Date(fDate)
              .toISOString()
              .split('T')[0];

            allDates.push(formattedFutureDate);
            dateWiseLinks.push({ date: formattedFutureDate, link: fLink });
          }
        } else {
          console.warn('Future date link not found for:', title);
        }

        const audienceLinks = await page.evaluate(() => {
          const audienceElement = [...document.querySelectorAll('dt')].find(
            (dt) => dt.textContent.includes('Audience:'),
          );
          if (!audienceElement) return [];
          const links = audienceElement.nextElementSibling.querySelectorAll(
            '.s-lc-event-category-link a',
          );
          return Array.from(links).map((link) => {
            if (link instanceof HTMLAnchorElement) {
              return {
                text: link.textContent,
                url: link.href,
              };
            }
            return { text: '', url: '' };
          });
        });

        const eventTypes = await element.$$eval('dt', (dtElements) => {
          const eventsByTypeDT = dtElements.find((dt) =>
            dt.innerText.includes('Events by Type:'),
          );
          if (eventsByTypeDT) {
            const ddElement = eventsByTypeDT.nextElementSibling;
            if (ddElement) {
              const anchors = ddElement.querySelectorAll(
                '.s-lc-event-category-link a',
              );
              return Array.from(anchors).map((a) =>
                (a as HTMLElement).innerText.trim(),
              );
            }
          }
          return [];
        });

        const imageElement = await element.$('.media-right a img');
        const image_url = imageElement
          ? await imageElement.getProperty('src').then((src) => src.jsonValue())
          : '';

        const registrationType = await element.evaluate((el) => {
          const dt = Array.from(el.querySelectorAll('dt')).find(
            (dt) => dt.textContent.trim() === 'Registration Type:',
          );
          return dt && dt.nextElementSibling instanceof HTMLElement
            ? (dt.nextElementSibling as HTMLElement).innerText.trim()
            : null;
        });
        const slug = await this.generateUniqueSlug(title);

        events.push({
          title,
          link,
          slug,
          description,
          date: eventDateString,
          allDates,
          time,
          location,
          audienceLinks,
          eventTypes,
          image_url,
          registrationType,
          type,
          date_wise_link: dateWiseLinks,
        });
        console.log('date_wise_link ===>>>>', dateWiseLinks);
      }

      console.log('Events:', events);
      await browser.close();

      const eventIdsToUpdate = [];

      for (let evt of events) {
        const Db = await this.eventlinkModel.findOne({
          event_link: evt.link,
          avalibility_dates: evt.date,
          source_id: new ObjectId(source_id),
        });
        if (Db) {
          console.log('Event link Already Created');
        } else {
          const Db = await this.eventlinkModel.create({
            event_link: evt.link,
            avalibility_dates: evt.allDates,
            title: evt.title,
            slug: evt.slug,
            venue: evt.seriesTitle,
            source: 'website hoboken public library',
            time: evt.time,
            description: evt.description,
            cityId: sourc.cityId,
            source_id: sourc._id,
            type: evt.type,
            events_type: evt.eventTypes,
            date_wise_link: evt.date_wise_link,
            image_url: evt.image_url,
            audiance: evt.audienceLinks,
            'location.name': evt.location,
            'location.fullAddress': evt.location,
          });
          await this.createAllEventLinkAndDetailForHobokenPublicLibrary(
            evt.link,
            Db._id,
            sourc._id,
            sourc.cityId,
          );
          await this.eventlinkModel.updateOne(
            { _id: Db._id },
            { $set: { is_event_detail: true } },
          );

          eventIdsToUpdate.push(Db._id.toString());
        }
      }

      if (eventIdsToUpdate.length > 0) {
        await this.updateEventsFriendly(eventIdsToUpdate);
        console.log(
          'updateEventsFriendly called with event IDs:',
          eventIdsToUpdate,
        );

        const eventsToCheck = await this.eventlinkModel.find({
          _id: { $in: eventIdsToUpdate },
        });

        for (const event of eventsToCheck) {
          if (!event.childFriendly && !event.familyFriendly) {
            await this.eventlinkModel.deleteOne({ _id: event._id });

            console.log(
              `Deleting event: ${event._id} as it's neither child nor family friendly`,
            );
            await this.eventModel.deleteOne({ event_link_id: event._id });
            console.log(
              `Deleted event from eventModel where event_link_id: ${event._id}`,
            );
          }
        }
      }

      return events;
    } catch (error) {
      console.error('Error scraping event data 222222:', error);
    }
  }

  async getEventDetailByIdForHobokenPublicLibrary(id: string): Promise<any> {
    try {
      const link = await this.eventlinkModel.findById({ _id: id });
      if (!link) {
        throw new HttpException(
          'Event link ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log('Event Link Found:', link);

      let eventDetails = await this.eventModel.findOne({
        event_link_id: link._id,
      });

      if (eventDetails) {
        console.log('Event Already Created');
        return eventDetails;
      }

      const url = link.event_link;
      let browser: puppeteer.Browser | undefined;
      let page: puppeteer.Page | undefined;

      try {
        browser = await puppeteer.launch({
          args: ['--no-sandbox'],
          ignoreHTTPSErrors: true,
          executablePath: '/usr/bin/chromium-browser',
        });

        page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        let eventDetails = await page.evaluate(() => {
          const title =
            document.querySelector('h1.media-heading')?.textContent?.trim() ||
            '';

          const description =
            document
              .querySelector('#s-lc-event-desc')
              ?.textContent?.trim()
              .replace(/(\n\s*)+/g, ' ') || '';

          const date =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('Date:'))
              ?.nextElementSibling?.textContent?.trim() || '';

          const time =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('Time:'))
              ?.nextElementSibling?.textContent?.trim() || '';

          const location =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('Location:'))
              ?.nextElementSibling?.textContent?.trim() || '';

          const library =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('BCCLS Library:'))
              ?.nextElementSibling?.textContent?.trim() || '';

          const categories = Array.from(document.querySelectorAll('dt')).find(
            (dt) => dt.textContent?.includes('Categories:'),
          )?.nextElementSibling
            ? Array.from(
                (
                  Array.from(document.querySelectorAll('dt')).find((dt) =>
                    dt.textContent?.includes('Categories:'),
                  )?.nextElementSibling as Element
                ).querySelectorAll('span.s-lc-event-category-link'),
              ).map((span) => ({
                text: span.textContent?.trim() || '',
                link: span.querySelector('a')?.getAttribute('href') || '',
              }))
            : [];

          const imageURL =
            document
              .querySelector('.media-left img.s-lc-event-fi')
              ?.getAttribute('src') || '';

          const organizerSection = document.querySelector(
            '#s-lc-page-column-2 .s-lc-box-container',
          );

          const organizerName =
            organizerSection
              ?.querySelector('.s-lc-profile-name')
              ?.textContent?.trim() || '';

          const organizerThumbnail =
            organizerSection
              ?.querySelector('.s-lc-profile-image img')
              ?.getAttribute('src') || '';

          const organizerWebsite =
            organizerSection
              ?.querySelector('.s-lc-profile-text a')
              ?.textContent?.trim() || '';

          const organizerUrl =
            document
              .querySelector('#s-lc-page-column-2 .s-lc-box-title a')
              ?.getAttribute('href') || '';

          return {
            title,
            description,
            date,
            time,
            location,
            library,
            categories,
            imageURL,
            organizer: {
              name: organizerName,
              url: 'https://hobokenlibrary.org/',
              orgWebsite: organizerWebsite,
              thumbnail: organizerThumbnail,
            },
            // organizer: {
            //   name: 'Hoboken Library',
            //   url: 'https://hobokenlibrary.org/',
            //   orgWebsite: 'https://https://hobokenlibrary.org//',
            //   thumbnail: 'https://libapps.s3.amazonaws.com/accounts/194729/profiles/192220/Master_logo_green_background.png',
            // },
          };
        });

        const formattedDate = moment(
          eventDetails.date,
          'dddd, MMMM D, YYYY',
        ).format('YYYY-MM-DD');
        console.log('Scraped Event Details:', eventDetails);

        let latitude, longitude;
        if (eventDetails.location) {
          try {
            const geocodeResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: eventDetails.location,
                  key: API_KEY,
                },
              },
            );

            if (geocodeResponse.data.status === 'OK') {
              const location =
                geocodeResponse.data.results[0].geometry.location;
              latitude = location.lat;
              longitude = location.lng;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            } else {
              console.log('Geocoding error:', geocodeResponse.data.status);
            }
          } catch (error) {
            console.error('Error fetching geocoding data:', error.message);
          }
        }

        const newEvent = await this.eventModel.create({
          title: eventDetails.title,
          venue: eventDetails.location,
          time: eventDetails.time,
          event_link: link.event_link,
          image_url: eventDetails.imageURL || 'No Image Available',
          event_city: 'Hoboken',
          description: eventDetails.description,
          location: {
            name: eventDetails.location || 'Unknown Location',
            fullAddress: eventDetails.location || 'No Address Available',
          },
          event_date: {
            display: formattedDate,
            datetime: eventDetails.time,
          },
          date: formattedDate,
          cityId: link.cityId,
          event_link_id: link._id,
          city: link.cityId.city,
          latitude,
          longitude,
          organizer: eventDetails.organizer,
          categories: eventDetails.categories || [],
          providerUrl: 'https://hobokenlibrary.org/',
        });

        link.is_event_detail = true;
        await link.save();

        return newEvent;
      } catch (error) {
        console.error('Error fetching event details by ID:', error);
        throw new HttpException(
          'Failed to fetch event details: ' +
            (error.message || 'Unknown error'),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } finally {
        if (page) await page.close();
        if (browser) await browser.close();
      }
    } catch (error) {
      console.error('Error in outer try block:', error);
      throw new HttpException(
        'Unexpected error: ' + (error.message || 'Unknown error'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAllEventDetailForHobokenPublicLibrary(
    source_id: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    try {
      console.log('source_id:', source_id);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      const eventLinks = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        avalibility_dates: { $elemMatch: { $gte: startDate, $lte: endDate } },
        source: 'website hoboken public library',
        is_event_detail: false,
      });

      if (eventLinks.length === 0) {
        console.warn(
          'No event links found for the specified city and date range',
        );
        return {
          message: 'No event links found for the specified city and date range',
          events: [],
        };
      }

      console.log('Event Links Found:', eventLinks);

      for (const link of eventLinks) {
        const existingEvent = await this.eventModel.findOne({
          event_link_id: link._id,
        });
        if (existingEvent) {
          console.log('Event Already Created');
          continue;
        }

        const url = link.event_link;
        let browser;
        let page;

        try {
          browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            ignoreHTTPSErrors: true,
            executablePath: '/usr/bin/chromium-browser',
          });
          page = await browser.newPage();
          await page.goto(url, { waitUntil: 'networkidle2' });

          const eventDetails = await page.evaluate(() => {
            const title =
              document.querySelector('h1.media-heading')?.textContent?.trim() ||
              '';
            const description =
              document
                .querySelector('#s-lc-event-desc')
                ?.textContent?.trim()
                .replace(/(\n\s*)+/g, ' ') || '';
            const date =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('Date:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const time =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('Time:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const location =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('Location:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const library =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('BCCLS Library:'))
                ?.nextElementSibling?.textContent?.trim() || '';

            const categories = Array.from(document.querySelectorAll('dt')).find(
              (dt) => dt.textContent?.includes('Categories:'),
            )?.nextElementSibling
              ? Array.from(
                  (
                    Array.from(document.querySelectorAll('dt')).find((dt) =>
                      dt.textContent?.includes('Categories:'),
                    )?.nextElementSibling as Element
                  ).querySelectorAll('span.s-lc-event-category-link'),
                ).map((span) => ({
                  text: span.textContent?.trim() || '',
                  link: span.querySelector('a')?.getAttribute('href') || '',
                }))
              : [];

            const imageURL =
              document
                .querySelector('.media-left img.s-lc-event-fi')
                ?.getAttribute('src') || '';

            const organizerSection = document.querySelector(
              '#s-lc-page-column-2 .s-lc-box-container',
            );

            const organizerName =
              organizerSection
                ?.querySelector('.s-lc-profile-name')
                ?.textContent?.trim() || '';

            const organizerThumbnail =
              organizerSection
                ?.querySelector('.s-lc-profile-image img')
                ?.getAttribute('src') || '';

            const organizerWebsite =
              organizerSection
                ?.querySelector('.s-lc-profile-text a')
                ?.textContent?.trim() || '';

            const organizerUrl =
              document
                .querySelector('#s-lc-page-column-2 .s-lc-box-title a')
                ?.getAttribute('href') || '';

            return {
              title,
              description,
              date,
              time,
              location,
              library,
              categories,
              imageURL,
              organizer: {
                name: organizerName,
                url: 'https://hobokenlibrary.org/',
                orgWebsite: organizerWebsite,
                thumbnail: organizerThumbnail,
              },
            };
          });

          const formattedDate = moment(
            eventDetails.date,
            'dddd, MMMM D, YYYY',
          ).format('YYYY-MM-DD');
          console.log('Event Details:', eventDetails);

          let latitude, longitude;
          if (eventDetails.location) {
            try {
              const geocodeResponse = await axios.get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                {
                  params: {
                    address: eventDetails.location,
                    key: API_KEY,
                  },
                },
              );

              if (geocodeResponse.data.status === 'OK') {
                const location =
                  geocodeResponse.data.results[0].geometry.location;
                latitude = location.lat;
                longitude = location.lng;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
              } else {
                console.log('Geocoding error:', geocodeResponse.data.status);
              }
            } catch (error) {
              console.error('Error fetching geocoding data:', error.message);
            }
          }

          await this.eventModel.create({
            title: eventDetails.title,
            venue: eventDetails.title,
            time: eventDetails.time,
            event_link: link.event_link,
            event_categories: eventDetails.categories.map((cat) => cat.text),
            image_url: eventDetails.imageURL,
            event_city: 'Hoboken',
            description: eventDetails.description,
            location: {
              name: eventDetails.location,
              fullAddress: eventDetails.location,
            },
            event_date: {
              display: formattedDate,
              datetime: eventDetails.time,
            },
            date: formattedDate,
            city: 'Hoboken',
            cityId: link.cityId,
            event_link_id: link._id,
            latitude,
            longitude,
            organizer: eventDetails.organizer,
            providerUrl: 'https://hobokenlibrary.org/',
          });

          link.is_event_detail = true;
          await link.save();
        } finally {
          if (page) await page.close();
          if (browser) await browser.close();
        }
      }

      return 'Event Detail Created Successfully';
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAllEventDetailForHobokenPublicLibrary(
    source_id: string,
  ): Promise<any> {
    try {
      console.log('source_id:', source_id);

      const eventLinks = await this.eventlinkModel.find({
        source_id: new ObjectId(source_id),
        source: 'website hoboken public library',
        is_event_detail: true,
      });

      // if (eventLinks.length === 0) {
      //   console.warn(
      //     'No event links found for the specified city and date range',
      //   );
      //   throw new HttpException(
      //     'No event links found for the specified city and date range',
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      console.log('Event Links Found:', eventLinks);

      for (const link of eventLinks) {
        const existingEvent = await this.eventModel.updateOne({
          event_link_id: link._id,
        });

        const url = link.event_link;
        let browser;
        let page;

        try {
          browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            ignoreHTTPSErrors: true,
            executablePath: '/usr/bin/chromium-browser',
          });
          page = await browser.newPage();
          await page.goto(url, { waitUntil: 'networkidle2' });

          const eventDetails = await page.evaluate(() => {
            const title =
              document.querySelector('h1.media-heading')?.textContent?.trim() ||
              '';
            const description =
              document
                .querySelector('#s-lc-event-desc')
                ?.textContent?.trim()
                .replace(/(\n\s*)+/g, ' ') || '';
            const date =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('Date:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const time =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('Time:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const location =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('Location:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const library =
              Array.from(document.querySelectorAll('dt'))
                .find((dt) => dt.textContent?.includes('BCCLS Library:'))
                ?.nextElementSibling?.textContent?.trim() || '';

            const categories = Array.from(document.querySelectorAll('dt')).find(
              (dt) => dt.textContent?.includes('Categories:'),
            )?.nextElementSibling
              ? Array.from(
                  (
                    Array.from(document.querySelectorAll('dt')).find((dt) =>
                      dt.textContent?.includes('Categories:'),
                    )?.nextElementSibling as Element
                  ).querySelectorAll('span.s-lc-event-category-link'),
                ).map((span) => ({
                  text: span.textContent?.trim() || '',
                  link: span.querySelector('a')?.getAttribute('href') || '',
                }))
              : [];

            const imageURL =
              document
                .querySelector('.media-left img.s-lc-event-fi')
                ?.getAttribute('src') || '';

            const organizerSection = document.querySelector(
              '#s-lc-page-column-2 .s-lc-box-container',
            );

            const organizerName =
              organizerSection
                ?.querySelector('.s-lc-profile-name')
                ?.textContent?.trim() || '';

            const organizerThumbnail =
              organizerSection
                ?.querySelector('.s-lc-profile-image img')
                ?.getAttribute('src') || '';

            const organizerWebsite =
              organizerSection
                ?.querySelector('.s-lc-profile-text a')
                ?.textContent?.trim() || '';

            const organizerUrl =
              document
                .querySelector('#s-lc-page-column-2 .s-lc-box-title a')
                ?.getAttribute('href') || '';

            return {
              title,
              description,
              date,
              time,
              location,
              library,
              categories,
              imageURL,
              organizer: {
                name: organizerName,
                url: 'https://hobokenlibrary.org/',
                orgWebsite: organizerWebsite,
                thumbnail: organizerThumbnail,
              },
            };
          });

          const formattedDate = moment(
            eventDetails.date,
            'dddd, MMMM D, YYYY',
          ).format('YYYY-MM-DD');
          console.log('Event Details:', eventDetails);

          let latitude, longitude;
          if (eventDetails.location) {
            try {
              const geocodeResponse = await axios.get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                {
                  params: {
                    address: eventDetails.location,
                    key: API_KEY,
                  },
                },
              );

              if (geocodeResponse.data.status === 'OK') {
                const location =
                  geocodeResponse.data.results[0].geometry.location;
                latitude = location.lat;
                longitude = location.lng;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
              } else {
                console.log('Geocoding error:', geocodeResponse.data.status);
              }
            } catch (error) {
              console.error('Error fetching geocoding data:', error.message);
            }
          }

          await this.eventModel.updateOne({
            title: eventDetails.title,
            venue: eventDetails.title,
            time: eventDetails.time,
            event_link: link.event_link,
            event_categories: eventDetails.categories.map((cat) => cat.text),
            image_url: eventDetails.imageURL,
            event_city: 'Hoboken',
            description: eventDetails.description,
            location: {
              name: eventDetails.location,
              fullAddress: eventDetails.location,
            },
            event_date: {
              display: formattedDate,
              datetime: eventDetails.time,
            },
            date: formattedDate,
            city: 'Hoboken',
            cityId: link.cityId,
            event_link_id: link._id,
            latitude,
            longitude,
            organizer: eventDetails.organizer,
            providerUrl: 'https://hobokenlibrary.org/',
          });

          link.is_event_detail = true;
          await link.save();
        } finally {
          if (page) await page.close();
          if (browser) await browser.close();
        }
      }

      return 'Event Detail Created Successfully';
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async filterEventBySourceAndDateWise(
    status: string,
    start_date: string,
    end_date: string,
    source_id: string,
    city_id: string,
    name: string,
    event_detail: string,
    is_published: string,
    page_number: number,
    page_size: number,
  ) {
    const skip = (page_number - 1) * page_size;

    let matchQueries = [];

    let match = { is_deleted: false };

    if (status) {
      match['status'] = status;
    }

    if (start_date || end_date) {
      let dateFilter = {};
      if (start_date) {
        dateFilter['$gte'] = new Date(start_date);
      }
      if (end_date) {
        dateFilter['$lte'] = new Date(end_date);
      }
      match['avalibility_dates'] = dateFilter;
    }

    if (source_id) {
      match['source_id'] = new ObjectId(source_id);
    }

    if (city_id) {
      match['cityId'] = new ObjectId(city_id);
    }

    if (event_detail) {
      if (event_detail == 'true') {
        match['is_event_detail'] = true;
      } else if (event_detail == 'false') {
        match['is_event_detail'] = false;
      }
    }

    if (is_published) {
      if (is_published == 'true') {
        match['is_published'] = true;
      } else if (is_published == 'false') {
        match['is_published'] = false;
      }
    }

    if (name) {
      matchQueries = [
        {
          $match: {
            $or: [
              { notes: { $regex: '.*' + name + '.*', $options: 'i' } },
              { admin_notes: { $regex: '.*' + name + '.*', $options: 'i' } },
              {
                proof_reader_notes: {
                  $regex: '.*' + name + '.*',
                  $options: 'i',
                },
              },
              { title: { $regex: '.*' + name + '.*', $options: 'i' } },
            ],
          },
        },
      ];
    }

    const data = await this.eventlinkModel.aggregate([
      ...matchQueries,
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'event_link_id',
          as: 'event_link_id',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'subjects',
          foreignField: '_id',
          as: 'subjects',
        },
      },
      // {
      //   $sort: { avalibility_dates: 1 },
      // },
      {
        $facet: {
          result: [
            { $sort: { createdOn: -1 } },
            { $skip: skip },
            { $limit: page_size },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async updateEventlinkStatusById(id: string, status: string) {
    console.log('id ===>>>', id);
    console.log('status ===>>>', status);
    const subjects = await this.eventlinkModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true },
    );

    console.log('subjects ===>>>', subjects);

    return subjects;
  }

  async addNewFieldsInEventLinkScript() {
    try {
      const events = await this.eventlinkModel.find();

      if (!events || events.length === 0) {
        return 'No Event Found';
      }

      let count = 0;

      for (let event of events) {
        let sourceId;
        let cty;

        const source1 = new ObjectId('672870307c7c60fb88405388');
        const source2 = new ObjectId('67287bfa7c7c60fb884053b7');
        const source3 = new ObjectId('67287c207c7c60fb884053b9');
        const source5 = new ObjectId('67287c427c7c60fb884053bb');
        const source6 = new ObjectId('67287c6a7c7c60fb884053bd');
        const source7 = new ObjectId('67287c7b7c7c60fb884053bf');

        if (event.source === 'website eventbrite') {
          sourceId = source1;
          cty = await this.event_sourceModel.findOne({ _id: source1 });
        } else if (event.source === 'website Jersey City Culture') {
          sourceId = source2;
          cty = await this.event_sourceModel.findOne({ _id: source2 });
        } else if (event.source === 'website Jersey City Free Public Library') {
          sourceId = source3;
          cty = await this.event_sourceModel.findOne({ _id: source3 });
        } else if (event.source === 'website Hoboken Library') {
          sourceId = source5;
          cty = await this.event_sourceModel.findOne({ _id: source5 });
        } else if (event.source === 'website hobokenmuseum') {
          sourceId = source6;
          cty = await this.event_sourceModel.findOne({ _id: source6 });
        } else if (event.source === 'website hoboken public library') {
          sourceId = source7;
          cty = await this.event_sourceModel.findOne({ _id: source7 });
        }

        const cityId = cty ? cty.cityId : null;

        const updatedEvent = await this.eventlinkModel.findOneAndUpdate(
          { _id: event._id },
          {
            $set: {
              status: 'unverified',
              is_published: false,
              source_id: new ObjectId(sourceId),
              cityId: new ObjectId(cityId),
            },
          },
          { new: true },
        );

        console.log('Updated Event ===>>>', updatedEvent);
        count++;
      }

      console.log(`${count} events updated successfully`);
      return `${count} events updated successfully`;
    } catch (error) {
      console.log(error);
      throw error.message || error;
    }
  }

  async removeEventsByDateSourceAndCity(
    cityId: string,
    sourceId: string,
    fromDate: string,
    toDate: string,
  ) {
    try {
      const events = await this.eventlinkModel.aggregate([
        {
          $match: {
            avalibility_dates: { $elemMatch: { $gte: fromDate, $lte: toDate } },
            source_id: new ObjectId(sourceId),
            cityId: new ObjectId(cityId),
          },
        },
      ]);

      for (let evnts of events) {
        console.log('evnts._id ====>>>>>>', evnts._id);
        try {
          const devnt = await this.eventModel.findOneAndDelete({
            event_link_id: new ObjectId(evnts._id),
          });
        } catch (err) {
          console.log('err ===>>>>>', err);
        }

        const devnt_link = await this.eventlinkModel.findByIdAndDelete({
          _id: new ObjectId(evnts._id),
        });
      }

      return events.length;
    } catch (error) {
      console.log(error);
      throw error.message || error;
    }
  }

  async scrapeEvent_link_jc_free_public_library(
    source_id: string,
    startDate: string,
  ) {
    console.log('city: ', source_id);
    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full cty: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'nj--union-city';
        break;
      case 'Union City':
        ctyId = 'in--union-city';
        break;
      case 'West New York':
        ctyId = 'united-states';
        break;
      case 'Guttenberg':
        ctyId = 'nj--guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'nj--bayonne';
        break;
      case 'Jersey City':
        ctyId = 'united-states--new-jersey';
        break;
      case 'Phoenix':
        ctyId = 'az--phoenix';
        break;
      case 'Secaucus':
        ctyId = 'nj--secaucus';
        break;
      case 'North Bergen':
        ctyId = 'united-states';
        break;
      case 'Hoboken':
        ctyId = 'nj--jersey-city';
        break;
      default:
        throw new Error('Unsupported city');
    }

    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);
    const baseUrl = `https://jclibrary.libcal.com/calendars?cid=-1&t=g&d=${startDate}&cal=-1&audience=8475&inc=0`;
    console.log('baseUrl ==========>>>>>>>>>', baseUrl);

    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/usr/bin/chromium-browser',
      });
      const page = await browser.newPage();
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 120000 });

      const noEventsScheduled = await page.evaluate(() => {
        const noEventsElement = document.querySelector(
          '.alert.alert-info.s-lc-c-s-nores',
        );
        return (
          noEventsElement &&
          noEventsElement.textContent.includes('No events are scheduled')
        );
      });

      if (noEventsScheduled) {
        console.log(`No events are scheduled for ${startDate}.`);
        await browser.close();
        return {
          success: false,
          message: `No events found for date ${startDate}`,
        };
      }

      const allEvents = [];

      const scrapeCurrentPage = async () => {
        await page.waitForSelector('.s-lc-eventcard', { timeout: 60000 });

        const events = await page.evaluate(
          (cityId, sourceId) => {
            const eventCards = Array.from(
              document.querySelectorAll('.s-lc-eventcard'),
            );
            return eventCards.map((card) => {
              const title =
                card
                  .querySelector('.s-lc-eventcard-title a')
                  ?.textContent?.trim() || '';
              const eventLink =
                card
                  .querySelector('.s-lc-eventcard-title a')
                  ?.getAttribute('href') || '';
              const description =
                card
                  .querySelector('.s-lc-eventcard-description')
                  ?.textContent?.trim() || '';
              const dateMonth =
                card.querySelector('.s-lc-evt-date-m')?.textContent?.trim() ||
                '';
              const dateDay =
                card.querySelector('.s-lc-evt-date-d')?.textContent?.trim() ||
                '';

              const audianceTags = Array.from(
                card.querySelectorAll(
                  '.s-lc-eventcard-tags .s-lc-eventcard-tag',
                ),
              ).map((tag) => {
                const tagText = tag
                  .querySelector('.s-lc-event-category-link')
                  ?.textContent?.trim();
                return tagText ? tagText : '';
              });

              return {
                title,
                event_link: eventLink,
                description,
                event_date: {
                  display: `${dateMonth} ${dateDay}`,
                  datetime: '',
                },
                city: 'Jersey City,NJ,USA',
                cityId: cityId,
                source_id: sourceId,
                source: 'website Jersey City Free Public Library',
                avalibility_dates: [],
                audiance: audianceTags,
              };
            });
          },
          sour.cityId,
          source_id,
        );

        events.forEach((event) => {
          const [month, day] = event.event_date.display.split(' ');
          event.event_date.datetime = this.formatEventDate(month, day);

          const eventDate = new Date(event.event_date.datetime);
          const formattedEventDate = `${eventDate.getFullYear()}-${String(
            eventDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;

          event.avalibility_dates = [formattedEventDate];
        });

        allEvents.push(...events);
      };

      await scrapeCurrentPage();

      const uniqueEvents = [];
      for (const event of allEvents) {
        const existingEvent = await this.eventlinkModel.findOne({
          title: event.title,
          event_link: event.event_link,
        });

        if (!existingEvent) {
          uniqueEvents.push(event);
        }
      }

      if (uniqueEvents.length > 0) {
        await this.eventlinkModel.insertMany(uniqueEvents);
        console.log(
          `${uniqueEvents.length} unique event(s) scraped and saved successfully.`,
        );
        await new Promise((resolve) => setTimeout(resolve, 120000));
      } else {
        console.log('No new events to add.');
      }

      await browser.close();

      return {
        success: true,
        message: `${uniqueEvents.length} new event(s) saved successfully.`,
      };
    } catch (error) {
      console.error('Error scraping event data:', error);
      throw new Error('Failed to scrape event data: ' + error.message);
    }
  }

  async createEventLinkFromJerseyCityCultureBySourceAndDate(
    source_id: string,
    date: string,
  ) {
    try {
      const source = await this.event_sourceModel.findById({
        _id: new ObjectId(source_id),
      });
      if (!source) {
        return 'Event Source Not Found !!!!';
      }
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          'http://127.0.0.1:8000/scraping-events-link-jerseycityculture/',
          {
            params: { date },
          },
        ),
      );
      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response structure from the scraping service');
      }

      const res = response.data.data;

      for (const rs of res) {
        // console.log('rs ======>>>>>>>>', rs);
        console.log('title ====>>>>>>', rs.Title);
        const dsa = await this.eventlinkModel.findOne({
          avalibility_dates: rs.Date,
          source_id: source_id,
          event_link: rs.Event_Link,
        });
        if (dsa) {
          console.log('Event Link Already Created');
        } else {
          const data = await new this.eventlinkModel({
            title: rs.Title,
            description: rs.Description,
            'location.name': rs.CityName,
            'location.fullAddress': rs.FullAddress,
            event_link: rs.Event_Link,
            time: rs.Time,
            avalibility_dates: rs.Date,
            venue: rs.Date_and_time,
            source_id: source_id,
            cityId: source.cityId,
          }).save();
        }
      }
      return res;
    } catch (error) {
      console.log(error);
      throw error.response;
    }
  }
  async scrap_event_link_hoboken_city_library(source_id, eventDate) {
    try {
      console.log('City ID: ', source_id);
      const sour = await this.event_sourceModel.findOne({
        _id: new mongoose.Types.ObjectId(source_id),
      });

      if (!sour) {
        throw new Error('Event source not found');
      }

      const cty = await this.citymanagementModel.findOne({
        _id: new mongoose.Types.ObjectId(sour.cityId),
      });
      if (!cty) {
        throw new Error('City not found');
      }

      const url = `https://hobokenlibrary.libnet.info/eeventcaldata?event_type=0&req=%7B%22private%22%3Afalse%2C%22date%22%3A%22${eventDate}%22%2C%22days%22%3A1%2C%22locations%22%3A%5B%5D%2C%22ages%22%3A%5B%5D%2C%22types%22%3A%5B%5D%7D`;
      console.log('URL: ', url);

      const response = await axios.get(url);
      if (response.data.length <= 0) {
        console.log('No events available for this date:', eventDate);
        return 'No events available for these dates';
      }

      const data = response.data;

      // Loop through each event and process it
      for (let evt of data) {
        const existingEvent = await this.eventlinkModel.findOne({
          event_link: evt.url,
        });

        if (!existingEvent) {
          console.log(`New event found: ${evt.title}`);
          await this.eventlinkModel.create({
            title: `${evt.title}${evt.sub_title}`,
            event_link: evt.url,
            venue: `${evt.datestring}:${evt.start_time}-${evt.end_time}`,
            ageGroup: evt.ages,
            events_type: evt.event_type,
            description: evt.description,
            image_url: `https://static.libnet.info/images/events/hobokenlibrary/${evt.event_image}`,
            avalibility_dates: evt.event_start.split(' ')[0],
            location: {
              name: evt.location,
              fullAddress: evt.library,
            },
            event_date: {
              start: evt.event_start,
              end: evt.event_end,
            },
            source_id: new mongoose.Types.ObjectId(sour._id),
            cityId: new mongoose.Types.ObjectId(sour.cityId),
          });
        } else {
          console.log(`Duplicate entry found for event link: ${evt.url}`);
        }
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error executing scrap_event_link_hoboken_city_library:',
        error.message,
      );
      throw error;
    }
  }

  async cronToCreateNextEvents_hoboken_city_library() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('67287c427c7c60fb884053bb'),
      );
      const ctyId = city._id.toString();

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ avalibility_dates: -1 })
        .limit(1);

      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastAvailableDate = new Date(
        latestEvent[0].avalibility_dates[
          latestEvent[0].avalibility_dates.length - 1
        ],
      );

      console.log('Last available date:', lastAvailableDate);

      const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
        const nextDate = new Date(lastAvailableDate);
        nextDate.setDate(lastAvailableDate.getDate() + i + 1);
        return nextDate.toISOString().split('T')[0];
      });

      console.log('Fetching events for the next 15 days:', nextSevenDays);

      for (const eventDate of nextSevenDays) {
        const startDate = eventDate;
        const endDate = eventDate;

        console.log(`Calling getEvents for date: ${startDate} to ${endDate}`);

        try {
          const eventFound = await this.getEvents(ctyId, startDate, endDate);

          if (!eventFound) {
            console.log(`No events found for date: ${startDate}`);
          } else {
            console.log(`Events found for date: ${startDate}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 15000));
        } catch (error) {
          console.error(
            `Error fetching events for date: ${startDate}`,
            error.message,
          );
        }
      }
    } catch (error) {
      console.error(
        'Error in cronToCreateNextEvents_hoboken_city_library:',
        error.message,
      );
    }
  }

  async startCron_hoboken_city_library() {
    try {
      if (process.env.NODE_ENV === 'do') {
        this.cronJobEventHobokenLibrary = cron.schedule(
          '30 11 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEvents_hoboken_city_library();
              console.log('cronToCreateNextEvents completed.');
            } catch (error) {
              console.error(
                'Error executing cronToCreateNextEvents:',
                error.message,
              );
            }
          },
          null,
          true,
          'Asia/Kolkata',
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error starting cron job:', error.message);
    }
  }

  async getEventByIdOrSlug(id: string) {
    let match = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      match['_id'] = new mongoose.Types.ObjectId(id);
    } else {
      match['slug'] = id;
    }

    const data = await this.eventlinkModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      {
        $addFields: {
          cityId: { $arrayElemAt: ['$cityId', 0] },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'event_link_id',
          as: 'event_link_id',
        },
      },
      {
        $addFields: {
          event_link_id: { $arrayElemAt: ['$event_link_id', 0] },
        },
      },
    ]);

    return data.length > 0 ? data[0] : null;
  }

  async cronToCreateNextEvents_hoboken_public_library() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('67287c6a7c7c60fb884053bd'),
      );
      const ctyId = city._id.toString();

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ createdOn: -1 })
        .limit(1);

      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastScrapedDateStr = latestEvent[0].avalibility_dates[0];
      const lastScrapedDate = new Date(lastScrapedDateStr);
      console.log('Last Scraped Event Date:', lastScrapedDate);

      const targetDays = 10; // Number of days to generate starting from the next day
      const eventDates = Array.from({ length: targetDays }, (_, i) => {
        const nextDate = new Date(lastScrapedDate);
        nextDate.setDate(lastScrapedDate.getDate() + i + 1); // Start from the day after lastScrapedDate
        return nextDate.toISOString().split('T')[0];
      });

      console.log('Generated Event Dates:', eventDates);

      for (const eventDate of eventDates) {
        console.log('Processing event for date:', eventDate);
        try {
          const eventLinks =
            await this.getEventLinksHobokenForHobokenPublicLibrary(
              eventDate,
              ctyId,
            );

          if (eventLinks && eventLinks.length > 0) {
            console.log(`Found ${eventLinks.length} events for ${eventDate}`);
          } else {
            console.log(`No events found for ${eventDate}`);
          }
        } catch (err) {
          console.error(`Error fetching events for ${eventDate}:`, err.message);
        }

        // Delay between each API call (2 minutes)
        await new Promise((resolve) => setTimeout(resolve, 12000));
      }
    } catch (error) {
      console.error(
        'Error in cronToCreateNextEvents_hoboken_public_library:',
        error.message,
      );
    }
  }

  async startCron_hoboken_public_library() {
    try {
      if (process.env.NODE_ENV === 'do') {
        this.cronJobEventHobokenPublicLibrary = cron.schedule(
          '30 12 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEvents_hoboken_public_library();
              console.log('cronToCreateNextEvents completed.');
              this.cronJobEventHobokenPublicLibrary.stop();
              console.log('Cron job stopped.');
            } catch (error) {
              console.error(
                'Error executing cronToCreateNextEvents:',
                error.message,
              );
            }
          },
          { scheduled: true, timezone: 'Asia/Kolkata' },
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error starting cron job:', error.message);
    }
  }

  async create_event_link_jersey_city_culture(source_id: string, date: string) {
    const source = await this.event_sourceModel.findById(source_id);
    if (!source) return 'Event Source Not Found !!!!';

    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/usr/bin/chromium-browser',
      });
      let url = `https://www.jerseycityculture.org/events/category/kids/${date}/`;
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

      const events = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('.tribe-events-calendar-day__event'),
        ).map((event) => {
          const titleElement = event.querySelector(
            '.tribe-events-calendar-day__event-title',
          );
          const title = titleElement
            ? (titleElement as HTMLElement).innerText.trim()
            : 'no info';
          const linkElement = event.querySelector(
            '.tribe-events-calendar-day__event-title a',
          );
          const link = linkElement
            ? (linkElement as HTMLAnchorElement)?.href
            : 'no info';
          const timeElement = event.querySelector(
            '.tribe-events-calendar-day__event-datetime',
          );
          const time = timeElement
            ? (timeElement as HTMLElement).innerText.trim()
            : 'no info';
          const modifiedTime = time ? time.split(' @ ')[1] || time : 'no info';
          const locationElement = event.querySelector(
            '.tribe-events-calendar-day__event-venue',
          );
          const location = locationElement
            ? (locationElement as HTMLElement)?.innerText.trim()
            : 'no info';
          const descriptionElement = event.querySelector(
            '.tribe-events-calendar-day__event-description',
          );
          const description = descriptionElement
            ? (descriptionElement as HTMLElement)?.innerText.trim()
            : 'no info';
          const dateElement = event
            .closest('.tribe-events-calendar-day')
            ?.querySelector('.tribe-events-calendar-day__time-separator-text')
            ?.getAttribute('datetime');
          const date = dateElement || 'no info';
          const venueElement =
            event
              .querySelector('.tribe-events-calendar-day__event-datetime')
              ?.getAttribute('datetime') || 'no info';
          const venue = venueElement || 'no info';
          const priceElement = event.querySelector(
            '.tribe-events-c-small-cta__price',
          );
          const price = priceElement
            ? (priceElement as HTMLElement)?.innerText.trim()
            : 'no info';
          const imageUrl =
            event
              .querySelector(
                '.tribe-events-calendar-day__event-featured-image-wrapper a img',
              )
              ?.getAttribute('src') || 'no info';

          return {
            title,
            link,
            time: modifiedTime,
            location,
            description,
            date: venue,
            venue: time,
            price,
            imageUrl,
          };
        });
      });

      console.log(events);

      const eventIds: string[] = [];
      for (const event of events) {
        const slug = await this.generateUniqueSlug(event.title);
        const Db = await this.eventlinkModel.findOne({
          event_link: event.link,
          source_id: new ObjectId(source_id),
        });
        if (Db) {
          console.log('Event link Already Created');
        } else if (!Db) {
          const Db = await this.eventlinkModel.create({
            event_link: event.link,
            avalibility_dates: event.date,
            title: event.title,
            slug: slug,
            venue: event.venue,
            source: 'website jersey city culture',
            time: event.time,
            description: event.description,
            cityId: source.cityId,
            source_id: source._id,
            type: 'no info',
            ageGroup: 'kids',
            events_type: 'no info',
            image_url: event.imageUrl,
            'location.name': event.location,
            'location.fullAddress': event.location,
          });
          eventIds.push(Db._id.toString());

          await this.create_event_link_and_detail_jersey_city_culture(
            event.link,
            Db._id,
            source._id,
            source.cityId,
          );
        }
      }

      if (eventIds.length > 0) {
        await this.updateEventsFriendly(eventIds);

        for (const eventId of eventIds) {
          const event = await this.eventlinkModel.findById(eventId);
          if (
            event &&
            event.childFriendly === false &&
            event.familyFriendly === false
          ) {
            await this.eventlinkModel.deleteOne({ _id: eventId });

            console.log(
              `Deleting event ${eventId} - Not child/family friendly`,
            );
            await this.eventModel.deleteOne({ event_link_id: eventId });
            console.log(
              `Deleted event from eventModel where event_link_id: ${eventId}`,
            );
          }
        }
      }
      return events;
    } catch (error) {
      console.error('Error starting cron job:', error.message);
    }
  }

  async getLatLngByAddress(address: string) {
    let Lat, Lng;
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address: address,
            key: API_KEY,
          },
        },
      );
      if (response.data.status === 'OK') {
        Lat = response.data.results[0].geometry.location.lat;
        Lng = response.data.results[0].geometry.location.lng;
        console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
        return { lat: Lat, lng: Lng };
      } else {
        console.log('Geocoding API error:', response.data.status);
      }
    } catch (error) {
      console.error('Error creating provider:', error);
    }
  }

  async create_event_detail_jersey_city_culture(
    source_id: string,
    Fromdate: string,
    Todate: string,
  ) {
    try {
      let Lat, Lng;
      const provider = await this.eventlinkModel.find({
        avalibility_dates: { $elemMatch: { $gte: Fromdate, $lte: Todate } },
        source_id: new ObjectId(source_id),
      });
      // console.log('provider', provider);
      for (const item of provider) {
        if (item.location.fullAddress) {
          console.log(
            'provider.location.fullAddress ===>>>>>',
            item.location.fullAddress,
          );
          // const addr = await this.getLatLngByAddress(provider.location.fullAddress);
          // console.log('addr ===>>>>>',addr)
          try {
            const response = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: item.location.fullAddress,
                  key: API_KEY,
                },
              },
            );
            if (response.data.status === 'OK') {
              Lat = response.data.results[0].geometry.location.lat;
              Lng = response.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
              // return { lat: Lat, lng: Lng };
            } else {
              console.log('Geocoding API error:', response.data.status);
            }
          } catch (error) {
            console.error('Error creating provider:', error);
            // throw error;
          }
        }
        const response: AxiosResponse = await firstValueFrom(
          this.httpService.get('http://127.0.0.1:8000/scraping-urlss/', {
            params: { url: item.event_link },
          }),
        );

        if (!response || !response.data || !response.data.data) {
          throw new Error(
            'Invalid response structure from the scraping service',
          );
        }
        // const dta1 = await this.getProviderWebsiteData(url);
        const dta = response.data.data;
        console.log('dta ===>>>>>', dta[0].Title);
        console.log('dta ===>>>>>', dta.title_text);
        // return dta;
        if (dta.length > 0) {
          const dtail = await this.eventModel.findOne({
            event_link_id: item._id,
            is_event_detail: false,
          });
          if (dtail) {
            console.log('Event Already Created');
          }
          if (!dtail) {
            const newEvent = await this.eventModel.create({
              title: dta[0].Title,
              description: dta[0].Description,
              imageUrl: dta[0].Image,
              time: dta[0].Detail_Time,
              date: dta[0].Detail_Date,
              price: dta[0].Detail_Cost,
              event_link: item.event_link,
              event_link_id: item._id,
              cityId: item.cityId,
              'event_date.display': dta[0].Detail_Date,
              'event_date.datetime': dta[0].Date,
              event_times: dta[0].Detail_Time,
              'location.name': dta[0].Venue_Address,
              'location.fullAddress': dta[0].Venue_Address,
              organizer: {
                name: dta[0].Organizer_Name,
                url: dta[0].Organizer_Name_Link,
                orgWebsite: dta[0].Organizer_Website,
                thumbnail: dta[0].Venue_Gallery_Link,
              },
              venue: dta[0].Date,
              providerName: dta[0].Organizer_Name,
              providerUrl: dta[0].Organizer_Website,
              providerImage: dta[0].Venue_Gallery_Link,
              source: 'website jersey city culture',
              source_id: source_id,
              latitude: Lat,
              longitude: Lng,
              'ageGroup.month': [],
              'ageGroup.year': [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            });

            item.is_event_detail = true;
            await item.save();
            await newEvent.save();
          }
        } else {
          console.log('dta not found');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async create_event_detail_jersey_city_cultureById(id: string) {
    try {
      let Lat, Lng;
      const provider = await this.eventlinkModel.findById({
        _id: new ObjectId(id),
      });
      if (!provider) {
        return 'event link not found';
      } else if (provider) {
        if (provider.location.fullAddress) {
          console.log(
            'provider.location.fullAddress ===>>>>>',
            provider.location.fullAddress,
          );
          // const addr = await this.getLatLngByAddress(provider.location.fullAddress);
          // console.log('addr ===>>>>>',addr)
          try {
            const response = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: provider.location.fullAddress,
                  key: API_KEY,
                },
              },
            );
            if (response.data.status === 'OK') {
              Lat = response.data.results[0].geometry.location.lat;
              Lng = response.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
              // return { lat: Lat, lng: Lng };
            } else {
              console.log('Geocoding API error:', response.data.status);
            }
          } catch (error) {
            console.error('Error creating provider:', error);
            // throw error;
          }
        }
        const response: AxiosResponse = await firstValueFrom(
          this.httpService.get('http://127.0.0.1:8000/scraping-urlss/', {
            params: { url: provider.event_link },
          }),
        );

        if (!response || !response.data || !response.data.data) {
          throw new Error(
            'Invalid response structure from the scraping service',
          );
        }
        // const dta1 = await this.getProviderWebsiteData(url);
        const dta = response.data.data;
        if (dta.length > 0) {
          const newEvent = await this.eventModel.create({
            title: dta[0].Title,
            description: dta[0].Description,
            imageUrl: dta[0].Image,
            time: dta[0].Detail_Time,
            date: dta[0].Detail_Date,
            price: dta[0].Detail_Cost,
            event_link: provider.event_link,
            event_link_id: provider._id,
            cityId: provider.cityId,
            'event_date.display': dta[0].Detail_Date,
            'event_date.datetime': dta[0].Date,
            event_times: dta[0].Detail_Time,
            'location.name': dta[0].Venue_Address,
            'location.fullAddress': dta[0].Venue_Address,
            organizer: {
              name: dta[0].Organizer_Name,
              url: dta[0].Organizer_Name_Link,
              orgWebsite: dta[0].Organizer_Website,
              thumbnail: dta[0].Venue_Gallery_Link,
            },
            venue: dta[0].Date,
            providerName: dta[0].Organizer_Name,
            providerUrl: dta[0].Organizer_Website,
            providerImage: dta[0].Venue_Gallery_Link,
            source: 'website jersey city culture',
            source_id: provider.source_id,
            latitude: Lat,
            longitude: Lng,
            'ageGroup.month': [],
            'ageGroup.year': [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          });
          provider.is_event_detail = true;
          await provider.save();
          return await newEvent.save();
        }
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async cronToCreateNextEvents_jersey_city_culture() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('67287bfa7c7c60fb884053b7'),
      );

      const ctyId = city._id.toString();

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ createdOn: -1 })
        .limit(1);
      console.log('latestEvent ===>>>>>>', latestEvent);
      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastScrapedDateStr = latestEvent[0].avalibility_dates[0];

      const lastScrapedDate = new Date(lastScrapedDateStr);
      console.log('Last Scraped Event Date:', lastScrapedDate);

      const targetDays = 10;
      const eventDates = Array.from({ length: targetDays }, (_, i) => {
        const nextDate = new Date(lastScrapedDate);
        nextDate.setDate(lastScrapedDate.getDate() + i + 1);
        return nextDate.toISOString().split('T')[0];
      });

      console.log('Generated Event Dates:', eventDates);

      for (const eventDate of eventDates) {
        console.log('Processing event for date:', eventDate);
        await this.create_event_link_jersey_city_culture(ctyId, eventDate);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      // }
      // else {
      //   console.log('No new events to scrape.');
      // }
    } catch (error) {
      console.error('Error in cronToCreateNextEvents:', error.message);
    }
  }

  async startCron_jersey_city_culture() {
    try {
      if (process.env.NODE_ENV === 'do') {
        this.cronJobEventJerseyCityCulture = cron.schedule(
          '30 13 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEvents_jersey_city_culture();
              console.log('cronToCreateNextEvents completed.');
              this.cronJobEventJerseyCityCulture.stop();
              console.log('Cron job stopped.');
            } catch (error) {
              console.error(
                'Error executing cronToCreateNextEvents:',
                error.message,
              );
            }
          },
          { scheduled: true, timezone: 'Asia/Kolkata' },
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error starting cron job:', error.message);
    }
  }

  async cronToCreateNextEvents_hoboken_museum() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('67287c6a7c7c60fb884053bd'),
      );

      if (!city) {
        console.log('City not found');
        return;
      }

      const ctyId = city._id.toString();
      const source_id = ctyId;

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ createdOn: 1 })
        .limit(1);

      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastScrapedDateStr = latestEvent[0].avalibility_dates[0];
      const lastScrapedDate = new Date(lastScrapedDateStr);

      const eventDates = this.generateNext7Days(lastScrapedDate);
      console.log('Generated Event Dates:', eventDates);

      for (const date of eventDates) {
        try {
          await this.getEventLinksHobokenForHobokenMuseumWebsite(
            date,
            source_id,
          );
        } catch (error) {
          console.log(
            `Error scraping events for date ${date}: ${error.message}`,
          );
          continue;
        }
      }
    } catch (error) {
      console.error('Error in cronToCreateNextEvents_hoboken_museum:', error);
    }
  }

  async startCron_hoboken_museum() {
    try {
      if (process.env.NODE_ENV === 'do') {
        this.cronJobEventHobokenMuseum = cron.schedule(
          '30 14 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEvents_hoboken_museum();
              console.log('cronToCreateNextEvents completed.');
              this.cronJobEventHobokenMuseum.stop();
              console.log('Cron job stopped.');
            } catch (error) {
              console.error(
                'Error executing cronToCreateNextEvents:',
                error.message,
              );
            }
          },
          { scheduled: true, timezone: 'Asia/Kolkata' },
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error starting cron job:', error.message);
    }
  }

  async striptToAddLatLngAndOtherFieldsInJerseyCityCulture(source_id: string) {
    try {
      let match = { is_deleted: false };

      if (source_id) {
        match['source_id'] = new ObjectId(source_id);
      }

      const data = await this.eventlinkModel.aggregate([
        {
          $match: match,
        },
        {
          $lookup: {
            from: 'eventlinks',
            localField: 'event_link_id',
            foreignField: '_id',
            as: 'event_link_id',
          },
        },
      ]);

      for (let events of data) {
        console.log('events ===>>>>>>', events);
      }
    } catch (error) {
      console.error('Error starting cron job:', error.message);
    }
  }

  async removeDuplicates(): Promise<{ deletedCount: number }> {
    try {
      const duplicates = await this.eventModel.aggregate([
        {
          $group: {
            _id: '$event_link_id',
            count: { $sum: 1 },
            ids: { $push: '$_id' },
          },
        },
        { $match: { count: { $gt: 1 } } },
      ]);

      let deletedCount = 0;

      for (const duplicate of duplicates) {
        // Keep one document and delete the rest
        const idsToDelete = duplicate.ids.slice(1); // Skip the first ID
        const result = await this.eventModel.deleteMany({
          _id: { $in: idsToDelete },
        });
        deletedCount += result.deletedCount;
      }

      return { deletedCount };
    } catch (error) {
      console.error('Error removing duplicates:', error);
      throw new Error('Error removing duplicates: ' + error.message);
    }
  }

  async TakelessionSubjectAddWondrflySubjectId() {
    try {
      let count = 0;
      // const response = await axios.get('http://localhost:8406/api/tags/list');
      // const wondrflySubjects = response.data; // Extract only the data
      // console.log('wondrflySubjects ====>>>>>',wondrflySubjects)
      const wondrflySubjects = await this.TagsModel.find();
      for (let wondrflySubject of wondrflySubjects) {
        const purpleSubjects =
          await this.takelessionsubjectModel.findOneAndUpdate(
            { name: wondrflySubject.name },
            { $set: { wondrflyRefrence: wondrflySubject._id } },
            { new: true },
          );
        console.log('count ==>>', count++);
      }

      return {
        wondrflySubjects, // Send only the relevant data
        // purpleSubjects,
      };
    } catch (error) {
      // Handle the error and provide meaningful feedback
      console.error('Error fetching data:', error.message);
      throw new Error(
        'Failed to fetch Wondrfly subjects or Takelesson subjects',
      );
    }
  }

  async AllSchoolTeacherInfoJsonScrap() {
    try {
      const apiUrl =
        'https://www.allschool.com/api/parent/evaluateTeacher/queryProductDetailEvaluateList?_v=1733331977899';
      const payload = {
        data: {
          teacherId: 6366,
        },
        pageNum: 1,
        pageSize: 9999,
      };

      // Making the POST request
      const response = await axios.post(apiUrl, payload);

      // if (response && response.data.length > 0) {
      // Assuming `allschoolteacherinfojsonModel` is correctly configured and accessible
      const teacher = await this.allschoolteacherinfojsonModel.create({
        teacherJson: response.data,
        url: apiUrl,
        teacherId: payload.data.teacherId,
      });
      console.log('teacher ===>>>', teacher);
      // }

      return { data: response.data };
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new Error('Failed to fetch AllSchool teacher info');
    }
  }

  async scratchProviderDataAllSchool(url: string) {
    let browser: puppeteer.Browser | null = null; // Declare browser outside the try block
    try {
      // Launch Puppeteer
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Go to the URL
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Get the full HTML content
      const content = await page.content();

      // Save the HTML content to a file for debugging
      fs.writeFileSync('page.html', content);
      console.log('HTML content saved to page.html');

      // Ensure the content length is logged for debugging
      console.log(`Content length: ${content.length}`);

      // Save the data to the database
      const provider = await this.allschoolproviderdumpModel.create({
        url: url,
        providerUrl: url,
        content: content, // Save raw HTML content
      });

      console.log(`Content successfully saved for URL: ${url}`);
      console.log('Saved provider:', provider);

      // Return the URL for confirmation
      return url;
    } catch (error) {
      console.error(
        `Failed to fetch or save data for URL ${url}:`,
        error.message,
      );
      throw error; // Re-throw the error for further handling if necessary
    } finally {
      // Ensure the browser is closed properly
      if (browser) {
        await browser.close();
      }
    }
  }

  async scratchProgramDataAllSchool(providerurl: string, programurl: string) {
    let browser: puppeteer.Browser | null = null; // Declare browser outside the try block
    try {
      // Launch Puppeteer
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Go to the URL
      await page.goto(programurl, { waitUntil: 'networkidle2' });

      // Get the full HTML content
      const content = await page.content();

      // Save the HTML content to a file for debugging
      fs.writeFileSync('page.html', content);
      console.log('HTML content saved to page.html');

      // Ensure the content length is logged for debugging
      console.log(`Content length: ${content.length}`);

      // Save the data to the database
      const provider = await this.allschoolprogramdumpModel.create({
        programurl: programurl,
        providerUrl: providerurl,
        content: content, // Save raw HTML content
      });

      console.log(`Content successfully saved for URL: ${programurl}`);
      console.log('Saved provider:', provider);

      // Return the URL for confirmation
      return provider;
    } catch (error) {
      console.error(
        `Failed to fetch or save data for URL ${programurl}:`,
        error.message,
      );
      throw error; // Re-throw the error for further handling if necessary
    } finally {
      // Ensure the browser is closed properly
      if (browser) {
        await browser.close();
      }
    }
  }

  async AllSchoolProviderBasicInfo(
    v: string,
    teacherId: string,
    provider: string,
  ) {
    console.log('v====', v, 'teacherId ===>>>', teacherId);
    try {
      const apiUrl = `https://www.allschool.com/api/parent/teacher/center/fullInfo/${teacherId}?extUrlParam=${teacherId}&_v=${v}`;
      const payload = {
        data: {
          teacherId: 6366,
        },
        pageNum: 1,
        pageSize: 9999,
      };

      // Making the POST request
      const response = await axios.get(apiUrl);
      console.log('response ====>>>>', response);

      // if (response && response.data.length > 0) {
      // Assuming `allschoolteacherinfojsonModel` is correctly configured and accessible
      const teacher = await this.schoolproviderintroModel.create({
        intro: response.data,
        url: apiUrl,
        teacherId: teacherId,
        provider: provider,
      });
      console.log('teacher ===>>>', teacher);
      // }

      return teacher;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new Error('Failed to fetch AllSchool teacher info');
    }
  }

  async AllSchoolProviderProgram(
    v: string,
    teacherId: string,
    pageNo: string,
    provider: string,
  ) {
    console.log('v ===', v, 'teacherId ====>>>', teacherId);
    try {
      const apiUrl = `https://www.allschool.com/api/parent/product/queryProduct?_v=${v}`;
      const payload = {
        pageNum: pageNo,
        pageSize: 8,
        teacherIds: [teacherId], // Ensure teacherId is passed correctly as an array
      };

      // Making the POST request
      const response = await axios.post(apiUrl, payload);
      console.log('response ===>>>>', response);

      const teacher = await this.schoolproviderprogramModel.create({
        program: response.data,
        url: apiUrl,
        teacherId: teacherId,
        provider: provider,
      });
      console.log('teacher ===>>>', teacher);

      return teacher;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new Error('Failed to fetch AllSchool teacher info');
    }
  }

  async AllSchoolProviderReview(
    v: string,
    teacherId: string,
    pageNo: string,
    provider: string,
  ) {
    try {
      const apiUrl = `https://www.allschool.com/api/parent/evaluateTeacher/queryProductDetailEvaluateList?_v=${v}`;
      const payload = {
        data: {
          teacherId: teacherId,
        },
        pageNum: pageNo,
        pageSize: 20,
      };

      // Making the POST request
      const response = await axios.post(apiUrl, payload);

      const teacher = await this.schoolproviderreviewModel.create({
        review: response.data,
        url: apiUrl,
        teacherId: teacherId,
        provider: provider,
      });
      console.log('teacher ===>>>', teacher);

      return teacher;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new Error('Failed to fetch AllSchool teacher info');
    }
  }

  async AllSchoolProviderProgramDetail(
    v: string,
    teacherId: string,
    provider: string,
  ) {
    try {
      const apiUrl = `https://www.allschool.com/api/parent/product/productDetail/${teacherId}?extUrlParam=${teacherId}&_v=${v}`;

      // Making the POST request
      const response = await axios.get(apiUrl);

      const teacher = await this.schoolproviderprograminfoModel.create({
        info: response.data,
        url: teacherId,
        provider: provider,
      });
      console.log('teacher ===>>>', teacher);

      return teacher;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new Error('Failed to fetch AllSchool teacher info');
    }
  }

  async getAllSchoolProviders(page_number: number, page_size: number) {
    const skip = (page_number - 1) * page_size;
    let match = {};

    const category = await this.schoolproviderintroModel.aggregate([
      { $match: match },

      {
        $lookup: {
          from: 'schoolproviderprograms',
          let: { providerId: '$provider' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$provider', '$$providerId'] },
              },
            },
          ],
          as: 'programs',
        },
      },
      {
        $lookup: {
          from: 'schoolproviderreviews',
          let: { providerId: '$provider' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$provider', '$$providerId'] },
              },
            },
          ],
          as: 'reviews',
        },
      },

      { $sort: { createdAt: 1 } },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { created_at: -1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;

    return {
      pageNumber: page_number,
      pageSize: page_size,
      TotalCount: totalCount,
      items: items,
    };
  }

  async getAllSchoolProgramsByProvider(
    page_number: number,
    page_size: number,
    url: string,
  ) {
    const skip = (page_number - 1) * page_size;
    let match = {};

    if (url) {
      match['provider'] = url;
    }

    const category = await this.schoolproviderprograminfoModel.aggregate([
      { $match: match },

      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { createdAt: 1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;

    return {
      pageNumber: page_number,
      pageSize: page_size,
      TotalCount: totalCount,
      items: items,
    };
  }

  async getAllSchoolReviewsByProvider(
    page_number: number,
    page_size: number,
    url: string,
  ) {
    const skip = (page_number - 1) * page_size;
    let match = {};

    if (url) {
      match['provider'] = url;
    }

    const category = await this.schoolproviderreviewModel.aggregate([
      { $match: match },

      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { createdAt: 1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;

    return {
      pageNumber: page_number,
      pageSize: page_size,
      TotalCount: totalCount,
      items: items,
    };
  }

  async getAllSchoolProvidersWithSubAndReview(
    page_number: number,
    page_size: number,
  ) {
    const skip = (page_number - 1) * page_size;

    const category = await this.schoolproviderintroModel.aggregate([
      {
        $lookup: {
          from: 'schoolproviderprograms',
          let: { providerId: '$provider' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$provider', '$$providerId'] },
              },
            },
          ],
          as: 'programs',
        },
      },
      {
        $lookup: {
          from: 'schoolproviderreviews',
          let: { providerId: '$provider' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$provider', '$$providerId'] },
              },
            },
          ],
          as: 'reviews',
        },
      },
      {
        $project: {
          _id: 1,
          signature: '$intro.data.signature',
          name: '$intro.data.name',
          nickName: '$intro.data.nickName',
          introduction: '$intro.data.introduction',
          avatar: '$intro.data.avatar',
          introductionVideoUrl: '$intro.data.introductionVideoUrl',
          modifierName: '$intro.data.modifierName',
          teacherScoreTotal: '$intro.data.teacherScoreTotal',
          studentCount: '$intro.data.studentCount',
          seoTitle: '$intro.data.seoTitle',
          seoDescription: '$intro.data.seoDescription',
          totalProgram: '$programs.program.data.total',
          totalReview: '$reviews.review.data.total',
          programs: {
            $reduce: {
              input: '$programs',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $map: {
                      input: '$$this.program.data.list',
                      as: 'item',
                      in: {
                        spuTitle: '$$item.spuTitle',
                        categoryName: '$$item.categoryName',
                        studentGainList: '$$item.studentGainList',
                        introduction: '$$item.introduction',
                        topics: '$$item.topics',
                      },
                    },
                  },
                ],
              },
            },
          },
          review: {
            $reduce: {
              input: '$reviews',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $map: {
                      input: '$$this.review.data.list',
                      as: 'item',
                      in: {
                        courseName: '$$item.courseName',
                        courseCover: '$$item.courseCover',
                        commentContext: '$$item.commentContext',
                        tagList: '$$item.tagList',
                        reply: '$$item.reply.receiveContent',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $facet: {
          result: [
            { $skip: skip },
            { $limit: page_size },
            { $sort: { created_at: -1 } },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    // Extract totals and results
    const totalCount = category[0].totalCount[0]
      ? category[0].totalCount[0].count
      : 0;
    const items = category[0].result;

    return {
      pageNumber: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async getAllSchoolProvidersWithSubAndReviewByProviderId(id: string) {
    const category = await this.schoolproviderintroModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'schoolproviderprograms',
          let: { providerId: '$provider' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$provider', '$$providerId'] },
              },
            },
          ],
          as: 'programs',
        },
      },
      {
        $lookup: {
          from: 'schoolproviderreviews',
          let: { providerId: '$provider' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$provider', '$$providerId'] },
              },
            },
          ],
          as: 'reviews',
        },
      },
      {
        $project: {
          _id: 1,
          signature: '$intro.data.signature',
          name: '$intro.data.name',
          nickName: '$intro.data.nickName',
          introduction: '$intro.data.introduction',
          avatar: '$intro.data.avatar',
          introductionVideoUrl: '$intro.data.introductionVideoUrl',
          modifierName: '$intro.data.modifierName',
          teacherScoreTotal: '$intro.data.teacherScoreTotal',
          studentCount: '$intro.data.studentCount',
          seoTitle: '$intro.data.seoTitle',
          seoDescription: '$intro.data.seoDescription',
          totalProgram: '$programs.program.data.total',
          totalReview: '$reviews.review.data.total',
          programs: {
            $reduce: {
              input: '$programs',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $map: {
                      input: '$$this.program.data.list',
                      as: 'item',
                      in: {
                        spuTitle: '$$item.spuTitle',
                        categoryName: '$$item.categoryName',
                        studentGainList: '$$item.studentGainList',
                        introduction: '$$item.introduction',
                        topics: '$$item.topics',
                      },
                    },
                  },
                ],
              },
            },
          },
          review: {
            $reduce: {
              input: '$reviews',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $map: {
                      input: '$$this.review.data.list',
                      as: 'item',
                      in: {
                        courseName: '$$item.courseName',
                        courseCover: '$$item.courseCover',
                        commentContext: '$$item.commentContext',
                        tagList: '$$item.tagList',
                        reply: '$$item.reply.receiveContent',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    return category;
  }

  async AllSchoolReport() {
    const category = await this.schoolproviderintroModel.find();

    let programcount = 0;
    let reviewcount = 0;

    for (let cnt of category) {
      const program = await this.schoolproviderprogramModel
        .find({ provider: cnt.provider })
        .limit(1);
      const review = await this.schoolproviderreviewModel
        .find({ provider: cnt.provider })
        .limit(1);

      if (program.length > 0) {
        programcount += program[0].program.data.total;
      }

      if (review.length > 0) {
        reviewcount += review[0].review.data.total;
      }
    }

    return {
      TotalProvider: category.length,
      TotalProgram: programcount,
      TotalReview: reviewcount,
    };
  }

  async archiveOldEvents(sourceId: string): Promise<number> {
    try {
      if (!Types.ObjectId.isValid(sourceId)) {
        throw new HttpException(
          'Invalid sourceId format',
          HttpStatus.BAD_REQUEST,
        );
      }

      const sour = await this.event_sourceModel.findOne({
        _id: new ObjectId(sourceId),
      });

      if (!sour) {
        console.log('Source not found', sourceId);
        throw new HttpException('Source not found', HttpStatus.NOT_FOUND);
      }

      const cityId = sour.cityId;
      console.log('cityId', cityId);

      const cty = await this.citymanagementModel.findOne({
        _id: new ObjectId(cityId),
      });

      if (!cty) {
        console.log('City not found for the given source', cityId);
        throw new HttpException(
          'City not found for the given source',
          HttpStatus.NOT_FOUND,
        );
      }

      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      console.log("Yesterday's date:", yesterday);

      console.log('Query parameters:', {
        source_id: sour._id,
        cityId: cityId,
        avalibility_dates: { $elemMatch: { $lte: yesterday } },
      });

      const eventsToArchive = await this.eventlinkModel.updateMany(
        {
          avalibility_dates: { $elemMatch: { $lte: yesterday } },
          source_id: sour._id,
          cityId: cityId,
        },
        { $set: { status: 'archived' } },
      );

      console.log('Matched events:', eventsToArchive.matchedCount);
      console.log('Modified events:', eventsToArchive.modifiedCount);

      return eventsToArchive.modifiedCount;
    } catch (error) {
      console.error('Error archiving events:', error);
      throw new HttpException(
        'Failed to archive events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAllEventLinksAndEventsEventBride(
    event_link: string,
    eventId: string,
  ) {
    try {
      const dta = await this.eventlinkModel.find({
        source: 'website eventbrite',
        is_event_detail: false,
      });

      console.log('dta =====>>>>', dta);

      if (dta.length === 0) {
        console.warn(
          'No event links found for the specified city and date range',
        );
        return {
          message: 'No event links found for the specified city and date range',
          events: [],
        };
      }

      for (let scr of dta) {
        let url = scr.event_link;

        try {
          const { data } = await axios.get(url, { timeout: 10000 });
          const $ = cheerio.load(data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const title = $('h1').text().trim();
          const existingEvent = await this.eventModel.findOne({
            event_link: url,
          });

          if (existingEvent) {
            console.log(`Event already exists with URL: ${url}`);
            continue;
          }

          let price = 'Price not specified';
          const priceElement1 = $(
            '.Layout-module__module___2eUcs .conversion-bar__panel-info',
          );
          if (priceElement1.length > 0) {
            price = priceElement1.text().trim();
            console.log('Price found in first section:', price);
          }

          if (price === 'Price not specified') {
            const priceElement2 = $(
              '.Layout-module__module___2eUcs .TicketCard-module__pricing___38cNv',
            );
            if (priceElement2.length > 0) {
              let priceSegments = [];
              priceElement2.each(function () {
                const ticketName = $(this)
                  .closest('.TicketCard-module__root___1Vb-2')
                  .find('.TicketCard-module__headerLeft___3wI3k h3')
                  .text()
                  .trim();

                const basePrice = $(this)
                  .find('.Typography_root__487rx')
                  .first()
                  .text()
                  .trim();

                const feeAndTax = $(this)
                  .find('.Typography_body-caption__487rx')
                  .map(function () {
                    return $(this).text().trim();
                  })
                  .get()
                  .join(' ');

                if (ticketName && basePrice && feeAndTax) {
                  priceSegments.push(
                    ticketName + '\n' + basePrice + ' ' + feeAndTax,
                  );
                }
              });

              price = priceSegments.join('\n\n');
              console.log('Price found in second section:', price);
            }
          }

          if (price === 'Price not specified') {
            const priceElement3 = $('.ticket-card-compact-size__price');
            if (priceElement3.length > 0) {
              price = priceElement3.text().trim();
              console.log('Price found in third section:', price);
            }
          }

          if (price === 'Price not specified') {
            console.warn('Price not found for the event');
          }

          const aboutThisEventSection = $(
            '.Layout-module__module___2eUcs[data-testid="aboutThisEvent"]',
          );
          const descriptionElements = aboutThisEventSection.find(
            '.has-user-generated-content.event-description__content *',
          );
          let description = '';

          descriptionElements.each((i, el) => {
            const elementText = $(el).text().trim();

            if (elementText && !description.includes(elementText)) {
              description += elementText + '\n';
            }
          });

          description = description.trim() || 'No description available.';

          const durationElement =
            aboutThisEventSection.find('ul.css-1i6cdnn li');
          const durationText =
            durationElement.text().trim() || 'Event duration not specified';

          const fullDescription = `About this event \nEvent lasts ${durationText} \n${description}`;

          const dateAndTimeSection = $(
            '.Layout-module__module___2eUcs[data-testid="dateAndTime"]',
          );
          const dateText =
            dateAndTimeSection
              .find('.date-info__full-datetime')
              .text()
              .trim() || 'Date and time not available';

          const locationDiv = $('.Layout-module__location___-D6BU');
          const locationText = locationDiv
            .find('.location-info__address-text')
            .text()
            .trim();
          let fullAddress = locationDiv
            .find('.location-info__address')
            .contents()
            .not(locationDiv.find('button'))
            .text()
            .trim();

          fullAddress = fullAddress.replace(/\s*Show\s*map\s*/i, '').trim();

          let Lat, Lng;
          if (fullAddress) {
            try {
              const response = await axios.get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                {
                  params: {
                    address: fullAddress,
                    key: API_KEY,
                  },
                },
              );

              if (response.data.status === 'OK') {
                Lat = response.data.results[0].geometry.location.lat;
                Lng = response.data.results[0].geometry.location.lng;
                console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
              } else {
                console.log('Geocoding API error:', response.data.status);
              }
            } catch (geoError) {
              console.error('Error fetching geocoding data:', geoError.message);
            }
          }

          let organizer: Organizer = {};

          const organizerNameElement = $(
            '.descriptive-organizer-info-mobile__name a',
          );
          if (organizerNameElement.length > 0) {
            organizer.name = organizerNameElement.text().trim();
            organizer.url = organizerNameElement.attr('href') || '';
          } else {
            console.warn('Organizer name not found');
          }

          const organizerDescriptionElement = $(
            '.descriptive-organizer-info-mobile__description',
          );

          if (organizerDescriptionElement.length > 0) {
            organizer.description = organizerDescriptionElement.text().trim();
          } else {
            organizer.description = 'No description available';
          }

          organizer.description = organizer.description
            .replace(/\s+/g, ' ')
            .trim();

          const organizerThumbnailElement = $(
            '.descriptive-organizer-info-mobile__image img',
          );
          if (organizerThumbnailElement.length > 0) {
            organizer.thumbnailLogo160 =
              organizerThumbnailElement.attr('src') || '';
          }

          const agenda = [];
          const agendaSection = $(
            '.Layout-module__module___2eUcs[data-testid="agenda"]',
          );
          const sessions = agendaSection.find('[data-testid="SlotPreview"]');

          sessions.each((i, el) => {
            const time = $(el)
              .find('[data-testid="preview-slot__time"]')
              .text()
              .trim();
            const sessionTitle = $(el).find('.css-bh5t0l').text().trim();

            let sessionDescription = $(el)
              .find('[data-testid="preview-slot__description"]')
              .html()
              .trim();

            sessionDescription = sessionDescription
              .replace(/<button[^>]*>[^<]*<\/button>/g, '')
              .replace(/<style[^>]*>[^<]*<\/style>/g, '')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+/g, ' ')
              .trim();

            sessionDescription = sessionDescription
              .replace(/\.css-[a-z0-9-]+/g, '')
              .replace(/{[^}]*}/g, '');

            if (!sessionDescription || sessionDescription.length < 50) {
              console.log(
                `Session description is too short for session: ${sessionTitle}, skipping.`,
              );
            }

            if (time && sessionTitle && sessionDescription) {
              agenda.push(`[${time}] ${sessionTitle} - ${sessionDescription}`);
            }
          });

          const priceLinkElement = $(
            '.Layout-module__module___2eUcs .conversion-bar--ticket-selection iframe',
          );
          let priceLink = '';

          if (priceLinkElement.length > 0) {
            priceLink = priceLinkElement.attr('src') || '';
            console.log('Price Link:', priceLink);
          }

          let refundPolicy = '';
          const refundPolicySection = $(
            '.Layout-module__module___2eUcs[data-testid="refundPolicy"]',
          );
          const refundPolicyContent = refundPolicySection.find('section div');

          refundPolicyContent.each((i, el) => {
            const text = $(el).text().trim();
            if (text) {
              refundPolicy += text + '\n';
            }
          });

          refundPolicy = refundPolicy.trim() || 'No refund policy available.';

          const sanitizedDescription =
            organizer.description && organizer.description.trim() !== '<P></P>'
              ? organizer.description
              : 'No description available';

          const eventDetails = {
            title,
            description: fullDescription,
            date: {
              display: dateText,
              datetime: dateText,
            },
            location: {
              name: locationText,
              fullAddress: fullAddress || 'Location not specified',
            },
            multiLocations: [
              {
                name: locationText || 'Location not listed',
                address: fullAddress || 'Address not listed',
                location: {
                  type: 'Point',
                  coordinates: [Lng, Lat],
                },
                createdOn: new Date(),
                updatedOn: new Date(),
              },
            ],
            latitude: Lat,
            longitude: Lng,
            organizer: {
              name: organizer.name || 'Organizer not specified',
              url: organizer.url || '',
              orgWebsite: organizer.orgWebsite || '',
              description: sanitizedDescription,
              thumbnail: organizer.thumbnailLogo160 || '',
            },
            url,
            price,
            refundPolicy,
            priceLink,
            agenda,
          };

          const isJerseyCity = /Jersey City/i.test(
            eventDetails.location.fullAddress,
          );

          if (!isJerseyCity) {
            console.log(
              `Event's full address does not contain 'Jersey City'. Deleting event...`,
            );
            await this.eventlinkModel.deleteOne({ _id: scr._id });
            continue;
          }

          const eventAlreadyExists = await this.eventModel.findOne({
            event_link: eventDetails.url,
          });

          if (eventAlreadyExists) {
            console.log(
              `Event already exists: ${eventDetails.title} - skipping.`,
            );
            continue;
          }

          await this.eventModel.create({
            title: eventDetails.title,
            venue: eventDetails.location.name,
            time: eventDetails.date.display,
            event_link: eventDetails.url,
            event_city: eventDetails.location.fullAddress,
            description: eventDetails.description,
            providerName: 'Event Brite',
            providerUrl: 'https://www.eventbrite.com/',
            providerImage: eventDetails.organizer.thumbnail,
            location: {
              name: eventDetails.location.name,
              fullAddress: eventDetails.location.fullAddress,
            },
            multiLocations: [
              {
                name: eventDetails.location.name || 'Location not listed',
                address:
                  eventDetails.location.fullAddress || 'Address not listed',
                location: {
                  type: 'Point',
                  coordinates: [Lng, Lat],
                },
                createdOn: new Date(),
                updatedOn: new Date(),
              },
            ],
            event_date: {
              display: eventDetails.date.display,
              datetime: eventDetails.date.datetime,
            },
            organizer: {
              name: eventDetails.organizer.name,
              url: eventDetails.organizer.url,
              orgWebsite: eventDetails.organizer.orgWebsite,
              description: eventDetails.organizer.description,
              thumbnail: eventDetails.organizer.thumbnail,
            },
            cityId: scr.cityId,
            event_link_id: scr._id,
            source: 'website eventbrite',
            price: eventDetails.price,
            refundPolicy: eventDetails.refundPolicy,
            latitude: Lat,
            longitude: Lng,
            priceLink: eventDetails.priceLink,
            agenda,
          });

          scr.is_event_detail = true;
          await scr.save();
        } catch (error) {
          console.error(
            `Error processing event with URL ${url}:`,
            error.message,
          );

          if (
            error.message.includes('Cannot read properties of null') ||
            error.message.includes('trim')
          ) {
            continue;
          }
        }
      }
    } catch (error) {
      console.error('Error in createAllEventLinksAndEventsEventBride:', error);
    }
  }

  async createEventLinksAndEventsFromCityLinks(): Promise<any> {
    try {
      const res = await this.eventlinkModel.find({
        source: 'website Jersey City Free Public Library',
        is_event_detail: false,
      });

      if (res.length === 0) {
        console.warn(
          'No event links found for the specified city and date range',
        );
        return {
          message: 'No event links found for the specified city and date range',
          events: [],
        };
      }

      console.log('Event Links Found:', res);

      const createdEvents = [];

      for (const link of res) {
        if (
          !Array.isArray(link.avalibility_dates) ||
          link.avalibility_dates.length === 0
        ) {
          continue;
        }

        let url = link.event_link;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const metaOgUrl = $('meta[property="og:url"]').attr('content');
        if (!metaOgUrl) {
          throw new HttpException(
            'Meta og:url content not found in the page',
            HttpStatus.BAD_REQUEST,
          );
        }

        link.event_link = metaOgUrl;
        await link.save();

        const eventTitle = $('h1.media-heading')
          .contents()
          .filter(function () {
            return this.nodeType === 3;
          })
          .text()
          .trim();

        const rawEventDate =
          $('dd')
            .first()
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim() || 'Varied Dates';

        const eventDate =
          $('dd')
            .first()
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim() || 'Varied Dates';

        const time = $('dd').eq(1).text().trim() || 'Time not listed';
        const eventPrice =
          $('.session_register_info h3').text().trim() || 'Price not listed';

        const availabilitySection = $('.recurrence');
        const meetingDates = availabilitySection
          .find('p')
          .first()
          .text()
          .trim();
        const meetingTimes = availabilitySection.find('.day').text().trim();
        const event_times = [meetingDates, meetingTimes];

        const imageUrl = $('.media-left a img').attr('src') || '';
        const organizerName =
          $('#s-lc-profile-name-111864').text().trim() ||
          'Organizer not listed';

        const orgWebsite = $('a[href^="/profile/"]').attr('href') || '';

        const organizer = {
          name: organizerName,
          url: orgWebsite
            ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
            : '',
          orgWebsite: orgWebsite
            ? `https://jclibrary.libcal.com/profile/${orgWebsite}`
            : '',
          description: $('.secondary-text[itemprop="description"]')
            .text()
            .trim(),
          thumbnail: '',
        };

        const addressParts = $('.ed-address-text span')
          .map((i, el) => $(el).text().trim())
          .get();
        const fullAddress = addressParts.join(' ').replace(/\s+/g, ' ').trim();

        let locationName = '';
        $('dt').each((index, element) => {
          if ($(element).text().trim() === 'Location:') {
            locationName = $(element).next('dd').text().trim();
          }
        });

        const eventDescription =
          $('#s-lc-event-desc')
            .text()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/g, ' ') || 'Description not listed';

        const location = {
          name: locationName || 'Location not listed',
          fullAddress: `${locationName} , Jersey City` || 'Address not listed',
        };

        let Lat, Lng;
        if (location.fullAddress) {
          try {
            const geoResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: location.fullAddress,
                  key: API_KEY,
                },
              },
            );

            if (geoResponse.data.status === 'OK') {
              Lat = geoResponse.data.results[0].geometry.location.lat;
              Lng = geoResponse.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
            } else {
              console.log('Geocoding API error:', geoResponse.data.status);
            }
          } catch (geoError) {
            console.error('Error fetching geocoding data:', geoError.message);
          }
        }

        const availabilityDates = link.avalibility_dates.map((dateStr) =>
          new Date(dateStr).toISOString(),
        );

        const audienceElements = $('dd')
          .filter(function () {
            return $(this).prev('dt').text().trim() === 'Audience:';
          })
          .find('.s-lc-event-category-link a');

        let audience = [];
        audienceElements.each((index, element) => {
          const audienceText = $(element).text().trim();
          if (audienceText === 'Juvenile') {
            audience.push('Juvenile');
          } else if (audienceText === 'Young Adult') {
            audience.push('Young Adult');
          } else if (audienceText === 'Adult') {
            audience.push('Adult');
          }
        });

        let ageGroup = { month: [], year: [] };

        audience.forEach((group) => {
          if (group === 'Juvenile') {
            for (let i = 1; i <= 17; i++) {
              ageGroup.year.push(i);
            }
          } else if (group === 'Young Adult') {
            for (let i = 18; i <= 25; i++) {
              ageGroup.year.push(i);
            }
          } else if (group === 'Adult') {
            for (let i = 26; i <= 64; i++) {
              ageGroup.year.push(i);
            }
          }
        });

        const eventData = {
          title: eventTitle,
          event_date: eventDate,
          description: eventDescription,
          time: time,
          event_times: event_times,
          organizer: organizer,
          event_link: metaOgUrl,
          event_link_id: link._id,
          cityId: link.cityId,
          event_city: 'Jersey City',
          image_url: $('.media-left a img').attr('src') || '',
          avalibility_dates: availabilityDates,
          latitude: Lat,
          longitude: Lng,
          ageGroup: ageGroup,
          price: 'Price not specified',
          refundPolicy: 'No refund policy specified.',
          venue: `472 Jersey Avenue Jersey City, New Jersey 07302`,
          providerName: 'Jersey City Free Public Library',
          providerUrl: 'https://jclibrary.libcal.com/',
          providerImage:
            'https://www.jclibrary.org/wp-content/uploads/2024/03/cropped-JCFPL-Logo-Navy_transparent-1.png',
          multiLocations: [
            {
              name: location.name || 'Location not listed',
              address: location.fullAddress || 'Address not listed',
              location: {
                type: 'Point',
                coordinates: [Lng, Lat],
              },
              createdOn: new Date(),
              updatedOn: new Date(),
            },
          ],
        };

        await this.eventModel.insertMany([eventData]);
        createdEvents.push(eventData);

        link.is_event_detail = true;
        await link.save();
      }

      return {
        message: `${createdEvents.length} events created successfully`,
        events: createdEvents,
      };
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async tryGoto(page, url, retries = 3) {
    let attempt = 0;
    while (attempt < retries) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        return;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed for ${url}:`, error);
        attempt++;
        if (attempt >= retries) {
          throw new Error(`Failed to load ${url} after ${retries} attempts`);
        }
      }
    }
  }

  async getAllHobokenLibraryLinksAndEvent(): Promise<any> {
    try {
      const eventLinkDataArray = await this.eventlinkModel.find({
        source: 'website Hoboken Library',
        is_event_detail: false,
      });

      if (eventLinkDataArray.length === 0) {
        throw new HttpException(
          'No event links found for Hoboken Library',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log(
        `Found ${eventLinkDataArray.length} event links for Hoboken Library`,
      );

      const createdEvents = [];

      for (const eventLinkData of eventLinkDataArray) {
        const eventLink = eventLinkData.event_link;

        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-images'],
          ignoreHTTPSErrors: true,
          executablePath: '/usr/bin/chromium-browser',
        });

        const page = await browser.newPage();

        try {
          await this.tryGoto(page, eventLink);

          const eventData = await page.evaluate((eventLinkId) => {
            const getElementText = (selector) => {
              const element = document.querySelector(selector);
              return element ? element.innerText.trim() : 'Not listed';
            };

            const eventDateTimeText = getElementText('.amh-content h4');

            if (!eventDateTimeText) {
              console.warn(`No date/time found for event ${eventLinkId}`);
              return null;
            }

            console.log('Event DateTime Text:', eventDateTimeText);

            const [dateText, timeText] = eventDateTimeText
              .split('\n')
              .map((text) => text.trim());

            if (!dateText || !timeText) {
              console.warn(
                `Malformed date or time for event ${eventLinkId}. Date: ${dateText}, Time: ${timeText}`,
              );
              return null;
            }

            const dateMatch = dateText.match(/(\w+), (\w+) (\d+)/);
            const timeMatch = timeText.match(
              /(\d{1,2}:\d{2})(am|pm) - (\d{1,2}:\d{2})(am|pm)/,
            );

            if (!dateMatch || !timeMatch) {
              console.error(
                `Failed to match date or time for event ${eventLinkId}. DateText: ${dateText}, TimeText: ${timeText}`,
              );
              return null;
            }

            const day = dateMatch[1];
            const month = dateMatch[2];
            const dayNum = dateMatch[3];
            const startTime = timeMatch[1] + timeMatch[2];
            const endTime = timeMatch[3] + timeMatch[4];

            const year = new Date().getFullYear();

            const monthNumber =
              new Date(Date.parse(month + ' 1, 2021')).getMonth() + 1;

            const formattedStartDate = `${year}-${monthNumber
              .toString()
              .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${startTime}`;
            const formattedEndDate = `${year}-${monthNumber
              .toString()
              .padStart(2, '0')}-${dayNum.padStart(2, '0')} ${endTime}`;

            const eventTime = timeText;

            const getAllParagraphsText = (selector: string) => {
              const elements = Array.from(document.querySelectorAll(selector));
              return elements
                .map((el) => el.textContent?.trim() || '')
                .join(' ');
            };

            const title = getElementText('.amh-block.amh-text h2');
            const eventPrice = getElementText('.session_register_info h3');
            const eventRefund = getElementText('.session_register_info h3');
            const availabilitySection = document.querySelector('.recurrence');
            const meetingDates = availabilitySection
              ? getElementText('.recurrence p')
              : '';
            const meetingTimes = availabilitySection
              ? getElementText('.recurrence .day')
              : '';
            const event_times = [meetingDates, meetingTimes];

            const imageUrl =
              (
                document.querySelector(
                  '.amh-block.amh-text .amh-content span div[style*="text-align: center"] img',
                ) as HTMLImageElement
              )?.src || '';

            const ogUrlMeta = document.querySelector(
              'meta[property="og:url"]',
            ) as HTMLMetaElement;
            const ogUrl = ogUrlMeta ? ogUrlMeta.content : '';

            const organizerName = getElementText('#s-lc-profile-name-111864');
            const organizerUrl =
              (document.querySelector('a[itemprop="url"]') as HTMLAnchorElement)
                ?.href || '';

            const description = getAllParagraphsText('.amh-content span p');

            const locationElement = document.querySelector(
              '.amh-block.amh-widget .amh-content a:last-child',
            ) as HTMLAnchorElement;
            const fullAddress = locationElement
              ? locationElement.innerText.replace(/\s+/g, ' ').trim()
              : 'Location not listed';

            const locationLinkElement = document.querySelector(
              '.amh-block.amh-widget .amh-content a:first-child',
            ) as HTMLAnchorElement;
            const locationLink = locationLinkElement
              ? locationLinkElement.href
              : '';

            const location = {
              name: 'Hoboken Library',
              fullAddress: '500 Park Avenue, Hoboken, NJ, 07030',
              coordinates: [0, 0],
              link: locationLink,
            };

            const ageGroupElement = Array.from(
              document.querySelectorAll('.amh-block.amh-text p'),
            ).find((p) => p.textContent.includes('AGE GROUP:'));

            let ageGroupName = null;
            if (ageGroupElement) {
              const ageGroupLink = ageGroupElement.querySelector('a');
              ageGroupName = ageGroupLink
                ? ageGroupLink.textContent.trim()
                : null;
            }

            return {
              title,
              event_date: formattedStartDate,
              event_end_time: formattedEndDate,
              description,
              price: 'Price not specified',
              refundPolicy: 'No refund policy specified.',
              event_times,
              organizer: {
                name: 'Hoboken Public Library',
                url: 'https://hobokenlibrary.libnet.info/events',
                orgWebsite: 'https://hobokenlibrary.libnet.info/events',
                description,
                thumbnail:
                  'https://hobokenlibrary.org/wp-content/uploads/2023/09/Hoboken-Public-Library-Logo-1.png',
              },
              location,
              image_url: imageUrl,
              event_link_id: eventLinkId,
              ageGroup: ageGroupName,
              venue: `500 Park Avenue,
  Hoboken, NJ, 07030`,
              time: eventTime,
              event_link: ogUrl,
              event_city: 'Hoboken',
              providerUrl: 'https://hobokenlibrary.libnet.info/',
            };
          }, eventLinkData._id);

          if (!eventData) {
            console.log(
              `Skipping event creation for event ${eventLinkData._id} due to missing or malformed date/time.`,
            );

            await this.eventlinkModel.deleteOne({ _id: eventLinkData._id });

            await browser.close();
            continue;
          }

          let latitude, longitude;
          if (eventData.location.fullAddress !== 'Location not listed') {
            try {
              const geocodeResponse = await axios.get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                {
                  params: {
                    address: eventData.location.fullAddress,
                    key: API_KEY,
                  },
                },
              );

              if (geocodeResponse.data.status === 'OK') {
                const location =
                  geocodeResponse.data.results[0].geometry.location;
                latitude = location.lat;
                longitude = location.lng;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
              } else {
                console.log('Geocoding error:', geocodeResponse.data.status);
              }
            } catch (error) {
              console.error('Error fetching geocoding data:', error.message);
            }
          }

          if (latitude && longitude) {
            eventData.location.coordinates = [longitude, latitude];
          }

          const cityId = eventLinkData.cityId || null;

          const eventDataWithGeo = {
            ...eventData,
            latitude,
            longitude,
            cityId,
            multiLocations: [
              {
                name: 'Hoboken Library',
                address: '500 Park Avenue, Hoboken, NJ, 07030',
                location: {
                  type: 'Point',
                  coordinates: [longitude, latitude],
                },
                createdOn: new Date(),
                updatedOn: new Date(),
              },
            ],
          };

          const existingEvent = await this.eventModel.findOne({
            title: eventDataWithGeo.title,
            event_link_id: eventLinkData._id,
            event_times: { $all: eventDataWithGeo.event_times },
          });

          if (existingEvent) {
            console.log('Event already exists, skipping...');
            continue;
          }

          await this.eventModel.insertMany(eventDataWithGeo);
          createdEvents.push(eventDataWithGeo);
          eventLinkData.is_event_detail = true;
          await eventLinkData.save();
        } catch (error) {
          console.log(`Error fetching event data for ${eventLink}:`, error);
        } finally {
          await browser.close();
        }
      }

      return {
        message: `${createdEvents.length} events created successfully`,
        events: createdEvents,
      };
    } catch (error) {
      console.log('Error fetching event data from URL:', error);

      return {
        message: 'Failed to extract event data: ' + error.message,
        events: [],
        error: true,
      };
    }
  }

  async createAllEventLinkAndDetailForHobokenMuseumWebsite(
    link,
    eventLinkId,
    sourId,
    cityId,
  ): Promise<any> {
    try {
      let existingEvent = await this.eventModel.findOne({
        event_link_id: eventLinkId,
        event_link: link,
      });
      console.log('existingEvent[===============]');
      if (existingEvent) {
        console.log('Event Already Created:', existingEvent.title);
        return;
      }

      const res = await this.eventlinkModel.find({
        source: 'website hobokenmuseum',
        is_event_detail: false,
      });

      let url = link;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const eventDetails = {
        title: $('h1.tribe-events-single-event-title').text().trim(),
        date: $('.tribe-events-start-date').attr('title') || '',
        time: $('.tribe-events-start-time').text().trim() || '',
        description:
          $('.tribe-events-single-event-description').text().trim() ||
          'No description available.',
        location: $('.tribe-venue a').text().trim() || '',
        address:
          $('.tribe-venue-location .tribe-street-address').text().trim() || '',
        city: $('.tribe-locality').text().trim() || '',
        state: $('.tribe-region.tribe-events-abbr').attr('title') || '',
        postalCode: $('.tribe-postal-code').text().trim() || '',
        country: $('.tribe-country-name').text().trim() || '',
        phone: $('.tribe-venue-tel').text().trim() || '',
        imageUrl:
          $('.tribe-events-single-event-description img').attr('src') ||
          'No Image Available',
        googleMapUrl:
          $('.tribe-events-gmap a').attr('href') || 'No Google Map URL',
        eventCategories: $('.tribe-events-event-categories a')
          .map((i, el) => $(el).text().trim())
          .get(),
        event_full_date_time:
          $('.tribe-events-schedule .tribe-event-date-start').text().trim() +
          ' - ' +
          $('.tribe-events-schedule .tribe-event-time').text().trim(),
      };

      console.log('eventDetails ====>>>>>>', eventDetails);

      const fullAddress = `1301 Hudson St.
        PO Box 3296
        Hoboken, NJ 07030`;

      let latitude = 0;
      let longitude = 0;

      if (fullAddress) {
        try {
          const geoResponse = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                address: fullAddress,
                key: API_KEY,
              },
            },
          );

          if (geoResponse.data.status === 'OK') {
            latitude = geoResponse.data.results[0].geometry.location.lat;
            longitude = geoResponse.data.results[0].geometry.location.lng;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          } else {
            console.log('Geocoding API error:', geoResponse.data.status);
          }
        } catch (geoError) {
          console.error('Error fetching geocoding data:', geoError.message);
        }
      }

      let dt_detail = await this.eventModel.create({
        title: eventDetails.title,
        venue: `Hoboken Historical Museum 
          1301 Hudson St.
          Hoboken, New Jersey`,
        time: eventDetails.time,
        event_link: link,
        event_categories: eventDetails.eventCategories,
        phone_number: '201.656.2240',
        image_url: eventDetails.imageUrl,
        event_city: 'Hoboken',
        description: eventDetails.description,
        price: `Admission: $5\nFree for children and members`,
        // location: {
        //   name: eventDetails.location,
        //   fullAddress: fullAddress,
        // },
        location: {
          name: eventDetails.location,
          fullAddress: fullAddress,
          coordinates: [longitude, latitude],
        },
        multiLocations: [
          {
            name: eventDetails.location || 'Location not listed',
            address: fullAddress || 'Address not listed',
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            createdOn: new Date(),
            updatedOn: new Date(),
          },
        ],
        event_date: {
          display: eventDetails.date,
          datetime: eventDetails.time,
        },
        organizer: {
          name: 'Hoboken Historical Museum',
          url: 'info@hobokenmuseum.org',
          orgWebsite: 'https://www.hobokenmuseum.org/',
          thumbnail:
            'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
        },
        date: eventDetails.date,
        providerName: 'Hoboken Historical Museum',
        providerUrl: 'www.hobokenmuseum.org/',
        providerImage:
          'https://www.hobokenmuseum.org/wp-content/uploads/2024/09/HHM-Logo-rwh-600-200.png',
        city: 'Hoboken',
        cityId: cityId,
        latitude: latitude,
        longitude: longitude,
        event_link_id: eventLinkId,
      });

      await dt_detail.save();

      await this.eventlinkModel.updateOne(
        { event_link: link },
        {
          $set: {
            is_event_detail: true,
            event_link_id: dt_detail._id,
          },
        },
      );

      console.log('Event detail created and event link updated.');
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAllEventLinkAndDetailForHobokenPublicLibrary(
    url,
    eventLinkId,
    sourId,
    cityId,
  ): Promise<any> {
    try {
      if (!url) {
        console.error('Error: Missing event link');
        return;
      }

      console.log('Event URL:', url);

      let existingEvent = await this.eventModel.findOne({
        event_link_id: eventLinkId,
        event_link: url,
      });

      console.log('existingEvent[===============]');

      if (existingEvent) {
        console.log('Event Already Created:', existingEvent.title);
        return;
      }

      const encodedUrl = encodeURI(url);
      let browser;
      let page;

      try {
        browser = await puppeteer.launch({
          args: ['--no-sandbox'],
          ignoreHTTPSErrors: true,
          executablePath: '/usr/bin/chromium-browser',
        });
        page = await browser.newPage();

        try {
          console.log('Navigating to URL:', encodedUrl);
          await page.goto(encodedUrl, { waitUntil: 'networkidle2' });
        } catch (err) {
          console.error('Error during page navigation:', err);
          throw new Error('Failed to navigate to the event URL');
        }

        const eventDetails = await page.evaluate(() => {
          const title =
            document.querySelector('h1.media-heading')?.textContent?.trim() ||
            '';
          const description =
            document
              .querySelector('#s-lc-event-desc')
              ?.textContent?.trim()
              .replace(/(\n\s*)+/g, ' ') || '';
          const date =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('Date:'))
              ?.nextElementSibling?.textContent?.trim() || '';
          const time =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('Time:'))
              ?.nextElementSibling?.textContent?.trim() || '';
          const location =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('Location:'))
              ?.nextElementSibling?.textContent?.trim() || '';
          const library =
            Array.from(document.querySelectorAll('dt'))
              .find((dt) => dt.textContent?.includes('BCCLS Library:'))
              ?.nextElementSibling?.textContent?.trim() || '';

          const categories = Array.from(document.querySelectorAll('dt')).find(
            (dt) => dt.textContent?.includes('Categories:'),
          )?.nextElementSibling
            ? Array.from(
                (
                  Array.from(document.querySelectorAll('dt')).find((dt) =>
                    dt.textContent?.includes('Categories:'),
                  )?.nextElementSibling as Element
                ).querySelectorAll('span.s-lc-event-category-link'),
              ).map((span) => ({
                text: span.textContent?.trim() || '',
                link: span.querySelector('a')?.getAttribute('href') || '',
              }))
            : [];

          const imageURL =
            document
              .querySelector('.media-left img.s-lc-event-fi')
              ?.getAttribute('src') || '';

          const organizerSection = document.querySelector(
            '#s-lc-page-column-2 .s-lc-box-container',
          );

          const organizerName =
            organizerSection
              ?.querySelector('.s-lc-profile-name')
              ?.textContent?.trim() || '';

          const organizerThumbnail =
            organizerSection
              ?.querySelector('.s-lc-profile-image img')
              ?.getAttribute('src') || '';

          const organizerWebsite =
            organizerSection
              ?.querySelector('.s-lc-profile-text a')
              ?.textContent?.trim() || '';

          const organizerUrl =
            document
              .querySelector('#s-lc-page-column-2 .s-lc-box-title a')
              ?.getAttribute('href') || '';

          return {
            title,
            description,
            date,
            time,
            location,
            library,
            categories,
            imageURL,
            organizer: {
              name: organizerName,
              url: 'https://hobokenlibrary.org/',
              orgWebsite: organizerWebsite,
              thumbnail: organizerThumbnail,
            },
          };
        });

        const formattedDate = moment(
          eventDetails.date,
          'dddd, MMMM D, YYYY',
        ).format('YYYY-MM-DD');
        console.log('Event Details:', eventDetails);

        const duplicateEvent = await this.eventModel.findOne({
          title: eventDetails.title,
          event_date: formattedDate,
          location: eventDetails.location,
        });

        if (duplicateEvent) {
          console.log('Duplicate Event Found:', duplicateEvent.title);
          return;
        }

        let latitude, longitude;
        if (eventDetails.location) {
          try {
            const geocodeResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: eventDetails.location,
                  key: API_KEY,
                },
              },
            );

            if (geocodeResponse.data.status === 'OK') {
              const location =
                geocodeResponse.data.results[0].geometry.location;
              latitude = location.lat;
              longitude = location.lng;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            } else {
              console.log('Geocoding error:', geocodeResponse.data.status);
            }
          } catch (error) {
            console.error('Error fetching geocoding data:', error.message);
          }
        }

        await this.eventModel.create({
          title: eventDetails.title,
          venue: `Hoboken Historical Museum 
          1301 Hudson St.
          Hoboken, New Jersey`,
          time: eventDetails.time,
          event_link: url,
          event_categories: eventDetails.categories.map((cat) => cat.text),
          image_url: eventDetails.imageURL,
          event_city: 'Hoboken',
          description: eventDetails.description,
          location: {
            name: eventDetails.location,
            fullAddress: eventDetails.location,
            coordinates: [longitude, latitude],
          },
          multiLocations: [
            {
              name: eventDetails.location || 'Location not listed',
              address: eventDetails.location || 'Address not listed',
              location: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              createdOn: new Date(),
              updatedOn: new Date(),
            },
          ],
          // location: {
          //   name: eventDetails.location,
          //   fullAddress: fullAddress,
          //   coordinates: [longitude, latitude],
          // },
          event_date: {
            display: formattedDate,
            datetime: eventDetails.time,
          },
          date: formattedDate,
          city: 'Hoboken',
          cityId: cityId,
          event_link_id: eventLinkId,
          latitude,
          longitude,
          organizer: eventDetails.organizer,
          providerUrl: 'https://hobokenlibrary.org/',
        });

        const eventLink = await this.eventlinkModel.findOne({
          event_link_id: eventLinkId,
        });

        if (eventLink) {
          eventLink.is_event_detail = true;
          await eventLink.save();
          console.log('Event link updated with event details');
        } else {
          console.error('Event link not found');
        }

        return 'Event Detail Created Successfully';
      } finally {
        if (page) await page.close();
        if (browser) await browser.close();
      }
    } catch (error) {
      console.error('Error fetching event data from URLs:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create_event_link_and_detail_jersey_city_culture(
    link,
    eventLinkId,
    sourId,
    cityId,
  ) {
    try {
      let existingEvent = await this.eventModel.findOne({
        event_link_id: eventLinkId,
        event_link: link,
      });
      console.log('existingEvent[===============]');
      if (existingEvent) {
        console.log('Event Already Created:', existingEvent.title);
        return;
      }

      const res = await this.eventlinkModel.find({
        source: 'website jersey city culture',
        is_event_detail: false,
      });

      let Lat, Lng;
      const provider = await this.eventlinkModel.find({
        // avalibility_dates: { $elemMatch: { $gte: Fromdate, $lte: Todate } },
        // source_id: new ObjectId(source_id),
      });
      // console.log('provider', provider);
      for (const item of provider) {
        if (item.location && item.location.fullAddress) {
          console.log(
            'provider.location.fullAddress ===>>>>>',
            item.location.fullAddress,
          );
          // const addr = await this.getLatLngByAddress(provider.location.fullAddress);
          // console.log('addr ===>>>>>',addr)
          try {
            const response = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: item.location.fullAddress,
                  key: API_KEY,
                },
              },
            );
            if (response.data.status === 'OK') {
              Lat = response.data.results[0].geometry.location.lat;
              Lng = response.data.results[0].geometry.location.lng;
              console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
              // return { lat: Lat, lng: Lng };
            } else {
              console.log('Geocoding API error:', response.data.status);
            }
          } catch (error) {
            console.error('Error geocoding address:', error);
            // Optionally, continue processing without geolocation info
          }
        } else {
          console.log('Location or fullAddress is missing for item:', item);
        }
        const response: AxiosResponse = await firstValueFrom(
          this.httpService.get('http://127.0.0.1:8000/scraping-urlss/', {
            params: { url: item.event_link },
          }),
        );

        if (!response || !response.data || !response.data.data) {
          throw new Error(
            'Invalid response structure from the scraping service',
          );
        }
        // const dta1 = await this.getProviderWebsiteData(url);
        const dta = response.data.data;
        console.log('dta ===>>>>>', dta[0].Title);
        console.log('dta ===>>>>>', dta.title_text);
        // return dta;
        if (dta.length > 0) {
          const dtail = await this.eventModel.findOne({
            event_link_id: item._id,
            is_event_detail: false,
          });
          if (dtail) {
            console.log('Event Already Created');
          }
          if (!dtail) {
            const newEvent = await this.eventModel.create({
              title: dta[0].Title,
              description: dta[0].Description,
              imageUrl: dta[0].Image,
              time: dta[0].Detail_Time,
              date: dta[0].Detail_Date,
              price: dta[0].Detail_Cost,
              event_link: item.event_link,
              event_link_id: item._id,
              cityId: item.cityId,
              'event_date.display': dta[0].Detail_Date,
              'event_date.datetime': dta[0].Date,
              event_times: dta[0].Detail_Time,
              'location.name': dta[0].Venue_Address,
              'location.fullAddress': dta[0].Venue_Address,
              'location.coordinates': [Lng, Lat],
              organizer: {
                name: dta[0].Organizer_Name,
                url: dta[0].Organizer_Name_Link,
                orgWebsite: dta[0].Organizer_Website,
                thumbnail: dta[0].Venue_Gallery_Link,
              },
              venue: dta[0].Date,
              providerName: dta[0].Organizer_Name,
              providerUrl: dta[0].Organizer_Website,
              providerImage: dta[0].Venue_Gallery_Link,
              source: 'website jersey city culture',
              // source_id: source_id,
              latitude: Lat,
              longitude: Lng,
              'ageGroup.month': [],
              'ageGroup.year': [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            });

            item.is_event_detail = true;
            await item.save();
            await newEvent.save();
          }
        } else {
          console.log('dta not found');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
  }

  async updateCountryAllSchoolProviders() {
    const provider = await this.schoolproviderintroModel.find();
    let count = 0;
    let browser;
    let page;

    for (let pro of provider) {
      try {
        let url = `https://www.allschool.com/teachers/${pro.intro.data.teacherPath}`;
        console.log('url  ====>>>>>>', url);
        browser = await puppeteer.launch({
          args: ['--no-sandbox'],
          ignoreHTTPSErrors: true,
          executablePath: '/usr/bin/chromium-browser',
        });
        page = await browser.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        try {
          const button = await page.waitForSelector('.ant-btn-primary', {
            visible: true,
            timeout: 15000,
          });

          // Wait for the button to be in an enabled and clickable state
          await page.waitForFunction(
            (buttonSelector) => {
              // const button = document.querySelector(buttonSelector);
              const button = document.querySelector(
                buttonSelector,
              ) as HTMLButtonElement;
              return (
                button &&
                !button.disabled &&
                button.offsetHeight > 0 &&
                button.offsetWidth > 0
              );
            },
            { timeout: 15000 },
            '.ant-btn-primary',
          );

          // Click the "I know" button to close the modal
          await button.click();

          // Wait for the modal to disappear (just in case it takes a moment)
          await page.waitForSelector('.ant-modal', {
            hidden: true,
            timeout: 5000,
          });

          // Wait for the target element that contains the country information
          await page.waitForSelector('.page-teacher--header-adress .country', {
            timeout: 30000,
          }); // Wait for 30 seconds

          // Extract the country text if the element exists
          const countryElement = await page.$(
            '.page-teacher--header-adress .country',
          );
          if (countryElement) {
            const country = await page.evaluate(
              (el) => el.textContent.trim(),
              countryElement,
            );
            console.log(country); // Output the country
            if (country !== undefined && country !== null && country !== '') {
              count = count++;
              const prvd = await this.schoolproviderintroModel.findOneAndUpdate(
                { _id: new ObjectId(pro._id) },
                { $set: { country: country } },
                { new: true },
              );
            }
            console.log('url  ====>>>>>>', url);
            console.log('count  ====>>>>>>', count);
          } else {
            console.log('Country element not found!');
          }
        } catch (error) {
          console.error('Error:', error);
        }

        await browser.close();
      } catch (error) {
        console.error('Error fetching event details:', error.message);
        throw new Error('Failed to fetch event details: ' + error.message);
      }
    }
  }

  async cronToCreateNextEvents_link_jc_free_public_library() {
    try {
      const city = await this.event_sourceModel.findById(
        new mongoose.Types.ObjectId('67287c207c7c60fb884053b9'),
      );

      const ctyId = city._id.toString();

      const latestEvent = await this.eventlinkModel
        .find({ source_id: new mongoose.Types.ObjectId(ctyId) })
        .sort({ createdOn: -1 })
        .limit(1);
      console.log('latestEvent ===>>>>>>', latestEvent);
      if (!latestEvent || latestEvent.length === 0) {
        console.log('No events found for city:', ctyId);
        return;
      }

      const lastScrapedDateStr = latestEvent[0].avalibility_dates[0];

      const lastScrapedDate = new Date(lastScrapedDateStr);
      console.log('Last Scraped Event Date:', lastScrapedDate);

      const targetDays = 7;
      const eventDates = Array.from({ length: targetDays }, (_, i) => {
        const nextDate = new Date(lastScrapedDate);
        nextDate.setDate(lastScrapedDate.getDate() + i + 1);
        return nextDate.toISOString().split('T')[0];
      });

      console.log('Generated Event Dates:', eventDates);

      for (const eventDate of eventDates) {
        console.log('Processing event for date:', eventDate);
        try {
          const eventsFound = await this.scrapeEventData(ctyId, eventDate);

          if (!eventsFound) {
            console.log(
              `No events found for date: ${eventDate}. Moving to next date.`,
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (error) {
          console.error(
            `Error scraping event data for date ${eventDate}:`,
            error.message,
          );
          console.log(`Moving to next date.`);
          continue;
        }
      }
    } catch (error) {
      console.error('Error in cronToCreateNextEvents:', error.message);
    }
  }

  async startCron_jc_free_public_library() {
    try {
      if (process.env.NODE_ENV === 'do') {
        this.cronJobEvent = cron.schedule(
          '30 10 * * 5',
          async () => {
            try {
              console.log('Running cronToCreateNextEvents...');
              await this.cronToCreateNextEvents_link_jc_free_public_library();
              console.log('cronToCreateNextEvents completed.');
              this.cronJobEvent.stop();
              console.log('Cron job stopped.');
            } catch (error) {
              console.error('Error executing cronToCreateNextEvents:', error);
            }
          },
          { scheduled: true, timezone: 'Asia/Kolkata' },
        );
      } else {
        console.log('Not running in script mode, cron job skipped.');
      }
    } catch (error) {
      console.error('Error starting cron job:', error);
    }
  }

  generateNext7Days(lastScrapedDate: Date): string[] {
    const targetDays = 7;
    return Array.from({ length: targetDays }, (_, i) => {
      const nextDate = new Date(lastScrapedDate);
      nextDate.setDate(lastScrapedDate.getDate() + i + 1);
      return nextDate.toISOString().split('T')[0];
    });
  }

  async allschoolProviderCountryWiseCount() {
    const category = await this.schoolproviderintroModel.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
    ]);

    return category;
  }

  async deleteEventLinkByDateAndSourceId(source_id: string, date: string) {
    try {
      // Convert the date into the same format as availability_dates
      const formattedDate = new Date(date).toISOString();

      // Find and delete matching event links
      const result = await this.eventlinkModel.deleteMany({
        source_id: new ObjectId(source_id),
        avalibility_dates: date,
      });

      // If no documents were deleted, return false
      if (result.deletedCount === 0) {
        return false;
      }

      return true; // Indicate successful deletion
    } catch (error) {
      console.error('Error in deleting event link:', error);
      throw new Error('Error in deleting event link: ' + error.message);
    }
  }

  async deleteEventLink(id: string): Promise<void> {
    const eventLink = await this.eventlinkModel.findById(id);

    if (!eventLink) {
      throw new Error('Event link not found');
    }

    await this.eventlinkModel.findByIdAndDelete(id);
  }

  async scrapeEventLinkAndEventDetailJCFreePublicLibrary(
    source_id: string,
    date: string,
  ) {
    console.log('City:', source_id);
    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('Full city data:', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    const baseUrl = `https://jclibrary.libcal.com/calendar/?cid=-1&t=d&d=${date}&cal=-1&inc=0`;
    console.log('Base URL:', baseUrl);

    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/usr/bin/chromium-browser',
      });
      const page = await browser.newPage();
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });

      await page
        .waitForSelector('.media.s-lc-c-evt', { timeout: 10000 })
        .catch(() => {
          console.warn('Event cards not found within the timeout period.');
          return [];
        });

      const events = await page.evaluate(
        (cityId, sourceId) => {
          const eventCards = Array.from(
            document.querySelectorAll('.media.s-lc-c-evt'),
          );
          return eventCards.map((card) => {
            const title =
              card.querySelector('.s-lc-c-evt-title a')?.textContent?.trim() ||
              '';
            const eventLink =
              card.querySelector('.s-lc-c-evt-title a')?.getAttribute('href') ||
              '';
            const description =
              card.querySelector('.s-lc-c-evt-des')?.textContent?.trim() || '';

            const dateInfo =
              Array.from(card.querySelectorAll('dt'))
                .find((dt) => dt.textContent.includes('Date:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const time =
              Array.from(card.querySelectorAll('dt'))
                .find((dt) => dt.textContent.includes('Time:'))
                ?.nextElementSibling?.textContent?.trim() || '';
            const location =
              Array.from(card.querySelectorAll('dt'))
                .find((dt) => dt.textContent.includes('Location:'))
                ?.nextElementSibling?.textContent?.trim() || 'No location data';

            const audience = Array.from(
              card.querySelectorAll('.s-lc-event-category-link'),
            ).map((tag) => tag.textContent?.trim());

            const inPersonLabel = card.querySelector('.s-lc-eventcard-pill');
            let inpersonOrVirtual = 'No data available';
            if (inPersonLabel) {
              inpersonOrVirtual = inPersonLabel.textContent.trim();
            }

            let eventMode = '';
            if (inpersonOrVirtual.includes('In-Person')) {
              eventMode = 'in-person';
            } else if (inpersonOrVirtual.includes('Virtual')) {
              eventMode = 'virtual';
            }

            return {
              title,
              event_link: eventLink,
              description,
              event_date: {
                display: dateInfo,
                datetime: `${new Date().getFullYear()}-${
                  dateInfo.split(' ')[1]
                }-${dateInfo.split(' ')[0]}`,
              },
              city: 'Jersey City, NJ, USA',
              cityId: cityId,
              source_id: sourceId,
              source: 'website Jersey City Free Public Library',
              availability_dates: [],
              audience,
              location,
              slug: '',
              ageGroup: 'No data available',
              inpersonOrVirtual: eventMode,
              events_type: audience,
            };
          });
        },
        sour.cityId,
        source_id,
      );

      // Process the scraped events
      for (const event of events) {
        const [month, day] = event.event_date.display.split(' ');
        event.event_date.datetime = `${new Date().getFullYear()}-${month}-${day}`;

        const eventDate = new Date(event.event_date.datetime);
        const formattedEventDate = `${eventDate.getFullYear()}-${String(
          eventDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;

        event.availability_dates = [formattedEventDate];
        event.slug = slugify(event.title, { lower: true, strict: true });

        const existingEvent = await this.eventlinkModel.findOne({
          title: event.title.trim(),
          event_link: event.event_link.trim(),
          availability_dates: { $in: [formattedEventDate] },
        });

        if (!existingEvent) {
          const savedEventLink = await this.eventlinkModel.create(event);
          console.log(`Event "${event.title}" saved successfully.`);
          await this.getEventDetailsById(savedEventLink._id.toString());
        }
      }

      await browser.close();

      return {
        success: true,
        message: `${events.length} events processed successfully.`,
      };
    } catch (error) {
      console.error('Error occurred during puppeteer scraping:', error);
      throw new Error(
        `Scraping error for source_id ${source_id}: ${error.message}`,
      );
    }
  }

  async getAllEventCount() {
    const data = await this.eventlinkModel.aggregate([
      { $match: { is_deleted: false } },
    ]);

    return data.length;
  }

  async getProgramDumpByProvider(id) {
    const data = await this.cleandumpModel.aggregate([
      { $match: { provider: new ObjectId(id), isProgramDataAvailable: true } },
    ]);

    return data;
  }

  async DownloadEventCSV(
    status: string,
    start_date: string,
    end_date: string,
    source_id: string,
    city_id: string,
    name: string,
    event_detail: string,
    is_published: string,
  ) {
    let matchQueries = [];

    let match = { is_deleted: false, is_event_detail: true };

    if (status) {
      match['status'] = status;
    }

    if (start_date || end_date) {
      let dateFilter = {};
      if (start_date) {
        dateFilter['$gte'] = new Date(start_date);
      }
      if (end_date) {
        dateFilter['$lte'] = new Date(end_date);
      }
      match['avalibility_dates'] = dateFilter;
    }

    if (source_id) {
      match['source_id'] = new ObjectId(source_id);
    }

    if (city_id) {
      match['cityId'] = new ObjectId(city_id);
    }

    if (event_detail) {
      if (event_detail == 'true') {
        match['is_event_detail'] = true;
      } else if (event_detail == 'false') {
        match['is_event_detail'] = false;
      }
    }

    if (is_published) {
      if (is_published == 'true') {
        match['is_published'] = true;
      } else if (is_published == 'false') {
        match['is_published'] = false;
      }
    }

    if (name) {
      matchQueries = [
        {
          $match: {
            $or: [
              { notes: { $regex: '.*' + name + '.*', $options: 'i' } },
              { admin_notes: { $regex: '.*' + name + '.*', $options: 'i' } },
              {
                proof_reader_notes: {
                  $regex: '.*' + name + '.*',
                  $options: 'i',
                },
              },
              { title: { $regex: '.*' + name + '.*', $options: 'i' } },
            ],
          },
        },
      ];
    }

    const data = await this.eventlinkModel.aggregate([
      ...matchQueries,
      {
        $match: match,
      },
      // {
      //   $lookup: {
      //     from: 'citymanagements',
      //     localField: 'cityId',
      //     foreignField: '_id',
      //     as: 'cityId',
      //   },
      // },
      // {
      //   $unwind: {
      //     path: '$cityId', // Unwind the array if you expect only one document per join
      //     preserveNullAndEmptyArrays: true, // If no match, keep the original document
      //   },
      // },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'event_link_id',
          as: 'event_link_id',
        },
      },
      {
        $unwind: {
          path: '$event_link_id', // Unwind the array if you expect only one document per join
          preserveNullAndEmptyArrays: true, // If no match, keep the original document
        },
      },
      {
        $project: {
          title: 1,
          avalibility_dates: 1,
          city: 1,
          source: 1,
          event_dates: 1,
          source_id: 1,
          status: 1,
          location: 1,
          EventTitle: '$event_link_id.title',
          Eventtime: '$event_link_id.time',
          Eventdate: '$event_link_id.date',
          Eventcity: '$event_link_id.city',
          EventrefundPolicy: '$event_link_id.refundPolicy',
          Eventevent_city: '$event_link_id.event_city',
          Eventevent_times: '$event_link_id.event_times',
          Eventdescription: '$event_link_id.description',
          Eventorganizer: '$event_link_id.organizer',
          EventproviderName: '$event_link_id.providerName',
          EventproviderUrl: '$event_link_id.providerUrl',
        },
      },
      { $limit: 1000 },
    ]);

    if (data) {
      const selectedFields = data.map((provider) => ({
        title: provider.title,
        city: provider.city,
        source: provider.source,
        status: provider.status,
        EventTitle: provider.EventTitle,
        Eventtime: provider.Eventtime,
        Eventdate: provider.Eventdate,
        EventrefundPolicy: provider.EventrefundPolicy,
        Eventevent_city: provider.Eventevent_city,
        Eventdescription: provider.Eventdescription,
        Eventorganizer: provider.Eventorganizer,
        EventproviderName: provider.EventproviderName,
      }));

      const workSheet = XLSX.utils.json_to_sheet(selectedFields);
      const workBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workBook, workSheet, 'providers');

      const excelBuffer = XLSX.write(workBook, {
        bookType: 'xlsx',
        type: 'buffer',
      });

      const timestamp = new Date().getTime();
      const fileName = `EventData__${timestamp}.xlsx`;

      const folderPath = path.join(process.cwd(), UrlService.filesFolder);
      const filePath = path.join(folderPath, fileName);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(filePath, excelBuffer);

      return `http://localhost:1333/excel_files/${fileName}`;
    }
  }

  async scrapEventBriteEventDetails(event_link, eventLinkId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { data } = await axios.get(event_link, { timeout: 10000 });
      const $ = cheerio.load(data);

      const title = $('h1').text().trim();

      let price = 'Price not specified';
      const priceElement1 = $(
        '.Layout-module__module___2eUcs .conversion-bar__panel-info',
      );
      if (priceElement1.length > 0) {
        price = priceElement1.text().trim();
        console.log('Price found in first section:', price);
      }

      if (price === 'Price not specified') {
        const priceElement2 = $(
          '.Layout-module__module___2eUcs .TicketCard-module__pricing___38cNv',
        );
        if (priceElement2.length > 0) {
          let priceSegments = [];
          priceElement2.each(function () {
            const ticketName = $(this)
              .closest('.TicketCard-module__root___1Vb-2')
              .find('.TicketCard-module__headerLeft___3wI3k h3')
              .text()
              .trim();

            const basePrice = $(this)
              .find('.Typography_root__487rx')
              .first()
              .text()
              .trim();

            const feeAndTax = $(this)
              .find('.Typography_body-caption__487rx')
              .map(function () {
                return $(this).text().trim();
              })
              .get()
              .join(' ');

            if (ticketName && basePrice && feeAndTax) {
              priceSegments.push(
                ticketName + '\n' + basePrice + ' ' + feeAndTax,
              );
            }
          });

          price = priceSegments.join('\n\n');
          console.log('Price found in second section:', price);
        }
      }

      if (price === 'Price not specified') {
        const priceElement3 = $('.ticket-card-compact-size__price');
        if (priceElement3.length > 0) {
          price = priceElement3.text().trim();
          console.log('Price found in third section:', price);
        }
      }

      if (price === 'Price not specified') {
        console.warn('Price not found for the event');
      }

      const url = event_link;
      const aboutThisEventSection = $(
        '.Layout-module__module___2eUcs[data-testid="aboutThisEvent"]',
      );
      const descriptionElements = aboutThisEventSection.find(
        '.has-user-generated-content.event-description__content *',
      );
      let description = '';

      descriptionElements.each((i, el) => {
        const elementText = $(el).text().trim();

        if (elementText && !description.includes(elementText)) {
          description += elementText + '\n';
        }
      });

      description = description.trim() || 'No description available.';

      const durationElement = aboutThisEventSection.find('ul.css-1i6cdnn li');
      const durationText =
        durationElement.text().trim() || 'Event duration not specified';

      const fullDescription = `About this event \nEvent lasts ${durationText} \n${description}`;

      const dateAndTimeSection = $(
        '.Layout-module__module___2eUcs[data-testid="dateAndTime"]',
      );
      const dateText =
        dateAndTimeSection.find('.date-info__full-datetime').text().trim() ||
        'Date and time not available';

      const locationDiv = $('.Layout-module__location___-D6BU');
      const locationText = locationDiv
        .find('.location-info__address-text')
        .text()
        .trim();
      let fullAddress = locationDiv
        .find('.location-info__address')
        .contents()
        .not(locationDiv.find('button'))
        .text()
        .trim();

      fullAddress = fullAddress.replace(/\s*Show\s*map\s*/i, '').trim();

      let Lat, Lng;
      if (fullAddress) {
        try {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                address: fullAddress,
                key: API_KEY,
              },
            },
          );

          if (response.data.status === 'OK') {
            Lat = response.data.results[0].geometry.location.lat;
            Lng = response.data.results[0].geometry.location.lng;
            console.log(`Latitude: ${Lat}, Longitude: ${Lng}`);
          } else {
            console.log('Geocoding API error:', response.data.status);
          }
        } catch (geoError) {
          console.error('Error fetching geocoding data:', geoError.message);
        }
      }

      let organizer: Organizer = {};

      const organizerNameElement = $(
        '.descriptive-organizer-info-mobile__name a',
      );
      if (organizerNameElement.length > 0) {
        organizer.name = organizerNameElement.text().trim();
        organizer.url = organizerNameElement.attr('href') || '';
      } else {
        console.warn('Organizer name not found');
      }

      const organizerDescriptionElement = $(
        '.descriptive-organizer-info-mobile__description',
      );

      if (organizerDescriptionElement.length > 0) {
        organizer.description = organizerDescriptionElement.text().trim();
      } else {
        organizer.description = 'No description available';
      }

      organizer.description = organizer.description.replace(/\s+/g, ' ').trim();

      const organizerThumbnailElement = $(
        '.descriptive-organizer-info-mobile__image img',
      );
      if (organizerThumbnailElement.length > 0) {
        organizer.thumbnailLogo160 =
          organizerThumbnailElement.attr('src') || '';
      }

      const agenda = [];
      const agendaSection = $(
        '.Layout-module__module___2eUcs[data-testid="agenda"]',
      );
      const sessions = agendaSection.find('[data-testid="SlotPreview"]');

      sessions.each((i, el) => {
        const time = $(el)
          .find('[data-testid="preview-slot__time"]')
          .text()
          .trim();
        const sessionTitle = $(el).find('.css-bh5t0l').text().trim();

        let sessionDescription = $(el)
          .find('[data-testid="preview-slot__description"]')
          .html()
          .trim();

        sessionDescription = sessionDescription
          .replace(/<button[^>]*>[^<]*<\/button>/g, '')
          .replace(/<style[^>]*>[^<]*<\/style>/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        sessionDescription = sessionDescription
          .replace(/\.css-[a-z0-9-]+/g, '')
          .replace(/{[^}]*}/g, '');

        if (!sessionDescription || sessionDescription.length < 50) {
          console.log(
            `Session description is too short for session: ${sessionTitle}, skipping.`,
          );
        }

        if (time && sessionTitle && sessionDescription) {
          agenda.push(`[${time}] ${sessionTitle} - ${sessionDescription}`);
        }
      });

      const priceLinkElement = $(
        '.Layout-module__module___2eUcs .conversion-bar--ticket-selection iframe',
      );
      let priceLink = '';

      if (priceLinkElement.length > 0) {
        priceLink = priceLinkElement.attr('src') || '';
        console.log('Price Link:', priceLink);
      }

      let refundPolicy = '';
      const refundPolicySection = $(
        '.Layout-module__module___2eUcs[data-testid="refundPolicy"]',
      );
      const refundPolicyContent = refundPolicySection.find('section div');

      refundPolicyContent.each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          refundPolicy += text + '\n';
        }
      });

      refundPolicy = refundPolicy.trim() || 'No refund policy available.';

      const sanitizedDescription =
        organizer.description && organizer.description.trim() !== '<P></P>'
          ? organizer.description
          : 'No description available';

      const eventDetails = {
        title,
        description: fullDescription,
        event_link: event_link,
        date: {
          display: dateText,
          datetime: dateText,
        },
        location: {
          name: locationText,
          fullAddress: fullAddress || 'Location not specified',
        },
        latitude: Lat,
        longitude: Lng,
        organizer: {
          name: organizer.name || 'Organizer not specified',
          url: organizer.url || '',
          orgWebsite: organizer.orgWebsite || '',
          description: sanitizedDescription,
          thumbnail: organizer.thumbnailLogo160 || '',
        },
        price,
        refundPolicy,
        priceLink,
        agenda,
      };

      try {
        const evDeatil = await this.eventModel.create({
          title: eventDetails.title,
          venue: eventDetails.location.name,
          time: eventDetails.date.display,
          event_city: eventDetails.location.fullAddress,
          description: eventDetails.description,
          providerName: 'Event Brite',
          providerUrl: 'https://www.eventbrite.com/',
          providerImage: eventDetails.organizer.thumbnail,
          location: {
            name: eventDetails.location.name,
            fullAddress: eventDetails.location.fullAddress,
          },
          event_date: {
            display: eventDetails.date.display,
            datetime: eventDetails.date.datetime,
          },
          organizer: {
            name: eventDetails.organizer.name,
            url: eventDetails.organizer.url,
            orgWebsite: eventDetails.organizer.orgWebsite,
            description: eventDetails.organizer.description,
            thumbnail: eventDetails.organizer.thumbnail,
          },
          source: 'website eventbrite',
          price: eventDetails.price,
          refundPolicy: eventDetails.refundPolicy,
          latitude: Lat,
          longitude: Lng,
          priceLink: eventDetails.priceLink,
          agenda,
          event_link: eventDetails.event_link,
          event_link_id: eventLinkId,
        });
        console.log(
          `Event link with Event Detail Created Sucessfully. ===>>>>`,
          evDeatil,
        );
        console.log(`Event "${title}" created successfully.`);
        await this.eventlinkModel.updateOne(
          { _id: eventLinkId },
          { $set: { is_event_detail: true } },
        );
        console.log(
          `Event link with ID ${eventLinkId} marked as having event details.`,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `Error processing event with URL ${event_link}:`,
          error.message,
        );

        if (error instanceof TypeError || error instanceof Error) {
          console.log(`Deleting event due to error processing: ${event_link}`);
          await this.eventlinkModel.deleteOne({ _id: eventLinkId });
          return;
        }

        console.error(`Error processing event: ${error.message}`);
      }
    } catch (error) {
      console.error(
        `Error processing event details for ${event_link}:`,
        error.message,
      );
    }
  }

  async scrapEventBriteEventWithDetailBySourceAndDate(
    source_id,
    start_date,
    end_date,
    keyword,
  ) {
    const sour = await this.event_sourceModel.findOne({
      _id: new ObjectId(source_id),
    });

    let ctyId;
    let ctId;

    const cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(sour.cityId),
    });
    console.log('full cty: ', cty);

    if (!cty) {
      throw new Error('City not found');
    }

    switch (cty.city) {
      case 'Weehawken':
        ctyId = 'nj--union-city';
        break;
      case 'Union City':
        ctyId = 'in--union-city';
        break;
      case 'West New York':
        ctyId = 'united-states';
        break;
      case 'Guttenberg':
        ctyId = 'nj--guttenberg';
        break;
      case 'Bayonne':
        ctyId = 'nj--bayonne';
        break;
      case 'Jersey City':
        ctyId = 'united-states--new-jersey';
        break;
      case 'Phoenix':
        ctyId = 'az--phoenix';
        break;
      case 'Secaucus':
        ctyId = 'nj--secaucus';
        break;
      case 'North Bergen':
        ctyId = 'united-states';
        break;
      case 'Hoboken':
        ctyId = 'nj--jersey-city';
        break;
      default:
        throw new Error('Unsupported city');
    }

    ctId = cty._id;
    console.log('ctyId: ', ctyId, 'ctId: ', ctId);

    let allEvents = [];
    let page = 1;
    let hasMoreEvents = true;
    const maxEventsPerRequest = 20;

    while (hasMoreEvents) {
      const url = `https://www.eventbrite.com/d/${ctyId}/${keyword}/?page=${page}&start_date=${start_date}&end_date=${end_date}&page_size=${maxEventsPerRequest}`;
      console.log('link_url: ', url);

      try {
        const { data, status } = await axios.get(url);

        if (status === 404) {
          console.warn(`Event URL not found: ${url}`);
          continue;
        }

        const $ = cheerio.load(data);
        let eventData;

        $('script').each((index, element) => {
          const scriptContent = $(element).html();
          if (
            scriptContent &&
            scriptContent.includes('window.__SERVER_DATA__')
          ) {
            const match = scriptContent.match(
              /window\.__SERVER_DATA__ = (\{.*?\});/s,
            );
            if (match) {
              const jsonString = match[1].trim();
              eventData = JSON.parse(jsonString);
            }
          }
        });

        if (
          !eventData ||
          !eventData.search_data ||
          !eventData.search_data.events
        ) {
          hasMoreEvents = false;
          continue;
        }

        const events = eventData.search_data.events.results || [];
        const filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.start_date);
          return (
            eventDate >= new Date(start_date) && eventDate <= new Date(end_date)
          );
        });

        for (const event of filteredEvents) {
          console.log('Event:', event);

          let eventPrice = '';
          const priceText = $('div[class*="priceWrapper"] p').text().trim();

          if (priceText) {
            eventPrice = priceText;
          } else {
            const priceFromText = $('div[class*="priceWrapper"] p')
              .text()
              .trim();
            if (priceFromText && priceFromText.startsWith('From')) {
              eventPrice = priceFromText;
            } else {
              eventPrice = 'Free';
            }
          }

          if (!eventPrice || eventPrice.toLowerCase() === 'free') {
            eventPrice = 'Free';
          } else if (!eventPrice) {
            console.warn('Price not found for event:', event.name);
            eventPrice = 'Price not listed';
          }

          const existingEvent = await this.eventlinkModel.findOne({
            event_link: event.url,
            source_id: new ObjectId(source_id),
            'event_date.display': event.start_date,
          });

          if (existingEvent) {
            console.log(`Event "${event.name}" already exists. Skipping...`);
            continue;
          }

          const slug = await this.generateUniqueSlug(event.name);

          const createdEventLink = await this.eventlinkModel.create({
            title: event.name,
            event_date: {
              display: event.start_date,
              datetime: event.start_date,
            },
            city: ctyId.trim(),
            cityId: sour.cityId,
            source_id: source_id,
            date: event.start_date,
            event_link: event.url,
            source: 'website eventbrite',
            type: keyword,
            avalibility_dates: event.start_date,
            slug: slug,
            summary: event.summary,
            price: eventPrice,
            longitude: event.primary_venue.address.longitude,
            latitude: event.primary_venue.address.latitude,
            tickets_url: event.tickets_url,
          });

          await this.scrapEventBriteEventDetails(
            event.url,
            createdEventLink._id,
          );

          console.log(`Event "${event.name}" processed successfully.`);
        }

        if (events.length < maxEventsPerRequest) {
          break;
        }

        page++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error during event scraping:', error.message);
        if (error.response && error.response.status === 429) {
          console.warn('Rate limit exceeded. Retrying...');
          await new Promise((resolve) => setTimeout(resolve, 60000));
        } else {
          break;
        }
      }
    }

    console.log('All events processed.');
  }

  getDateStringToJSO(contentString: string): string {
    const jsonRegex = /```json([\s\S]+?)```|```([\s\S]+?)```|{[\s\S]*}/;

    const jsonDataMatch = contentString.match(jsonRegex);

    console.log('jsonDataMatch====>>>>', jsonDataMatch);

    if (jsonDataMatch) {
      const jsonDataString =
        jsonDataMatch[1] || jsonDataMatch[2] || jsonDataMatch[0];

      try {
        JSON.parse(jsonDataString);
        return jsonDataString.trim();
      } catch (error) {
        console.error('Invalid JSON extracted:', error.message);
        return '{}';
      }
    }

    console.warn('No JSON block found in content');
    return '{}';
  }

  async updateEventsFriendly(_ids: string[]) {
    this.logger.log('[service:citymanagement:updateEventsFriendly]');

    if (!_ids || _ids.length === 0) {
      console.log('No event IDs provided to update.');
      return;
    }

    console.log('Event IDs ===>>>', _ids);

    let match: any = { is_event_detail: true };
    match['_id'] = { $in: _ids.map((id) => new ObjectId(id)) };

    const data = await this.eventlinkModel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'event_link_id',
          as: 'event_link_id',
        },
      },
      { $unwind: { path: '$event_link_id', preserveNullAndEmptyArrays: true } },
    ]);

    if (!data.length) {
      console.log('No events found for the given criteria.');
      return;
    }

    console.log('Items ===>>>', data);

    for (let dta of data) {
      let eventTitle = dta?.title || '';
      let linkedEventDescription = dta?.event_link_id?.description || '';
      console.log('linkedEventDescription ==', linkedEventDescription);

      let prompt = `
Given the event details: "${eventTitle}" and "${linkedEventDescription}", analyze the event and provide the following information:

*Tagging Rules:*
- Events about "Storytime" must be tagged with both "Early Learning" and "English & Languages".
- Events about "Literacy" must be tagged as "English & Languages".
- Events related to "Art" or "Crafts" should be tagged "Visual & Creative".
- Events about making things should generally be "Visual & Creative" except for food-related events, which should be "Food & Culinary Arts".
- "Early Learning" applies only to children aged 0-5 years.
- "Hobbies & Games" includes board games & card games but *NOT* Coding or Robotics (should be "Tech & Engineering").
- Environmental events should be "Community & Culture".
- Typing events should be "English & Language".
- Events about "Black History", "Hispanic Heritage", etc., should be tagged as "Community & Culture" & "Social Studies".
- Events about social issues at an *individual level* (e.g., bullying) should be "Personal Development" & "Community & Culture".
- Social issues at a *societal level* should be "Social Studies".
- Events with "Move and Groove" should be tagged "Dance".

*Registration Analysis:*
- Set "isRegistration" to true if the event requires registration, sign-up, RSVP, or has limited capacity
- Look for phrases like "register now", "sign up required", "RSVP", "limited seats", etc.
- Also check if there's a registration deadline mentioned

*Categories Available:* .

*Provide a JSON response:*
{
    "event": {
      "childFriendly": true/false,
      "familyFriendly": true/false,
      "isRegistration": true/false,
      "categoryIds": [<array of category IDs>]
    }
}
`;

      console.log('Prompt for Event Analysis ===>>>>', prompt);

      const genAI = new GoogleGenerativeAI(
        'YOUR_GOOGLE_KEY',
      );
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      try {
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        console.log('Raw Response Text:', responseText);

        let responseData;
        try {
          responseData = JSON.parse(this.getDateStringToJSO(responseText));
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid JSON from AI model');
        }
        console.log('Parsed JSON Response:', responseData);

        const childFriendly = responseData?.event?.childFriendly ?? false;
        const familyFriendly = responseData?.event?.familyFriendly ?? false;
        const isRegistration = responseData?.event?.isRegistration ?? false;

        console.log('Child Friendly:', childFriendly);
        console.log('Family Friendly:', familyFriendly);
        console.log('Registration Required:', isRegistration);

        const categoryIds = responseData?.event?.categoryIds
          ?.map((categoryName: string) => {
            
          })
          .filter(Boolean);

        console.log('Categories (IDs) for event:', categoryIds);

        // First update with basic fields including isRegistration
        await this.eventlinkModel.findOneAndUpdate(
          { _id: new ObjectId(dta._id) },
          {
            $set: {
              childFriendly,
              familyFriendly,
              isRegistration,
              categories: categoryIds,
            },
          },
          { new: true },
        );

        const subjects = await this.TagsModel.find({
          isActivated: true,
          categoryIds: { $in: categoryIds },
        });
       
        const promptSub = `
        Given the event details: "${eventTitle}" and "${linkedEventDescription}", classify the event into the appropriate subject. 
         *Subjects Available:*  ${subjects.map((s) => s.name).join(', ')}.

          *Provide a JSON response:*
          {
            "subjects": [<array of subjects>]
           }`;
        const resultSub = await model.generateContent(promptSub);
        const responseTextSub = await resultSub.response.text();
        console.log('Raw Responsesub Text:', responseTextSub);

        let responseDataSub;
        try {
          responseDataSub = JSON.parse(
            this.getDateStringToJSO(responseTextSub),
          );
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          // throw new Error('Invalid JSON from AI model');
        }

        console.log(
          'Parsed JSON responseDataSub:',
          responseDataSub,
          responseDataSub?.subjects,
        );
        const subjectIds = responseDataSub?.subjects || [];
        let subjectResult = [];
        if (subjectIds.length) {
          const regexPatterns = this.generateRegexPatterns(subjectIds);
          subjectResult = await this.TagsModel.find({
            isActivated: true,
            categoryIds: { $in: categoryIds },
            $or: regexPatterns.map((regex) => ({
              name: { $regex: regex },
            })),
          });
          console.log(
            'subjectIds (IDs) for event:',
            subjectResult.map((s) => s._id),
          );
        }

        // Final update including subjects
        await this.eventlinkModel.findOneAndUpdate(
          { _id: new ObjectId(dta._id) },
          {
            $set: {
              childFriendly,
              familyFriendly,
              isRegistration,
              categories: categoryIds,
              subjects: subjectResult.map((s) => s._id),
            },
          },
          { new: true },
        );
      } catch (error) {
        console.error('AI model error:', error.message);
      }
    }
  }

  async archiveOldEventsAllWebsites(): Promise<number> {
    try {
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      console.log("Yesterday's date:", yesterday);

      const eventsToArchive = await this.eventlinkModel.updateMany(
        {
          avalibility_dates: { $elemMatch: { $lte: yesterday } },
        },
        { $set: { status: 'archived' } },
      );

      console.log(`Archived ${eventsToArchive.modifiedCount} events`);
      return eventsToArchive.modifiedCount;
    } catch (error) {
      console.error('Error archiving events:', error);
      throw new HttpException(
        'Failed to archive events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startCronarchiveOldEventss() {
    try {
      this.startCronarchiveOldEvents = cron.schedule(
        '30 10 * * *',
        async () => {
          try {
            console.log('Running cronToCreateNextEvents...');
            await this.archiveOldEventsAllWebsites();
            console.log('cronToCreateNextEvents completed.');
            this.startCronarchiveOldEvents?.stop();
            console.log('Cron job stopped.');
          } catch (error) {
            console.error('Error executing cronToCreateNextEvents:', error);
          }
        },
        {
          scheduled: true,
          timezone: 'Asia/Kolkata',
        },
      );
    } catch (error) {
      console.error('Error in cronToCreateNextEvents 2:', error);
    }
  }

  async setProviderDataFromFinalByCity(id: string) {
    try {
      const data = await this.userModel.find({ cityId: new ObjectId(id) });
      if (!data.length) {
        console.log('No users found for the given criteria.');
      }
      for (let dta of data) {
        try {
          await this.setProviderDataFromFinal(dta._id);
        } catch (error) {
          console.error('Error in setProviderDataFromFinalByCity:', error);
        }
      }
    } catch (error) {
      console.error('Error update users:', error);
      throw new HttpException(
        'Failed to update users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEventsWithMultiLocations() {
    const events = await this.eventModel
      .find({
        latitude: { $exists: true, $ne: null },
        longitude: { $exists: true, $ne: null },
        location: { $exists: true },
      })
      .lean();

    if (events.length === 0) {
      console.log('No events found that need updating.');
      return;
    }

    for (let event of events) {
      console.log('Event Object:', event);

      const { location, latitude, longitude } = event;

      console.log(`Event ID: ${event._id}`);
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      console.log(`Location:`, location);

      if (!location || !latitude || !longitude) {
        console.warn(
          'Missing location, latitude, or longitude for event:',
          event._id,
        );
        continue;
      }

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        console.warn(`Invalid latitude or longitude for event: ${event._id}`);
        continue;
      }

      const coordinates: [number, number] = [lon, lat];
      const multiLocation = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: location.name || 'Location not specified',
        address: location.fullAddress || 'Address not available',
        location: {
          type: 'Point',
          coordinates,
        },
        createdOn: new Date(),
        updatedOn: new Date(),
      };

      event.multiLocations = [multiLocation];
      event.location = undefined;

      await this.eventModel.updateOne({ _id: event._id }, { $set: event });

      console.log(`Event updated with multiLocations: ${event._id}`);
    }
  }

  async updateProviderCategoriesByPrompt(userId: string) {
    this.logger.log('[service:provider:updateProviderCategoriesByPrompt]');

    let providerName = '';
    let providerDescription = '';
    let providerId: string;

    try {
      const user = await this.userModel.findById(userId).lean();
      if (!user) throw new NotFoundException(`User ${userId} not found`);

      const provider = await this.dummyproviderModel
        .findOne({ provider: userId })
        .lean();
      if (!provider)
        throw new NotFoundException(`Provider for user ${userId} not found`);

      providerId = provider._id.toString();
      providerDescription = provider.discription || '';
      providerName =
        provider.businessName?.[0] || user.userName?.[0] || 'Unnamed Provider';

      const [categories] = await Promise.all([
        this.TagsModel.find({ isActivated: true }).lean(),
      ]);

      if (!categories.length) throw new Error('No active categories found');

      const categoryMap = new Map(
        categories.map((category) => [
          category.name.toLowerCase(),
          {
            id: category._id.toString(),
            exactName: category.name,
          },
        ]),
      );

      const categoryPrompt = `
        ### INSTRUCTIONS ###
        You MUST follow these rules:
        1. Analyze the provider information below
        2. Select ONLY from these EXACT category names:
           ${categories.map((c) => `- "${c.name}"`).join('\n')}
        3. Return ONLY valid JSON format with EXACTLY this structure:
           {
             "categories": ["CategoryName1", "CategoryName2"]
           }
  
        ### PROVIDER INFORMATION ###
        Name: ${providerName}
        Description: ${providerDescription || 'No description provided'}
  
        ### YOUR RESPONSE MUST BE ###
      `;

      this.logger.debug('Sending category prompt to AI', {
        prompt: categoryPrompt,
      });

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let categoryResponse;
      try {
        const result = await model.generateContent(categoryPrompt);
        const responseText = await result.response.text();
        this.logger.debug('Raw AI response', { response: responseText });

        const jsonString = this.extractJSON(responseText);
        if (!jsonString) throw new Error('No valid JSON found in response');

        categoryResponse = JSON.parse(jsonString);

        if (
          !categoryResponse?.categories ||
          !Array.isArray(categoryResponse.categories)
        ) {
          throw new Error('Invalid response structure from AI');
        }
      } catch (error) {
        this.logger.error('AI processing failed', {
          error: error.message,
          stack: error.stack,
        });
        throw new Error('AI categorization failed. Please try again.');
      }

      const validCategoryIds: string[] = [];
      const validTagIds: string[] = [];

      for (const categoryName of categoryResponse.categories) {
        const lowerName = categoryName.toLowerCase();
        if (categoryMap.has(lowerName)) {
          validCategoryIds.push(categoryMap.get(lowerName).id);
        }
      }

      if (validCategoryIds.length) {
        const matchingTags = await this.TagsModel.find({
          isActivated: true,
          categoryIds: { $in: validCategoryIds },
        }).lean();

        validTagIds.push(...matchingTags.map((tag) => tag._id.toString()));

        this.logger.debug('Found matching tags', {
          categoryIds: validCategoryIds,
          matchingTags: matchingTags.map((t) => t.name),
          tagIds: validTagIds,
        });
      }

      const updateData = {
        category: validCategoryIds,
        subcategory: validTagIds,
        updatedAt: new Date(),
      };

      const updatedProvider = await this.dummyproviderModel.findByIdAndUpdate(
        providerId,
        { $set: updateData },
        { new: true },
      );

      this.logger.log(
        'Successfully updated provider categories and subcategories',
        {
          providerId,
          categories: validCategoryIds,
          subcategories: validTagIds,
        },
      );

      return updatedProvider;
    } catch (error) {
      this.logger.error('Provider categorization failed', {
        error: error.message,
        providerId,
        providerName,
        providerDescription,
        stack: error.stack,
      });

      throw new HttpException(
        {
          status:
            error instanceof NotFoundException
              ? HttpStatus.NOT_FOUND
              : HttpStatus.BAD_REQUEST,
          message: error.message.includes('AI')
            ? 'Failed to process provider categorization. Please try again.'
            : error.message,
          providerId,
          providerName,
        },
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateAllDummyProvidersCategories() {
    this.logger.log('[service:provider:updateAllDummyProvidersCategories]');

    try {
      // 1. Get all dummy providers
      const dummyProviders = await this.dummyproviderModel.find().lean();
      if (!dummyProviders.length) {
        throw new Error('No dummy providers found');
      }

      // 2. Get all active categories and tags once
      const [categories] = await Promise.all([
        this.TagsModel.find({ isActivated: true }).lean(),
      ]);

      if (!categories.length) throw new Error('No active categories found');

      // 3. Create lookup maps
      const categoryMap = new Map(
        categories.map((category) => [
          category.name.toLowerCase(),
          {
            id: category._id.toString(),
            exactName: category.name,
          },
        ]),
      );

      // 4. Generate AI prompt template
      const promptTemplate = `
        ### INSTRUCTIONS ###
        You MUST follow these rules:
        1. Analyze the provider information below
        2. Select ONLY from these EXACT category names:
           ${categories.map((c) => `- "${c.name}"`).join('\n')}
        3. Return ONLY valid JSON format with EXACTLY this structure:
           {
             "categories": ["CategoryName1", "CategoryName2"]
           }
  
        ### PROVIDER INFORMATION ###
        Name: {providerName}
        Description: {providerDescription}
  
        ### YOUR RESPONSE MUST BE ###
      `;

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // 5. Process each provider with 5-second delay
      const results = [];
      const DELAY_MS = 5000; // 5 second delay between providers

      for (const provider of dummyProviders) {
        try {
          const providerId = provider._id.toString();
          const providerDescription = provider.discription || ''; // Fixed typo from 'discription'
          const providerName = provider.businessName?.[0] || 'Unnamed Provider';

          // Get user for provider name fallback
          const user = await this.userModel.findById(provider.provider).lean();
          if (!user) {
            this.logger.warn(`User not found for provider ${providerId}`);
            results.push({
              providerId,
              error: 'User not found',
              success: false,
            });
            await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
            continue;
          }

          const userName = user?.userName?.[0] || '';

          // 6. Generate AI prompt for this provider
          const categoryPrompt = promptTemplate
            .replace('{providerName}', providerName || userName)
            .replace('{providerDescription}', providerDescription);

          this.logger.debug(`Processing provider ${providerId}`, {
            name: providerName,
            description: providerDescription,
          });

          // 7. Call AI service
          let categoryResponse;
          try {
            const result = await model.generateContent(categoryPrompt);
            const responseText = await result.response.text();
            const jsonString = this.extractJSON(responseText);
            if (!jsonString) throw new Error('No valid JSON found in response');

            categoryResponse = JSON.parse(jsonString);

            if (
              !categoryResponse?.categories ||
              !Array.isArray(categoryResponse.categories)
            ) {
              throw new Error('Invalid response structure from AI');
            }
          } catch (error) {
            this.logger.error(
              `AI processing failed for provider ${providerId}`,
              {
                error: error.message,
              },
            );
            results.push({
              providerId,
              error: `AI processing failed: ${error.message}`,
              success: false,
            });
            await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
            continue;
          }

          // 8. Process AI response
          const validCategoryIds: string[] = [];
          for (const categoryName of categoryResponse.categories) {
            const lowerName = categoryName.toLowerCase();
            if (categoryMap.has(lowerName)) {
            }
          }

          // 9. Find matching tags
          const validTagIds: string[] = [];
          if (validCategoryIds.length) {
            const matchingTags = await this.TagsModel.find({
              isActivated: true,
              categoryIds: { $in: validCategoryIds },
            }).lean();

            validTagIds.push(...matchingTags.map((tag) => tag._id.toString()));
          }

          // 10. Update provider
          const updateData = {
            category: validCategoryIds,
            subcategory: validTagIds,
            updatedAt: new Date(),
          };

          const updatedProvider =
            await this.dummyproviderModel.findByIdAndUpdate(
              providerId,
              { $set: updateData },
              { new: true },
            );

          results.push({
            providerId,
            categories: validCategoryIds,
            subcategories: validTagIds,
            success: true,
          });

          this.logger.debug(`Updated provider ${providerId}`, {
            categories: validCategoryIds,
            subcategories: validTagIds,
          });
        } catch (error) {
          this.logger.error(`Failed to process provider ${provider._id}`, {
            error: error.message,
          });
          results.push({
            providerId: provider._id.toString(),
            error: error.message,
            success: false,
          });
        }

        // Add delay after processing each provider
        if (provider !== dummyProviders[dummyProviders.length - 1]) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }

      return {
        totalProcessed: dummyProviders.length,
        successCount: results.filter((r) => r.success).length,
        failedCount: results.filter((r) => !r.success).length,
        results,
      };
    } catch (error) {
      this.logger.error('Failed to update dummy providers', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private extractJSON(text: string): string | null {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : null;
  }

  async ProvidersCategoriesAndTagsByProviderId(
    providerId: string,
    promptId: string,
  ) {
    this.logger.log(
      '[service:provider:ProvidersCategoriesAndTagsByProviderId]',
    );

    try {
      let CategoriesName = [];
      
      const Providers = await this.providerModel
        .find({ user: new ObjectId(providerId) })
        .lean();
      if (!Providers && Provider.length <= 0) {
        throw new Error('No providers found');
      } else if (!Providers[0].website && Providers[0].website !== '') {
        throw new Error('these provider has no website');
      } else if (Providers[0].website) {
        try {
          const prompt = '';
          const searchValue = prompt
          console.log('searchValue ===>>>', searchValue);
          const chatgpt = new ChatGPT(
            'YOUR_OPENAI_KEY',
          );
          try {
            // Send prompt to ChatGPT
            const [err, chatResponse] = await chatgpt.createCompletions(
              searchValue,
            );
            console.log('chatResponse ====>>>>', chatResponse);

            if (err) {
              console.warn(`ChatGPT Error for provider:`, err.message);
            }

            let responseData;
            try {
              const jsonString = this.getDateStringToJSON(
                chatResponse[0]?.message?.content || '{}',
              );
              responseData = JSON.parse(jsonString);
            } catch (parseError) {
              console.warn(
                'ChatGPT Response Parsing Error:',
                parseError.message,
              );
              console.warn(
                'Invalid Response:',
                chatResponse[0]?.message?.content,
              );
            }

            if (responseData?.categories?.length) {
              console.log('Programs:', responseData.categories);
              let ctname = responseData.categories;
            
            }
          } catch (error) {
            console.error(
              `Error processing dump for provider ${Provider[0].website}:`,
              error.message,
            );
          }
        } catch (error) {
          throw new HttpException(
            'Failed to chatgpt response',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      console.error('Error update users:', error);
      throw new HttpException(
        'Failed to update categories in provider',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async TaggingTagAndCategoryInChildCareProgram(
    programId: string,
    promptId: string,
  ) {
    this.logger.log(
      '[service:provider:TaggingTagAndCategoryInChildCareProgram]',
    );

    try {
      let CategoriesName = [];
      
      const Providers = await this.dummyprogramModel
        .findById({ _id: new ObjectId(programId) })
        .lean();
      if (!Providers) {
        throw new Error('No providers found');
      } else if (Providers) {
        try {
          const programDetail = [];
          if (Providers.name[0]) {
            programDetail.push(Providers.name[0]);
          }
          if (Providers.description[0]) {
            programDetail.push(Providers.description[0]);
          }
          // console.log('Providers ===>>>',Providers)
          const prompt = '';
          const programDetailStr = programDetail.join(', ');
          const searchValue = prompt
            .replace(/\[WEBSITE\]/gi, programDetailStr)
            .replace(/\[CategoriesName\]/gi, CategoriesName.join(', '));
          // console.log('searchValue ===>>>', searchValue);
          const chatgpt = new ChatGPT(
            'YOUR_OPENAI_KEY',
          );
          try {
            // Send prompt to ChatGPT
            const [err, chatResponse] = await chatgpt.createCompletions(
              searchValue,
            );
            // console.log('chatResponse ====>>>>',chatResponse)

            if (err) {
              console.warn(`ChatGPT Error for provider:`, err.message);
            }

            let responseData;
            try {
              const jsonString = this.getDateStringToJSON(
                chatResponse[0]?.message?.content || '{}',
              );
              responseData = JSON.parse(jsonString);
            } catch (parseError) {
              console.warn(
                'ChatGPT Response Parsing Error:',
                parseError.message,
              );
              console.warn(
                'Invalid Response:',
                chatResponse[0]?.message?.content,
              );
            }

            if (responseData?.categories?.length) {
              // console.log('Programs:', responseData.categories);
              let ctname = responseData.categories;
             
            }
          } catch (error) {
            console.error(
              `Error processing dump for provider ${Provider[0].website}:`,
              error.message,
            );
          }
        } catch (error) {
          throw new HttpException(
            'Failed to chatgpt response',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      console.error('Error update users:', error);
      throw new HttpException(
        'Failed to update categories in provider',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAllEventsFriendly() {
    this.logger.log('[service:citymanagement:updateAllEventsFriendly]');

    // Get all event links that are marked as event details
    const allEventLinks = await this.eventlinkModel
      .find({
        is_event_detail: true,
      })
      .lean();

    if (!allEventLinks.length) {
      console.log('No event links found to update.');
      return { message: 'No events found to update', updatedCount: 0 };
    }

    const eventIds = allEventLinks.map((event) => event._id.toString());
    console.log(`Found ${eventIds.length} events to update`);

    // Process in batches to avoid overwhelming the system
    const batchSize = 10;
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < eventIds.length; i += batchSize) {
      const batch = eventIds.slice(i, i + batchSize);
      console.log(
        `Processing batch ${i / batchSize + 1} of ${Math.ceil(
          eventIds.length / batchSize,
        )}`,
      );

      try {
        await this.updateEventsFriendly(batch);
        successCount += batch.length;
      } catch (error) {
        console.error(`Error processing batch starting at index ${i}:`, error);
        errorCount += batch.length;
      }

      processedCount += batch.length;
      console.log(`Processed ${processedCount} of ${eventIds.length} events`);
    }

    return {
      message: 'Batch update completed',
      totalEvents: eventIds.length,
      successCount,
      errorCount,
      batchesProcessed: Math.ceil(eventIds.length / batchSize),
    };
  }

  async TaggingAllProgramsInChildCareProviderByProviderId( providerId: string, promptId: string ) {

    this.logger.log('[service:provider:TaggingAllProgramsInChildCareProviderByProviderId]');

    try {
      
      const Providers = await this.dummyprogramModel.find({ provider: new ObjectId(providerId) });
      if (!Providers.length) {
        throw new Error('No Programs found');
      } else if (Providers.length > 0) {
        try {
          for(let items of Providers){
            const programId = items._id.toString();
            await this.TaggingTagAndCategoryInChildCareProgram(programId, promptId);
          }
         } catch (error) {
          throw new HttpException(
            'Failed to chatgpt response',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      console.error('Error update users:', error);
      throw new HttpException(
        'Failed to update categories in provider',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
