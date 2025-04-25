import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path, { join } from 'path';
const fs = require('fs');
import * as XLSX from 'xlsx';
// const cron = require('node-cron');
import cron from 'node-cron';
const validUrl = require('valid-url');
import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
const credPath = join(
  process.cwd(),
  'src',
  'app',
  'gemini',
  'cred',
  'cred.json',
);
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
import { User } from 'src/schemas/user.schema';
import { Provider } from 'src/schemas/provider.schema';

import { Tags } from 'src/schemas/tags.schema';

import { Takelessionsubject } from 'src/schemas/takelessionsubject.schema';
import { Takelessioncategory } from 'src/schemas/takelessioncategory.schema';
import { Takelessiondump } from 'src/schemas/takelessiondump.schema';
import { Takelessionprovider } from 'src/schemas/takelessionprovider.schema';
const ObjectId = require('mongoose').Types.ObjectId;
import { Tasklessonreview } from 'src/schemas/tasklessonreview.schema';
import { Takelessonproviderjson } from 'src/schemas/takelessonproviderjson.schema';
import { Subjectprovider } from 'src/schemas/subjectprovider.schema';
import { TakelessonsubjectLessonsjson } from 'src/schemas/takelessonsubjectLessonsjson.schema';
import { Eventlink } from 'src/schemas/eventlink.schema';
import { Event } from 'src/schemas/event.schema ';
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
import { Dummyprogram } from 'src/schemas/dummyprogram.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Program } from 'src/schemas/program.schema';

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

interface Price {
  priceUnit?: string;
  priceType?: string;
  pricePerParticipant?: string;
  pricePerHour?: string;
  classDuration?: string;
  halfOrFullDay?: string;
  title?: string;
  duration?: string;
  noOfHours?: string;
  noOfDays?: string;
  noOfWeeks?: string;
}

@Injectable()
export class ProgramScrapService {
  static filesFolder = 'excel_files';
  static ProviderfilesFolder = 'files';
  private readonly logger = new Logger(ProgramScrapService.name);
  private readonly httpService: HttpService = new HttpService();
  private cronJob: cron.ScheduledTask | null = null;
  private cronJobEvent: cron.ScheduledTask | null = null;
  private cronJobEventHobokenLibrary: cron.ScheduledTask | null = null;
  private cronJobEventHobokenPublicLibrary: cron.ScheduledTask | null = null;
  private cronJobEventJerseyCityCulture: cron.ScheduledTask | null = null;
  private cronJobEventHobokenMuseum: cron.ScheduledTask | null = null;
  private cronJobFamily: cron.ScheduledTask | null = null;
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

    @InjectModel(Dummyprogram.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly dummyprogramModel: Model<Dummyprogram>,

    @InjectModel(
      Schoolproviderprograminfo.name,
      DATABASE_CONNECTION.WEBSCRAPING,
    )
    private readonly schoolproviderprograminfoModel: Model<Schoolproviderprograminfo>,

    @InjectModel(Allschoolprogramdump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly allschoolprogramdumpModel: Model<Allschoolprogramdump>,
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
    
    @InjectModel(Program.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly programModel: Model<Program>,
    @InjectModel(User.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly UserModel: Model<User>,
   
  ) {}

async getProgramFromDump(id: string, status?) {
    //   const res = await this.webdumpModel
    //     .findOne({ provider: id })
    const cleanDump = await this.cleandumpModel.findById(id);
    if (!cleanDump) {
      throw new HttpException('Dump Data not found 1', HttpStatus.NOT_FOUND);
    }
    const webDump = await this.webdumpModel.findById(cleanDump.dumpId);

    return { cleanDump, webDump };
}

getDateStringToJSON(contentString) {
    const jsonRegex =
      /```json([\s\S]+?)```|{[^{}]*}|```markdown\n({[\s\S]*})\n```|```(?:json)?\n([\s\S]+?)```|\{(?:[^{}]|(?:\{(?:[^{}]|)*\}))*\}/;

    const jsonDataMatch = contentString.match(jsonRegex);

    // console.log('jsonDataMatch====>>>>', jsonDataMatch);

    if (jsonDataMatch) {
      const jsonDataString =
        jsonDataMatch[1] ||
        jsonDataMatch[2] ||
        jsonDataMatch[3] ||
        jsonDataMatch[4];

      if (jsonDataString) {
        return jsonDataString.trim();
      }
    }
    return '{}'; // Return an empty JSON object as a fallback
}

getDateStringToJSONs(contentString: string): string {
    // Regex to match valid JSON blocks
    const jsonRegex = /```json([\s\S]+?)```|```([\s\S]+?)```|{[\s\S]*}/;

    const jsonDataMatch = contentString.match(jsonRegex);

    // console.log('jsonDataMatch====>>>>', jsonDataMatch);

    if (jsonDataMatch) {
      const jsonDataString =
        jsonDataMatch[1] || jsonDataMatch[2] || jsonDataMatch[0];

      try {
        // Validate if the extracted string is valid JSON
        JSON.parse(jsonDataString);
        return jsonDataString.trim();
      } catch (error) {
        console.error('Invalid JSON extracted:', error.message);
        return '{}'; // Return an empty JSON object as fallback
      }
    }

    console.warn('No JSON block found in content');
    return '{}'; // Return an empty JSON object as fallback
}

async cleanProgramDumpByQueue(id: string) {
    // Fetch data with aggregation
    const data = await this.cleandumpModel.aggregate([
      { $match: { provider: new ObjectId(id), isProgramDataAvailable: true } },
    ]);

    if (!data || !data.length) {
      throw new HttpException('Dump Data not found 2', HttpStatus.NOT_FOUND);
    }

    for (const dres of data) {
      const prompt = `${dres.content} in this content please provide me program name and program description in a JSON format like: { "programs": [{ "name": "", "description": "" }] }`;

      const chatgpt = new ChatGPT(
        'YOUR_OPENAI_KEY',
      );

      try {
        const [err, chat_response] = await chatgpt.createCompletion(prompt);

        if (err) {
          console.warn('ChatGPT Error:', err.message);
          continue; // Skip this iteration if ChatGPT fails
        }

        let responseData;
        try {
          const jsonString = this.getDateStringToJSON(
            chat_response[0]?.message?.content || '{}',
          );
          responseData = JSON.parse(jsonString);
        } catch (parseError) {
          console.warn('ChatGPT Response Parsing Error:', parseError.message);
          console.warn('Invalid Response:', chat_response[0]?.message?.content);
          continue; // Skip this iteration if parsing fails
        }

        console.log('responseData ====>>>>>', responseData);

        if (responseData?.programs?.length > 0) {
          for (const program of responseData.programs) {
            const { name, description } = program;

            // Check if a Dummyprogram with the same provider, name, and description already exists
            const existingProgram = await this.dummyprogramModel.findOne({
              provider: new ObjectId(id),
              name,
              description,
            });

            if (!existingProgram) {
              // Create a new Dummyprogram document for each program
              const newProgram = new this.dummyprogramModel({
                provider: new ObjectId(id),
                name,
                description,
                createdOn: new Date(),
                updatedOn: new Date(),
              });

              await newProgram.save();
              console.log(`New Dummyprogram created: ${name}`);
            } else {
              console.log(`Dummyprogram already exists: ${name}`);
            }
          }
        }
      } catch (error) {
        console.error('Error processing content:', error.message);
        continue; // Skip this iteration if any unexpected error occurs
      }
    }
}

async cleanProgramDumpAndCreateDummyProgramByCity(id: string) {
    try {
      // Fetch providers in the specified city with aggregation
      const providers = await this.userModel.aggregate([
        {
          $match: {
            cityId: new ObjectId(id),
            role: 'provider',
            status: 'Verified',
          },
        },
        {
          $lookup: {
            from: 'providers',
            localField: '_id',
            foreignField: 'user',
            as: 'provider',
          },
        },
        { $match: { 'provider.providerType': 'regular' } },
      ]);

      console.log('Number of providers:', providers.length);

      if (!providers.length) {
        throw new HttpException(
          'No verified providers found in the city',
          HttpStatus.NOT_FOUND,
        );
      }

      for (const provider of providers) {
        // Fetch all dump data for this provider
        const dumpData = await this.cleandumpModel.find({
          provider: new ObjectId(provider._id),
          isProgramDataAvailable: true,
          dummyProgram: false,
        });

        if (!dumpData.length) {
          console.warn(`No dump data found for provider: ${provider._id}`);
          continue;
        }

        for (const dump of dumpData) {
          const prompt = `${dump.content} in this content please provide me program name and program description in a JSON format like: { "programs": [{ "name": "", "description": "" }] }`;

          // Initialize ChatGPT client
          const chatgpt = new ChatGPT(
            'YOUR_OPENAI_KEY',
          );

          try {
            // Send prompt to ChatGPT
            const [err, chatResponse] = await chatgpt.createCompletion(prompt);

            if (err) {
              console.warn(
                `ChatGPT Error for provider ${provider._id}:`,
                err.message,
              );
              continue; // Skip on ChatGPT failure
            }

            let responseData;
            try {
              const jsonString = this.getDateStringToJSON(
                chatResponse[0]?.message?.content || '{}',
              );
              responseData = JSON.parse(jsonString);
            } catch (parseError) {
              console.warn(
                'Error parsing ChatGPT response:',
                parseError.message,
              );
              console.warn(
                'Invalid response:',
                chatResponse[0]?.message?.content,
              );
              continue;
            }

            console.log('Parsed Response Data:', responseData);

            if (responseData?.programs?.length) {
              for (const program of responseData.programs) {
                const { name, description } = program;

                // Check if a program with the same name already exists for the same provider
                const existingProgram = await this.dummyprogramModel.findOne({
                  provider: new ObjectId(provider._id),
                  name: name.trim(),
                });

                if (existingProgram) {
                  // If the program exists but the description is different, append the description
                  if (!existingProgram.description.includes(description)) {
                    await this.dummyprogramModel.updateOne(
                      { _id: existingProgram._id },
                      {
                        $set: { updatedOn: new Date() },
                        $addToSet: { description: description.trim() }, // Add unique descriptions
                      },
                    );
                    console.log(
                      `Updated description for Dummyprogram: ${name}`,
                    );
                  } else {
                    console.log(`Duplicate program found, skipping: ${name}`);
                  }
                } else {
                  // Create new dummy program if it doesn't exist
                  await new this.dummyprogramModel({
                    provider: new ObjectId(provider._id),
                    name: name.trim(),
                    description: [description.trim()],
                    createdOn: new Date(),
                    updatedOn: new Date(),
                  }).save();

                  console.log(`New Dummyprogram created: ${name}`);
                }

                // Update dump data to mark the program as processed
                await this.cleandumpModel.updateOne(
                  { _id: new ObjectId(dump._id) },
                  { $set: { dummyProgram: true } },
                );
              }
            }
          } catch (error) {
            console.error(
              `Error processing dump for provider ${provider._id}:`,
              error.message,
            );
          }
        }
      }

      console.log('All providers processed successfully.');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Rethrow already formatted HTTP exception
      }
      console.error(
        'Error in cleanProgramDumpAndCreateDummyProgramByCity:',
        error.message,
      );
      throw new HttpException(
        {
          isSuccess: false,
          statusCode: 500,
          error: 'An error occurred while processing',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async getDummyProgramByProvider(id: string) {
    // Fetch data with aggregation
    const data = await this.dummyprogramModel.aggregate([
      { $match: { provider: new ObjectId(id) } },
      
    ]);

    if (!data || !data.length) {
      throw new HttpException('Dump Data not found 3', HttpStatus.NOT_FOUND);
    }
    return data;
}

async saveGeminiHistory(question, answer, userId) {
    const historyModel = {
      question: question,
      answers: [answer],
      searchFrom: userId,
    };
}

async getDataFromGeminiAdvanceByProgramDumpId(id: string, req) {
    console.log('id', id);

    const data = await this.cleandumpModel.findById(id);

    if (data) {
      const prompt = `${data.content} in this content please provide me program name and program description, program price, program timing, program type, program location in a JSON format like: { "programs": [{ "name": "", "description": "", "price": "", "location":"", timing: "", "type": "" }] }`;

      const genAI = new GoogleGenerativeAI(
        'YOUR_GOOGLE_KEY',
      );
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // const prompt = "Explain how AI works";

      const result = await model.generateContent(prompt);
      console.log(result.response.text());
      let responseData;
      try {
        const jsonString = this.getDateStringToJSON(result.response.text());
        responseData = JSON.parse(jsonString);
      } catch (parseError) {
        console.warn('Error parsing ChatGPT response:', parseError.message);
        console.warn('Invalid response:', result.response.text());
      }
      return responseData;
    }
}

async createDummyProgramFromGeminiAdvanceByProvider(id: string, req) {
    console.log('id', id);

    const data = await this.cleandumpModel.find({
      provider: new ObjectId(id),
      isProgramDataAvailable: true,
    });

    if (data) {
      for (const dres of data) {
        // const prompt = `${dres.content} in this content please provide me program name and program description, program price, program timing, program type, program location in a JSON format like: { "programs": [{ "name": "", "description": "", "price": "", "location":"", timing: "", "type": "" }] }`;
        const prompt = `
        ${dres.content}
        
        In this content, extract only the data that is explicitly mentioned and available. Do not provide any inferred, estimated, or placeholder values. If any of the following fields are missing or not explicitly mentioned, return them as empty:
        
        {
          "programs": [
            {
              "name": "",
              "description": "",
              "price": "",
              "location": "",
              "timing": "",
              "type": ""
            }
          ]
        }
        
        Only return data in the format above, and do not generate data or suggest anything not explicitly found in the content.
        `;

        const genAI = new GoogleGenerativeAI(
          'YOUR_GOOGLE_KEY',
        );
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        try {
          // Send prompt to ChatGPT
          const result = await model.generateContent(prompt);

          let responseData;
          try {
            const jsonString = this.getDateStringToJSON(result.response.text());
            responseData = JSON.parse(jsonString);
          } catch (parseError) {
            console.warn('Error parsing ChatGPT response:', parseError.message);
            console.warn('Invalid response:', result.response.text());
            continue;
          }

          console.log('Parsed Response Data:', responseData);

          if (responseData?.programs?.length) {
            for (const program of responseData.programs) {
              const { name, description, price, location, timing, type } =
                program;

              if (!name) continue; // Skip if essential data like name is missing

              // Check if a program with the same name already exists for the same provider
              const existingProgram = await this.dummyprogramModel.findOne({
                provider: new ObjectId(id),
                name: name.trim(),
              });

              if (existingProgram) {
                // If the program exists but the description is different, append the description
                if (!existingProgram.description.includes(description)) {
                  await this.dummyprogramModel.updateOne(
                    { _id: existingProgram._id },
                    {
                      $set: { updatedOn: new Date() },
                      $addToSet: { description: description.trim() }, // Add unique descriptions
                    },
                  );
                  console.log(`Updated description for Dummyprogram: ${name}`);
                } else {
                  console.log(`Duplicate program found, skipping: ${name}`);
                }
              } else {
                // Create new dummy program if it doesn't exist
                await new this.dummyprogramModel({
                  provider: new ObjectId(id),
                  name: name.trim(),
                  description: [description.trim()],
                  price: price?.trim() || '',
                  location: location?.trim() || '',
                  timing: timing?.trim() || '',
                  type: type?.trim() || '',
                  createdOn: new Date(),
                  updatedOn: new Date(),
                }).save();
                console.log(`New Dummyprogram created: ${name}`);
              }

              // Update dump data to mark the program as processed
              await this.cleandumpModel.updateOne(
                { _id: new ObjectId(dres._id) },
                { $set: { dummyProgram: true } },
              );
            }
          }
        } catch (error) {
          console.error(
            `Error processing dump for provider ${dres._id}:`,
            error.message,
          );
        }
      }
    }
}

async createDummyProgramFromGeminiAdvanceByDumpId(id: string) {
    console.log('Processing Dump ID:', id);

    try {
      const data = await this.cleandumpModel.findById({
        _id: new ObjectId(id),
        isProgramDataAvailable: true,
      });

      if (!data) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      if (data.dummyProgram === true && data.gemini === true) {
        throw new HttpException(
          'This Dump Has Already Created Programs!!!',
          HttpStatus.NOT_FOUND,
        );
      }

      if (data.isProgramDataAvailable === true) {
        const prompt = `${data.content}

In this content, extract only the data explicitly mentioned. Do not infer, estimate, or add placeholder values. If any field is missing or not explicitly mentioned, return them as empty. Return the extracted data in the following format:

{
  "programs": [
    {
                                 "name": "", 
                                 "emails": ["",""...], 
                                 "description": "",
                                 "ageGroup": {},
                                 "skilllevel": "",
                                 "isFreeTrial": true/false,
                                 "parentalSupervisionRequired": "chose value from only :- No data available || Parent attendance NOT  required || Parent attendance NOT required || Parent attendance required",
                                 "earlyDrop_off_LatePick_up": {},
                                 "maxStudentsPerClass": "",
                                 "session_premises": "chose value from only :- private-class || class || camp || party || child-care || event",
                                 "privateOrGroup": "chose value from only :- private || group",
                                 "session_premises": "chose value from only :- indoor || outdoor || either || no data available",
                                 "canParentsParticipateInActivity": true/false,
                                 "seatsAvailable": "", 
                                 "activityRecurring": { "days": [], "activityRecurring": boolean },
                                 "indoorOroutdoor": "", 
                                 "inpersonOrVirtual": "",
                                 "duration": { "hours": "", "minutes": "" },  
                                 "time": { "from": "", "to": "" },
                                 "bookingCancelledIn": { "days": "", "hours": "" },
                                 "capacity": { "min": "", "max": "" },     
                                 "groupDiscount": { "noOfStudents": 0, "discountPercent": "" },
                                 "priceForSiblings": "", 
                                 "adultAssistanceIsRequried": boolean,      
                                 "prices": {
                                   "priceUnit": "", 
                                   "priceType": "", 
                                   "pricePerParticipant": "", 
                                   "pricePerHour": "", 
                                   "classDuration": "", 
                                   "youEarn": "", 
                                   "noOfUnits": "1",
                                   "priceProrated": false, 
                                   "setDefault": false, 
                                   "halfOrFullDay": "", 
                                   "title": "", 
                                   "recurrence": "", 
                                   "duration": "", 
                                   "noOfHours": "", 
                                   "noOfDays": "", 
                                   "addOnprices": [], 
                                   "noOfWeeks": "", 
                                   "candace": "" 
                                 },        
                                 "languages": { "language": "", "proficiency": "" },
                                 "healthAndSafety": "",  
                                 "location": "", 
                                 "timing": "", 
                                 "type": "", 
                                 "schedule": { "day": "", "startTime": "", "endTime": "", "frequency": "", "notes": "" }
                               }
  ]
}

Only extract and return the data explicitly available in the content provided above. Do not generate or assume any additional information. Fields not explicitly mentioned should remain empty or have their default values as specified above.
`;

        const genAI = new GoogleGenerativeAI(
          'YOUR_GOOGLE_KEY',
        );
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        try {
          const result = await model.generateContent(prompt);
          console.log('Raw Response Text:', result.response.text());

          let jsonString;
          let responseData;

          try {
            jsonString = this.getDateStringToJSO(result.response.text());
            responseData = JSON.parse(jsonString);
            console.log('Parsed JSON Response:', responseData);
          } catch (error) {
            console.error('Error parsing JSON:', error.message);
            throw new Error('Invalid JSON from AI model');
          }

          if (responseData?.programs?.length) {
            console.log('Extracted Programs:', responseData.programs);

            for (const program of responseData.programs) {
              try {
                const {
                  name,
                  description,
                  earlyDrop_off_LatePick_up,
                  canParentsParticipateInActivity,
                  maxStudentsPerClass,
                  seatsAvailable,
                  activityRecurring,
                  indoorOroutdoor,
                  inpersonOrVirtual,
                  ageGroup,
                  duration,
                  time,
                  bookingCancelledIn,
                  capacity,
                  // batches,
                  // sessions,
                  groupDiscount,
                  priceForSiblings,
                  adultAssistanceIsRequried,
                  prices,
                  languages,
                  healthAndSafety,
                  location,
                  timing,
                  type,
                  schedule,
                  session_premises,
                  programType,
                  emails,
                  skilllevel,
                  isFreeTrial,
                  parentalSupervisionRequired,
                  privateOrGroup,
                } = program;

                if (!name) {
                  console.warn('Skipping program without name:', program);
                  continue;
                }

                console.log('Processing Program:', name);

                const existingProgram = await this.dummyprogramModel.findOne({
                  provider: new ObjectId(id),
                  name: name.trim(),
                  createFrom: 'GEMINI',
                });

                if (existingProgram) {
                  console.log('Existing program found:', existingProgram.name);
                  if (
                    description &&
                    !existingProgram.description.includes(description)
                  ) {
                    await this.dummyprogramModel.updateOne(
                      { _id: existingProgram._id },
                      {
                        $set: { updatedOn: new Date() },
                        $addToSet: { description: description.trim() },
                      },
                    );
                    console.log(`Updated program description: ${name}`);
                  } else {
                    console.log(
                      `Duplicate program detected, skipping: ${name}`,
                    );
                  }
                } else {
                  console.log('Creating new program:', name);
                  const dp = await new this.dummyprogramModel({
                    provider: new ObjectId(data.provider),
                    name: name.trim(),
                    description: [description.trim()],
                    prices: prices || {},
                    schedule: schedule || {},
                    location: location?.trim() || '',
                    timing: timing?.trim() || '',
                    type: type?.trim() || '',
                    createFrom: 'ChatGPT',
                    earlyDrop_off_LatePick_up: earlyDrop_off_LatePick_up,
                    canParentsParticipateInActivity:
                      canParentsParticipateInActivity,
                    maxStudentsPerClass: maxStudentsPerClass,
                    seatsAvailable: seatsAvailable,
                    activityRecurring: activityRecurring,
                    indoorOroutdoor: indoorOroutdoor,
                    inpersonOrVirtual: inpersonOrVirtual,
                    ageGroup: ageGroup,
                    duration: duration,
                    time: time,
                    bookingCancelledIn: bookingCancelledIn,
                    capacity: capacity,
                    // batches: batches,
                    // sessions: sessions,
                    groupDiscount: groupDiscount,
                    priceForSiblings: priceForSiblings,
                    adultAssistanceIsRequried: adultAssistanceIsRequried,
                    languages: languages,
                    healthAndSafety: healthAndSafety,
                    session_premises: session_premises,
                    programType: programType,
                    emails: emails,
                    skilllevel: skilllevel,
                    isFreeTrial: isFreeTrial,
                    parentalSupervisionRequired: parentalSupervisionRequired,
                    privateOrGroup: privateOrGroup,
                    createdOn: new Date(),
                    updatedOn: new Date(),
                  }).save();
                  console.log(`New Dummyprogram created: ${name}`);
                  console.log(`New Dummyprogram created: ${dp.prices}`);
                }
              } catch (programError) {
                console.error(
                  'Error processing individual program, skipping:',
                  program,
                  programError.message,
                );
              }
            }

            // Mark dump data as processed
            await this.cleandumpModel.updateOne(
              { _id: new ObjectId(data._id) },
              { $set: { dummyProgram: true, gemini: true } },
            );
          } else {
            console.warn('No valid programs found in response:', responseData);
          }
        } catch (error) {
          console.error('Error during AI processing:', error.message);
        }
      }
    } catch (error) {
      console.error('Error processing dump:', error.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async createDummyProgramFromGeminiAdvance(id: string) {
    console.log('Processing Dump ID:', id);

    try {
      const data = await this.cleandumpModel.find({
        provider: new ObjectId(id),
        isProgramDataAvailable: true,
      });

      if (!data.length) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      if(data.length){
        for(const d of data){
          if (d.dummyProgram === true && d.gemini === true) {
            console.log('This Dump Has Already Created Programs!!!');
            continue;
            // throw new HttpException('This Dump Has Already Created Programs!!!', HttpStatus.NOT_FOUND );
          }
    
          if (d.isProgramDataAvailable === true) {
            const prompt = `${d.content}
    
    In this content, extract only the data explicitly mentioned. Do not infer, estimate, or add placeholder values. If any field is missing or not explicitly mentioned, return them as empty. Return the extracted data in the following format:
    
                              {
                               "programs": [
                                   {
                                     "name": "", 
                                     "emails": ["",""...], 
                                     "description": "",
                                     "ageGroup": {},
                                     "skilllevel": "",
                                     "isFreeTrial": true/false,
                                     "parentalSupervisionRequired": "chose value from only :- No data available || Parent attendance NOT  required || Parent attendance NOT required || Parent attendance required",
                                     "earlyDrop_off_LatePick_up": {},
                                     "maxStudentsPerClass": "",
                                     "session_premises": "chose value from only :- private-class || class || camp || party || child-care || event",
                                     "privateOrGroup": "chose value from only :- private || group",
                                     "session_premises": "chose value from only :- indoor || outdoor || either || no data available",
                                     "canParentsParticipateInActivity": true/false,
                                     "seatsAvailable": "", 
                                     "activityRecurring": { "days": [], "activityRecurring": boolean },
                                     "indoorOroutdoor": "", 
                                     "inpersonOrVirtual": "",
                                     "duration": { "hours": "", "minutes": "" },  
                                     "time": { "from": "", "to": "" },
                                     "bookingCancelledIn": { "days": "", "hours": "" },
                                     "capacity": { "min": "", "max": "" },     
                                     "groupDiscount": { "noOfStudents": 0, "discountPercent": "" },
                                     "priceForSiblings": "", 
                                     "adultAssistanceIsRequried": boolean,      
                                     "prices": {
                                       "priceUnit": "", 
                                       "priceType": "", 
                                       "pricePerParticipant": "", 
                                       "pricePerHour": "", 
                                       "classDuration": "", 
                                       "youEarn": "", 
                                       "noOfUnits": "1",
                                       "priceProrated": false, 
                                       "setDefault": false, 
                                       "halfOrFullDay": "", 
                                       "title": "", 
                                       "recurrence": "", 
                                       "duration": "", 
                                       "noOfHours": "", 
                                       "noOfDays": "", 
                                       "addOnprices": [], 
                                       "noOfWeeks": "", 
                                       "candace": "" 
                                     },        
                                     "languages": { "language": "", "proficiency": "" },
                                     "healthAndSafety": "",  
                                     "location": "", 
                                     "timing": "", 
                                     "type": "", 
                                     "schedule": { "day": "", "startTime": "", "endTime": "", "frequency": "", "notes": "" }
                                   }
                                ]
                               }
    
    Only extract and return the data explicitly available in the content provided above. Do not generate or assume any additional information. Fields not explicitly mentioned should remain empty or have their default values as specified above.
    `;
    
            const genAI = new GoogleGenerativeAI(
              'YOUR_GOOGLE_KEY',
            );
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
            try {
              const result = await model.generateContent(prompt);
              console.log('Raw Response Text:', result.response.text());
    
              let jsonString;
              let responseData;
    
              try {
                jsonString = this.getDateStringToJSO(result.response.text());
                responseData = JSON.parse(jsonString);
                console.log('Parsed JSON Response:', responseData);
              } catch (error) {
                console.error('Error parsing JSON:', error.message);
                // throw new Error('Invalid JSON from AI model');
              }
    
              if (responseData?.programs?.length) {
                console.log('Extracted Programs:', responseData.programs);
    
                for (const program of responseData.programs) {
                  try {
                    const {
                      name,
                      description,
                      earlyDrop_off_LatePick_up,
                      canParentsParticipateInActivity,
                      maxStudentsPerClass,
                      seatsAvailable,
                      activityRecurring,
                      indoorOroutdoor,
                      inpersonOrVirtual,
                      ageGroup,
                      duration,
                      time,
                      bookingCancelledIn,
                      capacity,
                      // batches,
                      // sessions,
                      groupDiscount,
                      priceForSiblings,
                      adultAssistanceIsRequried,
                      prices,
                      languages,
                      healthAndSafety,
                      location,
                      timing,
                      type,
                      schedule,
                      session_premises,
                      programType,
                      emails,
                      skilllevel,
                      isFreeTrial,
                      parentalSupervisionRequired,
                      privateOrGroup,
                    } = program;
    
                    if (!name) {
                      console.warn('Skipping program without name:', program);
                      continue;
                    }
    
                    console.log('Processing Program:', name);
    
                    const existingProgram = await this.dummyprogramModel.findOne({
                      provider: new ObjectId(id),
                      name: name.trim(),
                      createFrom: 'GEMINI',
                    });
    
                    if (existingProgram) {
                      console.log('Existing program found:', existingProgram.name);
                      if (
                        description &&
                        !existingProgram.description.includes(description)
                      ) {
                        await this.dummyprogramModel.updateOne(
                          { _id: existingProgram._id },
                          {
                            $set: { updatedOn: new Date() },
                            $addToSet: { description: description.trim() },
                          },
                        );
                        console.log(`Updated program description: ${name}`);
                      } else {
                        console.log(
                          `Duplicate program detected, skipping: ${name}`,
                        );
                      }
                    } else {
                      console.log('Creating new program:', name);
                      const dp = await new this.dummyprogramModel({
                        provider: new ObjectId(d.provider),
                        name: name.trim(),
                        description: [description.trim()],
                        prices: prices || {},
                        schedule: schedule || {},
                        location: location?.trim() || '',
                        timing: timing?.trim() || '',
                        type: type?.trim() || '',
                        createFrom: 'ChatGPT',
                        earlyDrop_off_LatePick_up: earlyDrop_off_LatePick_up,
                        canParentsParticipateInActivity:
                          canParentsParticipateInActivity,
                        maxStudentsPerClass: maxStudentsPerClass,
                        seatsAvailable: seatsAvailable,
                        activityRecurring: activityRecurring,
                        indoorOroutdoor: indoorOroutdoor,
                        inpersonOrVirtual: inpersonOrVirtual,
                        ageGroup: ageGroup,
                        duration: duration,
                        time: time,
                        bookingCancelledIn: bookingCancelledIn,
                        capacity: capacity,
                        // batches: batches,
                        // sessions: sessions,
                        groupDiscount: groupDiscount,
                        priceForSiblings: priceForSiblings,
                        adultAssistanceIsRequried: adultAssistanceIsRequried,
                        languages: languages,
                        healthAndSafety: healthAndSafety,
                        session_premises: session_premises,
                        programType: programType,
                        emails: emails,
                        skilllevel: skilllevel,
                        isFreeTrial: isFreeTrial,
                        parentalSupervisionRequired: parentalSupervisionRequired,
                        privateOrGroup: privateOrGroup,
                        createdOn: new Date(),
                        updatedOn: new Date(),
                      }).save();
                      console.log(`New Dummyprogram created: ${name}`);
                      console.log(`New Dummyprogram created: ${dp.prices}`);
                    }
                  } catch (programError) {
                    console.error(
                      'Error processing individual program, skipping:',
                      program,
                      programError.message,
                    );
                  }
                }
    
                // Mark dump data as processed
                await this.cleandumpModel.updateOne(
                  { _id: new ObjectId(d._id) },
                  { $set: { dummyProgram: true, gemini: true } },
                );
              } else {
                console.warn('No valid programs found in response:', responseData);
              }
            } catch (error) {
              console.error('Error during AI processing:', error.message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing dump:', error.message);
      // throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR );
    }
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

async createDummyProgramFromChatGptByDumpId(id: string) {
    console.log('id', id);

    const data = await this.cleandumpModel.findById({
      _id: new ObjectId(id),
      isProgramDataAvailable: true,
    });
    // console.log('data  ====>>>>>>11111', data);

    if (data.isProgramDataAvailable !== true) {
      throw new HttpException('Dump Data not found 31', HttpStatus.NOT_FOUND);
    }
    if (data.dummyProgram === true && data.chatgpt === true) {
      throw new HttpException(
        'This Dump Has Already Created Programs!!!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (data.isProgramDataAvailable === true) {
      // const prompt = `${dres.content} in this content please provide me program name and program description, program price, program timing, program type, program location in a JSON format like: { "programs": [{ "name": "", "description": "", "price": "", "location":"", timing: "", "type": "" }] }`;
      const prompt = `${data.content}

In this content, extract only the data explicitly mentioned. Do not infer, estimate, or add placeholder values. If any field is missing or not explicitly mentioned, return them as empty. Return the extracted data in the following format:

{
  "programs": [
    {
                                 "name": "", 
                                 "emails": ["",""...], 
                                 "description": "",
                                 "ageGroup": {},
                                 "skilllevel": "",
                                 "isFreeTrial": true/false,
                                 "parentalSupervisionRequired": "chose value from only :- No data available || Parent attendance NOT  required || Parent attendance NOT required || Parent attendance required",
                                 "earlyDrop_off_LatePick_up": {},
                                 "maxStudentsPerClass": "",
                                 "session_premises": "chose value from only :- private-class || class || camp || party || child-care || event",
                                 "privateOrGroup": "chose value from only :- private || group",
                                 "session_premises": "chose value from only :- indoor || outdoor || either || no data available",
                                 "canParentsParticipateInActivity": true/false,
                                 "seatsAvailable": "", 
                                 "activityRecurring": { "days": [], "activityRecurring": boolean },
                                 "indoorOroutdoor": "", 
                                 "inpersonOrVirtual": "",
                                 "duration": { "hours": "", "minutes": "" },  
                                 "time": { "from": "", "to": "" },
                                 "bookingCancelledIn": { "days": "", "hours": "" },
                                 "capacity": { "min": "", "max": "" },     
                                 "groupDiscount": { "noOfStudents": 0, "discountPercent": "" },
                                 "priceForSiblings": "", 
                                 "adultAssistanceIsRequried": boolean,      
                                 "prices": {
                                   "priceUnit": "", 
                                   "priceType": "", 
                                   "pricePerParticipant": "", 
                                   "pricePerHour": "", 
                                   "classDuration": "", 
                                   "youEarn": "", 
                                   "noOfUnits": "1",
                                   "priceProrated": false, 
                                   "setDefault": false, 
                                   "halfOrFullDay": "", 
                                   "title": "", 
                                   "recurrence": "", 
                                   "duration": "", 
                                   "noOfHours": "", 
                                   "noOfDays": "", 
                                   "addOnprices": [], 
                                   "noOfWeeks": "", 
                                   "candace": "" 
                                 },        
                                 "languages": { "language": "", "proficiency": "" },
                                 "healthAndSafety": "",  
                                 "location": "", 
                                 "timing": "", 
                                 "type": "", 
                                 "schedule": { "day": "", "startTime": "", "endTime": "", "frequency": "", "notes": "" }
                               }
  ]
}

Only extract and return the data explicitly available in the content provided above. Do not generate or assume any additional information. Fields not explicitly mentioned should remain empty or have their default values as specified above.
`;

      const chatgpt = new ChatGPT(
        'YOUR_OPENAI_KEY',
      );

      try {
        // Send prompt to ChatGPT
        const [err, chatResponse] = await chatgpt.createCompletion(prompt);

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
          console.warn('ChatGPT Response Parsing Error:', parseError.message);
          console.warn('Invalid Response:', chatResponse[0]?.message?.content);
        }

        if (responseData?.programs?.length) {
          for (const program of responseData.programs) {
            const {
              name,
              description,
              earlyDrop_off_LatePick_up,
              canParentsParticipateInActivity,
              maxStudentsPerClass,
              seatsAvailable,
              activityRecurring,
              indoorOroutdoor,
              inpersonOrVirtual,
              ageGroup,
              duration,
              time,
              bookingCancelledIn,
              capacity,
              // batches,
              // sessions,
              groupDiscount,
              priceForSiblings,
              adultAssistanceIsRequried,
              prices,
              languages,
              healthAndSafety,
              location,
              timing,
              type,
              schedule,
              session_premises,
              programType,
              emails,
              skilllevel,
              isFreeTrial,
              parentalSupervisionRequired,
              privateOrGroup,
            } = program;

            if (!name) continue; // Skip if essential data like name is missing

            // Check if a program with the same name already exists for the same provider
            const existingProgram = await this.dummyprogramModel.findOne({
              provider: new ObjectId(id),
              name: name.trim(),
              createFrom: 'CHATGPT',
            });

            if (existingProgram) {
              // If the program exists but the description is different, append the description
              if (!existingProgram.description.includes(description)) {
                await this.dummyprogramModel.updateOne(
                  { _id: existingProgram._id },
                  {
                    $set: { updatedOn: new Date() },
                    $addToSet: { description: description.trim() }, // Add unique descriptions
                  },
                );
                console.log(`Updated description for Dummyprogram: ${name}`);
              } else {
                console.log(`Duplicate program found, skipping: ${name}`);
              }
            } else {
              // Create new dummy program if it doesn't exist
              const dp = await new this.dummyprogramModel({
                provider: new ObjectId(data.provider),
                name: name.trim(),
                description: [description.trim()],
                prices: prices || {},
                schedule: schedule || {},
                location: location?.trim() || '',
                timing: timing?.trim() || '',
                type: type?.trim() || '',
                createFrom: 'ChatGPT',
                earlyDrop_off_LatePick_up: earlyDrop_off_LatePick_up,
                canParentsParticipateInActivity:
                  canParentsParticipateInActivity,
                maxStudentsPerClass: maxStudentsPerClass,
                seatsAvailable: seatsAvailable,
                activityRecurring: activityRecurring,
                indoorOroutdoor: indoorOroutdoor,
                inpersonOrVirtual: inpersonOrVirtual,
                ageGroup: ageGroup,
                duration: duration,
                time: time,
                bookingCancelledIn: bookingCancelledIn,
                capacity: capacity,
                // batches: batches,
                // sessions: sessions,
                groupDiscount: groupDiscount,
                priceForSiblings: priceForSiblings,
                adultAssistanceIsRequried: adultAssistanceIsRequried,
                languages: languages,
                healthAndSafety: healthAndSafety,
                session_premises: session_premises,
                programType: programType,
                emails: emails,
                skilllevel: skilllevel,
                isFreeTrial: isFreeTrial,
                parentalSupervisionRequired: parentalSupervisionRequired,
                privateOrGroup: privateOrGroup,
                createdOn: new Date(),
                updatedOn: new Date(),
              }).save();
              console.log(`New Dummyprogram created: ${name}`);
              console.log(`New Dummyprogram created: ${dp.prices}`);
            }

            // Update dump data to mark the program as processed
            await this.cleandumpModel.updateOne(
              { _id: new ObjectId(data._id) },
              { $set: { dummyProgram: true, chatgpt: true } },
            );
          }
        }
      } catch (error) {
        console.error(
          `Error processing dump for provider ${data._id}:`,
          error.message,
        );
      }
    }
}

async cleanDoubleQuoteInh1h2Script() {
    try {
      // const data = await this.H1h2managementModel.find({});

      // if (!data || !data.length) {
      //   throw new HttpException(
      //     'No data found in H1h2managementModel',
      //     HttpStatus.NOT_FOUND,
      //   );
      // }
      let count = 0;

      // for (const dres of data) {
      //   let { h1, h2 } = dres;
      //   console.log('count ===>>>>', count++);
      //   // Clean h1 if it exists
      //   if (h1) {
      //     h1 = h1.replace(/^["']+|["']+$/g, ''); // Remove leading and trailing quotes
      //   }

      //   // Clean h2 if it exists
      //   if (h2) {
      //     h2 = h2.replace(/^["']+|["']+$/g, ''); // Remove leading and trailing quotes
      //   }

      //   // Update the record only if changes are made
      //   if (h1 !== dres.h1 || h2 !== dres.h2) {
      //     console.log('update doc ====>>>>', count++);
      //     await this.H1h2managementModel.updateOne(
      //       { _id: new ObjectId(dres._id) },
      //       { $set: { h1, h2 } },
      //     );
      //   }
      // }

      console.log('Cleaned double quotes from h1 and h2 successfully.');
    } catch (error) {
      console.error('Error in cleaning double quotes:', error.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async createProviderByWebsite(website, city) {
    let lat, lng;

    let cty = await this.citymanagementModel.findOne({
      _id: new ObjectId(city),
    });

    if (cty.city === 'Hoboken') {
      lat = 40.745255;
      lng = -74.034775;
    }

    if (cty.city === 'Jersey City') {
      lat = 40.719074;
      lng = -74.050552;
    }

    const apiKey = 'YOUR_GOOGLE_KEY'; // Replace with your actual API key
    const searchUrl =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const detailsUrl =
      'https://maps.googleapis.com/maps/api/place/details/json';

    // Define the request object for the nearby search
    const request = {
      location: `${lat},${lng}`,
      radius: 50000, // 50 km radius
      keyword: website,
      type: 'establishment|point_of_interest',
    };

    try {
      // First API Call: Fetch nearby places
      const response = await axios.get(searchUrl, {
        params: {
          location: request.location,
          radius: request.radius,
          keyword: request.keyword,
          type: request.type,
          key: apiKey,
        },
      });

      const places = response.data.results;

      // Fetch additional details for each place
      const detailedPlaces = await Promise.all(
        places.map(async (place) => {
          try {
            const detailsResponse = await axios.get(detailsUrl, {
              params: {
                place_id: place.place_id,
                key: apiKey,
                fields:
                  'name,formatted_address,international_phone_number,website,opening_hours,reviews,types',
              },
            });

            const details = detailsResponse.data.result;

            return {
              name: details.name,
              address: details.formatted_address,
              phone: details.international_phone_number || 'N/A',
              website: details.website || 'N/A',
              opening_hours: details.opening_hours
                ? details.opening_hours.weekday_text
                : 'N/A',
              reviews: details.reviews
                ? details.reviews.map((r) => ({
                    author: r.author_name,
                    rating: r.rating,
                    text: r.text,
                  }))
                : 'N/A',
              types: details.types,
              licenses: 'N/A', // Manually add if available
              certifications: 'N/A', // Manually add if available
              staff: 'N/A', // Custom, not provided by Google API
              daycare_capacity: 'N/A', // Custom, not provided by Google API
              languages_spoken: 'N/A', // Custom, not provided by Google API
              curriculum: 'N/A', // Custom, not provided by Google API
              calendar_info: 'N/A', // Custom, not provided by Google API
              financial_aid: 'N/A', // Custom, not provided by Google API
              schedules: details.opening_hours
                ? details.opening_hours.weekday_text
                : 'N/A',
            };
          } catch (detailsError) {
            console.error(
              `Error fetching details for place_id: ${place.place_id}`,
              detailsError.message,
            );
            return null;
          }
        }),
      );

      console.log(
        'Detailed Places:',
        detailedPlaces.filter((p) => p),
      ); // Print valid places
      return detailedPlaces.filter((p) => p); // Return only valid places
    } catch (error) {
      console.error('Error searching for places:', error.message);
      throw new Error('Error searching for places');
    }
}

async generateGoogleMapsSearchUrl(searchQuery, lat, lng, radius = 2639) {
  // Encode query to be URL-safe
  const encodedQuery = encodeURIComponent(searchQuery);

  // Construct the Google Maps search URL
  return `https://www.google.com/maps/search/${encodedQuery}/@${lat},${lng},${radius}m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDIxMC4wIKXMDSoASAFQAw%3D%3D`;
}

async  getChildCareProvidersByGoogleMaps(city) {
  let lat, lng, radius;
  
  // Fetch city coordinates dynamically
  let cty = await this.citymanagementModel.findOne({
    _id: new ObjectId(city),
  });
  
  if (cty.city === 'Hoboken') {
    lat = 40.7460168;
    lng = -74.0437668;
    radius = 2639;
  } else if (cty.city === 'Jersey City') {
    lat = 40.7460159;
    lng = -74.0437668;
    radius = 2639;
  } else {
    throw new Error("Invalid city selection");
  }
  let searchQuery = "day care providers in " + cty.city; // Dynamic search query

  // Generate the Google Maps URL
  const googleMapsUrl = this.generateGoogleMapsSearchUrl(searchQuery, lat, lng, radius);
  console.log("Google Maps URL:", googleMapsUrl); // Log the URL for debugging

  const apiKey = 'YOUR_GOOGLE_KEY'; // Replace with your actual API key
  const searchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

  let providers = [];
  let nextPageToken = null;
  let attemptCount = 0;

  try {
    do {
      let requestParams = {
        query: searchQuery, // Uses the same query as Google Maps
        location: `${lat},${lng}`,
        radius: radius,
        type: 'child_care',
        key: apiKey,
        ...(nextPageToken && { pagetoken: nextPageToken }) // Add pagetoken if exists
      };

      const response = await axios.get(searchUrl, { params: requestParams });

      providers = [...providers, ...response.data.results];

      nextPageToken = response.data.next_page_token || null;

      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 2s delay
      }

      attemptCount++;
      console.log(`Fetching page ${attemptCount}, Total Providers: ${providers.length}`);

    } while (nextPageToken && attemptCount < 10);

    const detailedProviders = await Promise.all(
      providers.map(async (place) => {
        try {
          const detailsResponse = await axios.get(detailsUrl, {
            params: {
              place_id: place.place_id,
              key: apiKey,
              fields:
                'name,formatted_address,international_phone_number,website,opening_hours,reviews,types',
            },
          });

          const details = detailsResponse.data.result;

          return {
            name: details.name,
            address: details.formatted_address,
            phone: details.international_phone_number || 'N/A',
            website: details.website || 'N/A',
            opening_hours: details.opening_hours
              ? details.opening_hours.weekday_text
              : 'N/A',
            reviews: details.reviews
              ? details.reviews.map((r) => ({
                  author: r.author_name,
                  rating: r.rating,
                  text: r.text,
                }))
              : 'N/A',
            types: details.types,
            licenses: 'N/A',
            certifications: 'N/A',
            staff: 'N/A',
            daycare_capacity: 'N/A',
            languages_spoken: 'N/A',
            curriculum: 'N/A',
            calendar_info: 'N/A',
            financial_aid: 'N/A',
            schedules: details.opening_hours
              ? details.opening_hours.weekday_text
              : 'N/A',
          };
        } catch (detailsError) {
          console.error(
            `Error fetching details for place_id: ${place.place_id}`,
            detailsError.message,
          );
          return null;
        }
      }),
    );

    console.log(`Final Total Providers: ${detailedProviders.length}`);
    return {
      googleMapsUrl, // Include the Google Maps URL in the response
      providers: detailedProviders.filter((p) => p),
    };
  } catch (error) {
    console.error('Error searching for places:', error.message);
    throw new Error('Error searching for places');
  }
}

async getUserReviews(placeId, placeInfo) {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';

    try {
      const response = await axios.get(url, {
        params: {
          place_id: placeId,
          key: 'YOUR_GOOGLE_KEY', // Replace with your actual API key
        },
      });

      const reviews = response.data.result.reviews;
      console.log('reviews ===>>>', reviews);
      if (reviews && reviews.length > 0) {
        // Use Promise.all to handle async operations in parallel
        // placeInfo.reviews = await Promise.all(
        //     reviews.map(async (review) => {
        //       const re = await this.ProviderreviewModel.findOne({providerId: id,body: review.text})
        //       if(!re){
        //          // Create review in the database
        //         const rew = await this.ProviderreviewModel.create({
        //           body: review.text,
        //           rating: review.rating,
        //           userName: review.author_name,
        //           providerId: id, // Assuming `user._id` is the provider's ID
        //           createdTime: new Date(review.time * 1000), // Store as a Date object
        //           lastUpdatedTime: new Date(review.time * 1000), // Store as a Date object
        //       });
        //       console.log('rew  ====>>>>',rew)
        //       return rew; // Return the created review
        //       }
        //     })
        // );
      } else {
        placeInfo.reviews = [];
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error.message);
    }
}

async createAllDummyProgramFromGeminiAdvance() {
    try {
      const data = await this.cleandumpModel.find({
        isProgramDataAvailable: true,
      });

      if (!data || data.length === 0) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      for (let dta of data) {
        if (dta.dummyProgram === true && dta.gemini === true) {
          console.warn('This Dump Has Already Created Programs, skipping...');
          continue;
        }

        if (dta.isProgramDataAvailable === true) {
          const prompt = `${dta.content}
        
                        Extract only explicitly mentioned data. If missing, return empty values in this JSON format:

                          {
                            "programs": [
                                {
                                 "name": "", 
                                 "emails": ["",""...], 
                                 "description": "",
                                 "ageGroup": {},
                                 "skilllevel": "",
                                 "isFreeTrial": true/false,
                                 "parentalSupervisionRequired": "chose value from only :- No data available || Parent attendance NOT  required || Parent attendance NOT required || Parent attendance required",
                                 "earlyDrop_off_LatePick_up": {},
                                 "maxStudentsPerClass": "",
                                 "session_premises": "chose value from only :- private-class || class || camp || party || child-care || event",
                                 "privateOrGroup": "chose value from only :- private || group",
                                 "session_premises": "chose value from only :- indoor || outdoor || either || no data available",
                                 "canParentsParticipateInActivity": true/false,
                                 "seatsAvailable": "", 
                                 "activityRecurring": { "days": [], "activityRecurring": boolean },
                                 "indoorOroutdoor": "", 
                                 "inpersonOrVirtual": "",
                                 "duration": { "hours": "", "minutes": "" },  
                                 "time": { "from": "", "to": "" },
                                 "bookingCancelledIn": { "days": "", "hours": "" },
                                 "capacity": { "min": "", "max": "" },     
                                 "groupDiscount": { "noOfStudents": 0, "discountPercent": "" },
                                 "priceForSiblings": "", 
                                 "adultAssistanceIsRequried": boolean,      
                                 "prices": {
                                   "priceUnit": "", 
                                   "priceType": "", 
                                   "pricePerParticipant": "", 
                                   "pricePerHour": "", 
                                   "classDuration": "", 
                                   "youEarn": "", 
                                   "noOfUnits": "1",
                                   "priceProrated": false, 
                                   "setDefault": false, 
                                   "halfOrFullDay": "", 
                                   "title": "", 
                                   "recurrence": "", 
                                   "duration": "", 
                                   "noOfHours": "", 
                                   "noOfDays": "", 
                                   "addOnprices": [], 
                                   "noOfWeeks": "", 
                                   "candace": "" 
                                 },        
                                 "languages": { "language": "", "proficiency": "" },
                                 "healthAndSafety": "",  
                                 "location": "", 
                                 "timing": "", 
                                 "type": "", 
                                 "schedule": { "day": "", "startTime": "", "endTime": "", "frequency": "", "notes": "" }
                               }
                            ]
                         }`;

          const genAI = new GoogleGenerativeAI(
            'YOUR_GOOGLE_KEY',
          );
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          try {
            const result = await model.generateContent(prompt);
            let jsonString;
            let responseData;

            try {
              jsonString = this.getDateStringToJSO(result.response.text());
              responseData = JSON.parse(jsonString);
            } catch (jsonError) {
              console.error('Invalid JSON extracted:', jsonError.message);
              continue; // Skip this dump and move to the next one
            }

            if (!responseData?.programs?.length) {
              console.warn('No valid programs found, skipping this dump.');
              continue;
            }

            for (const program of responseData.programs) {
              try {
                const {
                  name,
                  description,
                  earlyDrop_off_LatePick_up,
                  canParentsParticipateInActivity,
                  maxStudentsPerClass,
                  seatsAvailable,
                  activityRecurring,
                  indoorOroutdoor,
                  inpersonOrVirtual,
                  ageGroup,
                  duration,
                  time,
                  bookingCancelledIn,
                  capacity,
                  groupDiscount,
                  priceForSiblings,
                  adultAssistanceIsRequried,
                  prices,
                  languages,
                  healthAndSafety,
                  location,
                  timing,
                  type,
                  syncId,
                  schedule,
                  session_premises,
                  programType,
                  emails,
                  skilllevel,
                  isFreeTrial,
                  parentalSupervisionRequired,
                  privateOrGroup,
                } = program;

                if (!name) {
                  console.warn('Skipping program without a name.');
                  continue;
                }

                console.log('Processing Program:', name);

                const existingProgram = await this.dummyprogramModel.findOne({
                  provider: new ObjectId(dta.provider),
                  name: name.trim(),
                  createFrom: 'GEMINI',
                });

                if (existingProgram) {
                  console.log('Existing program found:', existingProgram.name);
                  if (
                    description &&
                    !existingProgram.description.includes(description)
                  ) {
                    await this.dummyprogramModel.updateOne(
                      { _id: existingProgram._id },
                      {
                        $set: { updatedOn: new Date() },
                        $addToSet: { description: description.trim() },
                      },
                    );
                    console.log(`Updated program description: ${name}`);
                  } else {
                    console.log(
                      `Duplicate program detected, skipping: ${name}`,
                    );
                  }
                } else {
                  console.log('Creating new program:', name);
                  await new this.dummyprogramModel({
                    provider: new ObjectId(dta.provider),
                    name: name.trim(),
                    description: [description?.trim() || ''],
                    prices: prices || {},
                    schedule: schedule || {},
                    location: location?.trim() || '',
                    timing: timing?.trim() || '',
                    type: type?.trim() || '',
                    createFrom: 'GEMINI',
                    earlyDrop_off_LatePick_up,
                    canParentsParticipateInActivity,
                    maxStudentsPerClass,
                    seatsAvailable,
                    activityRecurring,
                    indoorOroutdoor,
                    inpersonOrVirtual,
                    ageGroup,
                    duration,
                    time,
                    bookingCancelledIn,
                    capacity,
                    syncId: dta._id,
                    groupDiscount,
                    priceForSiblings,
                    adultAssistanceIsRequried,
                    languages,
                    healthAndSafety,
                    session_premises,
                    programType,
                    emails,
                    skilllevel,
                    isFreeTrial,
                    parentalSupervisionRequired,
                    privateOrGroup,
                    createdOn: new Date(),
                    updatedOn: new Date(),
                  }).save();
                  console.log(`New Dummy Program created: ${name}`);
                }
              } catch (programError) {
                console.error(
                  'Error processing individual program, skipping:',
                  program,
                  programError.message,
                );
                continue; // Skip this program and move to the next one
              }
            }

            await this.cleandumpModel.updateOne(
              { _id: new ObjectId(dta._id) },
              { $set: { dummyProgram: true, gemini: true } },
            );
          } catch (aiError) {
            console.error('Error during AI processing:', aiError.message);
            continue; // Skip this dump and move to the next one
          }
        }
      }
    } catch (error) {
      console.error('Error processing dump:', error.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async createAllDummyProgramFromCHATGPT() {
    try {
      const data = await this.cleandumpModel.find({
        isProgramDataAvailable: true,
      });

      if (!data || data.length === 0) {
        throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
      }

      for (let dta of data) {
        if (dta.dummyProgram === true && dta.chatgpt === true) {
          console.warn('This Dump Has Already Created Programs, skipping...');
          continue;
        }

        if (dta.isProgramDataAvailable === true) {
          const prompt = `${dta.content} Extract only explicitly mentioned data. If missing, return empty values in this JSON format:
                            { "programs": [
                               {
                                 "name": "", 
                                 "emails": ["",""...], 
                                 "description": "",
                                 "ageGroup": {},
                                 "skilllevel": "",
                                 "isFreeTrial": true/false,
                                 "parentalSupervisionRequired": "chose value from only :- No data available || Parent attendance NOT  required || Parent attendance NOT required || Parent attendance required",
                                 "earlyDrop_off_LatePick_up": {},
                                 "maxStudentsPerClass": "",
                                 "session_premises": "chose value from only :- private-class || class || camp || party || child-care || event",
                                 "privateOrGroup": "chose value from only :- private || group",
                                 "session_premises": "chose value from only :- indoor || outdoor || either || no data available",
                                 "canParentsParticipateInActivity": true/false,
                                 "seatsAvailable": "", 
                                 "activityRecurring": { "days": [], "activityRecurring": boolean },
                                 "indoorOroutdoor": "", 
                                 "inpersonOrVirtual": "",
                                 "duration": { "hours": "", "minutes": "" },  
                                 "time": { "from": "", "to": "" },
                                 "bookingCancelledIn": { "days": "", "hours": "" },
                                 "capacity": { "min": "", "max": "" },     
                                 "groupDiscount": { "noOfStudents": 0, "discountPercent": "" },
                                 "priceForSiblings": "", 
                                 "adultAssistanceIsRequried": boolean,      
                                 "prices": {
                                   "priceUnit": "", 
                                   "priceType": "", 
                                   "pricePerParticipant": "", 
                                   "pricePerHour": "", 
                                   "classDuration": "", 
                                   "youEarn": "", 
                                   "noOfUnits": "1",
                                   "priceProrated": false, 
                                   "setDefault": false, 
                                   "halfOrFullDay": "", 
                                   "title": "", 
                                   "recurrence": "", 
                                   "duration": "", 
                                   "noOfHours": "", 
                                   "noOfDays": "", 
                                   "addOnprices": [], 
                                   "noOfWeeks": "", 
                                   "candace": "" 
                                 },        
                                 "languages": { "language": "", "proficiency": "" },
                                 "healthAndSafety": "",  
                                 "location": "", 
                                 "timing": "", 
                                 "type": "", 
                                 "schedule": { "day": "", "startTime": "", "endTime": "", "frequency": "", "notes": "" }
                               }
                             ]
                           }`;
          const chatgpt = new ChatGPT(
            'YOUR_OPENAI_KEY',
          );

          try {
            // Send prompt to ChatGPT
            const [err, chatResponse] = await chatgpt.createCompletion(prompt);

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
              continue; // Skip this dump and move to the next one
            }

            if (!responseData?.programs?.length) {
              console.warn('No valid programs found, skipping this dump.');
              continue;
            }

            for (const program of responseData.programs) {
              try {
                const {
                  name,
                  description,
                  earlyDrop_off_LatePick_up,
                  canParentsParticipateInActivity,
                  maxStudentsPerClass,
                  seatsAvailable,
                  activityRecurring,
                  indoorOroutdoor,
                  inpersonOrVirtual,
                  ageGroup,
                  duration,
                  time,
                  bookingCancelledIn,
                  capacity,
                  groupDiscount,
                  priceForSiblings,
                  adultAssistanceIsRequried,
                  prices,
                  languages,
                  healthAndSafety,
                  location,
                  timing,
                  type,
                  syncId,
                  schedule,
                  session_premises,
                  programType,
                  emails,
                  skilllevel,
                  isFreeTrial,
                  parentalSupervisionRequired,
                  privateOrGroup,
                } = program;

                if (!name) {
                  console.warn('Skipping program without a name.');
                  continue;
                }

                console.log('Processing Program:', name);

                const existingProgram = await this.dummyprogramModel.findOne({
                  provider: new ObjectId(dta.provider),
                  name: name.trim(),
                  createFrom: 'GEMINI',
                });

                if (existingProgram) {
                  console.log('Existing program found:', existingProgram.name);
                  if (
                    description &&
                    !existingProgram.description.includes(description)
                  ) {
                    await this.dummyprogramModel.updateOne(
                      { _id: existingProgram._id },
                      {
                        $set: { updatedOn: new Date() },
                        $addToSet: { description: description.trim() },
                      },
                    );
                    console.log(`Updated program description: ${name}`);
                  } else {
                    console.log(
                      `Duplicate program detected, skipping: ${name}`,
                    );
                  }
                } else {
                  console.log('Creating new program:', name);
                  await new this.dummyprogramModel({
                    provider: new ObjectId(dta.provider),
                    name: name.trim(),
                    description: [description?.trim() || ''],
                    prices: prices || {},
                    schedule: schedule || {},
                    location: location?.trim() || '',
                    timing: timing?.trim() || '',
                    type: type?.trim() || '',
                    createFrom: 'CHATGPT',
                    earlyDrop_off_LatePick_up,
                    canParentsParticipateInActivity,
                    maxStudentsPerClass,
                    seatsAvailable,
                    activityRecurring,
                    indoorOroutdoor,
                    inpersonOrVirtual,
                    ageGroup,
                    duration,
                    time,
                    bookingCancelledIn,
                    capacity,
                    syncId: dta._id,
                    groupDiscount,
                    priceForSiblings,
                    adultAssistanceIsRequried,
                    languages,
                    healthAndSafety,
                    session_premises,
                    programType,
                    emails,
                    skilllevel,
                    isFreeTrial,
                    parentalSupervisionRequired,
                    privateOrGroup,
                    createdOn: new Date(),
                    updatedOn: new Date(),
                  }).save();
                  console.log(`New Dummy Program created: ${name}`);
                }
              } catch (programError) {
                console.error(
                  'Error processing individual program, skipping:',
                  program,
                  programError.message,
                );
                continue; // Skip this program and move to the next one
              }
            }

            await this.cleandumpModel.updateOne(
              { _id: new ObjectId(dta._id) },
              { $set: { dummyProgram: true, chatgpt: true } },
            );
          } catch (aiError) {
            console.error('Error during AI processing:', aiError.message);
            continue; // Skip this dump and move to the next one
          }
        }
      }
    } catch (error) {
      console.error('Error processing dump:', error.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async createExtraFromGeminiAdvance(id) {
  try {
    const data = await this.cleandumpModel.find({
      provider: new ObjectId(id),
      isProviderDataAvailable: true,
    });

    if (!data || data.length === 0) {
      throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
    }

    for (let dta of data) {
      const prompt = `${dta.content}
      
Extract only explicitly mentioned data. If missing, return empty values in this JSON format:

{
"programs": [
  "licenses": [
      {
        "license_id": "string",
        "type": "string",
        "issued_date": "date",
        "expiry_date": "date",
        "issuing_authority": "string"
      }
    ],
    "certifications": [
      {
        "certification_name": "string",
        "description": "string",
        "issued_by": "string",
        "issued_date": "date",
        "expiry_date": "date"
      }
    ],
    "staff": [
      {
        "name": "string",
        "role": "string",
        "qualifications": "string",
        "experience_years": "number",
        "languages_spoken": ["string"],
        "certifications": ["string"]
      }
    ],
    "daycarecapacity": {
      "total_capacity": "number",
      "age_groups": "string"
    },
    "languages_spoken": ["string"],
    "curriculum": ["string"],
    "CalendarInformation": {
      "schedule_type": "string",
      "start_date": "date",
      "end_date": "date",
      "holidays": ["date"]
    },
    "financial_aid": {
      "available": "boolean",
      "program_name": "string",
      "eligibility": "string",
      "coverage": "string"
    },
    "schedules": {
      "early_drop_off": "boolean",
      "night_hours": "boolean",
      "after_care": "boolean",
      "operating_start_time": "string",
     "operating_end_time": "string"  
    }
]
}`;

      const genAI = new GoogleGenerativeAI('YOUR_GOOGLE_KEY');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      try {
        const result = await model.generateContent(prompt);
        let jsonString;
        let responseData;

        try {
          let aiResponse = await result.response.text();

          // Remove JSON formatting artifacts
          aiResponse = aiResponse.replace(/```json|```/g, '').trim();

          // Validate if JSON is malformed
          if (!aiResponse.startsWith('{') && !aiResponse.startsWith('[')) {
            console.error('Invalid JSON format detected:', aiResponse);
            continue;
          }

          jsonString = aiResponse;
          responseData = JSON.parse(jsonString);
        } catch (jsonError) {
          console.error('Invalid JSON extracted:', jsonError.message);
          continue;
        }

        if (!responseData?.programs?.length) {
          console.warn('No valid programs found, skipping this dump.');
          continue;
        }

        for (const program of responseData.programs) {
          console.log('Extracted Program Data:', JSON.stringify(program, null, 2));

          const existingProgram = await this.providerModel.findOne({
            user: dta.provider,
          });

          // Helper function to merge unique data
          const mergeUniqueArray = (existing, incoming, key) => {
            return [
              ...new Map(
                [
                  ...(Array.isArray(existing) ? existing : []),
                  ...(Array.isArray(incoming) ? incoming : []),
                ]
                  .filter((item) => item && item[key]) // Remove empty objects
                  .map((item) => [item[key], item]), // Ensure uniqueness
              ).values(),
            ];
          };

          const mergedStaff = mergeUniqueArray( existingProgram?.Staff, program?.staff,'name', );
          const mergedLicenses = mergeUniqueArray( existingProgram?.Licences, program?.licenses, 'license_id', );
          const mergedCertifications = mergeUniqueArray(existingProgram?.Certifications, program?.certifications,'certification_name', );
          const mergedDaycareCapacity = program?.daycarecapacity ? program.daycarecapacity : existingProgram?.DaycareCapacity;
          const mergedLanguagesSpoken = [ ...new Set([...(Array.isArray(existingProgram?.LanguagesSpoken) ? existingProgram.LanguagesSpoken : []),
          ...(Array.isArray(program?.languages_spoken) ? program.languages_spoken : []),
            ]),
          ];
          const mergedCurriculumTeachingMethodology = program?.curriculum?.join(', ') || existingProgram?.curriculum;
          const mergedCalendarInformation = program?.CalendarInformation || existingProgram?.CalendarInformation;
          const mergedFinancialAid = program?.financial_aid || existingProgram?.FinancialAid;
          const mergedSchedules = program?.schedules || existingProgram?.Schedules;

          // Avoid saving empty fields
          const updateData: Record<string, any> = {};
          if (mergedStaff.length > 0) updateData.Staff = mergedStaff;
         
          if (mergedLicenses.length > 0) updateData.Licences = mergedLicenses;
          
          if (mergedCertifications.length > 0) updateData.Certifications = mergedCertifications;
         
          if (mergedDaycareCapacity) updateData.DaycareCapacity = mergedDaycareCapacity;
          
          if (mergedLanguagesSpoken.length > 0) updateData.LanguagesSpoken = mergedLanguagesSpoken;
         
          if (mergedCurriculumTeachingMethodology) updateData.CurriculumTeachingMethodology = mergedCurriculumTeachingMethodology;
          
          if (mergedCalendarInformation) updateData.CalendarInformation = mergedCalendarInformation;
          
          if (mergedFinancialAid) updateData.FinancialAid = mergedFinancialAid;
          
          if (mergedSchedules) updateData.Schedules = mergedSchedules;
          

          if (existingProgram) {
            // Update only if there is new data
            await this.providerModel.updateOne(
              { user: dta.provider },
              {
                $set: updateData,
              },
            );
          } else {
            // Insert new record if it doesn't exist
            await this.providerModel.create({
              user: dta.provider,
              ...updateData,
            });
          }
        }
      } catch (aiError) {
        console.error('Error during AI processing:', aiError.message);
        continue;
      }
    }
  } catch (error) {
    console.error('Error processing dump 22:', error.message);
    return; // Instead of throwing, return and continue execution
  }
}

async updateStaffAndCertificationByProviderId(ProviderId: string) {
  try {
    const data = await this.cleandumpModel.find({
      provider: new ObjectId(ProviderId)
    });

    if (!data || data.length === 0) {
      throw new HttpException('Dump Data not found', HttpStatus.NOT_FOUND);
    }

    const genAI = new GoogleGenerativeAI('YOUR_GOOGLE_KEY');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    for (let dta of data) {
      const prompt = `
Extract only explicitly mentioned data from the following content. If data is missing, use empty values. 
Return ONLY in this JSON format:

{
  "programs": [
    {
      "certifications": [
        {
          "certification_name": "string",
          "description": "string",
          "issued_by": "string",
          "issued_date": "date",
          "expiry_date": "date"
        }
      ],
      "staff": [
        {
          "name": "string",
          "role": "string",
          "qualifications": "string",
          "experience_years": "number"
        }
      ]
    }
  ]
}

Content:
${dta.content}
`;

      try {
        const result = await model.generateContent(prompt);
        const aiResponse = await result.response.text();

        // Extract potential JSON block
        const cleaned = aiResponse.trim().replace(/```json|```/g, '').trim();

        if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
          console.error('Invalid JSON format detected:', cleaned);
          continue;
        }

        let responseData;
        try {
          responseData = JSON.parse(cleaned);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError.message);
          continue;
        }

        if (!responseData?.programs?.length) {
          console.warn('No valid programs found, skipping this dump.');
          continue;
        }

        for (const program of responseData.programs) {
          console.log('Extracted Staff:', program?.staff);
          console.log('Extracted Certifications:', program?.certifications);

          const existingProgram = await this.providerModel.findOne({
            user: dta.provider,
          });

          if (!existingProgram) {
            throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
          }

          const mergeUniqueArray = (existing, incoming, key) => {
            return [
              ...new Map(
                [
                  ...(Array.isArray(existing) ? existing : []),
                  ...(Array.isArray(incoming) ? incoming : []),
                ]
                  .filter((item) => item && item[key])
                  .map((item) => [item[key], item]),
              ).values(),
            ];
          };

          const mergedStaff = mergeUniqueArray(existingProgram?.Staff, program?.staff, 'name');
          const mergedCertifications = mergeUniqueArray(existingProgram?.Certifications, program?.certifications, 'certification_name');

          const updateData: Record<string, any> = {};
          if (mergedStaff.length > 0) updateData.Staff = mergedStaff;
          if (mergedCertifications.length > 0) updateData.Certifications = mergedCertifications;

          if (Object.keys(updateData).length > 0) {
            await this.providerModel.updateOne({ user: dta.provider }, { $set: updateData });
            await this.dummyproviderModel.updateOne({ provider: dta.provider }, { $set: updateData });
          }
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError.message);
        continue;
      }
    }
  } catch (error) {
    console.error('Error processing dump:', error.message);
  }
}

async updateStaffAndCertificationChagGptWebSearchByProviderIdAndPromptId(ProviderId: string, promptId: string) {
  try {
    const provider = await this.providerModel.findOne({ user: new ObjectId(ProviderId) });
    console.log('provider.website ====>>>>>>', provider.website)

    if (!provider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }
    
    let prompt = ''

          const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');
          try {
            
            const [err, chatResponse] = await chatgpt.createCompletions(prompt);
      
            if (err) {
              console.warn(`ChatGPT Error for provider:`, err.message);
            }
            console.log('chatResponse ====>>>>>>', chatResponse)
            let responseData;
            try {
              const jsonString = this.getDateStringToJSON(
                chatResponse[0]?.message?.content || '{}',
              );
              responseData = JSON.parse(jsonString);
            } catch (parseError) {
              console.warn('ChatGPT Response Parsing Error:', parseError.message);
              console.warn('Invalid Response:', chatResponse[0]?.message?.content);
            }
            console.log('responseData ====>>>>>>', responseData)
            if (responseData?.programs) {
              console.log('responseData.programs ====>>>>>>', responseData.programs)

              const programData = responseData.programs[0];
             
              if (programData) {
                console.log('Processing Program:', programData);
              
                const existing = await this.dummyproviderModel.findOne({ provider: ProviderId });
              
                const mergeUniqueByName = (existingArray = [], newArray = [], key) => {
                  const map = new Map();
              
                  // Add existing data first
                  for (const item of existingArray) {
                    if (item && item[key]) {
                      map.set(item[key].toLowerCase(), item);
                    }
                  }
              
                  // Add new data, skip if key (case-insensitive) already exists
                  for (const item of newArray) {
                    if (item && item[key] && !map.has(item[key].toLowerCase())) {
                      map.set(item[key].toLowerCase(), item);
                    }
                  }
              
                  return Array.from(map.values());
                };
              
                const mergedStaff = mergeUniqueByName(existing?.Staff, programData.staff, 'name');
                const mergedCerts = mergeUniqueByName(existing?.Certifications, programData.certifications, 'certification_name');
              
                const update = await this.dummyproviderModel.updateOne(
                  { provider: ProviderId },
                  {
                    $set: {
                      Staff: mergedStaff,
                      Certifications: mergedCerts,
                    },
                  },
                );
              } else {
                console.warn('No valid program data found in response');
              }
            }
          
            }catch (error) {
              console.error('Error updating program:', error.message);
          }

  } catch (error) {
    console.error('Error processing dump:', error.message);
  }
}
async childCareProvider(city_id: string) {
    try {
      let match = { is_child_care: true };
      const user = await this.providerModel.aggregate([
        { $match: match },
      ]);
      for (let dta of user) {
        await this.createExtraFromGeminiAdvance(dta.user);
      }
    } catch (error) {
      console.error('Error processing dump 11:', error.message);
      throw new HttpException(
        'Internal Server Error 11',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async  createChildCareQueueByCitySubParts(city) {
  let apiKey = 'YOUR_GOOGLE_KEY'; // Replace with your actual API key
  let searchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  let detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

  const citymanagement = await this.citymanagementModel.findOne({ _id: new ObjectId(city) });
  const ctname = citymanagement.city.toLowerCase()
  let searchQuery = `daycare providers in '${ctname}'`;
  console.log('searchQuery ====>>>>>>',searchQuery)

  let cityParts;
  if (citymanagement.city === 'Jersey City') {
    cityParts = [
      { lat: 40.755500, lng: -74.070500, radius: 2000 },
      { lat: 40.745000, lng: -74.065000, radius: 2000 },
      { lat: 40.745000, lng: -74.045000, radius: 2000 },
      { lat: 40.730000, lng: -74.070000, radius: 2000 },
      { lat: 40.730000, lng: -74.040000, radius: 2000 },
      { lat: 40.725000, lng: -74.025000, radius: 2000 },
      { lat: 40.715000, lng: -74.065000, radius: 2000 },
      { lat: 40.710000, lng: -74.045000, radius: 2000 },
      { lat: 40.705000, lng: -74.025000, radius: 2000 },
      { lat: 40.700000, lng: -74.065000, radius: 2000 }
    ];
  } else if (citymanagement.city === 'Hoboken') {
    cityParts = [
      { lat: 40.756000, lng: -74.030000, radius: 1000 },
      { lat: 40.750000, lng: -74.035000, radius: 1000 },
      { lat: 40.750000, lng: -74.025000, radius: 1000 },
      { lat: 40.745000, lng: -74.035000, radius: 1000 },
      { lat: 40.745000, lng: -74.025000, radius: 1000 },
      { lat: 40.740000, lng: -74.035000, radius: 1000 },
      { lat: 40.740000, lng: -74.025000, radius: 1000 },
      { lat: 40.736000, lng: -74.030000, radius: 1000 }
    ];
  }

  let allProviders = [];

  try {
    for (let part of cityParts) {
      console.log(`Fetching results for lat:${part.lat}, lng:${part.lng}`);

      let nextPageToken = null;
      let attemptCount = 0;

      do {
        let requestParams = {
          query: searchQuery,
          location: `${part.lat},${part.lng}`,
          radius: part.radius,
          type: 'child_care|preschool|daycare',
          key: apiKey,
          ...(nextPageToken && { pagetoken: nextPageToken })
        };

        const response = await axios.get(searchUrl, { params: requestParams });

        allProviders = [...allProviders, ...response.data.results];

        nextPageToken = response.data.next_page_token || null;

        if (nextPageToken) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        attemptCount++;
        console.log(`Fetching page ${attemptCount}, Total Providers: ${allProviders.length}`);

      } while (nextPageToken && attemptCount < 3);
    }

    // Fetch additional details for each provider
    for (let place of allProviders) {
      try {
        const detailsResponse = await axios.get(detailsUrl, {
          params: {
            place_id: place.place_id,
            key: apiKey,
            fields: 'name,formatted_address,international_phone_number,website,opening_hours,reviews,types',
          },
        });

        const details = detailsResponse.data.result;
        // return details

        //  Fix: Ensure `details` is an object and has a website 
        if (details && details.website && details.formatted_address.includes(citymanagement.city)) {
          
          try {
            const existingQueue = await this.queueModel.findOne({ urls: details.website, status: 'pending' });

            if (!existingQueue) {
              await this.queueModel.create({
                cityId: new ObjectId(city),
                status: 'pending',
                type: 'google',
                urls: details.website
              });
              console.log('name ====>>>>>>',details.name)
              console.log('address ====>>>>>>',details.formatted_address)
              console.log('city ====>>>>>>',citymanagement.city)
              console.log(`website: ${details.website}`);
            }
          } catch (dbError) {
            console.error(`Database error for ${details.website}:`, dbError.message);
          }
        } else {
          console.log(`Skipping provider - No website: ${details.name}`);
        }

      } catch (detailsError) {
        console.error(`Error fetching details for place_id: ${place.place_id}`, detailsError.message);
      }
    }

    console.log(`Final Total Providers: ${allProviders.length}`);

    return {
      city: citymanagement.city,
      totalProviders: allProviders.length,
      providers: allProviders,
    };
    
  } catch (error) {
    console.error('Error searching for places:', error.message);
    throw new Error('Error searching for places');
  }
}

async  updateQueueStatusByCityAndType(city,type,Fromstatus,Tostatus) {

  try{
    const queue = await this.queueModel.find({cityId: new ObjectId(city), type: type, status: Fromstatus});
    if(queue.length){
      for(let que of queue){
        await this.queueModel.findOneAndUpdate(
          { _id: new ObjectId(que._id)},
          { $set: { status : Tostatus} },
          { new : true }
        )
      } 
    }
  }catch(err){
    throw new HttpException('Internal Server Error 11', HttpStatus.INTERNAL_SERVER_ERROR); 
  }

}

async  updateChildCareProviderStatusByCity(city,Fromstatus,Tostatus,is_child_care) {
      let matchQueries = [];
      const match = {
        cityId: new ObjectId(city),
        roles: 'purpleprovider',
        status: Fromstatus,
        is_deleted: false
      };
      const match1 = {};
  
      let providerLookupBefore = [];
      let providerLookupAfter = [
        {
          $lookup: {
            from: 'providers',
            localField: '_id',
            foreignField: 'user',
            as: 'provider',
          },
        },
        {
          $unwind: {
            path: '$provider',
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
      if (is_child_care) {
        providerLookupBefore = [
          {
            $lookup: {
              from: 'providers',
              localField: '_id',
              foreignField: 'user',
              as: 'provider',
            },
          },
          {
            $unwind: {
              path: '$provider',
              preserveNullAndEmptyArrays: true,
            },
          },
        ];
        
        providerLookupAfter = [];
        if (is_child_care == 'true') {
          match1['provider.is_child_care'] = true;
        } else if (is_child_care == 'false') {
          match1['provider.is_child_care'] = false;
        }
      }
      const data = await this.userModel.aggregate([
        ...matchQueries,
        {
          $match: match,
        },
        ...providerLookupBefore,
        
        {
          $match: match1,
        },
        {
          $facet: {
            result: [
              ...providerLookupAfter,
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
  
      const items = data[0].result;
      if(items.length){
        for(let item of items){
          await this.userModel.findOneAndUpdate(
            { _id: new ObjectId(item._id)},
            { $set: { status : 'Archived'} },
            { new : true }
          )
        }
      }
}

async  updateTimingChildCareProviderByStatusAndCity(city,Fromstatus,is_child_care) {
  let matchQueries = [];
  const match = {
    cityId: new ObjectId(city),
    roles: 'purpleprovider',
    status: Fromstatus,
    is_deleted: false
  };
  const match1 = {};

  let providerLookupBefore = [];
  let providerLookupAfter = [
    {
      $lookup: {
        from: 'providers',
        localField: '_id',
        foreignField: 'user',
        as: 'provider',
      },
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (is_child_care) {
    providerLookupBefore = [
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    
    providerLookupAfter = [];
    if (is_child_care == 'true') {
      match1['provider.is_child_care'] = true;
    } else if (is_child_care == 'false') {
      match1['provider.is_child_care'] = false;
    }
  }
  const data = await this.userModel.aggregate([
    ...matchQueries,
    {
      $match: match,
    },
    ...providerLookupBefore,
    
    {
      $match: match1,
    },
    {
      $project: {
        _id: 1,
        website: '$provider.website',
        cityId: 1,
      }
    },
    {
      $facet: {
        result: [
          ...providerLookupAfter,
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

  const items = data[0].result;
  if(items.length){
    for(let item of items){
      console.log('item ====>>>>',item)
      await this.createTimingByWebsite(item.cityId,item.website,item._id);
    }
  }
}

async  updateTimingChildCareProviderByProviderId(providerId) {
  
  const user = await this.userModel.findOne({_id: new ObjectId(providerId)});
  if(!user){
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  if(user){
    const data = await this.providerModel.findOne({user: new ObjectId(providerId)});
    if(!data){
      console.log('provider not found')
    }
    if(!data.rating.googleLink){
      console.log('google link not found')
      const city = await this.citymanagementModel.findOne({_id: user.cityId});
      
      const dtl = await this.placeService.findDetails(data.website,city.city);
      console.log('dtl ===>>>',dtl)
     if(!dtl){
        console.log('dtl not found')
      }
      if(dtl){
        console.log('dtl found')
        let pro = await this.providerModel.findOneAndUpdate(
          { user: new ObjectId(providerId) },
          { $set: { 
            topGoogleReviews: dtl.reviews,
            'rating.googleRating': dtl.rating,
            'rating.numberOfGoogle': dtl.totalRatings,
            'rating.googleLink': dtl.mapsLink,
           }
          },
          { new: true }
        );
        if(!pro){
          console.log('provider not found')
        }
        if(pro){
          console.log('googleLink  ====>>>',pro.rating.googleLink)
          console.log('user id  ====>>>',pro.user)
          await this.createTimingByPlaceId(pro.rating.googleLink,pro.user);
        }
      }
    
      // await this.createTimingByWebsite(user.cityId,data.website,user._id);
    }
    console.log('id ===>>>',data._id)
    console.log('place id ===>>>',data.rating.googleLink)
    if(data.rating.googleLink !== null && data.rating.googleLink !== '' && data.rating.googleLink !== undefined){
      await this.createTimingByPlaceId(data.rating.googleLink,user._id);
    }
  }
  return user;
}

async createTimingByPlaceId(placeId: string, providerId) {
  const place = new URL(placeId).searchParams.get('q')?.split('place_id:')[1];
  if (!place) {
    throw new Error('Invalid Google Maps link or missing place_id');
  }
  const apiKey = 'YOUR_GOOGLE_KEY';
  const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

  try {
    const detailsResponse = await axios.get(detailsUrl, {
      params: {
        place_id: place,
        key: apiKey,
        fields: 'name,formatted_address,international_phone_number,website,opening_hours,reviews,types',
      },
    });

    const details = detailsResponse.data.result;
    // console.log('Place Details:', details);

    if (details && details.opening_hours && details.opening_hours.weekday_text) {
      const weekdayText = details.opening_hours.weekday_text;

      const providerUpdate = await this.providerModel.findOneAndUpdate(
        { user: new ObjectId(providerId) },
        { $set: { timing: weekdayText } },
        { new: true }
      );

      const dummyProviderUpdate = await this.dummyproviderModel.findOneAndUpdate(
        { provider: new ObjectId(providerId) },
        { $set: { Schedules: weekdayText,businessName: details.name } }
      );

      // console.log('Updated Provider Timing:', providerUpdate);
      return weekdayText;
    } else {
      console.warn('Opening hours not found in place details.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching place details by place_id:', error.message);
    throw new Error('Failed to fetch place details');
  }
}


async createTimingByWebsite(city, website,id ) {
  let lat, lng;

  let cty = await this.citymanagementModel.findOne({_id: new ObjectId(city)});
  console.log('cty ====>>>>',cty)

  if (cty.city === 'Hoboken') {
    lat = 40.745255;
    lng = -74.034775;
  }

  if (cty.city === 'Jersey City') {
    lat = 40.719074;
    lng = -74.050552;
  }

  const apiKey = 'YOUR_GOOGLE_KEY'; // Replace with your actual API key
  const searchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

  // Define the request object for the nearby search
  const request = {
    location: `${lat},${lng}`,
    radius: 50000, // 50 km radius
    keyword: website,
    type: 'establishment|point_of_interest',
  };

  try {
    // First API Call: Fetch nearby places
    const response = await axios.get(searchUrl, {
      params: {
        location: request.location,
        radius: request.radius,
        keyword: request.keyword,
        type: request.type,
        key: apiKey,
      },
    });

    const places = response.data.results;

console.log('places 1 ====>>>>',places)
    // Fetch additional details for each place
    const detailedPlaces = await Promise.all(
      places.map(async (place) => {
        try {
          const detailsResponse = await axios.get(detailsUrl, {
            params: {
              place_id: place.place_id,
              key: apiKey,
              fields:'name,formatted_address,international_phone_number,website,opening_hours,reviews,types,rating,user_ratings_total,place_id',
            },
          });

          const details = detailsResponse.data.result;
          console.log('details ====>>>>',details)
          if (details && details.opening_hours && details.opening_hours.weekday_text) {
            // Assuming you just need to update once, as details is an object, not an array
            const provider = await this.providerModel.findOneAndUpdate(
              { user: new ObjectId(id) },
              {
                $set: {
                  timing: details.opening_hours.weekday_text,
                  topGoogleReviews: details.reviews,
                  'rating.googleRating': details.rating,
                  'rating.numberOfGoogle': details.user_ratings_total,
                  'rating.googleLink': `https://www.google.com/maps/place/?q=place_id:${details.place_id}`,
                },
              }
            );
            const dummyprovider = await this.dummyproviderModel.findOneAndUpdate(
              { provider: new ObjectId(id) },
              {
                $set: {
                  Schedules: details.opening_hours.weekday_text,
                },
              }
            );
            console.log('updateTimingProvider ===>>>>', provider);
          }
        
        } catch (detailsError) {
          console.error(
            `Error fetching details for place_id: ${place.place_id}`,
            detailsError.message,
          );
          return null;
        }
      }),
    );

    console.log('Detailed Places 1:', detailedPlaces.filter((p) => p)); // Print valid places
    return detailedPlaces.filter((p) => p); // Return only valid places
  } catch (error) {
    console.error('Error searching for places:', error.message);
    throw new Error('Error searching for places');
  }
}

async  createDummyProgramFromGeminiAdvanceByCityAndStatus(city,status,is_child_care) {
  let matchQueries = [];
  const match = {
    cityId: new ObjectId(city),
    roles: 'purpleprovider',
    status: status,
    is_deleted: false
  };
  const match1 = {};

  let providerLookupBefore = [];
  let providerLookupAfter = [
    {
      $lookup: {
        from: 'providers',
        localField: '_id',
        foreignField: 'user',
        as: 'provider',
      },
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (is_child_care) {
    providerLookupBefore = [
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    
    providerLookupAfter = [];
    if (is_child_care == 'true') {
      match1['provider.is_child_care'] = true;
    } else if (is_child_care == 'false') {
      match1['provider.is_child_care'] = false;
    }
  }
  const data = await this.userModel.aggregate([
    ...matchQueries,
    {
      $match: match,
    },
    ...providerLookupBefore,
    
    {
      $match: match1,
    },
    {
      $project: {
        _id: 1,
      }
    },
    {
      $facet: {
        result: [
          ...providerLookupAfter,
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

  const items = data[0].result;
  if(items.length){
    for(let item of items){
      console.log('item ====>>>>',item)
      await this.createDummyProgramFromGeminiAdvance(item._id);
    }
  }
}

async  createExtraFieldsFromGeminiAdvanceByCityAndStatus(city,status,is_child_care) {
  let matchQueries = [];
  const match = {
    cityId: new ObjectId(city),
    roles: 'purpleprovider',
    status: status,
    is_deleted: false
  };
  const match1 = {};

  let providerLookupBefore = [];
  let providerLookupAfter = [
    {
      $lookup: {
        from: 'providers',
        localField: '_id',
        foreignField: 'user',
        as: 'provider',
      },
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (is_child_care) {
    providerLookupBefore = [
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    
    providerLookupAfter = [];
    if (is_child_care == 'true') {
      match1['provider.is_child_care'] = true;
    } else if (is_child_care == 'false') {
      match1['provider.is_child_care'] = false;
    }
  }
  const data = await this.userModel.aggregate([
    ...matchQueries,
    {
      $match: match,
    },
    ...providerLookupBefore,
    
    {
      $match: match1,
    },
    {
      $project: {
        _id: 1,
      }
    },
    {
      $facet: {
        result: [
          ...providerLookupAfter,
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

  const items = data[0].result;
  if(items.length){
    for(let item of items){
      console.log('item ====>>>>',item)
      await this.createExtraFromGeminiAdvance(item._id);
    }
  }
}

async createProgramFromDummyProgramByCityId(cityId: string) {
    const dummyPrograms = await this.dummyprogramModel.find();
    for(let dummyProgram of dummyPrograms){
      try{
        const prgram = await this.programModel.findOne({name: dummyProgram.name[0],description: dummyProgram.description[0]});
        console.log(prgram);
        if(!prgram && prgram == null){
        const cty = await this.UserModel.findById({_id: new ObjectId(dummyProgram.provider)});  
        const data = await new this.programModel({
      name: dummyProgram.name[0] || '',
      description: dummyProgram.description[0] || '',
      canParentsParticipateInActivity: dummyProgram.canParentsParticipateInActivity,
      maxStudentsPerClass: dummyProgram.maxStudentsPerClass,
      seatsAvailable: dummyProgram.seatsAvailable,
      activityRecurring: {
        activityRecurring: dummyProgram.activityRecurring?.activityRecurring,
        days: dummyProgram.activityRecurring?.days || [],
      },
      indoorOroutdoor: dummyProgram.indoorOroutdoor,
      inpersonOrVirtual: dummyProgram.inpersonOrVirtual,
      type: dummyProgram.type || '',
      price: dummyProgram.price || 0,
      verifiedstatus: dummyProgram.verifiedstatus || 'unverified',
      timelinePics: dummyProgram.timelinePics || [],
      ageGroup: dummyProgram.ageGroup,
      isDateNotMention: dummyProgram.isDateNotMention,
      isPriceNotMention: dummyProgram.isPriceNotMention,
      // time: dummyProgram.time,
      isTimeNotMention: dummyProgram.isTimeNotMention,
      duration: dummyProgram.duration,
      isPublished: dummyProgram.isPublished,
      isFree: dummyProgram.isFree,
      isFav: dummyProgram.isFav,
      pricePerParticipant: dummyProgram.pricePerParticipant || 0,
      priceForSiblings: dummyProgram.priceForSiblings || null,
      adultAssistanceIsRequried: dummyProgram.adultAssistanceIsRequried,
      pricePeriod: dummyProgram.pricePeriod,
      capacity: dummyProgram.capacity,
      emails: dummyProgram.emails || [],
      addresses: dummyProgram.addresses || [],
      syncId: dummyProgram._id,
      days: dummyProgram.days,
      exceptionDates: dummyProgram.exceptionDates || [],
      proofreaderRating: dummyProgram.proofreaderRating,
      programRating: dummyProgram.programRating,
      isExpired: dummyProgram.isExpired,
      isproRated: dummyProgram.isproRated,
      isFreeTrial: dummyProgram.isFreeTrial,
      cycle_time: dummyProgram.cycle_time,
      isParentJoin: dummyProgram.isParentJoin,
      isChildCare: dummyProgram.isChildCare,
      privateOrGroup: dummyProgram.privateOrGroup || 'Group',
      maxTravelDistance: dummyProgram.maxTravelDistance || 0,
      totalSessionClasses: dummyProgram.totalSessionClasses || 0,
      isParentGuardianRequire: dummyProgram.isParentGuardianRequire,
      isOpenForBooking: dummyProgram.isOpenForBooking || 'Yes',
      last_reviewed: dummyProgram.last_reviewed ? dummyProgram.last_reviewed : '1970-06-28T12:32:06.247Z',
      isDateFlexible: dummyProgram.isDateFlexible,
      isDayNotMention: dummyProgram.isDayNotMention,
      isDayFlexible: dummyProgram.isDayFlexible,
      isTimeFlexible: dummyProgram.isTimeFlexible,
      dateOption: dummyProgram.dateOption || 'Dates available',
      dayOption: dummyProgram.dayOption || 'Days provided',
      timeOption: dummyProgram.timeOption || 'Time Available',
      maxNumberOfStudents: dummyProgram.maxNumberOfStudents || 'No Capacity info',
      parentalSupervisionRequired: dummyProgram.parentalSupervisionRequired || 'No data available',
      pricing: dummyProgram.pricing || 'Price available',
      pricePerUnit: dummyProgram.pricePerUnit,
      groupDiscount: dummyProgram.groupDiscount || {
        noOfStudents: 0,
        discountPercent: null,
      },
      meetGreetDuration: dummyProgram.meetGreetDuration || {
        hours: null,
        minutes: null,
      },
      skillLevel: dummyProgram.skillLevel || {
        title: '',
        description: '',
        isCustom: false,
      },
      prices: dummyProgram.prices || [],
      isDuplicate: dummyProgram.isDuplicate,
      addFrom: dummyProgram.addFrom || 'purpleInvester',
      createFrom: dummyProgram.createFrom || 'GEMINI',
      moveToWondrfly: dummyProgram.moveToWondrfly || false,
      isArchived: dummyProgram.isArchived || false,
      isRequestVerified: dummyProgram.isRequestVerified || 'Not started',
      questionAndAnswer: dummyProgram.questionAndAnswer || [],
      extraPrices: dummyProgram.extraPrices || [],
      slug: dummyProgram.slug,
      user: dummyProgram.provider || '',
      cityId: cty.cityId,
        }).save();
        console.log('new program created ====>>>',data)
      } else if(prgram){
        console.log('Program already exist');
      }
       }catch(e){
         console.log(e);
       }
    } 
}

async createDummyProgramsFromProviderURL(id: string) {

  const data = await this.providerModel.findById({_id: new ObjectId(id)});

  if(!data){
    throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
  }

  if (data.website && data.website !== '') {
    const url = data.website;

    const searchValue = `Find all programs and program details from provider ${url} website and return a concise JSON format with only essential details:
                              {
                               "programs": [
                                   {
                                     "name": "", 
                                     "description": "",
                                     "ageGroup": {},
                                     "activityRecurring": { "days": [], "activityRecurring": boolean },
                                     "time": { "from": "", "to": "" },
                                     "prices": {
                                       "priceUnit": "", 
                                       "priceType": "", 
                                       "pricePerParticipant": "", 
                                       "pricePerHour": "", 
                                       "classDuration": "", 
                                       "halfOrFullDay": "", 
                                       "duration": ""
                                     },        
                                     "location": "", 
                                     "timing": "", 
                                     "schedule": { "day": "", "startTime": "", "endTime": "", "frequency": "" }
                                   }
                                ]
                               }`;

    const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');

    try {
      // Send prompt to ChatGPT
      const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
      console.log('chatResponse ====>>>>',chatResponse)

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
        console.warn('ChatGPT Response Parsing Error:', parseError.message);
        console.warn('Invalid Response:', chatResponse[0]?.message?.content);
      }

      if (responseData?.programs?.length) {
        for (const program of responseData.programs) {
          const {
            name,
            description,
            earlyDrop_off_LatePick_up,
            canParentsParticipateInActivity,
            maxStudentsPerClass,
            seatsAvailable,
            activityRecurring,
            indoorOroutdoor,
            inpersonOrVirtual,
            ageGroup,
            duration,
            time,
            bookingCancelledIn,
            capacity,
            // batches,
            // sessions,
            groupDiscount,
            priceForSiblings,
            adultAssistanceIsRequried,
            prices,
            languages,
            healthAndSafety,
            location,
            timing,
            type,
            schedule,
            session_premises,
            programType,
            emails,
            skilllevel,
            isFreeTrial,
            parentalSupervisionRequired,
            privateOrGroup,
          } = program;

          if (!name) continue; // Skip if essential data like name is missing

          // Check if a program with the same name already exists for the same provider
          const existingProgram = await this.dummyprogramModel.findOne({
            provider: new ObjectId(id),
            name: name.trim(),
            createFrom: 'CHATGPT',
          });

          if (existingProgram) {
            // If the program exists but the description is different, append the description
            if (!existingProgram.description.includes(description)) {
              await this.dummyprogramModel.updateOne(
                { _id: existingProgram._id },
                {
                  $set: { updatedOn: new Date() },
                  $addToSet: { description: description.trim() }, // Add unique descriptions
                },
              );
              console.log(`Updated description for Dummyprogram: ${name}`);
            } else {
              console.log(`Duplicate program found, skipping: ${name}`);
            }
          } else {
            // Create new dummy program if it doesn't exist
            const dp = await new this.dummyprogramModel({
              provider: new ObjectId(data.user),
              name: name.trim(),
              description: [description.trim()],
              prices: prices || {},
              schedule: schedule || {},
              location: location?.trim() || '',
              timing: timing?.trim() || '',
              type: type?.trim() || '',
              createFrom: 'ChatGPT',
              earlyDrop_off_LatePick_up: earlyDrop_off_LatePick_up,
              canParentsParticipateInActivity:
                canParentsParticipateInActivity,
              maxStudentsPerClass: maxStudentsPerClass,
              seatsAvailable: seatsAvailable,
              activityRecurring: activityRecurring,
              indoorOroutdoor: indoorOroutdoor,
              inpersonOrVirtual: inpersonOrVirtual,
              ageGroup: ageGroup,
              duration: duration,
              time: time,
              bookingCancelledIn: bookingCancelledIn,
              capacity: capacity,
              // batches: batches,
              // sessions: sessions,
              groupDiscount: groupDiscount,
              priceForSiblings: priceForSiblings,
              adultAssistanceIsRequried: adultAssistanceIsRequried,
              languages: languages,
              healthAndSafety: healthAndSafety,
              session_premises: session_premises,
              programType: programType,
              emails: emails,
              skilllevel: skilllevel,
              isFreeTrial: isFreeTrial,
              parentalSupervisionRequired: parentalSupervisionRequired,
              privateOrGroup: privateOrGroup,
              createdOn: new Date(),
              updatedOn: new Date(),
            }).save();
            console.log(`New Dummyprogram created: ${name}`);
            console.log(`New Dummyprogram created: ${dp.prices}`);
          }
        }
      }
    } catch (error) {
      console.error(
        `Error processing dump for provider ${data._id}:`,
        error.message,
      );
    }
  }
}

async createDummyProgramsByProviderAndPrompt(providerId: string,promptId: string) {

  const userD = await this.userModel.findById({_id: new ObjectId(providerId)});

  if(!userD){
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  let location = userD.addressLine1;
  const data = await this.providerModel.find({user: new ObjectId(providerId)});

  if(!data){
    throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
  }

  const prmpt = '';

  if(!prmpt){
    throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);
  }

  if (data[0].website && data[0].website !== '') {
    const url = data[0].website;

    

    const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');

    try {
      // Send prompt to ChatGPT
      const [err, chatResponse] = await chatgpt.createCompletions(prmpt);
      console.log('chatResponse ====>>>>',chatResponse)

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
        console.warn('ChatGPT Response Parsing Error:', parseError.message);
        console.warn('Invalid Response:', chatResponse[0]?.message?.content);
      }

      if (responseData?.programs?.length) {
        for (const program of responseData.programs) {
          const {
            name,
            description,
            earlyDrop_off_LatePick_up,
            canParentsParticipateInActivity,
            maxStudentsPerClass,
            seatsAvailable,
            activityRecurring,
            indoorOroutdoor,
            inpersonOrVirtual,
            ageGroup,
            duration,
            time,
            bookingCancelledIn,
            capacity,
            groupDiscount,
            priceForSiblings,
            adultAssistanceIsRequried,
            prices,
            languages,
            healthAndSafety,
            location,
            timing,
            type,
            schedule,
            session_premises,
            programType,
            emails,
            skilllevel,
            isFreeTrial,
            parentalSupervisionRequired,
            privateOrGroup,
          } = program;

          if (!name) continue; // Skip if essential data like name is missing

          // Check if a program with the same name already exists for the same provider
          const existingProgram = await this.dummyprogramModel.findOne({
            provider: new ObjectId(providerId),
            name: name.trim(),
            createFrom: 'CHATGPT',
          });

          if (existingProgram) {
            // If the program exists but the description is different, append the description
            if (!existingProgram.description.includes(description)) {
              await this.dummyprogramModel.updateOne(
                { _id: existingProgram._id },
                {
                  $set: { updatedOn: new Date() },
                  $addToSet: { description: description.trim() }, // Add unique descriptions
                },
              );
              console.log(`Updated description for Dummyprogram: ${name}`);
            } else {
              console.log(`Duplicate program found, skipping: ${name}`);
            }
          } else {
            // Create new dummy program if it doesn't exist
            const dp = await new this.dummyprogramModel({
              provider: new ObjectId(data[0].user),
              name: name.trim(),
              description: [description.trim()],
              prices: prices || {},
              schedule: schedule || {},
              location: location?.trim() || '',
              timing: timing?.trim() || '',
              type: type?.trim() || '',
              createFrom: 'ChatGPT',
              earlyDrop_off_LatePick_up: earlyDrop_off_LatePick_up,
              canParentsParticipateInActivity:
                canParentsParticipateInActivity,
              maxStudentsPerClass: maxStudentsPerClass,
              seatsAvailable: seatsAvailable,
              activityRecurring: activityRecurring,
              indoorOroutdoor: indoorOroutdoor,
              inpersonOrVirtual: inpersonOrVirtual,
              ageGroup: ageGroup,
              duration: duration,
              time: time,
              bookingCancelledIn: bookingCancelledIn,
              capacity: capacity,
              groupDiscount: groupDiscount,
              priceForSiblings: priceForSiblings,
              adultAssistanceIsRequried: adultAssistanceIsRequried,
              languages: languages,
              healthAndSafety: healthAndSafety,
              session_premises: session_premises,
              programType: programType,
              emails: emails,
              skilllevel: skilllevel,
              isFreeTrial: isFreeTrial,
              parentalSupervisionRequired: parentalSupervisionRequired,
              privateOrGroup: privateOrGroup,
              createdOn: new Date(),
              updatedOn: new Date(),
            }).save();
            console.log(`New Dummyprogram created: ${name}`);
            console.log(`New Dummyprogram created: ${dp.prices}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing dump for provider ${data[0].website}:`, error.message);
    }
  }
}

async createNextDummyProgramsByProviderAndPrompt(providerId: string,promptId: string) {

  let program_name = ['not any programs'];

  const dmpr = await this.dummyprogramModel.find({provider: new ObjectId(providerId)});
  if(dmpr.length > 0){
    program_name = dmpr.map(item => Array.isArray(item.name) ? item.name.join(", ") : item.name);
    console.log('program_name ====>>>>',program_name)
  }

  const data = await this.providerModel.find({user: new ObjectId(providerId)});

  if(!data){
    throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
  }

  const prmpt = '';

  if(!prmpt){
    throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);
  }

  if (data[0].website && data[0].website !== '') {
    const url = data[0].website;

    console.log('data[0].website ====>>>>',data[0].website)
    console.log('prmpt.prompt ====>>>>',prmpt)
    // const searchValue =prmpt.prompt.replace(/\[subject\]/gi, data[0].website);
    const searchValue = prmpt;
    console.log('searchValue ====>>>>',searchValue)

    const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');

    try {
      // Send prompt to ChatGPT
      const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
      console.log('chatResponse ====>>>>',chatResponse)

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
        console.warn('ChatGPT Response Parsing Error:', parseError.message);
        console.warn('Invalid Response:', chatResponse[0]?.message?.content);
      }

      if (responseData?.programs?.length) {
        for (const program of responseData.programs) {
          const {
            name,
            description,
            earlyDrop_off_LatePick_up,
            canParentsParticipateInActivity,
            maxStudentsPerClass,
            seatsAvailable,
            activityRecurring,
            indoorOroutdoor,
            inpersonOrVirtual,
            ageGroup,
            duration,
            time,
            bookingCancelledIn,
            capacity,
            groupDiscount,
            priceForSiblings,
            adultAssistanceIsRequried,
            prices,
            languages,
            healthAndSafety,
            location,
            timing,
            type,
            schedule,
            session_premises,
            programType,
            emails,
            skilllevel,
            isFreeTrial,
            parentalSupervisionRequired,
            privateOrGroup,
          } = program;

          if (!name) continue; // Skip if essential data like name is missing

          // Check if a program with the same name already exists for the same provider
          const existingProgram = await this.dummyprogramModel.findOne({
            provider: new ObjectId(providerId),
            name: name.trim(),
            createFrom: 'CHATGPT',
          });

          if (existingProgram) {
            // If the program exists but the description is different, append the description
            if (!existingProgram.description.includes(description)) {
              await this.dummyprogramModel.updateOne(
                { _id: existingProgram._id },
                {
                  $set: { updatedOn: new Date() },
                  $addToSet: { description: description.trim() }, // Add unique descriptions
                },
              );
              console.log(`Updated description for Dummyprogram: ${name}`);
            } else {
              console.log(`Duplicate program found, skipping: ${name}`);
            }
          } else if((!existingProgram)) {
            // Create new dummy program if it doesn't exist
            const dp = await new this.dummyprogramModel({
              provider: new ObjectId(data[0].user),
              name: name.trim(),
              description: [description.trim()],
              prices: prices || {},
              schedule: schedule || {},
              location: location?.trim() || '',
              timing: timing?.trim() || '',
              type: type?.trim() || '',
              createFrom: 'ChatGPT',
              earlyDrop_off_LatePick_up: earlyDrop_off_LatePick_up,
              canParentsParticipateInActivity:
                canParentsParticipateInActivity,
              maxStudentsPerClass: maxStudentsPerClass,
              seatsAvailable: seatsAvailable,
              activityRecurring: activityRecurring,
              indoorOroutdoor: indoorOroutdoor,
              inpersonOrVirtual: inpersonOrVirtual,
              ageGroup: ageGroup,
              duration: duration,
              time: time,
              bookingCancelledIn: bookingCancelledIn,
              capacity: capacity,
              groupDiscount: groupDiscount,
              priceForSiblings: priceForSiblings,
              adultAssistanceIsRequried: adultAssistanceIsRequried,
              languages: languages,
              healthAndSafety: healthAndSafety,
              session_premises: session_premises,
              programType: programType,
              emails: emails,
              skilllevel: skilllevel,
              isFreeTrial: isFreeTrial,
              parentalSupervisionRequired: parentalSupervisionRequired,
              privateOrGroup: privateOrGroup,
              createdOn: new Date(),
              updatedOn: new Date(),
            }).save();
            console.log(`New Dummyprogram created: ${name}`);
            console.log(`New Dummyprogram created: ${dp.prices}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing dump for provider ${data[0].website}:`, error.message);
    }
  }
}

async updateDummyProgramsByProgramAndPrompt(programId, promptId) {
  try {
      const dmpr = await this.dummyprogramModel.findById(programId);
      if (!dmpr) throw new HttpException('Program not found', HttpStatus.NOT_FOUND);

      const prmpt = '';
      if (!prmpt) throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);

      const data = await this.cleandumpModel.find({ provider: dmpr.provider });
      if (!data.length) throw new HttpException('This Provider has no dump', HttpStatus.NOT_FOUND);

      let missingFields = [];
      let ProgramName = dmpr.name?.[0] || 'Unknown Program';

      for (const dta of data) {
          // Collect missing fields
          if (!dmpr.activityRecurring?.days?.length) missingFields.push('activityRecurring.days');
          if (!dmpr.time?.from || !dmpr.time?.to) missingFields.push('time.from', 'time.to');
          if (!dmpr.indoorOroutdoor) missingFields.push('indoorOrOutdoor');
          if (!dmpr.inpersonOrVirtual) missingFields.push('inPersonOrVirtual');
          if (!dmpr.ageGroup?.minAge || !dmpr.ageGroup?.maxAge) missingFields.push('ageGroup.minAge', 'ageGroup.maxAge');
          if (!dmpr.schedule?.day || !dmpr.schedule?.startTime || !dmpr.schedule?.endTime) missingFields.push('schedule.day', 'schedule.startTime', 'schedule.endTime');

          if (!Array.isArray(dmpr.prices) || dmpr.prices.length === 0) {
              missingFields.push('prices');
          } else {
              for (const price of dmpr.prices) {
                  ['priceUnit', 'priceType', 'pricePerHour', 'halfOrFullDay', 'title', 'noOfHours', 'noOfDays', 'noOfWeeks', 'pricePerParticipant', 'classDuration'].forEach(field => {
                      if (!price[field]) {
                          missingFields.push(`prices.${field}`);
                      }
                  });
              }
          }

          console.log('Missing Fields:', missingFields);

          const programContent = typeof dta.content === 'string' ? dta.content : JSON.stringify(dta.content);
          const searchValue ='';

          const chatgpt = new ChatGPT('YOUR_OPENAI_KEY'); // Replace with actual key

          try {
              const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
              if (err) {
                  console.warn(`ChatGPT Error:`, err.message);
                  continue;
              }

              let responseData;
              try {
                let rawResponse = chatResponse[0]?.message?.content || '{}';
                if (!rawResponse.startsWith('{') || !rawResponse.endsWith('}')) {
                  console.warn('Invalid JSON format received from ChatGPT:', rawResponse);
                  continue;  // Skip processing this entry
                }
                let responseData = JSON.parse(rawResponse);
                if (responseData?.fields) {
                  await this.dummyprogramModel.updateOne(
                    { _id: programId },
                    {
                      $set: {
                        'ageGroup.minAge': responseData.fields['ageGroup.minAge'],
                        'ageGroup.maxAge': responseData.fields['ageGroup.maxAge'],
                        'schedule.day': responseData.fields['schedule.day'],
                        'schedule.startTime': responseData.fields['schedule.startTime'],
                        'schedule.endTime': responseData.fields['schedule.endTime'],
                        'time.from': responseData.fields['time.from'],
                        'time.to': responseData.fields['time.to'],
                        'prices.priceUnit': responseData.fields['prices.priceUnit'],
                        'prices.priceType': responseData.fields['prices.priceType'],
                        'prices.pricePerHour': responseData.fields['prices.pricePerHour'],
                        'prices.halfOrFullDay': responseData.fields['prices.halfOrFullDay'],
                        'prices.title': responseData.fields['prices.title'],
                        'prices.noOfHours': responseData.fields['prices.noOfHours'],
                        'prices.noOfDays': responseData.fields['prices.noOfDays'],
                        'prices.noOfWeeks': responseData.fields['prices.noOfWeeks'],
                        'prices.pricePerParticipant': responseData.fields['prices.pricePerParticipant'],
                        'prices.classDuration': responseData.fields['prices.classDuration']
                      },
                    }
                  );
                }
              } catch (parseError) {
                  console.warn('ChatGPT Response Parsing Error:', parseError.message);
                  continue;
              }

          } catch (error) {
              console.error(`Error processing dump for provider ${ProgramName}:`, error.message);
          }
      }
  } catch (error) {
      console.error('Error updating program:', error.message);
  }
}

async updateScheduleInDummyProgramByProgramAndPrompt(programId : string, promptId : string) {
  try {
      const dmpr = await this.dummyprogramModel.findById(programId);
      if (!dmpr) throw new HttpException('Program not found', HttpStatus.NOT_FOUND);
      //   console.log('dmpr ===>>>',dmpr)
      const prmpt = '';
      if (!prmpt) throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);

      const data = await this.cleandumpModel.find({ provider: dmpr.provider, isProgramDataAvailable: true });
      if (!data.length) throw new HttpException('This Provider has no dump', HttpStatus.NOT_FOUND);
      let missingFields = [];

      // Ensure dmpr is defined before accessing properties
      if (!dmpr.schedule || dmpr.schedule.day === null) {
        missingFields.push("schedule.day");
      }
      
      // Check for other missing schedule fields
      if (!dmpr.schedule || dmpr.schedule.startTime === null) {
        missingFields.push("schedule.startTime");
      }
      
      if (!dmpr.schedule || dmpr.schedule.endTime === null) {
        missingFields.push("schedule.endTime");
      }
      
      if (!dmpr.schedule || dmpr.schedule.frequency === null) {
        missingFields.push("schedule.frequency");
      }
      
      if (!dmpr.schedule || dmpr.schedule.notes === null) {
        missingFields.push("schedule.notes");
      }
      
      console.log(missingFields);
      
      let ProgramName = dmpr.name?.[0] || 'Unknown Program';

      for (const dta of data) {

          const programContent = typeof dta.content === 'string' ? dta.content : JSON.stringify(dta.content);
          const searchValue = '';

          const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');
          try {
            // Send prompt to ChatGPT
            const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
            console.log('chatResponse ====>>>>',chatResponse)
      
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
              console.warn('ChatGPT Response Parsing Error:', parseError.message);
              console.warn('Invalid Response:', chatResponse[0]?.message?.content);
            }
      
            if (responseData?.fields) {
              const updateFields: any = {};
            
              // Dynamically add only non-empty values
              if (responseData.fields['schedule.day']) {
                updateFields['schedule.day'] = responseData.fields['schedule.day'];
              }
              if (responseData.fields['schedule.startTime']) {
                updateFields['schedule.startTime'] = responseData.fields['schedule.startTime'];
              }
              if (responseData.fields['schedule.endTime']) {
                updateFields['schedule.endTime'] = responseData.fields['schedule.endTime'];
              }
              if (responseData.fields['schedule.frequency']) {
                updateFields['schedule.frequency'] = responseData.fields['schedule.frequency'];
              }
              if (responseData.fields['schedule.notes']) {
                updateFields['schedule.notes'] = responseData.fields['schedule.notes'];
              }
            
              // Update only if there's something to update
              if (Object.keys(updateFields).length > 0) {
                await this.dummyprogramModel.updateOne(
                  { _id: programId },
                  { $set: updateFields }
                );
                console.log(`Updated Dummyprogram ${programId} with fields: ${Object.keys(updateFields).join(', ')}`);
              } else {
                console.log('No valid fields to update.');
              }
            }            
            }catch (error) {
              console.error('Error updating program:', error.message);
          }
          }
  } catch (error) {
      console.error('Error updating program:', error.message);
  }
}

async updatePricesInDummyProgramByProgramAndPrompt(programId: string, promptId: string) {
  try {
    const dmpr = await this.dummyprogramModel.findById(programId);
    if (!dmpr) throw new HttpException('Program not found', HttpStatus.NOT_FOUND);

    const prmpt = '';
    if (!prmpt) throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);

    const data = await this.cleandumpModel.find({ provider: dmpr.provider, isProgramDataAvailable: true });
    if (!data.length) throw new HttpException('This Provider has no dump', HttpStatus.NOT_FOUND);

    if (!Array.isArray(dmpr.prices)) {
      dmpr.prices = [];
    }

    let programName = dmpr.name?.[0] || 'Unknown Program';

    for (const dta of data) {
      const programContent = typeof dta.content === 'string' ? dta.content : JSON.stringify(dta.content);
      const searchValue = '';

      const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');

      try {
        const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
        if (err) {
          console.warn(`ChatGPT Error:`, err.message);
          continue;
        }

        let responseData;
        try {
          const jsonString = this.getDateStringToJSON(chatResponse[0]?.message?.content || '{}');
          responseData = JSON.parse(jsonString);
        } catch (parseError) {
          console.warn('ChatGPT Response Parsing Error:', parseError.message);
          console.warn('Invalid Response:', chatResponse[0]?.message?.content);
          continue;
        }

        if (responseData?.fields) {
          console.log('responseData?.fields ===>>>>',responseData?.fields)
          let newPrice: Price = {};
          const requiredFields = ["pricePerParticipant", "pricePerHour", "duration", "noOfHours"];
          let hasRequiredData = requiredFields.some(field => responseData.fields?.[`prices.${field}`]?.trim());

          // If required fields are empty, skip adding new price
          if (!hasRequiredData) {
            console.log(`Skipping price creation due to missing required fields.`);
            continue;
          }

          for (const field in responseData.fields) {
            if (field.startsWith("prices.")) {
              const key = field.replace("prices.", "") as keyof Price;
              newPrice[key] = responseData.fields[field] || "";
            }
          }

          // Check if an existing price has null values for pricePerParticipant & pricePerHour
          let existingPrice = dmpr.prices.find(p => p.pricePerParticipant === null && p.pricePerHour === null);

          if (existingPrice) {
            console.log(`Updating existing price with missing values.`);
            Object.assign(existingPrice, newPrice); // Merge new data into existing price
          } else {
            // Check for duplicates before adding a new price
            const isDuplicate = dmpr.prices.some(
              (p) => p.title === newPrice.title && p.priceType === newPrice.priceType
            );

            if (!isDuplicate) {
              dmpr.prices.push(newPrice);
              console.log(`Added new price:`, newPrice);
            }
          }
        }
      } catch (error) {
        console.error('Error updating program:', error.message);
      }
    }

    await dmpr.save();
    console.log("Updated Prices:", dmpr.prices);
  } catch (error) {
    console.error('Error updating program:', error.message);
  }
}

async updateActivityAgeGroupInDummyProgramByProgramAndPrompt(programId : string, promptId : string) {
  try {
      const dmpr = await this.dummyprogramModel.findById(programId);
      if (!dmpr) throw new HttpException('Program not found', HttpStatus.NOT_FOUND);
      //   console.log('dmpr ===>>>',dmpr)
      const prmpt = '';
      if (!prmpt) throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);

      const data = await this.cleandumpModel.find({ provider: dmpr.provider, isProgramDataAvailable: true });
      if (!data.length) throw new HttpException('This Provider has no dump', HttpStatus.NOT_FOUND);
      let missingFields = [];

      // Ensure dmpr is defined before accessing properties
      if (!dmpr.ageGroup || dmpr.ageGroup.minAge === null && dmpr.ageGroup.minAge === '') {
        missingFields.push("ageGroup.minAge");
      }
      
      // Check for other missing schedule fields
      if (!dmpr.ageGroup || dmpr.ageGroup.maxAge === null && dmpr.ageGroup.maxAge === '') {
        missingFields.push("ageGroup.maxAge");
      }
      
      if (!dmpr.activityRecurring || dmpr.activityRecurring.activityRecurring === null) {
        missingFields.push("activityRecurring.activityRecurring");
      }
      
      if (!dmpr.activityRecurring || dmpr.activityRecurring.days === null && dmpr.activityRecurring.days.length <= 0) {
        missingFields.push("activityRecurring.days");
      }
      
      if (!dmpr.maxStudentsPerClass || dmpr.maxStudentsPerClass === '') {
        missingFields.push("maxStudentsPerClass");
      }

      if (!dmpr.indoorOroutdoor || dmpr.indoorOroutdoor === 'No data available') {
        missingFields.push("indoorOroutdoor");
      }

      if (!dmpr.inpersonOrVirtual || dmpr.inpersonOrVirtual === 'No data available') {
        missingFields.push("inpersonOrVirtual");
      }

      if (!dmpr.maxNumberOfStudents || dmpr.maxNumberOfStudents === 'No Capacity info') {
        missingFields.push("maxNumberOfStudents");
      }

      if (!dmpr.parentalSupervisionRequired || dmpr.parentalSupervisionRequired === 'No data available') {
        missingFields.push("parentalSupervisionRequired");
      }

      if (!dmpr.pricing) {
        missingFields.push("pricing");
      }

      if (!dmpr.skillGroup || dmpr.skillGroup.length <= 0) {
        missingFields.push("skillGroup");
      }
      
      console.log(missingFields);
      
      let ProgramName = dmpr.name?.[0] || 'Unknown Program';

      for (const dta of data) {

          const programContent = typeof dta.content === 'string' ? dta.content : JSON.stringify(dta.content);
          const searchValue = '';

          const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');
          try {
            // Send prompt to ChatGPT
            const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
            console.log('chatResponse ====>>>>',chatResponse)
      
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
              console.warn('ChatGPT Response Parsing Error:', parseError.message);
              console.warn('Invalid Response:', chatResponse[0]?.message?.content);
            }
      
            if (responseData?.fields) {
              if (responseData.fields) {
                  // If the program exists but the description is different, append the description
                    const dba = await this.dummyprogramModel.updateOne(
                      { _id: programId },
                      {
                        $set: { 
                          'ageGroup.minAge': responseData.fields['ageGroup.minAge'],
                          'ageGroup.maxAge': responseData.fields['ageGroup.maxAge'],
                          'activityRecurring.activityRecurring': responseData.fields['activityRecurring.activityRecurring'],
                          'activityRecurring.days': responseData.fields['activityRecurring.days'],
                          'maxStudentsPerClass': responseData.fields['maxStudentsPerClass'],
                          'indoorOroutdoor': responseData.fields['indoorOroutdoor'],
                          'inpersonOrVirtual': responseData.fields['inpersonOrVirtual'],
                          'maxNumberOfStudents': responseData.fields['maxNumberOfStudents'],
                          'parentalSupervisionRequired': responseData.fields['parentalSupervisionRequired'],
                          'pricing': responseData.fields['pricing'],
                          'skillGroup': responseData.fields['skillGroup']
                         },
                      },
                    );
                    console.log(`Updated Dummyprogram ${dba}`);
                  }
              }
            }catch (error) {
              console.error('Error updating program:', error.message);
          }
          }
  } catch (error) {
      console.error('Error updating program:', error.message);
  }
}

async updateCurriculumAndCertificatesInDummyProviderByProviderAndPrompt(providerId : string, promptId : string) {
  try {
      const dmpr = await this.providerModel.findOne({user: providerId});
      if (!dmpr) throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
      
      const prmpt = '';
      if (!prmpt) throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);

          const searchValue = prmpt

          const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');
          try {
            
            const [err, chatResponse] = await chatgpt.createCompletions(searchValue);
      
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
              console.warn('ChatGPT Response Parsing Error:', parseError.message);
              console.warn('Invalid Response:', chatResponse[0]?.message?.content);
            }
      
            if (responseData?.programs) {
             
              const programData = responseData.programs[0];

              if (programData) {
              
                const dba = await this.dummyproviderModel.updateOne(
                  { provider: providerId },
                  {
                    $set: {
                      CurriculumTeachingMethodology: programData.curriculum,
                      LanguagesSpoken: programData.languages_spoken,
                    },
                  },
                );
              
              } else {
                console.warn('No valid program data found in response');
              }
            }
          
            }catch (error) {
              console.error('Error updating program:', error.message);
          }
         
  } catch (error) {
      console.error('Error updating program:', error.message);
  }
}

async  checkChildCareProviderExistWebDumpOrNot(city,Fromstatus,is_child_care) {
  let matchQueries = [];
  const match = {
    cityId: new ObjectId(city),
    roles: 'purpleprovider',
    status: Fromstatus,
    is_deleted: false
  };
  const match1 = {};

  let createDumpCount = 0;
  let notCreateDumpCount = 0;
  let totalCount = 0;

  let providerLookupBefore = [];
  let providerLookupAfter = [
    {
      $lookup: {
        from: 'providers',
        localField: '_id',
        foreignField: 'user',
        as: 'provider',
      },
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (is_child_care) {
    providerLookupBefore = [
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    
    providerLookupAfter = [];
    if (is_child_care == 'true') {
      match1['provider.is_child_care'] = true;
    } else if (is_child_care == 'false') {
      match1['provider.is_child_care'] = false;
    }
  }
  const data = await this.userModel.aggregate([
    ...matchQueries,
    {
      $match: match,
    },
    ...providerLookupBefore,
    
    {
      $match: match1,
    },
    {
      $facet: {
        result: [
          ...providerLookupAfter,
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

  const items = data[0].result;
  totalCount = items.length;
  console.log('items ===>>>',items.length)
  if(items.length){
    for(let item of items){
      let pr = await this.webdumpModel.findOne({provider: item._id});
      if(pr){
        createDumpCount++;
        console.log('createDumpCount ===>>>',createDumpCount)
      }if(!pr){
        notCreateDumpCount++;
        console.log('notCreateDumpCount ===>>>',notCreateDumpCount)
        await this.userModel.findOneAndUpdate(
          { _id: item._id },
          { $unset:{ stage: 1 } },
          { new: true }
        )
      }
    }
  }
  return {totalCount, createDumpCount,notCreateDumpCount};
}

async  checkWebDumpLengthLessThanFive(city,Fromstatus,is_child_care) {
  let matchQueries = [];
  const match = {
    cityId: new ObjectId(city),
    roles: 'purpleprovider',
    status: Fromstatus,
    is_deleted: false
  };
  const match1 = {};

  let ProviderCount = 0;
  let totalCount = 0;

  let providerLookupBefore = [];
  let providerLookupAfter = [
    {
      $lookup: {
        from: 'providers',
        localField: '_id',
        foreignField: 'user',
        as: 'provider',
      },
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (is_child_care) {
    providerLookupBefore = [
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    
    providerLookupAfter = [];
    if (is_child_care == 'true') {
      match1['provider.is_child_care'] = true;
    } else if (is_child_care == 'false') {
      match1['provider.is_child_care'] = false;
    }
  }
  const data = await this.userModel.aggregate([
    ...matchQueries,
    {
      $match: match,
    },
    ...providerLookupBefore,
    
    {
      $match: match1,
    },
    {
      $facet: {
        result: [
          ...providerLookupAfter,
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

  const items = data[0].result;
  totalCount = items.length;
  console.log('items ===>>>',items.length)
  if(items.length){
    for(let item of items){
      let pr = (await this.webdumpModel.find({provider: item._id}));
      if(pr.length <= 5){
        ProviderCount++;
        console.log('ProviderCount ===>>>',ProviderCount,pr.length,item._id)
      }
    }
  }
  return {totalCount, ProviderCount};
}

}