import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { programInterface } from 'src/@types/interfaces/program';
import { Program } from 'src/schemas/program.schema';
import { Temporaryprogram } from 'src/schemas/temporaryprogram.schema';
import { User } from 'src/schemas/user.schema';
import { createProgramDto } from './dto/create.dto';
import { Webscraping } from 'src/schemas/webscraping.schema';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ChatGPT } from '@app/service/chatgpt';
import { isString } from 'util';
import { from } from 'rxjs';
import { parseString } from 'xml2js';
import { diffLines } from 'diff';
import { Tags } from 'src/schemas/tags.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

const puppeteer = require('puppeteer');
const ObjectId = mongoose.Types.ObjectId;

Injectable();
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

  constructor(
    @InjectModel(Program.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly programModel: Model<Program>,
    @InjectModel(Temporaryprogram.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly tempProgramModel: Model<Temporaryprogram>,
    @InjectModel(User.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly UserModel: Model<User>,
    
    @InjectModel(Webscraping.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly WebscrapingModel: Model<Webscraping>,
    
    @InjectModel(Tags.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly TagsModel: Model<Tags>,
  ) {}

  async createProgram(model: createProgramDto) {
    const {
      name,
      providerName,
      earlyDrop_off_LatePick_up,
      canParentsParticipateInActivity,
      // location,
      maxStudentsPerClass,
      seatsAvailable,
      activityRecurring,
      indoorOroutdoor,
      skillGroups,
      source,
      sourceUrl,
      city,
      cycle,
      activeStatus,
      alias,
      description,
      type,
      price,
      code,
      joiningLink,
      presenter,
      programCoverPicl,
      status,
      timelinePics,
      ageGroup,
      date,
      isDateNotMention,
      isPriceNotMention,
      time,
      isTimeNotMention,
      bookingCancelledIn,
      duration,
      isPublished,
      isFree,
      isFav,
      pricePerParticipant,
      priceForSiblings,
      specialInstructions,
      adultAssistanceIsRequried,
      pricePeriod,
      priceUnit,
      capacity,
      emails,
      batches,
      user,
      addresses,
      sessions,
      programImage,
      lastModifiedBy,
      days,
      exceptionDates,
      extractionDate,
      extractor_notes,
      extractor_url,
      proofreaderObservation,
      extractionComment,
      cyrilComment,
      cyrilApproval,
      proofreaderRating,
      programRating,
      dbStatus,
      parentRequired,
      sessionLength,
      isExpired,
      expireReason,
      isproRated,
      isFreeTrial,
      per_hour_rate,
      cycle_time,
      addedBy,
      proof_reader_notes,
      isParentJoin,
      isChildCare,
      privateOrGroup,
      maxTravelDistance,
      totalSessionClasses,
      offerDiscount,
      isParentGuardianRequire,
      isOpenForBooking,
      zip,
      last_reviewed,
      registrationDates,
      isDateFlexible,
      isDayNotMention,
      isDayFlexible,
      isTimeFlexible,
      dateOption,
      dayOption,
      timeOption,
      maxNumberOfStudents,
      parentalSupervisionRequired,
      pricing,
      pricePerUnit,
      skillGroup,
      questionAndAnswer,
      groupDiscount,
      youEarn,
      meetGreetDuration,
      skillLevel,
      extraPrices,
      prices,
      providerEmail,
      locationOfActivity,
      multiLocations,
      instructor,
      displayPhoneNumbers,
      schedule,
      subCategoryIds,
      categoryId,
      cityId,
      moveToWondrfly,
      addFrom,
      isArchived,
      primaryPhoneNumbers,
      verifiedstatus,
      inpersonOrVirtual
      // providerId,
    } = model;
    const data = await new this.programModel({
      name,
      providerName,
      earlyDrop_off_LatePick_up,
      canParentsParticipateInActivity,
      // location,
      maxStudentsPerClass,
      seatsAvailable,
      activityRecurring,
      indoorOroutdoor,
      skillGroups,
      source,
      sourceUrl,
      city,
      cycle,
      activeStatus,
      alias,
      description,
      type,
      price,
      code,
      joiningLink,
      presenter,
      programCoverPicl,
      status,
      timelinePics,
      ageGroup,
      date,
      isDateNotMention,
      isPriceNotMention,
      time,
      isTimeNotMention,
      bookingCancelledIn,
      duration,
      isFree,
      isFav,
      pricePerParticipant,
      priceForSiblings,
      specialInstructions,
      adultAssistanceIsRequried,
      pricePeriod,
      priceUnit,
      capacity,
      emails,
      batches,
      user,
      addresses,
      sessions,
      programImage,
      lastModifiedBy,
      days,
      exceptionDates,
      extractionDate,
      extractor_notes,
      extractor_url,
      proofreaderObservation,
      extractionComment,
      cyrilComment,
      cyrilApproval,
      proofreaderRating,
      programRating,
      dbStatus,
      parentRequired,
      sessionLength,
      isExpired,
      expireReason,
      isproRated,
      isFreeTrial,
      per_hour_rate,
      cycle_time,
      addedBy,
      proof_reader_notes,
      isParentJoin,
      isChildCare,
      privateOrGroup,
      maxTravelDistance,
      totalSessionClasses,
      offerDiscount,
      isParentGuardianRequire,
      isOpenForBooking,
      zip,
      last_reviewed,
      registrationDates,
      isDateFlexible,
      isDayNotMention,
      isDayFlexible,
      isTimeFlexible,
      dateOption,
      dayOption,
      timeOption,
      maxNumberOfStudents,
      parentalSupervisionRequired,
      pricing,
      pricePerUnit,
      skillGroup,
      questionAndAnswer,
      groupDiscount,
      youEarn,
      meetGreetDuration,
      skillLevel,
      extraPrices,
      prices,
      providerEmail,
      locationOfActivity,
      multiLocations,
      instructor,
      displayPhoneNumbers,
      schedule,
      subCategoryIds,
      categoryId,
      cityId,
      moveToWondrfly,
      addFrom,
      isArchived,
      primaryPhoneNumbers,
      verifiedstatus,
      inpersonOrVirtual
      // providerId,
    }).save();
    const programId = data._id;
    try {
      const result = await axios.put(
        `${process.env.WONDRFLY}/api/programs/updateSeo/${programId}`,
        {},
      );
    } catch (error) {
      console.error('Error:', error);
    }

    if (programId) {
      if (
        data.extractor_notes !== undefined &&
        data.extractor_notes !== null &&
        data.extractor_notes !== ''
      ) {
        await this.checkChanges(programId, data.extractor_notes);
      }
    }
    if (model.tempProgramId) {
      const tempProgram = await this.tempProgramModel.findByIdAndUpdate(
        model.tempProgramId,
        { addProgram: true, programId: data._id },
      );
    }
    return data;
  }

  async getById(id: string) {
    const [listResult] = await this.programModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'tags',
          let: { subCategoryIds: '$subCategoryIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$_id', { $ifNull: ['$$subCategoryIds', []] }] },
                  ],
                },
              },
            },
          ],
          as: 'subCategoryIds',
        },
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$categoryId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', { $ifNull: ['$$categoryId', []] }] }],
                },
              },
            },
          ],
          as: 'categoryId',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$user' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                firstName: 1,
              },
            },
          ],
          as: 'programOwner',
        },
      },
      {
        $unwind: {
          path: '$programOwner',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          programOwner: '$programOwner.firstName',
        },
      },
    ]);
    return listResult;
  }

  async getByUser(id, archived, page_size: number, page_number: number) {
    const match: { user: Types.ObjectId; isArchived?: boolean } = {
      user: new mongoose.Types.ObjectId(id),
    };

    if (archived) {
      if (archived == 'true') {
        match.isArchived = true;
      } else if (archived == 'false') {
        match.isArchived = false;
      }
    }

    const skip = (page_number - 1) * page_size;
    const data = await this.programModel.aggregate([
      // { $match: { user: new ObjectId(id), isArchived: false } },
      { $match: match },
      {
        $facet: {
          result: [
            { $sort: { name: 1, createdOn: 1 } },
            { $skip: skip },
            { $limit: page_size },
            {
              $lookup: {
                from: 'tags',
                let: { subCategoryIds: '$subCategoryIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $in: [
                              '$_id',
                              { $ifNull: ['$$subCategoryIds', []] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: 'subCategoryIds',
              },
            },
            {
              $lookup: {
                from: 'categories',
                let: { categoryId: '$categoryId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ['$_id', { $ifNull: ['$$categoryId', []] }] },
                        ],
                      },
                    },
                  },
                ],
                as: 'categoryId',
              },
            },
            {
              $lookup: {
                from: 'providerschedules',
                let: { schedule: '$schedule' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$schedule'],
                      },
                    },
                  },
                ],
                as: 'schedule',
              },
            },
            {
              $lookup: {
                from: 'phonenumbers',
                let: { phoneNumber: '$phoneNumber' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$phoneNumber'],
                      },
                    },
                  },
                ],
                as: 'phoneNumber',
              },
            },
            {
              $lookup: {
                from: 'providerinstructors',
                let: { instructor: '$instructor' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ['$_id', { $ifNull: ['$$instructor', []] }] },
                        ],
                      },
                    },
                  },
                ],
                as: 'instructor',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { multiLocations: '$multiLocations' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $in: [
                              '$_id',
                              { $ifNull: ['$$multiLocations', []] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: 'multiLocations',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { locationOfActivity: '$locationOfActivity' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$locationOfActivity'],
                      },
                    },
                  },
                ],
                as: 'locationOfActivity',
              },
            },
            {
              $lookup: {
                from: 'provideremails',
                let: { providerEmail: '$providerEmail' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$providerEmail'],
                      },
                    },
                  },
                ],
                as: 'providerEmail',
              },
            },
            {
              $lookup: {
                from: 'activities',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$programId', '$$programId'],
                      },
                    },
                  },
                ],
                as: 'activities',
              },
            },
            {
              $set: {
                activitiesCount: { $size: '$activities' },
              },
            },
            {
              $project: {
                activities: false,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'lastModifiedBy',
                foreignField: '_id',
                as: 'lastModifiedBy',
              },
            },
            {
              $unwind: {
                path: '$lastModifiedBy',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$user' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$userId'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      firstName: 1,
                    },
                  },
                ],
                as: 'programOwner',
              },
            },
            {
              $unwind: {
                path: '$programOwner',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $set: {
                programOwner: '$programOwner.firstName',
              },
            },
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
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;
    const TotalPrgram = await this.programModel
      .find({ user: new mongoose.Types.ObjectId(id) })
      .count();
    const ArchivedCount = await this.programModel
      .find({ user: new mongoose.Types.ObjectId(id), isArchived: true })
      .count();
    const UnArchivedCount = await this.programModel
      .find({ user: new mongoose.Types.ObjectId(id), isArchived: false })
      .count();

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      TotalPrgram: TotalPrgram,
      ArchivedCount: ArchivedCount,
      UnArchivedCount: UnArchivedCount,
      items: items,
    };
  }

  async getAllPrograms(page_size: number, page_number: number, @Req() req) {
    const skip = (page_number - 1) * page_size;
    const data = await this.programModel.aggregate([
      {
        $lookup: {
          from: 'tags',
          let: { subCategoryIds: '$subCategoryIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$_id', { $ifNull: ['$$subCategoryIds', []] }] },
                  ],
                },
              },
            },
          ],
          as: 'subCategoryIds',
        },
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$categoryId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', { $ifNull: ['$$categoryId', []] }] }],
                },
              },
            },
          ],
          as: 'categoryId',
        },
      },
      {
        $lookup: {
          from: 'providerschedules',
          let: { schedule: '$schedule' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$schedule'],
                },
              },
            },
          ],
          as: 'schedule',
        },
      },
      {
        $lookup: {
          from: 'phonenumbers',
          let: { phoneNumber: '$phoneNumber' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$phoneNumber'],
                },
              },
            },
          ],
          as: 'phoneNumber',
        },
      },
      {
        $lookup: {
          from: 'activities',
          let: { programId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$programId', '$$programId'],
                },
              },
            },
          ],
          as: 'activities',
        },
      },
      {
        $set: {
          activitiesCount: { $size: '$activities' },
        },
      },
      {
        $project: {
          activities: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastModifiedBy',
          foreignField: '_id',
          as: 'lastModifiedBy',
        },
      },
      {
        $unwind: {
          path: '$lastModifiedBy',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'providerinstructors',
          let: { instructor: '$instructor' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', { $ifNull: ['$$instructor', []] }] }],
                },
              },
            },
          ],
          as: 'instructor',
        },
      },
      {
        $lookup: {
          from: 'providerlocations',
          let: { multiLocations: '$multiLocations' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$_id', { $ifNull: ['$$multiLocations', []] }] },
                  ],
                },
              },
            },
          ],
          as: 'multiLocations',
        },
      },
      {
        $lookup: {
          from: 'providerlocations',
          let: { locationOfActivity: '$locationOfActivity' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$locationOfActivity'],
                },
              },
            },
          ],
          as: 'locationOfActivity',
        },
      },
      {
        $lookup: {
          from: 'provideremails',
          let: { providerEmail: '$providerEmail' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$providerEmail'],
                },
              },
            },
          ],
          as: 'providerEmail',
        },
      },
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
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }
  async remove(id: string) {
    const userId = await this.programModel.findOne({ _id: id });
    console.log('userId', userId._id.toString());
    const user = await this.programModel.findByIdAndDelete({ _id: id });
    const scraping = await this.WebscrapingModel.findOneAndDelete({
      programId: id,
    });

    if (!user) {
      throw new HttpException('program not found', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.checkProviderChanges(userId.user.toString()); // Pass the relevant user ID or object
    } catch (error) {
      console.error('Error checking provider changes:', error);
    }
    return 'program removed';
  }
  // async fetchPageBodyContent(url) {
  //   try {
  //     const result = await axios.get(url);
  //     return result.data;
  //   } catch (error) {
  //     console.error('Error fetching page content:', error);
  //     throw error;
  //   }
  // }

//   async fetchPageBodyContent(url) {
//     try {
//       const axiosInstance = axios.create({
//         withCredentials: true,  // Enable cookies
//         maxRedirects: 5,        // Follow redirects
//     });
//     const result = await axiosInstance.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
//                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//                 'Accept-Language': 'en-US,en;q=0.9',
//                 'Referer': url,
//             }
//         });
//         return result.data;
//     } catch (error) {
//         console.error('Error fetching page content:', error);
//         throw error;
//     }
// }

async  fetchPageBodyContent(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const content = await page.content();
  await browser.close();
  return content;
}
  async extractVisibleContent(html) {
    const $ = await cheerio.load(html);
    $(
      'style, noscript, iframe, footer, header, .adsbygoogle, .adsense, #disqus_thread, #disqus_thread *, nav, .wp-pagenavi, .wp-pagenavi *, script[src^="https://www.googletagmanager.com"], script[src^="https://www.clarity.ms"], script[src^="https://connect.facebook.net"]',
    ).remove();
    $('head').remove();
    $('script').remove();

    return $('body').text().replace(/\s+/g, ' ').trim();
  }
  async checkForChanges(url, id) {
    try {
      const currentBodyContent = await this.fetchPageBodyContent(url);
      // const program = await this.programModel.findOne({ _id: id });
      const extractedCurrentContent = await this.extractVisibleContent(
        currentBodyContent,
      );
      console.log('First time checking, saving content.');
      // Save the fetched body content for the first time
      const newPage = new this.WebscrapingModel({
        url,
        content: extractedCurrentContent,
      });
      newPage.programId = id;
      newPage.content = currentBodyContent;
      newPage.url = url;
      newPage.isChanged = 'First time checking, content saved';
      newPage.lastChangedTime = new Date();
      // program.changeDetection = false;
      // await program.save();
      const changedetection = await newPage.save();
      if (changedetection) {
        const program = await this.programModel.findOne({ _id: id });
        program.changeDetection = false;
        await program.save();
      }
      return {
        message: 'First time checking, content saved. No changes detected.',
      };
    } catch (error) {
      console.error('Error checking for changes:', error);
      throw error;
    }
  }

  async checkChanges(programId, extractorNotes) {
    console.log('id', programId);
    const urls = decodeURIComponent(extractorNotes);
    console.log('URL:', urls);

    try {
      const result = await this.checkForChanges(urls, programId);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        'An error occurred while processing the request.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async ProviderCheck(providerId) {
    this.logger.log('[checkChanges:user:create]');

    // const provider = await this.userModel.find({ changeDetection: true });
    let provider = await this.UserModel.aggregate([
      { $match: { changeDetection: true, _id: providerId } },
      {
        $lookup: {
          from: 'programs',
          let: { user: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$user'] },
                    { $eq: ['$changeDetection', true] },
                  ],
                },
              },
            },
          ],
          as: 'program',
        },
      },
      { $match: { program: { $size: 0 } } },
      { $project: { _id: 1 } },
    ]);

    console.log('length ==>>', provider.length);
    if (provider && provider.length) {
      provider = provider.map((item) => item._id);
      const providers = await this.UserModel.updateMany(
        { _id: { $in: provider } },
        { $set: { changeDetection: false } },
        { new: true },
      );
    }
    // const provider = await this.UserModel.find({ changeDetection: true });
    let unChangeprovider = await this.UserModel.aggregate([
      { $match: { changeDetection: false } },
      {
        $lookup: {
          from: 'programs',
          let: { user: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$user'] },
                    { $eq: ['$changeDetection', true] },
                  ],
                },
              },
            },
          ],
          as: 'program',
        },
      },
      { $match: { $expr: { $gt: [{ $size: '$program' }, 0] } } },
      { $project: { _id: 1 } },
    ]);

    console.log('length ==>>', unChangeprovider.length);

    if (!unChangeprovider.length) {
      return 'All unChangeProviders Checked';
    }
    unChangeprovider = unChangeprovider.map((item) => item._id);
    const unChangeproviders = await this.UserModel.updateMany(
      { _id: { $in: unChangeprovider } },
      { $set: { changeDetection: true } },
      { new: true },
    );

    return unChangeprovider;
  }
  async update(id: string, model: Partial<programInterface>, @Req() req) {
    const program = await this.programModel.findById(id);

    if (!program) {
      throw new HttpException('program not found', HttpStatus.BAD_REQUEST);
    }
    program.lastModifiedBy = req.user._id;
    if (
      model.user !== 'string' &&
      model.user !== '' &&
      model.user !== undefined
    ) {
      program.user = model.user;
    }
    if (
      model.isRequestVerified !== 'string' &&
      model.isRequestVerified !== '' &&
      model.isRequestVerified !== undefined
    ) {
      program.isRequestVerified = model.isRequestVerified;
    }
    if (model.moveToWondrfly !== undefined) {
      program.moveToWondrfly = model.moveToWondrfly;
    }
    if (model.isArchived !== undefined) {
      program.isArchived = model.isArchived;
    }
    if (
      model.addFrom !== 'string' &&
      model.addFrom !== '' &&
      model.addFrom !== undefined
    ) {
      program.addFrom = model.addFrom;
    }
    if (
      model.cityId !== 'string' &&
      model.cityId !== '' &&
      model.cityId !== undefined
    ) {
      program.cityId = model.cityId;
    }

    // if (
    //   model.providerId !== 'string' &&
    //   model.providerId !== '' &&
    //   model.providerId !== undefined
    // ) {
    //   program.providerId = model.providerId;
    // }

    if (
      model.name !== 'string' &&
      model.name !== '' &&
      model.name !== undefined
    ) {
      program.name = model.name;
    }

    if (
      model.inpersonOrVirtual !== 'string' &&
      model.inpersonOrVirtual !== '' &&
      model.inpersonOrVirtual !== undefined
    ) {
      program.inpersonOrVirtual = model.inpersonOrVirtual;
    }

    if (
      model.providerName !== 'string' &&
      model.providerName !== '' &&
      model.providerName !== undefined
    ) {
      program.providerName = model.providerName;
    }

    if (model.earlyDrop_off_LatePick_up !== undefined) {
      program.earlyDrop_off_LatePick_up = model.earlyDrop_off_LatePick_up;
    }

    // if (model.location !== undefined) {
    //   program.location = model.location;
    // }

    if (model.verifiedstatus !== undefined) {
      program.verifiedstatus = model.verifiedstatus;
    }

    if (model.canParentsParticipateInActivity !== undefined) {
      program.canParentsParticipateInActivity =
        model.canParentsParticipateInActivity;
    }
    if (
      model.maxStudentsPerClass !== 0 &&
      model.maxStudentsPerClass !== undefined
    ) {
      program.maxStudentsPerClass = model.maxStudentsPerClass;
    }
    if (model.seatsAvailable !== 0 && model.seatsAvailable !== undefined) {
      program.seatsAvailable = model.seatsAvailable;
    }
    if (model.activityRecurring !== undefined) {
      program.activityRecurring = model.activityRecurring;
    }
    if (
      model.indoorOroutdoor !== 'string' &&
      model.indoorOroutdoor !== '' &&
      model.indoorOroutdoor !== undefined
    ) {
      program.indoorOroutdoor = model.indoorOroutdoor;
    }
    if (
      model.skillGroup !== 'string' &&
      model.skillGroup !== '' &&
      model.skillGroup !== undefined
    ) {
      program.skillGroup = model.skillGroup;
    }
    if (
      typeof model.source !== 'string' &&
      model.source !== '' &&
      model.source !== undefined
    ) {
      program.source = model.source;
    }
    if (typeof model.sourceUrl !== 'string' && model.sourceUrl !== undefined) {
      program.sourceUrl = model.sourceUrl;
    }
    if (
      typeof model.city !== 'string' &&
      model.city !== '' &&
      model.city !== undefined
    ) {
      program.city = model.city;
    }
    if (
      model.cycle !== 'string' &&
      model.cycle !== '' &&
      model.cycle !== undefined
    ) {
      program.cycle = model.cycle;
    }
    if (
      model.activeStatus !== 'string' &&
      model.activeStatus !== '' &&
      model.activeStatus !== undefined
    ) {
      program.activeStatus = model.activeStatus;
    }
    if (
      model.alias !== 'string' &&
      model.alias !== '' &&
      model.alias !== undefined
    ) {
      program.alias = model.alias;
    }
    if (
      model.description !== 'string' &&
      model.description !== '' &&
      model.description !== undefined
    ) {
      program.description = model.description;
    }
    if (
      model.type !== 'string' &&
      model.type !== undefined &&
      model.type !== undefined
    ) {
      program.type = model.type;
    }
    if (model.price !== 0 && model.price !== undefined) {
      program.price = model.price;
    }
    if (
      model.code !== undefined &&
      model.code !== '' &&
      model.code !== 'string'
    ) {
      program.code = model.code;
    }
    if (
      model.joiningLink !== undefined &&
      model.joiningLink !== 'string' &&
      model.joiningLink !== ''
    ) {
      program.joiningLink = model.joiningLink;
    }
    if (
      model.presenter !== undefined &&
      model.presenter !== 'string' &&
      model.presenter !== ''
    ) {
      program.presenter = model.presenter;
    }
    if (
      model.programCoverPicl !== undefined &&
      model.programCoverPicl !== 'string' &&
      model.programCoverPicl !== ''
    ) {
      program.programCoverPicl = model.programCoverPicl;
    }
    if (
      model.status !== 'string' &&
      model.status !== '' &&
      model.status !== undefined
    ) {
      program.status = model.status;
    }
    if (
      model.offerDiscount !== 'string' &&
      // model.offerDiscount !== '' &&
      model.offerDiscount !== undefined
    ) {
      program.offerDiscount = model.offerDiscount;
    }
    if (
      model.specialInstructions !== 'string' &&
      // model.specialInstructions !== '' &&
      model.specialInstructions !== undefined
    ) {
      program.specialInstructions = model.specialInstructions;
    }
    if (model.ageGroup !== undefined) {
      program.ageGroup = model.ageGroup;
    }
    if (model.date !== undefined) {
      program.date = model.date;
    }
    if (model.isDateNotMention !== undefined) {
      program.isDateNotMention = model.isDateNotMention;
    }
    if (model.isPriceNotMention !== undefined) {
      program.isPriceNotMention = model.isPriceNotMention;
    }
    if (model.time !== undefined) {
      program.time = model.time;
    }
    if (model.isTimeNotMention !== undefined) {
      program.isTimeNotMention = model.isTimeNotMention;
    }
    if (model.bookingCancelledIn !== undefined) {
      program.bookingCancelledIn = model.bookingCancelledIn;
    }
    if (model.duration !== undefined) {
      program.duration = model.duration;
    }
    if (model.isPublished !== undefined) {
      program.isPublished = model.isPublished;
    }
    if (model.isFree !== undefined) {
      program.isFree = model.isFree;
    }
    if (model.isFav !== undefined) {
      program.isFav = model.isFav;
    }
    if (
      model.pricePerParticipant !== 0 &&
      model.pricePerParticipant !== undefined
    ) {
      program.pricePerParticipant = model.pricePerParticipant;
    }
    if (
      model.priceForSiblings !== 'string' &&
      model.priceForSiblings !== '' &&
      model.priceForSiblings !== undefined
    ) {
      program.priceForSiblings = model.priceForSiblings;
    }
    if (
      model.specialInstructions !== 'string' &&
      model.specialInstructions !== '' &&
      model.specialInstructions !== undefined
    ) {
      program.specialInstructions = model.specialInstructions;
    }
    if (model.adultAssistanceIsRequried !== undefined) {
      program.adultAssistanceIsRequried = model.adultAssistanceIsRequried;
    }
    if (model.pricePeriod !== undefined) {
      program.pricePeriod = model.pricePeriod;
    }
    if (
      model.priceUnit !== 'string' &&
      model.priceUnit !== '' &&
      model.priceUnit !== undefined
    ) {
      program.priceUnit = model.priceUnit;
    }
    if (model.capacity !== undefined) {
      program.capacity = model.capacity;
    }
    if (model.emails !== undefined) {
      program.emails = model.emails;
    }
    if (
      model.user !== 'string' &&
      model.user !== '' &&
      model.user !== undefined
    ) {
      program.user = model.user;
    }
    if (model.addresses !== undefined) {
      program.addresses = model.addresses;
    }
    if (
      model.programImage !== 'string' &&
      model.programImage !== '' &&
      model.programImage !== undefined
    ) {
      program.programImage = model.programImage;
    }
    if (model.days !== undefined) {
      program.days = model.days;
    }
    if (model.exceptionDates !== undefined) {
      program.exceptionDates = model.exceptionDates;
    }
    if (model.extractionDate !== undefined) {
      program.extractionDate = model.extractionDate;
    }
    if (
      model.extractor_notes !== 'string' &&
      model.extractor_notes !== '' &&
      model.extractor_notes !== undefined
    ) {
      program.extractor_notes = model.extractor_notes;
    }
    if (
      model.extractor_url !== 'string' &&
      model.extractor_url !== '' &&
      model.extractor_url !== undefined
    ) {
      program.extractor_url = model.extractor_url;
    }
    if (
      model.proofreaderObservation !== 'string' &&
      model.proofreaderObservation !== '' &&
      model.proofreaderObservation !== undefined
    ) {
      program.proofreaderObservation = model.proofreaderObservation;
    }
    if (
      model.extractionComment !== 'string' &&
      model.extractionComment !== '' &&
      model.extractionComment !== undefined
    ) {
      program.extractionComment = model.extractionComment;
    }
    if (
      model.cyrilComment !== 'string' &&
      model.cyrilComment !== '' &&
      model.cyrilComment !== undefined
    ) {
      program.cyrilComment = model.cyrilComment;
    }
    if (
      model.cyrilApproval !== 'string' &&
      model.cyrilApproval !== '' &&
      model.cyrilApproval !== undefined
    ) {
      program.cyrilApproval = model.cyrilApproval;
    }
    if (
      model.proofreaderRating !== 0 &&
      model.proofreaderRating !== undefined
    ) {
      program.proofreaderRating = model.proofreaderRating;
    }
    if (model.programRating !== 0 && model.programRating !== undefined) {
      program.programRating = model.programRating;
    }
    if (
      model.dbStatus !== 'string' &&
      model.dbStatus !== '' &&
      model.dbStatus !== undefined
    ) {
      program.dbStatus = model.dbStatus;
    }
    if (
      model.parentRequired !== 'string' &&
      model.parentRequired !== '' &&
      model.parentRequired !== undefined
    ) {
      program.parentRequired = model.parentRequired;
    }
    if (
      model.sessionLength !== 'string' &&
      model.sessionLength !== '' &&
      model.sessionLength !== undefined
    ) {
      program.sessionLength = model.sessionLength;
    }
    if (model.isExpired !== undefined) {
      program.isExpired = model.isExpired;
    }
    if (
      model.expireReason !== 'string' &&
      model.expireReason !== '' &&
      model.expireReason !== undefined
    ) {
      program.expireReason = model.expireReason;
    }
    if (model.isproRated !== undefined) {
      program.isproRated = model.isproRated;
    }
    if (model.isFreeTrial !== undefined) {
      program.isFreeTrial = model.isFreeTrial;
    }
    if (
      model.per_hour_rate !== 'string' &&
      model.per_hour_rate !== '' &&
      model.per_hour_rate !== undefined
    ) {
      program.per_hour_rate = model.per_hour_rate;
    }
    if (model.cycle_time !== undefined && model.cycle_time !== 0) {
      program.cycle_time = model.cycle_time;
    }
    if (
      model.proof_reader_notes !== undefined &&
      model.proof_reader_notes !== 'string' &&
      model.proof_reader_notes !== ''
    ) {
      program.proof_reader_notes = model.proof_reader_notes;
    }
    if (
      model.addedBy !== 'string' &&
      model.addedBy !== '' &&
      model.addedBy !== undefined
    ) {
      program.addedBy = model.addedBy;
    }
    if (model.isParentJoin !== undefined) {
      program.isParentJoin = model.isParentJoin;
    }
    if (model.isChildCare !== undefined) {
      program.isChildCare = model.isChildCare;
    }
    if (
      model.privateOrGroup !== 'string' &&
      model.privateOrGroup !== '' &&
      model.privateOrGroup !== undefined
    ) {
      program.privateOrGroup = model.privateOrGroup;
    }
    if (
      model.maxTravelDistance !== 0 &&
      model.maxTravelDistance !== undefined
    ) {
      program.maxTravelDistance = model.maxTravelDistance;
    }
    if (
      model.totalSessionClasses !== 0 &&
      model.totalSessionClasses !== undefined
    ) {
      program.totalSessionClasses = model.totalSessionClasses;
    }
    if (model.isParentGuardianRequire !== undefined) {
      program.isParentGuardianRequire = model.isParentGuardianRequire;
    }
    if (model.zip !== 'string' && model.zip !== '' && model.zip !== undefined) {
      program.zip = model.zip;
    }
    if (
      model.isOpenForBooking !== 'string' &&
      model.isOpenForBooking !== '' &&
      model.isOpenForBooking !== undefined
    ) {
      program.isOpenForBooking = model.isOpenForBooking;
    }
    if (model.last_reviewed !== null && model.last_reviewed !== undefined) {
      program.last_reviewed = model.last_reviewed;
    }
    if (model.next_reviewed !== null && model.next_reviewed !== undefined) {
      program.next_reviewed = model.next_reviewed;
    }
    if (model.addedByCreatedOn !== undefined) {
      program.addedByCreatedOn = model.addedByCreatedOn;
    }
    if (model.registrationDates !== undefined) {
      program.registrationDates = model.registrationDates;
    }
    if (model.isDateFlexible !== undefined) {
      program.isDateFlexible = model.isDateFlexible;
    }
    if (model.isDayNotMention !== undefined) {
      program.isDayNotMention = model.isDayNotMention;
    }
    if (model.isDayFlexible !== undefined) {
      program.isDayFlexible = model.isDayFlexible;
    }
    if (model.isTimeFlexible !== undefined) {
      program.isTimeFlexible = model.isTimeFlexible;
    }
    if (
      model.dateOption !== 'string' &&
      model.dateOption !== '' &&
      model.dateOption !== undefined
    ) {
      program.dateOption = model.dateOption;
    }
    if (
      model.dayOption !== 'string' &&
      model.dayOption !== '' &&
      model.dayOption !== undefined
    ) {
      program.dayOption = model.dayOption;
    }
    if (
      model.timeOption !== 'string' &&
      model.timeOption !== '' &&
      model.timeOption !== undefined
    ) {
      program.timeOption = model.timeOption;
    }
    if (
      model.maxNumberOfStudents !== 'string' &&
      model.maxNumberOfStudents !== '' &&
      model.maxNumberOfStudents !== undefined
    ) {
      program.maxNumberOfStudents = model.maxNumberOfStudents;
    }
    if (
      model.parentalSupervisionRequired !== 'string' &&
      model.parentalSupervisionRequired !== '' &&
      model.parentalSupervisionRequired !== undefined
    ) {
      program.parentalSupervisionRequired = model.parentalSupervisionRequired;
    }
    if (
      model.pricing !== 'string' &&
      model.pricing !== '' &&
      model.pricing !== undefined
    ) {
      program.pricing = model.pricing;
    }
    if (model.pricePerUnit !== undefined) {
      program.pricePerUnit = model.pricePerUnit;
    }
    if (
      model.skillGroup !== undefined &&
      model.skillGroup !== 'string' &&
      model.skillGroup !== ''
    ) {
      program.skillGroup = model.skillGroup;
    }
    if (model.questionAndAnswer !== undefined) {
      program.questionAndAnswer = model.questionAndAnswer;
    }
    if (model.groupDiscount !== undefined) {
      program.groupDiscount = model.groupDiscount;
    }

    if (
      model.youEarn !== undefined &&
      model.youEarn !== 'string' &&
      model.youEarn !== ''
    ) {
      program.youEarn = model.youEarn;
    }
    if (model.meetGreetDuration !== undefined) {
      program.meetGreetDuration = model.meetGreetDuration;
    }
    if (model.skillLevel !== undefined) {
      program.skillLevel = model.skillLevel;
    }
    if (model.extraPrices !== undefined) {
      program.extraPrices = model.extraPrices;
    }
    if (model.prices !== undefined) {
      program.prices = model.prices;
    }
    if (model.providerEmail !== undefined) {
      program.providerEmail = model.providerEmail;
    }
    if (model.locationOfActivity !== undefined) {
      program.locationOfActivity = model.locationOfActivity;
    }
    if (model.multiLocations !== undefined) {
      program.multiLocations = model.multiLocations;
    }
    if (model.displayPhoneNumbers !== undefined) {
      program.displayPhoneNumbers = model.displayPhoneNumbers;
    }
    if (model.primaryPhoneNumbers !== undefined) {
      program.primaryPhoneNumbers = model.primaryPhoneNumbers;
    }
    if (model.schedule !== undefined) {
      program.schedule = model.schedule;
    }
    if (model.subCategoryIds !== undefined) {
      program.subCategoryIds = model.subCategoryIds;
    }
    if (model.instructor !== undefined) {
      program.instructor = model.instructor;
    }
    if (model.categoryId !== undefined) {
      program.categoryId = model.categoryId;
    }
    if (model.changeDetection !== undefined && model.changeDetection !== null) {
      program.changeDetection = model.changeDetection;
    }
    program.updatedOn = new Date();
    await program.save();

    // if (
    //   program.extractor_notes !== null &&
    //   program.extractor_notes !== undefined
    // ) {
    //   const programId = program._id;
    //   this.webScrapingProgram(programId);
    // }
    //   if (program.extractor_notes !== null && program.extractor_notes !== undefined) {
    //     const programId = program._id;
    //     const webscraping = await this.WebscrapingModel.findOne({ programId });
    //     if (!webscraping) {
    //         const programWithNotes = await this.programModel.findById(programId);
    //         if (programWithNotes.extractor_notes !== null && programWithNotes.extractor_notes !== undefined) {
    //             const currentProgram = await this.programModel.findById(programId);
    //             if (!currentProgram.changeDetection) {
    //                 // Set changeDetection to false only if it hasn't been set before
    //                 currentProgram.changeDetection = false;
    //                 await currentProgram.save();
    //             }
    //             await this.checkChanges(programId, programWithNotes.extractor_notes);
    //         }
    //     }
    // }
    try {
      const result = await axios.put(
        `${process.env.WONDRFLY}/api/programs/updateSeo/${program._id}`,
        {},
      );
    } catch (error) {
      console.error('Error:', error);
    }
    this.checkProviderChanges(program.user);
    return program;
  }
  async webScrapingProgram(programId) {
    const webscraping = await this.WebscrapingModel.findOne({ programId });
    if (!webscraping) {
      const program = await this.programModel.findById(programId);
      if (
        program.extractor_notes !== null &&
        program.extractor_notes !== undefined
      ) {
        await this.checkChanges(programId, program.extractor_notes);
        await this.ProviderCheck(program.user);
      }
    }
  }
  async checkProviderChanges(user: string) {
    let provider = await this.programModel.aggregate([
      {
        $match: {
          user: new ObjectId(user),
          isArchived: false,
          changeDetection: true,
        },
      },
      { $project: { _id: 1, changeDetection: 1 } },
    ]);

    const userChangeDetection = provider && provider.length ? true : false;

    const userUpdateResult = await this.UserModel.updateOne(
      { _id: new ObjectId(user) },
      { $set: { changeDetection: userChangeDetection } },
    );
  }

  async updateProgramBatch<T>(
    id: string,
    BatchId: string,
    model: any,
    @Req() req,
  ) {
    const program = await this.programModel.findById(id);

    const batch = await this.programModel.findOne({ 'batches._id': BatchId });

    if (!program) {
      throw new HttpException('program not found', HttpStatus.BAD_REQUEST);
    }

    if (!batch) {
      throw new HttpException(
        'Program Batch Not Found',
        HttpStatus.BAD_REQUEST,
      );
    }

    program.lastModifiedBy = req.user._id;

    if (model.batches !== undefined) {
      program.batches = program.batches.map((b_doc) => {
        if (BatchId == `${b_doc._id}`) {
          b_doc = { ...b_doc, ...model.batches };
        }
        return b_doc;
      });
    }

    await program.save();

    return program;
  }

  async updateProgramSession(
    id: string,
    SessionId: string,
    model: any,
    @Req() req,
  ) {
    const program = await this.programModel.findById(id);

    const batch = await this.programModel.findOne({
      'sessions._id': SessionId,
    });

    if (!program) {
      throw new HttpException('program not found', HttpStatus.BAD_REQUEST);
    }

    if (!batch) {
      throw new HttpException(
        'Program Sessions Not Found',
        HttpStatus.BAD_REQUEST,
      );
    }

    program.lastModifiedBy = req.user._id;

    if (model.sessions !== undefined) {
      program.sessions = program.sessions.map((b_doc) => {
        if (SessionId == `${b_doc._id}`) {
          b_doc = { ...b_doc, ...model.sessions };
        }
        return b_doc;
      });
    }

    await program.save();

    return program;
  }

  async updateProgramQuestionAndAnswer(
    id: string,
    QueAnsId: string,
    model: any,
    @Req() req,
  ) {
    const program = await this.programModel.findById(id);

    const batch = await this.programModel.findOne({
      'questionAndAnswer._id': QueAnsId,
    });

    if (!program) {
      throw new HttpException('program not found', HttpStatus.BAD_REQUEST);
    }

    if (!batch) {
      throw new HttpException(
        'Program Question And Answer Not Found',
        HttpStatus.BAD_REQUEST,
      );
    }

    program.lastModifiedBy = req.user._id;

    if (model.questionAndAnswer !== undefined) {
      program.questionAndAnswer = program.questionAndAnswer.map((b_doc) => {
        if (QueAnsId == `${b_doc._id}`) {
          b_doc = { ...b_doc, ...model.questionAndAnswer };
        }
        return b_doc;
      });
    }

    await program.save();

    return program;
  }

  async search(
    cityId: string,
    user: string,
    changeDetection: string,
    isArchived: string,
    verifiedstatus: string,
    page_size: number,
    page_number: number,
    programType: string,
  ) {
    const skip = (page_number - 1) * page_size;
    const matchCriteria: Record<string, any> = {};

    if (programType && !/^[a-zA-Z\s]+$/.test(programType)) {
      throw new BadRequestException('programType should only contain alphabetic characters and spaces.');
    }
    
    if (programType) {
      matchCriteria.type = programType;
    }

    if (cityId) {
      matchCriteria.cityId = new ObjectId(cityId);
    }

    if (user) {
      matchCriteria.user = new ObjectId(user);
    }

    if (changeDetection) {
      if (changeDetection === 'true') {
        matchCriteria.changeDetection = true;
      } else if (changeDetection === 'false') {
        matchCriteria.changeDetection = false;
      }
    }

    if (isArchived) {
      if (isArchived === 'true') {
        matchCriteria.isArchived = true;
      } else if (isArchived === 'false') {
        matchCriteria.isArchived = false;
      }
    }

    if (verifiedstatus) {
      matchCriteria.verifiedstatus = verifiedstatus;
    }

    const data = await this.programModel.aggregate([
      {
        $match: matchCriteria,
      },
      {
        $facet: {
          result: [
            { $sort: { name: 1, createdOn: 1 } },
            { $skip: skip },
            { $limit: page_size },
            {
              $lookup: {
                from: 'tags',
                let: { subCategoryIds: '$subCategoryIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$_id', { $ifNull: ['$$subCategoryIds', []] }],
                      },
                    },
                  },
                ],
                as: 'subCategoryIds',
              },
            },
            {
              $lookup: {
                from: 'categories',
                let: { categoryId: '$categoryId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$_id', { $ifNull: ['$$categoryId', []] }],
                      },
                    },
                  },
                ],
                as: 'categoryId',
              },
            },
            {
              $lookup: {
                from: 'providerschedules',
                let: { schedule: '$schedule' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$schedule'] },
                    },
                  },
                ],
                as: 'schedule',
              },
            },
            {
              $lookup: {
                from: 'phonenumbers',
                let: { phoneNumber: '$phoneNumber' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$phoneNumber'] },
                    },
                  },
                ],
                as: 'phoneNumber',
              },
            },
            {
              $lookup: {
                from: 'providerinstructors',
                let: { instructor: '$instructor' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$_id', { $ifNull: ['$$instructor', []] }],
                      },
                    },
                  },
                ],
                as: 'instructor',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { multiLocations: '$multiLocations' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$_id', { $ifNull: ['$$multiLocations', []] }],
                      },
                    },
                  },
                ],
                as: 'multiLocations',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { locationOfActivity: '$locationOfActivity' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$locationOfActivity'] },
                    },
                  },
                ],
                as: 'locationOfActivity',
              },
            },
            {
              $lookup: {
                from: 'provideremails',
                let: { providerEmail: '$providerEmail' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$providerEmail'] },
                    },
                  },
                ],
                as: 'providerEmail',
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$user' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$userId'] },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      firstName: 1,
                    },
                  },
                ],
                as: 'programOwner',
              },
            },
            {
              $unwind: {
                path: '$programOwner',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'activities',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$programId', '$$programId'] },
                    },
                  },
                ],
                as: 'activities',
              },
            },
            {
              $set: {
                programOwner: '$programOwner.firstName',
                activitiesCount: { $size: '$activities' },
              },
            },
            {
              $project: {
                activities: false,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'lastModifiedBy',
                foreignField: '_id',
                as: 'lastModifiedBy',
              },
            },
            {
              $unwind: {
                path: '$lastModifiedBy',
                preserveNullAndEmptyArrays: true,
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
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async createDuplicateById(id: string) {
    const listResult = await this.programModel.findOne({ _id: id });
    if (!listResult) {
      throw new Error('Program Not Found');
    }
    if (listResult) {
      const data = await new this.programModel({
        name: listResult.name,
        providerName: listResult.providerName,
        earlyDrop_off_LatePick_up: listResult.earlyDrop_off_LatePick_up,
        canParentsParticipateInActivity:
          listResult.canParentsParticipateInActivity,
        // location: listResult.location,
        maxStudentsPerClass: listResult.maxStudentsPerClass,
        seatsAvailable: listResult.seatsAvailable,
        activityRecurring: listResult.activityRecurring,
        indoorOroutdoor: listResult.indoorOroutdoor,
        inpersonOrVirtual: listResult.inpersonOrVirtual,
        source: listResult.source,
        sourceUrl: listResult.sourceUrl,
        city: listResult.city,
        cycle: listResult.cycle,
        activeStatus: listResult.activeStatus,
        alias: listResult.alias,
        description: listResult.description,
        type: listResult.type,
        price: listResult.price,
        code: listResult.code,
        joiningLink: listResult.joiningLink,
        presenter: listResult.presenter,
        programCoverPicl: listResult.programCoverPicl,
        verifiedstatus: listResult.verifiedstatus,
        status: listResult.status,
        timelinePics: listResult.timelinePics,
        ageGroup: listResult.ageGroup,
        date: listResult.date,
        isDateNotMention: listResult.isDateNotMention,
        isPriceNotMention: listResult.isPriceNotMention,
        changeDetection: listResult.changeDetection,
        time: listResult.time,
        isTimeNotMention: listResult.isTimeNotMention,
        bookingCancelledIn: listResult.bookingCancelledIn,
        duration: listResult.duration,
        isPublished: listResult.isPublished,
        isFree: listResult.isFree,
        isFav: listResult.isFav,
        pricePerParticipant: listResult.pricePerParticipant,
        priceForSiblings: listResult.priceForSiblings,
        specialInstructions: listResult.specialInstructions,
        adultAssistanceIsRequried: listResult.adultAssistanceIsRequried,
        pricePeriod: listResult.pricePeriod,
        priceUnit: listResult.priceUnit,
        capacity: listResult.capacity,
        emails: listResult.emails,
        batches: listResult.batches,
        user: listResult.user,
        // slug: listResult.slug,
        addresses: listResult.addresses,
        sessions: listResult.sessions,
        programImage: listResult.programImage,
        lastModifiedBy: listResult.lastModifiedBy,
        days: listResult.days,
        exceptionDates: listResult.exceptionDates,
        extractionDate: listResult.extractionDate,
        extractor_notes: listResult.extractor_notes,
        extractor_url: listResult.extractor_url,
        proofreaderObservation: listResult.proofreaderObservation,
        extractionComment: listResult.extractionComment,
        cyrilComment: listResult.cyrilComment,
        cyrilApproval: listResult.cyrilApproval,
        proofreaderRating: listResult.proofreaderRating,
        programRating: listResult.programRating,
        dbStatus: listResult.dbStatus,
        parentRequired: listResult.parentRequired,
        sessionLength: listResult.sessionLength,
        isExpired: listResult.isExpired,
        expireReason: listResult.expireReason,
        isproRated: listResult.isproRated,
        isFreeTrial: listResult.isFreeTrial,
        per_hour_rate: listResult.per_hour_rate,
        cycle_time: listResult.cycle_time,
        proof_reader_notes: listResult.proof_reader_notes,
        addedBy: listResult.addedBy,
        isParentJoin: listResult.isParentJoin,
        isChildCare: listResult.isChildCare,
        privateOrGroup: listResult.privateOrGroup,
        maxTravelDistance: listResult.maxTravelDistance,
        totalSessionClasses: listResult.totalSessionClasses,
        offerDiscount: listResult.offerDiscount,
        isParentGuardianRequire: listResult.isParentGuardianRequire,
        isOpenForBooking: listResult.isOpenForBooking,
        zip: listResult.zip,
        last_reviewed: listResult.last_reviewed,
        next_reviewed: listResult.next_reviewed,
        addedByCreatedOn: listResult.addedByCreatedOn,
        registrationDates: listResult.registrationDates,
        isDateFlexible: listResult.isDateFlexible,
        isDayNotMention: listResult.isDayNotMention,
        isDayFlexible: listResult.isDayFlexible,
        isTimeFlexible: listResult.isTimeFlexible,
        dateOption: listResult.dateOption,
        dayOption: listResult.dayOption,
        timeOption: listResult.timeOption,
        maxNumberOfStudents: listResult.maxNumberOfStudents,
        parentalSupervisionRequired: listResult.parentalSupervisionRequired,
        pricing: listResult.pricing,
        pricePerUnit: listResult.pricePerUnit,
        skillGroup: listResult.skillGroup,
        questionAndAnswer: listResult.questionAndAnswer,
        groupDiscount: listResult.groupDiscount,
        youEarn: listResult.youEarn,
        meetGreetDuration: listResult.meetGreetDuration,
        skillLevel: listResult.skillLevel,
        extraPrices: listResult.extraPrices,
        prices: listResult.prices,
        providerEmail: listResult.providerEmail,
        locationOfActivity: listResult.locationOfActivity,
        multiLocations: listResult.multiLocations,
        instructor: listResult.instructor,
        primaryPhoneNumbers: listResult.primaryPhoneNumbers,
        schedule: listResult.schedule,
        subCategoryIds: listResult.subCategoryIds,
        categoryId: listResult.categoryId,
        cityId: listResult.cityId,
        isDuplicate: true,
        addFrom: listResult.addFrom,
        moveToWondrfly: listResult.moveToWondrfly,
        isArchived: listResult.isArchived,
        duplicateId: listResult._id,
        displayPhoneNumbers: listResult.displayPhoneNumbers,
        // slug: listResult.slug,
      }).save();
      return data;
    }
  }
  async fetchData(url) {
    const result = await axios.get(url);
    return result.data;
  }
  async getProgramDataFromUrl(url: string, providerId: string) {
    const html = await this.fetchData(url);
    const bodyContent = this.extractBodyContent(html);
    console.log('bodyContent===>', bodyContent);
    const chatgpt = new ChatGPT(
      'YOUR_OPENAI_KEY',
    );
    const prompt =
      bodyContent +
      ' Referencing the given data, find programs from this provider.  Programs fields may include program or class name as name, program or class description as description, price as price, class times as schedules, duration as duration, age(s) as ageGroup, mode(s) of delivery (online or in-person) as deliveryMode, program type (group class, semester, private lesson, or party activity) as type, discounts(if any) as discount, available seats as availableSeat and other data fields.  Only report information that is found in the file.  If the required program fields and information are not found in the file, do not generate new fields or information not found in the attached file.please give programs in programs array.  Report all of this in JSON format like:{programs:[]}.';
    let [err, chat_response] = await chatgpt.createCompletion(prompt);

    if (err) {
      throw new Error(err.data.error.message);
    }
    chat_response = chat_response[0].message.content;
    console.log('chat_response===>', chat_response);
    if (isString(chat_response)) {

      const jsonRegex =
        /```json([\s\S]+?)```|{[^{}]*}|```markdown\n({[\s\S]*})\n```|```(?:json)?\n([\s\S]+?)```|\{(?:[^{}]|(?:\{(?:[^{}]|)*\}))*\}/;

      // Extracting the JSON string from the Markdown string
      const jsonDataMatch = chat_response.match(jsonRegex);

      if (jsonDataMatch) {
        const jsonDataString =
          jsonDataMatch[1] ||
          jsonDataMatch[2] ||
          jsonDataMatch[3] ||
          jsonDataMatch[4];

        chat_response = jsonDataString
          ? JSON.parse(jsonDataString)
          : JSON.parse(chat_response);

        // Now you can use chat_response object in your JavaScript code
      } else {
        throw new Error('No JSON data found in the Markdown string.');
        // console.log("No JSON data found in the Markdown string.");
      }
    }
    let programs = chat_response.programs;
    let addData = programs.map((program) => {
      return { programData: program, providerId: providerId, url: url };
    });
    const data = await this.tempProgramModel.insertMany(addData);
    // ({
    //   programData: chat_response,
    // }).save();
    console.log(data);
    return chat_response;
  }

  extractBodyContent(html: string): string {
    const $ = cheerio.load(html);

    // Remove <script> tags
    $('script').remove();

    // Remove <style> tags containing CSS
    $('style').remove();

    // Remove style attributes from HTML elements
    $('[style]').removeAttr('style');

    // Initialize an array to store text content from each element
    const textContent = [];

    // Iterate over each element within the body
    $('body')
      .children()
      .each((index, element) => {
        // Extract text content of the element and push it to the array
        const elementText = $(element).text().trim();
        if (elementText) {
          textContent.push(elementText);
        }
      });

    // Join the text content from all elements and remove spaces
    return textContent.join('').replace(/\s/g, '');
  }

  async getTempProgramToWondrflyProgramChanges(id) {
    let tempProgram = await this.tempProgramModel.findById(id);
    if (!tempProgram) {
      throw new Error('Program not found');
    }
    let programModel = `{
      name: '', description: 'write description if not availabe in provider data please write a note in max 2500 characters about description by your self', type: 'chose value from only :- Camp || Class||  Party || Private Class', email: '',
      isPublished: false, price: '', date:{ from: 'give value in iso format or null',to: 'give value in iso format or null'},ageGroup: { month:[], give only ingeger array between 0-23, year:[] give only ingeger array between 2-18},
      duration: 'give value in mints or null', isFree: false, emails: [],extraPrices: [{
        pricePerUnit: 'chose value from only :- hour || class|| day|| week|| month|| package|| semester|| year',
        pricePerParticipant: 'price in integer',
      }],indoorOroutdoor: 'chose value from only:- Indoor or Outdoor or Either  or No data available,
      offerDiscount: 'write a note about offer discounts if not availabe in provider data please write a note in max 2500 characters about offer discounts by your self',
      specialInstructions: 'write a note about SPECIAL / ADDITIONAL INSTRUCTIONS if not availabe in provider data please write a note in max 2500 characters about offer discounts by your self',
      parentalSupervisionRequired: 'chose value from only :- No data available || Parent attendance NOT  required || Parent attendance NOT required || Parent attendance required',
      pricing:  "chose value from only :- It is a free program || No data available || Price available || Price can be discussed ||",
      if price is available then addprice in extraPrices:[ {pricePerUnit: 'chose value from only :- hour || class|| day|| week|| month|| package|| semester|| year', pricePerParticipant: 'price in integer'}],
      extractor_notes:${tempProgram.url}
    }`;

    const chatgpt = new ChatGPT(
      'YOUR_OPENAI_KEY',
    );
    const prompt =
      JSON.stringify(tempProgram.programData) +
      'change this data in program model. program model is = ' +
      programModel +
      'in json format';
    let [err, chat_response] = await chatgpt.createCompletion(prompt);

    if (err) {
      throw new Error(err.data.error.message);
    }
    console.log(chat_response);
    chat_response = chat_response[0].message.content;
    if (isString(chat_response)) {
      let jsonRegex = /```json([\s\S]+?)```|\{([\s\S]+?)\}/;

      // Extracting the JSON string from the first Markdown string
      let jsonDataMatch = chat_response.match(jsonRegex);

      // Extracting the JSON string from the Markdown string
      // let jsonDataMatch = programDetail.match(jsonRegex);
      if (jsonDataMatch) {
        let jsonDataString = jsonDataMatch[1] || jsonDataMatch[2];
        // Parsing the JSON string into a JavaScript object
        chat_response = JSON.parse(jsonDataString);

        // Now you can use chat_response object in your JavaScript code
      } else {
        throw new Error('No JSON data found in the Markdown string.');
        // console.log("No JSON data found in the Markdown string.");
      }
    }
    return chat_response;
  }

  async fetchAndParseSitemap(url: string): Promise<string[]> {
    try {
      const response = await axios.get(url);
      const xml = response.data;
      return new Promise<string[]>((resolve, reject) => {
        parseString(xml, async (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result.sitemapindex) {
              const urls = result.sitemapindex.sitemap.map(
                (sitemap: any) => sitemap.loc[0],
              );
              // resolve(urls);
              let data = [];
              for (let url of urls) {
                let links = await this.fetchAndParseSitemap(url);
                data = data.concat(links);
              }
              resolve(data);
            }
            if (result.urlset) {
              const urls = result.urlset.url.map((url: any) => url.loc[0]);
              resolve(urls);
            }
          }
        });
      });
    } catch (error) {
      throw new Error(`Error fetching sitemap: ${error.message}`);
    }
  }

  async getMissingData(id, missingFields) {
    let tempProgram = await this.tempProgramModel.findById(id);
    if (!tempProgram) {
      throw new Error('Program not found');
    }
    console.log('tempProgram', tempProgram);
    let provider = await this.UserModel.aggregate([
      {
        $match: {
          _id: tempProgram.providerId,
        },
      },
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'providerData',
        },
      },
      {
        $unwind: '$providerData',
      },
      {
        $project: {
          _id: 1,
          subCategoryIds: '$providerData.subCategoryIds',
          categories: '$providerData.categories',
        },
      },
      {
        $lookup: {
          from: 'tags',
          let: { subCategoryIds: '$subCategoryIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$subCategoryIds'],
                },
              },
            },
            { $project: { _id: 1, name: 1 } },
          ],
          as: 'subCategoryIds',
        },
      },
      {
        $lookup: {
          from: 'categories',
          let: { categories: '$categories' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$categories'],
                },
              },
            },
            { $project: { _id: 1, name: 1 } },
          ],
          as: 'categories',
        },
      },
    ]);
    console.log('provider===>', provider);
   
    let query = provider[0].subCategoryIds.length
      ? `Please find subCategoryIds name from this list  ${provider[0].subCategoryIds
          .map((x) => x.name)
          .toString()}`
      : ``;
    query += provider[0].categories.length
      ? `Please find categories name from this list  ${provider[0].categories
          .map((x) => x.name)
          .toString()}`
      : ``;
    const chatgpt = new ChatGPT(
      'YOUR_OPENAI_KEY',
    );

    const prompt =
      'programData=' +
      tempProgram.programData.description +
      `select data behalf of programData and ${query} only select from this list else give null` +
      'in json format like {subCategoryIds:[],categories:[]}';
    console.log('prompt==>', prompt);
    let [err, chat_response] = await chatgpt.createCompletion(prompt);

    if (err) {
      throw new Error(err.data.error.message);
    }
    console.log(chat_response);
    chat_response = chat_response[0].message.content;
    let contentString = chat_response;
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
          const data = { subCategoryIds: [], categories: [] };
          if (contentString) {
            let providerCategories = provider[0].categories.map((x) => x._id);
            let providerSubCategories = provider[0].subCategoryIds.map(
              (x) => x._id,
            );
            if (
              contentString.subCategoryIds &&
              contentString.subCategoryIds.length
            ) {
              const regexPatterns = this.generateRegexPatterns(
                contentString.subCategoryIds,
              );

              // Find documents where any word in name field matches any regex pattern
              const result = await this.TagsModel.find({
                _id: {
                  $in: providerSubCategories,
                },
                $or: regexPatterns.map((regex) => ({
                  name: { $regex: regex },
                })),
              });
              data.subCategoryIds = result.map((x) => x._id);
            }
            if (contentString.categories && contentString.categories.length) {
              const regexPatterns = this.generateRegexPatterns(
                contentString.categories,
              );
            }
            return data;
          }
        } catch (error) {
          console.error('Error processing provider data:', error);
          // throw new Error("Error processing provider data.");
        }
      } else {
        console.error('No JSON data found in the Markdown string.');
        throw new Error('No JSON data found.');
      }
    }
  }
  generateRegexPatterns(content) {
    const words = content.flatMap((item) => item.split(' '));
    return words.map((word) => new RegExp(`\\b${word}\\b`, 'i')); // "i" for case-insensitive matching
  }

  async updateProgramLocation(id: string, model) {
    const listResult = await this.programModel.findOne({ _id: id });
    if (!listResult) {
      throw new Error('Program Not Found');
    }
    if (listResult) {
      if (
        model.user !== 'string' &&
        model.user !== '' &&
        model.user !== undefined
      ) {
        listResult.user = model.user;
      }
      if (
        model.multiLocations !== 'string' &&
        model.multiLocations !== '' &&
        model.multiLocations !== undefined
      ) {
        listResult.multiLocations = model.multiLocations;
      }
      await listResult.save();
    }
    return listResult;
  }

  async searchByName(name, provider, page_size: number, page_number: number) {
    const matchCriteria: Record<string, any> = {};

    if (name) {
      matchCriteria.name = {
        $regex: new RegExp(
          `${name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
          'i',
        ),
      };
    }
    if (provider) {
      matchCriteria.user = new ObjectId(provider);
    }

    const skip = (page_number - 1) * page_size;
    const data = await this.programModel.aggregate([
      // { $match: { user: new ObjectId(id), isArchived: false } },
      { $match: matchCriteria },
      {
        $facet: {
          result: [
            { $sort: { name: 1, createdOn: 1 } },
            { $skip: skip },
            { $limit: page_size },
            {
              $lookup: {
                from: 'tags',
                let: { subCategoryIds: '$subCategoryIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $in: [
                              '$_id',
                              { $ifNull: ['$$subCategoryIds', []] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: 'subCategoryIds',
              },
            },
            {
              $lookup: {
                from: 'categories',
                let: { categoryId: '$categoryId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ['$_id', { $ifNull: ['$$categoryId', []] }] },
                        ],
                      },
                    },
                  },
                ],
                as: 'categoryId',
              },
            },
            {
              $lookup: {
                from: 'providerschedules',
                let: { schedule: '$schedule' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$schedule'],
                      },
                    },
                  },
                ],
                as: 'schedule',
              },
            },
            {
              $lookup: {
                from: 'phonenumbers',
                let: { phoneNumber: '$phoneNumber' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$phoneNumber'],
                      },
                    },
                  },
                ],
                as: 'phoneNumber',
              },
            },
            {
              $lookup: {
                from: 'providerinstructors',
                let: { instructor: '$instructor' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ['$_id', { $ifNull: ['$$instructor', []] }] },
                        ],
                      },
                    },
                  },
                ],
                as: 'instructor',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { multiLocations: '$multiLocations' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $in: [
                              '$_id',
                              { $ifNull: ['$$multiLocations', []] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: 'multiLocations',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { locationOfActivity: '$locationOfActivity' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$locationOfActivity'],
                      },
                    },
                  },
                ],
                as: 'locationOfActivity',
              },
            },
            {
              $lookup: {
                from: 'provideremails',
                let: { providerEmail: '$providerEmail' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$providerEmail'],
                      },
                    },
                  },
                ],
                as: 'providerEmail',
              },
            },
            {
              $lookup: {
                from: 'activities',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$programId', '$$programId'],
                      },
                    },
                  },
                ],
                as: 'activities',
              },
            },
            {
              $set: {
                activitiesCount: { $size: '$activities' },
              },
            },
            {
              $project: {
                activities: false,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'lastModifiedBy',
                foreignField: '_id',
                as: 'lastModifiedBy',
              },
            },
            {
              $unwind: {
                path: '$lastModifiedBy',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$user' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$userId'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      firstName: 1,
                    },
                  },
                ],
                as: 'programOwner',
              },
            },
            {
              $unwind: {
                path: '$programOwner',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $set: {
                programOwner: '$programOwner.firstName',
              },
            },
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
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async addChangeDetection() {
   try{
    const program = await this.programModel.find();
    if(program.length > 0){
      for (let prgm of program) {
        try{
          await this.webScrapingProgram(prgm._id);
        }catch(e){
          console.log(e);
        }
      }
    }if(!program.length){
      return 'No program found';
    }
   }catch(e){
     console.log(e);
   }
  }
}
