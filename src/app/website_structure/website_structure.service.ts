import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import cron from 'node-cron';
import { Website_structure } from 'src/schemas/website_structure.schema';
import { Event_source } from 'src/schemas/event_source.schema';
const axios = require('axios');
const cheerio = require('cheerio');
const ObjectId = require('mongoose').Types.ObjectId;


@Injectable()
export class WebsiteStructureService {
    private readonly logger = new Logger(WebsiteStructureService.name);
    private cronJob: cron.ScheduledTask | null = null;

    constructor(
        @InjectModel(Website_structure.name,DATABASE_CONNECTION.WONDRFLY) private readonly website_structureModel: Model<Website_structure>,
        @InjectModel(Event_source.name, DATABASE_CONNECTION.WONDRFLY) private readonly event_sourceModel: Model<Event_source>,
    ) {
      this.startCron();
     }

     async checkChanges(source_id: string) {
       try {
         const sourc = await this.event_sourceModel.findById({ _id: new ObjectId(source_id) });
         const url = sourc.website;
     
         const { data: html } = await axios.get(url);
         const $ = cheerio.load(html);
     
         let eventData;
     
         // Extract the specific script tag containing `window.__SERVER_DATA__`
         $('script').each((index, element) => {
           const scriptContent = $(element).html();
           if (scriptContent && scriptContent.includes('window.__SERVER_DATA__')) {
             const match = scriptContent.match(/window\.__SERVER_DATA__ = (\{.*?\});/s);
             if (match) {
               const jsonString = match[1].trim();
               eventData = JSON.parse(jsonString);
             }
           }
         });
     
         if (!eventData) {
           throw new Error('Failed to retrieve essential event data structure.');
         }
     
         // Filter out dynamic fields and sort the JSON to ensure consistency
         const filteredEventData = JSON.stringify(eventData, (key, value) => {
           if (
             ['start_date', 'end_date', 'updated_at', 'timestamp', 'random_id', 'pagination', 'continuation'].includes(key)
           ) {
             return undefined; // Exclude dynamic fields from comparison
           }
           return value;
         }, 2); // Indentation for readability
     
         console.log('filteredEventData =====>>>>>>>', filteredEventData);
     
         const currentStructureHash = crypto.createHash('md5').update(filteredEventData).digest('hex');
         console.log('currentStructureHash========>>>>>>>', currentStructureHash);
     
         const existingRecord = await this.website_structureModel.findOne({ website: url });
         if (!existingRecord) {
           // Save the structure if it doesn't exist yet
           await this.website_structureModel.create({
             website: url,
             structure: currentStructureHash,
             lastChecked: new Date(),
           });
           sourc.last_cron = new Date();
           sourc.change_detection = false;
           await sourc.save();
           return "HTML structure created for the first time.";
         }
     
         console.log('existingRecord.structure========>>>>>>>', existingRecord.structure);
         console.log('Comparing existing and current structure hashes...');
     
         // Compare the stored hash with the current hash
         if (existingRecord.structure === currentStructureHash) {
           sourc.last_cron = new Date();
           sourc.change_detection = false;
           await sourc.save();
           return "No changes in required HTML structure.";
         } else {
           await this.website_structureModel.updateOne(
             { website: url },
             { structure: currentStructureHash, lastChecked: new Date() }
           );
           sourc.last_cron = new Date();
           sourc.change_detection = true;
           await sourc.save();
           return "Required HTML structure has changed and is updated in the database.";
         }
       } catch (error) {
         console.error("Error checking and saving required HTML structure:", error);
         throw new Error("Failed to check and save required HTML structure.");
       }
     }
    
      async cronToCreateNextEvents() {
        try {
          const city = await this.event_sourceModel.find();
          console.log('city', city);
          for (let ctys of city) {
            let id = ctys._id.toString();
           await this.checkChanges(id)
          }
        } catch (error) {
          console.error('Error in cronToCreateNextEvents:', error);
        }
      }
    
      async startCron() {
        try {
          this.cronJob = cron.schedule(
            // '0 15 * * 0',
            '20 18 * * 0',
            async () => {
              try {
                console.log('Running cronToCreateNextEvents...');
                await this.cronToCreateNextEvents();
                console.log('cronToCreateNextEvents completed.');
                this.cronJob?.stop(); // Use optional chaining to safely call stop
                console.log('Cron job stopped.');
              } catch (error) {
                console.error('Error executing cronToCreateNextEvents:', error);
              }
            },
            {
              scheduled: true,
              timezone: 'Asia/Kolkata', // Set timezone to Asia/Kolkata
            },
          );
        } catch (error) {
          console.error('Error in cronToCreateNextEvents:', error);
        }
      }
      
      async getAll() {
        try {
          const city = await this.website_structureModel.find();
          return { Items: city, Count: city.length };
        } catch (error) {
          console.error('Error in cronToCreateNextEvents:', error);
        }
      }

      async getById(id: string) {
        try {
          const city = await this.website_structureModel.findById({ _id: id});
          return city;
        } catch (error) {
          console.error('Error in cronToCreateNextEvents:', error);
        }
      }

      async removeById(id: string) {
        try {
          const city = await this.website_structureModel.findByIdAndDelete({ _id: id});
          return city;
        } catch (error) {
          console.error('Error in cronToCreateNextEvents:', error);
        }
      }
}
