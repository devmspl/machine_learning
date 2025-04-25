import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
const cron = require('node-cron');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebscrapingInterface } from 'src/@types/interfaces/webscraping';
import { Webscraping } from 'src/schemas/webscraping.schema';
import { diffLines } from 'diff';
// import cheerio from 'cheerio';
import * as cheerio from 'cheerio';
import axios from 'axios';
// import * as cron from 'cron';
// import { CronJob } from 'cron';
import { ProgramModule } from '../program/program.module';
import { Program } from 'src/schemas/program.schema';
import { User } from 'src/schemas/user.schema';
import { Provider } from 'src/schemas/provider.schema';
import { ChatGPT } from '@app/service/chatgpt';
import { Programurl } from 'src/schemas/programurl.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class WebscrapingService {
    private readonly logger = new Logger(WebscrapingService.name);

    constructor(
        @InjectModel(Webscraping.name,DATABASE_CONNECTION.WONDRFLY) private readonly webscrapingModel: Model<Webscraping>,
        @InjectModel(Program.name,DATABASE_CONNECTION.WONDRFLY) private readonly programModel: Model<Program>,
        @InjectModel(User.name,DATABASE_CONNECTION.WONDRFLY) private readonly userModel: Model<User>,
        @InjectModel(Programurl.name,DATABASE_CONNECTION.WONDRFLY) private readonly programurlModel: Model<Programurl>,
    ) { }

    async fetchPageBodyContent(url) {
        try {
            const result = await axios.get(url);
            return result.data;
        } catch (error) {
            console.error('Error fetching page content:', error);
            throw error; // Rethrow the error for better error handling
        }
    }

    async extractVisibleContent(html) {
        const $ = await cheerio.load(html);
        $('style, noscript, iframe, footer, header, .adsbygoogle, .adsense, #disqus_thread, #disqus_thread *, nav, .wp-pagenavi, .wp-pagenavi *, script[src^="https://www.googletagmanager.com"], script[src^="https://www.clarity.ms"], script[src^="https://connect.facebook.net"]').remove();
        $('head').remove(); // Separate selector to remove the head element
        $('script').remove();
        return $('body').text().replace(/\s+/g, ' ').trim();
    }


    async checkForChanges(url, id) {
        try {
            const currentBodyContent = await this.fetchPageBodyContent(url);
            const page = await this.webscrapingModel.findOne({ programId: id });
            const program = await this.programModel.findOne({ _id: id });

            // Extract visible content from the current page
            const extractedCurrentContent = await this.extractVisibleContent(currentBodyContent);

            if (page) {
                // Extract visible content from the stored content
                const extractedStoredContent = await this.extractVisibleContent(page.content);
                if (extractedCurrentContent !== extractedStoredContent) {
                    console.log('Changes detected in body content!');
                    const differences = diffLines(extractedStoredContent, extractedCurrentContent);

                    page.content = currentBodyContent;
                    page.isChanged = 'Changes detected';
                    page.lastChangedTime = new Date();
                    program.changeDetection = true;
                    if (!program.isArchived) await this.userModel.findByIdAndUpdate(program.user, { changeDetection: true }, { new: true });
                    await program.save();
                    await page.save();

                    return {
                        message: 'Changes detected',
                        extractedStoredContent,
                        extractedCurrentContent,

                    };
                } else {
                    page.isChanged = 'No changes detected';
                    await page.save();
                    console.log('No changes detected');
                    return {
                        message: 'No changes detected',
                        extractedStoredContent,
                        extractedCurrentContent
                    };
                }
            } else {
                console.log('First time checking, saving content.');
                // Save the fetched body content for the first time
                const newPage = new this.webscrapingModel({ url, content: currentBodyContent });

                newPage.programId = id;
                newPage.content = currentBodyContent;
                newPage.url = url;
                newPage.isChanged = 'First time checking, content saved';
                newPage.lastChangedTime = new Date();
                if (!program.isArchived) await this.userModel.findByIdAndUpdate(program.user, { changeDetection: false }, { new: true });
                program.changeDetection = false;
                await program.save();
                await newPage.save();
                return { message: 'First time checking, content saved. No changes detected.' };
            }
        } catch (error) {
            console.error('Error checking for changes:', error);
            throw error;
        }
    }

    async checkChanges(id) {
        console.log('id', id);
        this.logger.log('[checkChanges:user:create]');
        const program = await this.programModel.findOne({ _id: id });
        if (!program) {
            throw new HttpException('Program not found', HttpStatus.NOT_FOUND);
        }
        const urls = decodeURIComponent(program.extractor_notes);
        console.log('URL:', urls);

        try {
            const result = await this.checkForChanges(urls, program._id);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw new HttpException('An error occurred while processing the request.', HttpStatus.BAD_REQUEST);
        }
    }

    async checkForChange(url) {
        try {
            const currentBodyContent = await this.fetchPageBodyContent(url);
            const page = await this.webscrapingModel.findOne({ url });


            // Extract visible content from the current page
            const extractedCurrentContent = await this.extractVisibleContent(currentBodyContent);
            // console.log('extractedCurrentContent', extractedCurrentContent);

            if (page) {
                // Extract visible content from the stored content
                const extractedStoredContent = await this.extractVisibleContent(page.content);
                // console.log('extractedStoredContent 1', extractedStoredContent);
                if (extractedCurrentContent !== extractedStoredContent) {
                    console.log('Changes detected in body content!');
                    const differences = diffLines(extractedStoredContent, extractedCurrentContent);

                    // Update the stored content and lastChecked timestamp
                    page.content = currentBodyContent;
                    page.isChanged = 'Changes detected';
                    page.lastChangedTime = new Date();
                    await page.save();

                    return {
                        message: 'Changes detected',
                        extractedStoredContent,
                        extractedCurrentContent,
                    };
                } else {
                    page.isChanged = 'No changes detected';
                    await page.save();
                    console.log('No changes detected');
                    return {
                        message: 'No changes detected',
                        extractedStoredContent,
                        extractedCurrentContent
                    };
                }
            } else {
                console.log('First time checking, saving content.');
                // Save the fetched body content for the first time
                const newPage = new this.webscrapingModel({ url, content: currentBodyContent });

                newPage.content = currentBodyContent;
                newPage.url = url;
                newPage.isChanged = 'First time checking, content saved';
                newPage.lastChangedTime = new Date();
                await newPage.save();
                return { message: 'First time checking, content saved. No changes detected.' };
            }
        } catch (error) {
            console.error('Error checking for changes:', error);
            throw error;
        }
    }

    async checkChangesByUrl(url) {
        console.log('url', url);
        this.logger.log('[checkChanges:user:create]');

        const urls = decodeURIComponent(url);
        console.log('URL:', urls);

        try {
            const result = await this.checkForChange(urls);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw new HttpException('An error occurred while processing the request.', HttpStatus.BAD_REQUEST);
        }
    }

    async getAllUrls(url, depth = 0, visited = new Set()) {
        try {
            // Fetch the HTML content of the webpage
            const response = await axios.get(url);
            const html = response.data;

            // Load the HTML into Cheerio
            const $ = cheerio.load(html);

            // Select all anchor elements and extract their href attributes
            const urls = [];

            $('a').each((index, element) => {
                const href = $(element).attr('href');
                if (href) {
                    urls.push(href);
                }
            });

            // Recursively fetch URLs from each found URL
            // const nestedUrls = [];
            // for (const href of urls) {
            //     const absoluteUrl = new URL(href, url).href;
            //     const nestedUrlsFromHref = await this.getAllUrls(absoluteUrl);
            //     nestedUrls.push(...nestedUrlsFromHref);
            // }

            // // Remove initial URLs found in the current page
            // const filteredNestedUrls = nestedUrls.filter(nestedUrl => !urls.includes(nestedUrl));

            return [...new Set(urls)]; // Remove duplicates
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async ProvidercheckChanges(id) {
        console.log('id', id);
        this.logger.log('[checkChanges:user:create]');
        const program = await this.programModel.find({ user: id });
        console.log('length ==>>', program.length)
        if (!program) {
            throw new HttpException('Program not found', HttpStatus.NOT_FOUND);
        }
        let results = [];
        for (let item of program) {

            const urls = decodeURIComponent(item.extractor_notes);
            console.log('URL:', urls);

            try {
                const result = await this.checkForChanges(urls, item._id);
                results.push(result);
                // return result;
            } catch (error) {
                console.error('Error:', error);
            }

        }
        return results;
    }

    ///////////////////////////------------------- CRON JOB RUN DAILY 5PM ---------------------------///////////////////////////

    /**
     * Checks for changes in all programs and returns the results.
     * It waits for 30 seconds between each check.
     * @returns {Promise<Array>} - An array of results from each check.
     */
    async getAllCheckChanges() {
        // Log the start of the function
        this.logger.log('[checkChanges:user:create]');

        // Find all programs
        const program = await this.programModel.find({ changeDetection: false, isArchived: false });
        console.log('Number of programs:', program.length);

        // Initialize an array to store the results
        const results = [];

        // Iterate over each program
        for (let item of program) {
            // Wait for 30 seconds
            await new Promise(resolve => setTimeout(resolve, 30000));

            // Decode the extractor notes
            const urls = decodeURIComponent(item.extractor_notes);
            console.log('URL:', urls);

            try {
                // Check for changes in the URLs and store the result
                const result = await this.checkForChanges(urls, item._id);
                results.push(result);
            } catch (error) {
                // Log any errors that occur
                console.error('Error:', error);
            }
        }

        // Return the results
        return results;
    }



    // Schedule the cron job to run daily at 5 PM

    onModuleInit() {
        if (process.env.NODE_ENV == 'script') {
            cron.schedule('10 8 * * 4', async () => {
                try {
                    console.log('Running cron job...');
                    const results = await this.getAllCheckChanges();
                    this.ProviderCheck()
                    this.logger.log('Cron job executed successfully : ', results);
                } catch (error) {
                    this.logger.error('Error executing cron job', error);
                }
            });

            this.logger.log('Cron job scheduled to run At 08:10 on Monday');
        }
    }

    async ProviderCheck() {

        this.logger.log('[checkChanges:user:create]');

        // const provider = await this.userModel.find({ changeDetection: true });
        let provider = await this.userModel.aggregate([
            { $match: { changeDetection: true } },
            {
                $lookup: {
                    from: "programs",
                    let: { user: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$user"] },
                                        { $eq: ["$changeDetection", true] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: "program"
                }
            },
            { $match: { program: { $size: 0 } } },
            { $project: { _id: 1 } }
        ])

        console.log('length ==>>', provider.length)
        if (provider && provider.length) {
            provider = provider.map(item => item._id)
            const providers = await this.userModel.updateMany(
                { _id: { $in: provider } },
                { $set: { changeDetection: false } },
                { new: true }
            );
        }
        // const provider = await this.userModel.find({ changeDetection: true });
        let unChangeprovider = await this.userModel.aggregate([
            { $match: { changeDetection: false } },
            {
                $lookup: {
                    from: "programs",
                    let: { user: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$user"] },
                                        { $eq: ["$changeDetection", true] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: "program"
                }
            },
            { $match: { $expr: { $gt: [{ $size: "$program" }, 0] } } },
            { $project: { _id: 1 } }
        ])

        console.log('length ==>>', unChangeprovider.length)

        if (!unChangeprovider.length) {

            return "All unChangeProviders Checked";

        }
        unChangeprovider = unChangeprovider.map(item => item._id)
        const unChangeproviders = await this.userModel.updateMany(
            { _id: { $in: unChangeprovider } },
            { $set: { changeDetection: true } },
            { new: true }
        );

        return unChangeprovider;

    }

    async checkUrlIsProgramOrNot(url) {

        console.log('url', url);

        try {
            const response = await axios.get(url);
            const html = response.data;

            // Parse HTML using Cheerio
            const $ = cheerio.load(html);

            // Extract program information (refine the selector as needed)
            const programInfo = $('.program-description').text() || $('body').text();

            // Check if program information exists
            const programResult = await this.isProgram(programInfo, $); // Pass Cheerio instance

            return programResult;
        } catch (error) {
            console.error('Error fetching or parsing HTML:', error);
            return { isProgram: false };
        }
    }

    async isProgram(programInfo, $) {
        // Convert programInfo to lowercase for case-insensitive comparison
        const lowerProgramInfo = programInfo.toLowerCase();

        // Check for comment sections (optional)
        if (programInfo.includes("#comments") || $('body').hasClass('comment-form')) {
            return false;
        }

        // Define program patterns with some context analysis
        const programPatterns = [
            // Look for keywords near program-related terms
            /(program|course|workshop)\b\s*(?:for|on|in)\s*(registration|enrollment|curriculum)/i,
            /\b(program|course|workshop)\b/i, // Base program keywords

            // Time and Duration (optional)
            /\d{1,2}(:\d{2})?(am|pm)\s*-\s*\d{1,2}(:\d{2})?(am|pm)\b/i,
            /\b(duration|length)\s*:\s*\d+\s*(minutes|hours|days|weeks)\b/i,

            // Schedule (optional)
            /\bschedule\b/i,
            /\b(daily|weekly|monthly)\s*schedule\b/i,

            // Session (optional)
            /\bsession\b/i,
            /\d+\s*session\b/i,

            // Grade (optional)
            /\b(grade\b|(?:\d{1,2})(th|st|nd|rd) grade)\b/i,
            // Include grade levels from URL
            /(\d+)(?:th|st|nd|rd)\s*-\s*(\d+)(?:th|st|nd|rd)\s*grade\b/i,

        ];

        // Check if any program patterns match with context
        const isProgramMatch = programPatterns.some(pattern => pattern.test(lowerProgramInfo));
        return isProgramMatch;
    }

    async Program(Info) {
        // Convert programInfo to lowercase for case-insensitive comparison
        const lowerProgramInfo = Info.toLowerCase();

        // Define program patterns with some context analysis
        const programPatterns = [
            // Look for keywords near program-related terms
            /(program|course|workshop)\b\s*(?:for|on|in)\s*(registration|enrollment|curriculum)/i,
            /\b(program|course|workshop)\b/i, // Base program keywords

            // Time and Duration (optional)
            /\d{1,2}(:\d{2})?(am|pm)\s*-\s*\d{1,2}(:\d{2})?(am|pm)\b/i,
            /\b(duration|length)\s*:\s*\d+\s*(minutes|hours|days|weeks)\b/i,

            // Schedule (optional)
            /\bschedule\b/i,
            /\b(daily|weekly|monthly)\s*schedule\b/i,

            // Session (optional)
            /\bsession\b/i,
            /\d+\s*session\b/i,

            // Grade (optional)
            /\b(grade\b|(?:\d{1,2})(th|st|nd|rd) grade)\b/i,
            // Include grade levels from URL
            /(\d+)(?:th|st|nd|rd)\s*-\s*(\d+)(?:th|st|nd|rd)\s*grade\b/i,

        ];

        // Check if any program patterns match with context
        const isProgramMatch = programPatterns.some(pattern => pattern.test(lowerProgramInfo));
        return isProgramMatch;
    }

    async checkChatGptToUrlIsProgramOrNot(url, req) {

        console.log('url', url);

        try {
            const searchValue = `please check this ${url} and provide me details about it like this Detail:{{}}`;
            console.log('searchValue', searchValue);
            const chatgpt = new ChatGPT('YOUR_OPENAI_KEY');
            const [err, chat_response] = await chatgpt.createCompletion(searchValue);

            if (err) {
                throw new Error(err.data.error.message);
            }

            // console.log('chat_response', chat_response[0].message.content);
            const programResult = await this.Program(chat_response[0].message.content);
            if (programResult == true) {
                const programUrl = await this.programurlModel.findOne({ url: url });
                if (programUrl) {
                    return 'Url Already Created'
                }
                const programUrlModel = {
                    url: url,
                    status: 'pending',
                    userId: req.user._id
                }
                const Url = await new this.programurlModel(programUrlModel).save();
                return Url;
            } if (programResult == false) {
                return 'No Program Url'
            }
            return programResult;
        } catch (error) {
            console.error('Error fetching or parsing HTML:', error);
            return false;
        }
    }

    async checkForChangess(url, id) {
        try {
            const currentBodyContent = await this.fetchPageBodyContent(url);
            const page = await this.webscrapingModel.findOne({ programId: id });
            const program = await this.programModel.findOne({ _id: id });

            // Extract visible content from the current page
            const extractedCurrentContent = await this.extractVisibleContent(currentBodyContent);

            if (page) {
                // Extract visible content from the stored content
                const extractedStoredContent = await this.extractVisibleContent(page.content);
                if (extractedCurrentContent !== extractedStoredContent) {
                    console.log('Changes detected in body content!');
                    const differences = diffLines(extractedStoredContent, extractedCurrentContent);

                    page.content = currentBodyContent;
                    page.isChanged = 'Changes detected';
                    page.lastChangedTime = new Date();
                    program.changeDetection = true;
                    if (!program.isArchived) await this.userModel.findByIdAndUpdate(program.user, { changeDetection: true }, { new: true });
                    await program.save();
                    await page.save();
                    console.log('Changes detected');
                    // return {
                    //     message: 'Changes detected',
                    //     extractedStoredContent,
                    //     extractedCurrentContent,

                    // };
                } else {
                    page.isChanged = 'No changes detected';
                    await page.save();
                    console.log('No changes detected');
                    // return {
                    //     message: 'No changes detected',
                    //     extractedStoredContent,
                    //     extractedCurrentContent
                    // };
                }
            } else {
                console.log('First time checking, saving content.');
                // Save the fetched body content for the first time
                const newPage = new this.webscrapingModel({ url, content: currentBodyContent });

                newPage.programId = id;
                newPage.content = currentBodyContent;
                newPage.url = url;
                newPage.isChanged = 'First time checking, content saved';
                newPage.lastChangedTime = new Date();
                if (!program.isArchived) await this.userModel.findByIdAndUpdate(program.user, { changeDetection: false }, { new: true });
                program.changeDetection = false;
                await program.save();
                await newPage.save();
                console.log('First time checking, content saved. No changes detected. Done');
                // return { message: 'First time checking, content saved. No changes detected.' };
            }
        } catch (error) {
            // console.error('Error checking for changes:', error);
            throw error;
        }
    }

    async  addChangeDetectionAllProvidersByCity(city,status,is_child_care) {
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
            const program = await this.programModel.find({ user: item._id });
            console.log('length ==>>', program.length)
            if (!program) {
                console.log('No Program Found');
            }
            if(program.length){
                let results = [];
                for (let item of program) {
                    console.log('item', item._id,item.extractor_notes);
                    if(item.extractor_notes){
                        try {
                            const urls = decodeURIComponent(item.extractor_notes);
                            console.log('URL:', urls);
                            const result = await this.checkForChangess(urls, item._id);
                            results.push(result);
                            // return result;
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }if(!item.extractor_notes && item.extractor_notes === '' && item.extractor_notes === null){
                        console.log('These Program Have No Url');
                    }
                }
            }
          }
        }
      }

}
