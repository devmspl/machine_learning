import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { userInterface, userLoginType } from 'src/@types/interfaces/user';
import { MailService } from '../services/mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model, ObjectId } from 'mongoose';
import { unlinkSync } from 'fs';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import shortid from 'shortid';
import S3 from 'aws-sdk/clients/s3';
const s3 = new S3({
  accessKeyId: 'YOUR KEY',
  secretAccessKey: 'YOUR KEY',
});
const ObjectId = mongoose.Types.ObjectId;

import {
  is_valid_object,
  is_valid_string,
  generate_otp,
  verifyHash,
  hash,
} from '@app/common';
import { Provider } from 'src/schemas/provider.schema';
import { create } from 'domain';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { Program } from 'src/schemas/program.schema';
import { Child } from 'src/schemas/child.schema';

@Injectable()
export class UserService {
  static filesFolder = 'excel_files';
  static ProviderfilesFolder = 'files';
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly userModel: Model<User>,
    @InjectModel(Program.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly programModel: Model<Program>,
    @InjectModel(Child.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly childModel: Model<Child>,
    @InjectModel(Provider.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly ProviderModel: Model<Provider>,
   
    private readonly mailService: MailService,
    private readonly jwt: JwtService,
  ) {}

  async createUser(model: userInterface) {
    const {
      firstName,
      lastName,
      userName,
      sex,
      age,
      dob,
      email,
      password,
      type,
      platForm,
      platFormId,
      phoneNumber,
      addressLine1,
      addressLine2,
      street,
      state,
      city,
      country,
      source,
      zipCode,
      location,
      stripeId,
      lastLoggedIn,
      inviteBy,
      isActivated,
      lastModifiedBy,
      isDeleted,
      deletedBy,
      deleteReason,
      deleteReasonDetail,
      deletedDate,
      createdBy,
      createdByUser,
      note,
      averageFinalRating,
      totalReviews,
      notificationsOnOff,
      isAmbassador,
      isUserVerified,
      isAmbassadorOn,
      role,
      roles,
      isPhoneVerified,
      isFav,
      browserName,
      ipAddress,
      osName,
      loginCount,
      lastLoginTime,
      betaUser,
      isPasswordSet,
      isEmailVerified,
      isPhoneNumberVerified,
      createdOn,
      updatedOn,
      last_reviewed,
      next_reviewed,
      providerCopy,
      reference,
      referenceUser,
      provider_reference,
      loginDetails,
      isInvitedBy,
      testMode,
      memeberShipUpdate,
      defaultSaveList,
      cityId,
      addFrom,
      moveToWondrfly,
      status,
      userUpdateCount,
      address,
      userUpdateFirstTime,
      website,
      is_deleted,
      secondaryPhonenumber,
    } = model;
    console.log('model', model);
    const data = await new this.userModel({
      firstName,
      lastName,
      userName,
      sex,
      age,
      dob,
      email,
      password,
      type,
      platForm,
      platFormId,
      phoneNumber,
      addressLine1,
      addressLine2,
      street,
      state,
      city,
      country,
      source,
      zipCode,
      // location,
      stripeId,
      lastLoggedIn,
      inviteBy,
      isActivated,
      lastModifiedBy,
      isDeleted,
      deletedBy,
      deleteReason,
      deleteReasonDetail,
      deletedDate,
      createdBy,
      createdByUser,
      note,
      averageFinalRating,
      totalReviews,
      notificationsOnOff,
      isAmbassador,
      isUserVerified,
      isAmbassadorOn,
      role,
      roles,
      isPhoneVerified,
      isFav,
      browserName,
      ipAddress,
      osName,
      loginCount,
      lastLoginTime,
      betaUser,
      isPasswordSet,
      isEmailVerified,
      isPhoneNumberVerified,
      createdOn,
      updatedOn,
      last_reviewed,
      next_reviewed,
      providerCopy,
      reference,
      referenceUser,
      provider_reference,
      loginDetails,
      isInvitedBy,
      testMode,
      memeberShipUpdate,
      defaultSaveList,
      cityId,
      addFrom,
      moveToWondrfly,
      status,
      userUpdateCount,
      address,
      userUpdateFirstTime,
      website,
      is_deleted,
      secondaryPhonenumber,
    }).save();

    return data;
  }

  async login(model: userLoginType) {
    const { email, password } = model;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatched = verifyHash(user.password, password);

    if (!isMatched) {
      throw new HttpException('Password not matched', HttpStatus.UNAUTHORIZED);
    }

    // Use the same structure as Node.js  new code
    const tokenPayload = {
      id: user._id, // Change _id to id
      password: user.password, // Include password to match Node.js
    };

    const token = this.jwt.sign(tokenPayload, {
      expiresIn: '7d',
    });  // new code

    //   old code
    // const token = this.jwt.sign(
    //   { _id: user._id },
    //   {
    //     expiresIn: '7d',
    //   },
    // );

    //  old code

    user.token = token;

    await user.save();

    return user;
  }

  async getById(id: string) {
    this.logger.log('[service:users:getById]');

    const data = await this.userModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
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
      {
        $lookup: {
          from: 'provideremails',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$user', '$$userId'],
                },
              },
            },
          ],
          as: 'emails',
        },
      },
      {
        $lookup: {
          from: 'providerlocations',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$user', '$$userId'],
                },
              },
            },
          ],
          as: 'providerlocation',
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          userName: 1,
          sex: 1,
          location: 1,
          age: 1,
          role: 1,
          roles: 1,
          dob: 1,
          email: 1,
          type: 1,
          facebookId: 1,
          googleId: 1,
          avatarImages: 1,
          phoneNumber: 1,
          secondaryPhonenumber: 1,
          addressLine1: 1,
          addressLine2: 1,
          street: 1,
          state: 1,
          city: 1,
          country: 1,
          source: 1,
          isClaimed: 1,
          zipCode: 1,
          stripeKey: 1,
          lastLoggedIn: 1,
          personalNote: 1,
          loginLimit: 1,
          securityQuestion: 1,
          answer: 1,
          inviteBy: 1,
          ssn: 1,
          isActivated: 1,
          lastModifiedBy: 1,
          isDeleted: 1,
          deletedBy: 1,
          deleteReason: 1,
          deleteReasonDetail: 1,
          deletedDate: 1,
          token: 1,
          createdBy: 1,
          createdByUser: 1,
          note: 1,
          averageFinalRating: 1,
          totalReviews: 1,
          notificationsOnOff: 1,
          profileCompleteEmail: 1,
          profileCompleteNotification: 1,
          isAmbassador: 1,
          isUserVerified: 1,
          isAmbassadorOn: 1,
          weeklyDate: 1,
          resetPasswordToken: 1,
          resetPasswordExpires: 1,
          isPhoneVerified: 1,
          totalPoints: 1,
          isFav: 1,
          parentInvitationLimit: 1,
          guardianInvitationLimit: 1,
          browserName: 1,
          ipAddress: 1,
          osName: 1,
          loginCount: 1,
          lastLoginTime: 1,
          deviceToken: 1,
          betaUser: 1,
          isFreeTrial: 1,
          isOnBoardingDone: 1,
          isPasswordSet: 1,
          isEmailVerified: 1,
          isPhoneNumberVerified: 1,
          createdOn: 1,
          usercreatedOn: 1,
          updatedOn: 1,
          last_reviewed: 1,
          next_reviewed: 1,
          providerCopy: 1,
          reference: 1,
          referenceUser: 1,
          provider_reference: 1,
          onBoardingCount: 1,
          userUpdateCount: 1,
          userUpdateFirstTime: 1,
          status: 1,
          cityId: 1,
          emails: 1,
          providerlocation: 1,
          website: '$provider.website',
          websiteUrl: '$provider.websiteUrl',
          googleReviewsURL: '$provider.googleReviewsURL',
          numberOfGoogleReviews: '$provider.numberOfGoogleReviews',
          averageGoogleRating: '$provider.averageGoogleRating',
          bottomGoogleReviews: '$provider.bottomGoogleReviews',
          mostRecentGoogleReviews: '$provider.mostRecentGoogleReviews',
          facebookURL: '$provider.facebookURL',
          facebookNumberOfFollowers: '$provider.facebookNumberOfFollowers',
          facebookNumberOfLikes: '$provider.facebookNumberOfLikes',
          yelpProfileURL: '$provider.yelpProfileURL',
          numberOfYelpRatings: '$provider.numberOfYelpRatings',
          averageYelpRating: '$provider.averageYelpRating',
          yelpTopReviews: '$provider.yelpTopReviews',
          yelpMostRecentReviews: '$provider.yelpMostRecentReviews',
          instagramProfileLink: '$provider.instagramProfileLink',
          numberOfInstagramFollowers: '$provider.numberOfInstagramFollowers',
          linkedin: '$provider.linkedin',
          imageURL: '$provider.imageURL',
          hours: '$provider.hours',
          fullAddress: '$provider.fullAddress',
          facebook: '$provider.facebook',
          description: '$provider.description',
          bio: '$provider.bio',
          about: '$provider.about',
          county: '$provider.county',
          addedBy: '$provider.addedBy',
          indoorOrOutdoor: '$provider.indoorOrOutdoor',
          inpersonOrVirtual: '$provider.inpersonOrVirtual',
          privateVsGroup: '$provider.privateVsGroup',
          activityTypes: '$provider.activityTypes',
          earlyDrop_off_LatePick_up: '$provider.earlyDrop_off_LatePick_up',
          provideTransportServicesToAndFromTheVenue:
            '$provider.provideTransportServicesToAndFromTheVenue',
          providePartyServices: '$provider.providePartyServices',
          provideBirthdaySpecificServices:
            '$provider.provideBirthdaySpecificServices',
          maximumTravelDistance: '$provider.maximumTravelDistance',
          instructor: '$provider.instructor',
          sourceUrl: '$provider.sourceUrl',
          provideInHomeInstruction: '$provider.provideInHomeInstruction',
          providePrivateInstruction: '$provider.providePrivateInstruction',
          isChildCare: '$provider.isChildCare',
          teamSize: '$provider.teamSize',
          gmb: '$provider.gmb',
          skillGroups: '$provider.skillGroups',
          yelp: '$provider.yelp',
          primaryAddress: '$provider.primaryAddress',
          displayPhoneNumbers: '$provider.displayPhoneNumbers',
          address: '$provider.address',
          // emails: "$provider.emails",
          businessName: '$provider.businessName',
          user: '$provider.user',
          subCategoryIds: '$provider.subCategoryIds',
          categories: '$provider.categories',
          cancellation_and_refund: '$provider.cancellation_and_refund',
          adminNotes: '$provider.adminNotes',
          proof_reader_notes: '$provider.proof_reader_notes',
          rating: '$provider.rating',
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
          let: { categoryId: '$categories' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', { $ifNull: ['$$categoryId', []] }] }],
                },
              },
            },
          ],
          as: 'categories',
        },
      },
    ]);

    // const user = await this.userModel.findById({ _id: id });

    // if (!user) {
    //   throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    // }
    return data;
  }

  async remove(id: string) {
    this.logger.log('[service:users:remove]');

    const user = await this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          is_deleted: true,
        },
      },
    );

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    return 'user removed';
  }

  // async removeProvider(id: string) {

  //   this.logger.log('[service:users:removeProvider]');
  
  //   const user = await this.userModel.findById(id)
  //   if(user){
  //     await this.ProviderModel.findOneAndDelete({user: new Object(id)})
  //     await this.userModel.findOneAndDelete({_id: id, roles: 'purpleprovider' });
  //     await this.providerlocation.deleteMany({user: new ObjectId(id)})
  //     await this.ProvideremailModel.deleteMany({user: new ObjectId(id)})
  //     await this.phonenumberModel.deleteMany({user: new ObjectId(id)})
  //   }

  //   if (!user) {
  //     throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
  //   }

  //   return 'user removed';
  // }

  async removeProvider(id: string) {
    this.logger.log(`[service:users:removeProvider] Removing provider with ID: ${id}`);

    if (!ObjectId.isValid(id)) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findById(id);
    
    if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    try {
        const providerDelete = await this.ProviderModel.findOneAndDelete({ user: new ObjectId(id) });
        this.logger.log(`[service:users:removeProvider] Provider deleted: ${providerDelete ? 'Success' : 'Not Found'}`);

        const userDelete = await this.userModel.findOneAndDelete({ _id: new ObjectId(id), roles: 'purpleprovider' });
        this.logger.log(`[service:users:removeProvider] User deleted: ${userDelete ? 'Success' : 'Not Found'}`);

    } catch (error) {
        this.logger.error(`[service:users:removeProvider] Error during deletion: ${error.message}`);
        throw new HttpException('Error deleting provider data', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.log(`[service:users:removeProvider] Successfully removed provider with ID: ${id}`);

    return { message: 'User and related data removed successfully', userId: id };
}

  async uploadProfileImage(files, id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    // Delete existing avatar image from S3 if exists
    if (user.avatarImages) {
      try {
        await s3
          .deleteObject({
            Bucket: 'wondrfly',
            Key: user.avatarImages,
          })
          .promise();
      } catch (err) {
        console.error('Error deleting old image from S3:', err);
      }
    }

    const image = files[0];
    const fileStream = fs.createReadStream(image.path);

    // Generate a random filename
    const randomFilename = this.generateRandomName(image.filename);

    // Upload new image to S3
    const params = {
      Bucket: 'wondrfly',
      Key: randomFilename, // Construct the key properly
      Body: fileStream,
      ContentType: image.mimetype,
      path: `purpleinvestor/user/images/${randomFilename}`,
    };
    try {
      const uploadResponse = await s3.upload(params).promise();
      // Update user's avatarImages field with the S3 filename
      user.avatarImages = uploadResponse.Key; // Update with the S3 filename
      await user.save();
      return 'Image uploaded successfully';
    } catch (err) {
      console.error('Error uploading image to S3:', err);
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateRandomName(filename = '') {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().getTime();
    return `${randomString}-${timestamp}-${filename}`;
  }

  async getAllUser(page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    const data = await this.userModel.aggregate([
      { $match: { is_deleted: false, roles: { $ne: 'purpleprovider' } } },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { created_at: -1 } },
            {
              $project: {
                _id: 1,
                fullname: 1,
                firstName: 1,
                lastName: 1,
                userName: 1,
                sex: 1,
                location: 1,
                age: 1,
                role: 1,
                roles: 1,
                dob: 1,
                email: 1,
                status: 1,
                type: 1,
                facebookId: 1,
                googleId: 1,
                avatarImages: 1,
                phoneNumber: 1,
                secondaryPhonenumber: 1,
                addressLine1: 1,
                addressLine2: 1,
                street: 1,
                state: 1,
                city: 1,
                country: 1,
                source: 1,
                isClaimed: 1,
                zipCode: 1,
                stripeKey: 1,
                lastLoggedIn: 1,
                personalNote: 1,
                loginLimit: 1,
                securityQuestion: 1,
                answer: 1,
                inviteBy: 1,
                ssn: 1,
                isActivated: 1,
                lastModifiedBy: 1,
                isDeleted: 1,
                deletedBy: 1,
                deleteReason: 1,
                deleteReasonDetail: 1,
                deletedDate: 1,
                token: 1,
                createdBy: 1,
                createdByUser: 1,
                note: 1,
                averageFinalRating: 1,
                totalReviews: 1,
                notificationsOnOff: 1,
                profileCompleteEmail: 1,
                profileCompleteNotification: 1,
                isAmbassador: 1,
                isUserVerified: 1,
                isAmbassadorOn: 1,
                weeklyDate: 1,
                resetPasswordToken: 1,
                resetPasswordExpires: 1,
                isPhoneVerified: 1,
                totalPoints: 1,
                isFav: 1,
                parentInvitationLimit: 1,
                guardianInvitationLimit: 1,
                browserName: 1,
                ipAddress: 1,
                osName: 1,
                loginCount: 1,
                lastLoginTime: 1,
                deviceToken: 1,
                betaUser: 1,
                isFreeTrial: 1,
                isOnBoardingDone: 1,
                isPasswordSet: 1,
                isEmailVerified: 1,
                isPhoneNumberVerified: 1,
                createdOn: 1,
                usercreatedOn: 1,
                updatedOn: 1,
                last_reviewed: 1,
                next_reviewed: 1,
                providerCopy: 1,
                reference: 1,
                referenceUser: 1,
                provider_reference: 1,
                onBoardingCount: 1,
                userUpdateCount: 1,
                userUpdateFirstTime: 1,
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
      TotalCount: totalCount,
      data: items,
    };
    // }
    //   {
    //     $skip: skip,
    //   },
    //   {
    //     $limit: page_size,
    //   },````````````                                                                                                                                                               
    // ]);
    // const data1 = await this.userModel.find({ is_deleted: false }).count();
    // return { TotalCount: data1, data: data };
  }
  async getProviders(
    id: string,
    sort: string,
    status: string,
    name: string,
    category: string,
    subCategory: string,
    changeDetection: string,
    page_size: number,
    page_number: number,
    is_child_care?: string,
  ) {
    let matchQueries = [];
    const skip = (page_number - 1) * page_size;
    let sorting = {};
    let SearchQuery = {};
    if (name) {
      matchQueries = [
        {
          $match: {
            $or: [
              { firstName: { $regex: '.*' + name + '.*', $options: 'i' } },
              { addressLine1: { $regex: '.*' + name + '.*', $options: 'i' } },
              { phoneNumber: { $regex: '.*' + name + '.*', $options: 'i' } },
              { email: { $regex: '.*' + name + '.*', $options: 'i' } },
            ],
          },
        },
      ];
    }
    if (sort == 'byName') {
      sorting = { firstName: 1 };
    } else if (sort == 'byDate') {
      sorting = { createdOn: -1 };
    } else if (sort == 'byDumpStage') {
      sorting = { stage: -1 };
    } else {
      sorting = { firstName: 1, createdOn: 1 };
    }
    const match = {
      cityId: new ObjectId(id),
      roles: 'purpleprovider',
      status: status,
      is_deleted: false
    };
    const match1 = {};
    if (changeDetection) {
      if (changeDetection == 'true') {
        match['changeDetection'] = true;
      } else if (changeDetection == 'false') {
        // ]);
        match['changeDetection'] = false;
      }
    }
    // if (is_child_care) {
    //   if (is_child_care == 'true') {
    //     SearchQuery['provider.is_child_care'] = true;
    //   } else if (is_child_care == 'false') {
    //     SearchQuery['provider.is_child_care'] = false;
    //   }
    // }

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
    if (category || subCategory) {
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
      if (category) {
        match1['provider.categories'] = category;
      }
      if (subCategory) {
        match1['provider.subCategoryIds'] = subCategory;
      }
    }
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
            { $sort: sorting },
            { $limit: page_size + skip },
            { $skip: skip },
            ...providerLookupAfter,
            
            {
              $lookup: {
                from: 'programs',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$user', '$$programId'],
                      },
                    },
                  },
                ],
                as: 'programs',
              },
            },
            {
              $addFields: {
                totalPrograms: { $size: '$programs' },
              },
            },
            {
              $lookup: {
                from: 'programs',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$user', '$$programId'] },
                          { $eq: ['$isPublished', true] },
                        ],
                      },
                    },
                  },
                ],
                as: 'programs',
              },
            },
            {
              $addFields: {
                publishedPrograms: { $size: '$programs' },
              },
            },

            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                userName: 1,
                sex: 1,
                location: 1,
                age: 1,
                role: 1,
                roles: 1,
                dob: 1,
                email: 1,
                type: 1,
                facebookId: 1,
                googleId: 1,
                avatarImages: 1,
                phoneNumber: 1,
                secondaryPhonenumber: 1,
                addressLine1: 1,
                addressLine2: 1,
                street: 1,
                state: 1,
                stage: 1,
                city: 1,
                country: 1,
                source: 1,
                isClaimed: 1,
                zipCode: 1,
                stripeKey: 1,
                lastLoggedIn: 1,
                personalNote: 1,
                loginLimit: 1,
                securityQuestion: 1,
                answer: 1,
                inviteBy: 1,
                ssn: 1,
                isActivated: 1,
                addFrom: 1,
                isDeleted: 1,
                deletedBy: 1,
                deleteReason: 1,
                deleteReasonDetail: 1,
                deletedDate: 1,
                token: 1,
                createdBy: 1,
                createdByUser: 1,
                note: 1,
                averageFinalRating: 1,
                totalReviews: 1,
                notificationsOnOff: 1,
                profileCompleteEmail: 1,
                profileCompleteNotification: 1,
                isAmbassador: 1,
                isUserVerified: 1,
                isAmbassadorOn: 1,
                weeklyDate: 1,
                resetPasswordToken: 1,
                resetPasswordExpires: 1,
                isPhoneVerified: 1,
                totalPoints: 1,
                isFav: 1,
                parentInvitationLimit: 1,
                guardianInvitationLimit: 1,
                browserName: 1,
                ipAddress: 1,
                osName: 1,
                loginCount: 1,
                lastLoginTime: 1,
                deviceToken: 1,
                betaUser: 1,
                isFreeTrial: 1,
                isOnBoardingDone: 1,
                isPasswordSet: 1,
                isEmailVerified: 1,
                isPhoneNumberVerified: 1,
                createdOn: 1,
                usercreatedOn: 1,
                updatedOn: 1,
                last_reviewed: 1,
                next_reviewed: 1,
                providerCopy: 1,
                reference: 1,
                referenceUser: 1,
                provider_reference: 1,
                onBoardingCount: 1,
                userUpdateCount: 1,
                userUpdateFirstTime: 1,
                status: 1,
                totalPrograms: 1,
                publishedPrograms: 1,
                changeDetection: 1,
                moveInProduction: 1,
                website: '$provider.website',
                googleReviewsURL: '$provider.googleReviewsURL',
                numberOfGoogleReviews: '$provider.numberOfGoogleReviews',
                averageGoogleRating: '$provider.averageGoogleRating',
                bottomGoogleReviews: '$provider.bottomGoogleReviews',
                mostRecentGoogleReviews: '$provider.mostRecentGoogleReviews',
                facebookURL: '$provider.facebookURL',
                facebookNumberOfFollowers:
                  '$provider.facebookNumberOfFollowers',
                facebookNumberOfLikes: '$provider.facebookNumberOfLikes',
                yelpProfileURL: '$provider.yelpProfileURL',
                numberOfYelpRatings: '$provider.numberOfYelpRatings',
                averageYelpRating: '$provider.averageYelpRating',
                yelpTopReviews: '$provider.yelpTopReviews',
                yelpMostRecentReviews: '$provider.yelpMostRecentReviews',
                instagramProfileLink: '$provider.instagramProfileLink',
                numberOfInstagramFollowers:
                  '$provider.numberOfInstagramFollowers',
                linkedin: '$provider.linkedin',
                imageURL: '$provider.imageURL',
                hours: '$provider.hours',
                fullAddress: '$provider.fullAddress',
                facebook: '$provider.facebook',
                description: '$provider.description',
                bio: '$provider.bio',
                about: '$provider.about',
                county: '$provider.county',
                addedBy: '$provider.addedBy',
                indoorOrOutdoor: '$provider.indoorOrOutdoor',
                inpersonOrVirtual: '$provider.inpersonOrVirtual',
                privateVsGroup: '$provider.privateVsGroup',
                activityTypes: '$provider.activityTypes',
                earlyDrop_off_LatePick_up:
                  '$provider.earlyDrop_off_LatePick_up',
                provideTransportServicesToAndFromTheVenue:
                  '$provider.provideTransportServicesToAndFromTheVenue',
                providePartyServices: '$provider.providePartyServices',
                provideBirthdaySpecificServices:
                  '$provider.provideBirthdaySpecificServices',
                maximumTravelDistance: '$provider.maximumTravelDistance',
                instructor: '$provider.instructor',
                provideInHomeInstruction: '$provider.provideInHomeInstruction',
                providePrivateInstruction:
                  '$provider.providePrivateInstruction',
                isChildCare: '$provider.isChildCare',
                teamSize: '$provider.teamSize',
                gmb: '$provider.gmb',
                skillGroups: '$provider.skillGroups',
                yelp: '$provider.yelp',
                primaryAddress: '$provider.primaryAddress',
                displayPhoneNumbers: '$provider.displayPhoneNumbers',
                address: '$provider.address',
                emails: '$provider.emails',
                businessName: '$provider.businessName',
                user: '$provider.user',
                subCategoryIds: '$provider.subCategoryIds',
                categories: '$provider.categories',
                primaryPhoneNumbers: '$provider.primaryPhoneNumbers',
                lastModifiedBy: '$provider.lastModifiedBy',
                activeStatus: '$provider.activeStatus',
                reviews: '$provider.reviews',
                rating: '$provider.rating',
                timing: "$provider.timing",
                // next_reviewed: "$provider.next_reviewed",
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
                let: { categoryId: '$categories' },
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
                as: 'categories',
              },
            },
            // {
            //   $lookup: {
            //     from: 'phonenumbers',
            //     let: { primaryPhoneNumbersID: '$primaryPhoneNumbers' },
            //     pipeline: [
            //       {
            //         $match: {
            //           $expr: {
            //             $and: [{ $in: ['$_id', { $ifNull: ['$$primaryPhoneNumbersID', []] }] }],
            //           },
            //         },
            //       },
            //     ],
            //     as: 'primaryPhoneNumbers',
            //   },
            // },
            {
              $lookup: {
                from: 'phonenumbers',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$user', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'primaryPhoneNumbers',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$user', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'providerlocations',
              },
            },
            {
              $unwind: {
                path: '$providerlocations',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $set: {
                location: '$providerlocations.name',
                addressLine1: '$providerlocations.name',
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

    console.log('data: ', data);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      TotalCount: totalCount,
      data: items,
    };
  }

  async getProvidersChildCareEvent(
    id: string,
    sort: string,
    status: string,
    changeDetection: string,
    page_size: number,
    page_number: number,
    childCare?: string,
    event?: string,
  ) {
    const skip = (page_number - 1) * page_size;
    let sorting = {};
    let SearchQuery = {};
    if (sort == 'byName') {
      sorting = { firstName: 1, createdOn: 1 };
    } else if (sort == 'byDate') {
      sorting = { createdOn: -1 };
    } else {
      sorting = { firstName: 1 };
    }
    const match = {
      cityId: new ObjectId(id),
      roles: 'purpleprovider',
      status: status,
    };
    if (changeDetection) {
      if (changeDetection == 'true') {
        match['changeDetection'] = true;
      } else if (changeDetection == 'false') {
        match['changeDetection'] = false;
      }
    }

    if (childCare) {
      if (childCare == 'true') {
        SearchQuery['provider.is_child_care'] = true;
      } else if (childCare == 'false') {
        SearchQuery['provider.is_child_care'] = false;
      }
    }

    if (event) {
      if (event == 'true') {
        SearchQuery['provider.is_event'] = true;
      } else if (event == 'false') {
        SearchQuery['provider.is_event'] = false;
      }
    }

    const data = await this.userModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'providers',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$user', '$$userId'] }],
                },
              },
            },
          ],
          as: 'provider',
        },
      },

      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: SearchQuery },
      {
        $facet: {
          result: [
            { $sort: sorting },
            { $limit: page_size + skip },
            { $skip: skip },
            {
              $lookup: {
                from: 'programs',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$user', '$$programId'],
                      },
                    },
                  },
                ],
                as: 'programs',
              },
            },
            {
              $addFields: {
                totalPrograms: { $size: '$programs' },
              },
            },
            {
              $lookup: {
                from: 'programs',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$user', '$$programId'] },
                          { $eq: ['$isPublished', true] },
                        ],
                      },
                    },
                  },
                ],
                as: 'programs',
              },
            },
            {
              $addFields: {
                publishedPrograms: { $size: '$programs' },
              },
            },

            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                userName: 1,
                sex: 1,
                location: 1,
                age: 1,
                role: 1,
                roles: 1,
                dob: 1,
                email: 1,
                type: 1,
                facebookId: 1,
                googleId: 1,
                avatarImages: 1,
                phoneNumber: 1,
                secondaryPhonenumber: 1,
                addressLine1: 1,
                addressLine2: 1,
                street: 1,
                state: 1,
                stage: 1,
                city: 1,
                country: 1,
                source: 1,
                isClaimed: 1,
                zipCode: 1,
                stripeKey: 1,
                lastLoggedIn: 1,
                personalNote: 1,
                loginLimit: 1,
                securityQuestion: 1,
                answer: 1,
                inviteBy: 1,
                ssn: 1,
                isActivated: 1,
                addFrom: 1,
                isDeleted: 1,
                deletedBy: 1,
                deleteReason: 1,
                deleteReasonDetail: 1,
                deletedDate: 1,
                token: 1,
                createdBy: 1,
                createdByUser: 1,
                note: 1,
                averageFinalRating: 1,
                totalReviews: 1,
                notificationsOnOff: 1,
                profileCompleteEmail: 1,
                profileCompleteNotification: 1,
                isAmbassador: 1,
                isUserVerified: 1,
                isAmbassadorOn: 1,
                weeklyDate: 1,
                resetPasswordToken: 1,
                resetPasswordExpires: 1,
                isPhoneVerified: 1,
                totalPoints: 1,
                isFav: 1,
                parentInvitationLimit: 1,
                guardianInvitationLimit: 1,
                browserName: 1,
                ipAddress: 1,
                osName: 1,
                loginCount: 1,
                lastLoginTime: 1,
                deviceToken: 1,
                betaUser: 1,
                isFreeTrial: 1,
                isOnBoardingDone: 1,
                isPasswordSet: 1,
                isEmailVerified: 1,
                isPhoneNumberVerified: 1,
                createdOn: 1,
                usercreatedOn: 1,
                updatedOn: 1,
                last_reviewed: 1,
                next_reviewed: 1,
                providerCopy: 1,
                reference: 1,
                referenceUser: 1,
                provider_reference: 1,
                onBoardingCount: 1,
                userUpdateCount: 1,
                userUpdateFirstTime: 1,
                status: 1,
                totalPrograms: 1,
                publishedPrograms: 1,
                changeDetection: 1,
                website: '$provider.website',
                googleReviewsURL: '$provider.googleReviewsURL',
                numberOfGoogleReviews: '$provider.numberOfGoogleReviews',
                averageGoogleRating: '$provider.averageGoogleRating',
                bottomGoogleReviews: '$provider.bottomGoogleReviews',
                mostRecentGoogleReviews: '$provider.mostRecentGoogleReviews',
                facebookURL: '$provider.facebookURL',
                facebookNumberOfFollowers:
                  '$provider.facebookNumberOfFollowers',
                facebookNumberOfLikes: '$provider.facebookNumberOfLikes',
                yelpProfileURL: '$provider.yelpProfileURL',
                numberOfYelpRatings: '$provider.numberOfYelpRatings',
                averageYelpRating: '$provider.averageYelpRating',
                yelpTopReviews: '$provider.yelpTopReviews',
                yelpMostRecentReviews: '$provider.yelpMostRecentReviews',
                instagramProfileLink: '$provider.instagramProfileLink',
                numberOfInstagramFollowers:
                  '$provider.numberOfInstagramFollowers',
                linkedin: '$provider.linkedin',
                imageURL: '$provider.imageURL',
                hours: '$provider.hours',
                fullAddress: '$provider.fullAddress',
                facebook: '$provider.facebook',
                description: '$provider.description',
                bio: '$provider.bio',
                about: '$provider.about',
                county: '$provider.county',
                addedBy: '$provider.addedBy',
                indoorOrOutdoor: '$provider.indoorOrOutdoor',
                inpersonOrVirtual: '$provider.inpersonOrVirtual',
                privateVsGroup: '$provider.privateVsGroup',
                activityTypes: '$provider.activityTypes',
                earlyDrop_off_LatePick_up:
                  '$provider.earlyDrop_off_LatePick_up',
                provideTransportServicesToAndFromTheVenue:
                  '$provider.provideTransportServicesToAndFromTheVenue',
                providePartyServices: '$provider.providePartyServices',
                provideBirthdaySpecificServices:
                  '$provider.provideBirthdaySpecificServices',
                maximumTravelDistance: '$provider.maximumTravelDistance',
                instructor: '$provider.instructor',
                provideInHomeInstruction: '$provider.provideInHomeInstruction',
                providePrivateInstruction:
                  '$provider.providePrivateInstruction',
                isChildCare: '$provider.isChildCare',
                teamSize: '$provider.teamSize',
                gmb: '$provider.gmb',
                skillGroups: '$provider.skillGroups',
                yelp: '$provider.yelp',
                primaryAddress: '$provider.primaryAddress',
                displayPhoneNumbers: '$provider.displayPhoneNumbers',
                address: '$provider.address',
                emails: '$provider.emails',
                businessName: '$provider.businessName',
                user: '$provider.user',
                subCategoryIds: '$provider.subCategoryIds',
                categories: '$provider.categories',
                primaryPhoneNumbers: '$provider.primaryPhoneNumbers',
                lastModifiedBy: '$provider.lastModifiedBy',
                activeStatus: '$provider.activeStatus',
                reviews: '$provider.reviews',
                rating: '$provider.rating',
                is_child_care: '$provider.is_child_care',
                is_event: '$provider.is_event',
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
                let: { categoryId: '$categories' },
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
                as: 'categories',
              },
            },
            {
              $lookup: {
                from: 'phonenumbers',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$user', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'primaryPhoneNumbers',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$user', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'providerlocations',
              },
            },
            {
              $unwind: {
                path: '$providerlocations',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $set: {
                location: '$providerlocations.name',
                addressLine1: '$providerlocations.name',
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
      TotalCount: totalCount,
      data: items,
    };
  }
  async sentSignupOtp(model: userInterface) {
    // const otp = '0000' ?? generate_otp();
    let otp = '0000';
    otp = otp === '0000' ? generate_otp() : otp;
    model.password = hash(model.password);
    const generate_otp_token = this.jwt.sign(
      { ...model, otp },
      { expiresIn: '3m' },
    );
    return generate_otp_token;
  }

  async verifySignupOtp({ token, otp }: { token: string; otp: string }) {
    const decode = this.jwt.verify(token);

    if (decode.name === 'TokenExpiredError') {
      throw new HttpException('otp expired', HttpStatus.BAD_REQUEST);
    }

    if (
      decode.name === 'JsonWebTokenError' ||
      decode.name === 'NotBeforeError'
    ) {
      throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
    }

    if (decode.otp !== otp) {
      throw new HttpException('invalid otp', HttpStatus.BAD_REQUEST);
    }

    const { otp: OTP, ...body } = decode;

    const user = await this.createUser(body);

    return user;
  }

  async update(id: string, model: Partial<userInterface>) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    // if (user.userUpdateFirstTime === false) {
    if (
      model.firstName !== 'string' &&
      model.firstName !== '' &&
      model.firstName !== undefined
    ) {
      user.firstName = model.firstName.trim();
    }
    if (
      model.lastName !== 'string' &&
      model.lastName !== '' &&
      model.lastName !== undefined
    ) {
      user.lastName = model.lastName.trim();
    }
    if (
      model.userName !== 'string' &&
      model.userName !== '' &&
      model.userName !== undefined
    ) {
      user.userName = model.userName.trim();
    }
    if (model.sex === 'male' || model.sex === 'female') {
      user.sex = model.sex.trim();
    }
    if (model.age !== undefined) {
      user.age = model.age;
    }
    if (model.dob !== 'string' && model.dob !== '' && model.dob !== undefined) {
      user.dob = model.dob.trim();
    }
    if (model.dob !== 'string' && model.dob !== '' && model.dob !== undefined) {
      user.dob = model.dob.trim();
    }
    if (
      model.email !== 'string' &&
      model.email !== '' &&
      model.email !== undefined
    ) {
      user.email = model.email.trim();
    }
    if (
      model.type !== 'string' &&
      model.type !== '' &&
      model.type !== undefined
    ) {
      user.type = model.type.trim();
    }
    if (
      model.platForm !== 'string' &&
      model.platForm !== '' &&
      model.platForm !== undefined
    ) {
      user.platForm = model.platForm.trim();
    }
    if (
      model.platFormId !== 'string' &&
      model.platFormId !== '' &&
      model.platFormId !== undefined
    ) {
      user.platFormId = model.platFormId.trim();
    }
    if (
      model.phoneNumber !== 'string' &&
      model.phoneNumber !== '' &&
      model.phoneNumber !== undefined
    ) {
      user.phoneNumber = model.phoneNumber.trim();
    }
    if (
      model.addressLine1 !== 'string' &&
      model.addressLine1 !== '' &&
      model.addressLine1 !== undefined
    ) {
      user.addressLine1 = model.addressLine1;
    }
    if (
      model.addressLine2 !== 'string' &&
      model.addressLine2 !== '' &&
      model.addressLine2 !== undefined
    ) {
      user.addressLine2 = model.addressLine2;
    }
    if (
      model.street !== 'string' &&
      model.street !== '' &&
      model.street !== undefined
    ) {
      user.street = model.street;
    }
    if (
      model.state !== 'string' &&
      model.state !== '' &&
      model.state !== undefined
    ) {
      user.state = model.state;
    }
    if (
      model.city !== 'string' &&
      model.city !== '' &&
      model.city !== undefined
    ) {
      user.city = model.city;
    }
    if (
      model.country !== 'string' &&
      model.country !== '' &&
      model.country !== undefined
    ) {
      user.country = model.country;
    }
    if (
      model.source !== 'string' &&
      model.source !== '' &&
      model.source !== undefined
    ) {
      user.source = model.source;
    }
    if (
      model.zipCode !== 'string' &&
      model.zipCode !== '' &&
      model.zipCode !== undefined
    ) {
      user.zipCode = model.zipCode;
    }
    // if (model.location !== undefined)  {
    //   user.location = model.location;
    // }
    if (
      model.stripeId !== 'string' &&
      model.stripeId !== '' &&
      model.stripeId !== undefined
    ) {
      user.stripeId = model.stripeId;
    }
    if (model.lastLoggedIn !== undefined) {
      user.lastLoggedIn = model.lastLoggedIn;
    }
    if (
      model.inviteBy !== 'string' &&
      model.inviteBy !== '' &&
      model.inviteBy !== undefined
    ) {
      user.inviteBy = model.inviteBy;
    }
    if (model.isActivated !== undefined) {
      user.isActivated = model.isActivated;
    }
    if (model.isDeleted !== undefined) {
      user.isDeleted = model.isDeleted;
    }
    if (
      model.deletedBy !== 'string' &&
      model.deletedBy !== '' &&
      model.deletedBy !== undefined
    ) {
      user.deletedBy = model.deletedBy;
    }
    if (
      model.deleteReason !== 'string' &&
      model.deleteReason !== '' &&
      model.deleteReason !== undefined
    ) {
      user.deleteReason = model.deleteReason;
    }
    if (
      model.deleteReasonDetail !== 'string' &&
      model.deleteReasonDetail !== '' &&
      model.deleteReasonDetail !== undefined
    ) {
      user.deleteReasonDetail = model.deleteReasonDetail;
    }
    if (model.deletedDate !== undefined) {
      user.deletedDate = model.deletedDate;
    }
    if (
      model.createdBy !== 'string' &&
      model.createdBy !== '' &&
      model.createdBy !== undefined
    ) {
      user.createdBy = model.createdBy;
    }
    if (
      model.createdByUser !== 'string' &&
      model.createdByUser !== '' &&
      model.createdByUser !== undefined
    ) {
      user.createdByUser = model.createdByUser;
    }
    if (
      model.note !== 'string' &&
      model.note !== '' &&
      model.note !== undefined
    ) {
      user.note = model.note;
    }
    if (
      model.averageFinalRating !== null &&
      model.averageFinalRating !== undefined &&
      model.averageFinalRating !== 0
    ) {
      user.averageFinalRating = model.averageFinalRating;
    }
    if (
      model.totalReviews !== null &&
      model.totalReviews !== undefined &&
      model.totalReviews !== 0
    ) {
      user.totalReviews = model.totalReviews;
    }
    if (model.notificationsOnOff) {
      user.notificationsOnOff = model.notificationsOnOff;
    }
    if (model.isAmbassador !== undefined) {
      user.isAmbassador = model.isAmbassador;
    }
    if (model.isUserVerified !== undefined) {
      user.isUserVerified = model.isUserVerified;
    }
    if (model.isAmbassadorOn) {
      user.isAmbassadorOn = model.isAmbassadorOn;
    }
    if (model.isAmbassadorOn) {
      user.isAmbassadorOn = model.isAmbassadorOn;
    }
    if (
      model.role !== 'string' &&
      model.role !== '' &&
      model.role !== undefined
    ) {
      user.role = model.role;
    }
    if (
      model.roles !== 'string' &&
      model.roles !== '' &&
      model.roles !== undefined
    ) {
      user.roles = model.roles;
    }
    if (model.isPhoneVerified !== undefined) {
      user.isPhoneVerified = model.isPhoneVerified;
    }
    if (
      model.browserName !== 'string' &&
      model.browserName !== '' &&
      model.browserName !== undefined
    ) {
      user.browserName = model.browserName;
    }
    if (model.isFav !== undefined) {
      user.isFav = model.isFav;
    }
    if (is_valid_string(model.addressLine2)) {
      user.addressLine2 = model.addressLine2;
    }
    if (is_valid_string(model.street)) {
      user.street = model.street;
    }
    if (is_valid_string(model.state)) {
      user.state = model.state;
    }
    if (is_valid_string(model.city)) {
      user.city = model.city;
    }
    if (model.country) {
      user.country = model.country;
    }
    if (model.source) {
      user.source = model.source;
    }
    if (is_valid_string(model.zipCode)) {
      user.zipCode = model.zipCode;
    }
    if (model.lastLoggedIn) {
      user.lastLoggedIn = model.lastLoggedIn;
    }
    if (is_valid_string(model.inviteBy)) {
      user.inviteBy = model.inviteBy.trim();
    }
    if (model.isActivated) {
      user.isActivated = model.isActivated;
    }
    if (is_valid_string(model.lastModifiedBy)) {
      user.lastModifiedBy = model.lastModifiedBy;
    }
    if (model.isDeleted) {
      user.isDeleted = model.isDeleted;
    }
    if (model.deletedBy) {
      user.deletedBy = model.deletedBy;
    }
    if (is_valid_string(model.deleteReason)) {
      user.deleteReason = model.deleteReason;
    }
    if (is_valid_string(model.deleteReasonDetail)) {
      user.deleteReasonDetail = model.deleteReasonDetail;
    }
    if (model.deletedDate) {
      user.deletedDate = model.deletedDate;
    }
    if (model.createdBy) {
      user.createdBy = model.createdBy;
    }
    if (model.createdByUser) {
      user.createdByUser = model.createdByUser;
    }
    if (model.note) {
      user.note = model.note;
    }
    if (model.averageFinalRating) {
      user.averageFinalRating = model.averageFinalRating;
    }
    if (model.totalReviews) {
      user.totalReviews = model.totalReviews;
    }
    if (model.notificationsOnOff) {
      user.notificationsOnOff = model.notificationsOnOff;
    }
    if (model.isAmbassador) {
      user.isAmbassador = model.isAmbassador;
    }
    if (model.isUserVerified) {
      user.isUserVerified = model.isUserVerified;
    }
    if (model.isAmbassadorOn) {
      user.isAmbassadorOn = model.isAmbassadorOn;
    }
    if (is_valid_string(model.role)) {
      user.role = model.role.trim();
    }
    if (model.isPhoneVerified) {
      user.isPhoneVerified = model.isPhoneVerified;
    }
    if (model.isFav) {
      user.isFav = model.isFav;
    }
    if (model.browserName) {
      user.browserName = model.browserName;
    }
    if (model.ipAddress) {
      user.ipAddress = model.ipAddress;
    }
    if (model.osName) {
      user.osName = model.osName;
    }
    if (model.loginCount) {
      user.loginCount = model.loginCount;
    }
    if (model.lastLoginTime) {
      user.lastLoginTime = model.lastLoginTime;
    }
    if (model.betaUser) {
      user.betaUser = model.betaUser;
    }
    if (model.isPasswordSet) {
      user.isPasswordSet = model.isPasswordSet;
    }
    if (model.isEmailVerified) {
      user.isEmailVerified = model.isEmailVerified;
    }
    if (model.isPhoneNumberVerified) {
      user.isPhoneNumberVerified = model.isPhoneNumberVerified;
    }
    if (model.last_reviewed) {
      user.last_reviewed = model.last_reviewed;
    }
    if (model.next_reviewed) {
      user.next_reviewed = model.next_reviewed;
    }
    if (model.providerCopy) {
      user.providerCopy = model.providerCopy;
    }
    if (model.reference) {
      user.reference = model.reference;
    }
    if (model.referenceUser) {
      user.referenceUser = model.referenceUser;
    }
    if (model.provider_reference) {
      user.provider_reference = model.provider_reference;
    }
    await user.save();

    return user;
  }

  async changePassword(
    id: string,
    model: { old_password: string; new_password: string },
  ) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const is_matched = verifyHash(user.password, model.old_password);

    if (!is_matched) {
      throw new HttpException('wrong old password', HttpStatus.BAD_REQUEST);
    }

    const new_hashed_pass = hash(model.new_password);

    user.password = new_hashed_pass;

    await user.save();

    return 'password changed.';
  }

  async forgetPassword(model: { email: string }) {
    const { email } = model;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const otp = generate_otp();
    console.log('otp====>>>', otp);

    const html = `<strong>YOUR OTP IS :- ${otp}</strong> <br/>
                  <p>Please do not share your one time password with anyone.</p>`;

    const sent_res = await this.mailService.sendMail({
      subject: 'Otp for reset password',
      to: user.email,
      html: html,
    });

    if (!sent_res || ![...sent_res.accepted].length) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwt.sign({ _id: user._id, otp }, { expiresIn: '3m' });

    return token;
  }

  async verifyOtp(token: string, otp: string) {
    const decode = await this.jwt.verify(token);
    if (
      decode.name === 'JsonWebTokenError' ||
      decode.name === 'NotBeforeError'
    ) {
      throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
    }

    if (decode.name === 'TokenExpiredError') {
      throw new HttpException('otp expired', HttpStatus.BAD_REQUEST);
    }

    if (decode.otp !== otp) {
      throw new HttpException('wrong expired', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findById(decode._id);

    if (!user) {
      throw new HttpException('UnAuthorized user', HttpStatus.UNAUTHORIZED);
    }

    const new_token = this.jwt.sign({ _id: user._id }, { expiresIn: '20m' });

    return {
      token: new_token,
    };
  }

  async resetPassword(password: string, userd: any) {
    const hashed = hash(password);

    const user = await this.userModel.findByIdAndUpdate(
      { _id: userd._id },
      { $set: { password: hashed } },
    );

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    return 'password changed';
  }

  async searchProvider(fullname: string, cityId: string) {
    const matchCriteria: Record<string, any> = {};
    // if (fullname) {
    //   // matchCriteria.fullname = { $regex: new RegExp(fullname, 'i') };
    //   matchCriteria.fullname = { $regex: new RegExp(`^${fullname}`, 'i') };
    // }

    // if (fullname) {
    //   // Check if the fullname has a space, if not, prepend a space
    //   if (!fullname.includes(' ')) {
    //     fullname = ' ' + fullname;
    //   }
    //   matchCriteria.fullname = { $regex: new RegExp(`${fullname}`, 'i') };
    // }
    if (fullname) {
      matchCriteria.firstName = {
        $regex: new RegExp(
          `${fullname.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
          'i',
        ),
      };
    }

    if (cityId) {
      matchCriteria.cityId = new ObjectId(cityId);
    }

    const data = await this.userModel.aggregate([
      {
        $match: {
          $and: [matchCriteria],
          $or: [{ roles: 'purpleprovider' }, { role: 'provider' }],
        },
      },
      {
        $facet: {
          result: [
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
            {
              $lookup: {
                from: 'programs',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$user', '$$programId'],
                      },
                    },
                  },
                ],
                as: 'programs',
              },
            },
            {
              $addFields: {
                totalPrograms: { $size: '$programs' },
              },
            },
            {
              $lookup: {
                from: 'programs',
                let: { programId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$user', '$$programId'] },
                          { $eq: ['$isPublished', true] },
                        ],
                      },
                    },
                  },
                ],
                as: 'programs',
              },
            },
            {
              $addFields: {
                publishedPrograms: { $size: '$programs' },
              },
            },
            { $sort: { firstName: 1, created_at: -1 } },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                userName: 1,
                sex: 1,
                location: 1,
                age: 1,
                role: 1,
                roles: 1,
                dob: 1,
                email: 1,
                type: 1,
                facebookId: 1,
                googleId: 1,
                avatarImages: 1,
                phoneNumber: 1,
                secondaryPhonenumber: 1,
                addressLine1: 1,
                addressLine2: 1,
                street: 1,
                state: 1,
                city: 1,
                country: 1,
                source: 1,
                isClaimed: 1,
                zipCode: 1,
                stripeKey: 1,
                lastLoggedIn: 1,
                personalNote: 1,
                loginLimit: 1,
                securityQuestion: 1,
                answer: 1,
                inviteBy: 1,
                ssn: 1,
                isActivated: 1,
                addFrom: 1,
                isDeleted: 1,
                deletedBy: 1,
                deleteReason: 1,
                deleteReasonDetail: 1,
                deletedDate: 1,
                token: 1,
                createdBy: 1,
                createdByUser: 1,
                note: 1,
                averageFinalRating: 1,
                totalReviews: 1,
                notificationsOnOff: 1,
                profileCompleteEmail: 1,
                profileCompleteNotification: 1,
                isAmbassador: 1,
                isUserVerified: 1,
                isAmbassadorOn: 1,
                weeklyDate: 1,
                resetPasswordToken: 1,
                resetPasswordExpires: 1,
                isPhoneVerified: 1,
                totalPoints: 1,
                isFav: 1,
                parentInvitationLimit: 1,
                guardianInvitationLimit: 1,
                browserName: 1,
                ipAddress: 1,
                osName: 1,
                loginCount: 1,
                lastLoginTime: 1,
                deviceToken: 1,
                betaUser: 1,
                isFreeTrial: 1,
                isOnBoardingDone: 1,
                isPasswordSet: 1,
                isEmailVerified: 1,
                isPhoneNumberVerified: 1,
                createdOn: 1,
                usercreatedOn: 1,
                updatedOn: 1,
                last_reviewed: 1,
                next_reviewed: 1,
                providerCopy: 1,
                reference: 1,
                referenceUser: 1,
                provider_reference: 1,
                onBoardingCount: 1,
                userUpdateCount: 1,
                userUpdateFirstTime: 1,
                status: 1,
                totalPrograms: 1,
                publishedPrograms: 1,
                changeDetection: 1,
                website: '$provider.website',
                googleReviewsURL: '$provider.googleReviewsURL',
                numberOfGoogleReviews: '$provider.numberOfGoogleReviews',
                averageGoogleRating: '$provider.averageGoogleRating',
                bottomGoogleReviews: '$provider.bottomGoogleReviews',
                mostRecentGoogleReviews: '$provider.mostRecentGoogleReviews',
                facebookURL: '$provider.facebookURL',
                facebookNumberOfFollowers:
                  '$provider.facebookNumberOfFollowers',
                facebookNumberOfLikes: '$provider.facebookNumberOfLikes',
                yelpProfileURL: '$provider.yelpProfileURL',
                numberOfYelpRatings: '$provider.numberOfYelpRatings',
                averageYelpRating: '$provider.averageYelpRating',
                yelpTopReviews: '$provider.yelpTopReviews',
                yelpMostRecentReviews: '$provider.yelpMostRecentReviews',
                instagramProfileLink: '$provider.instagramProfileLink',
                numberOfInstagramFollowers:
                  '$provider.numberOfInstagramFollowers',
                linkedin: '$provider.linkedin',
                imageURL: '$provider.imageURL',
                hours: '$provider.hours',
                fullAddress: '$provider.fullAddress',
                facebook: '$provider.facebook',
                description: '$provider.description',
                bio: '$provider.bio',
                about: '$provider.about',
                county: '$provider.county',
                addedBy: '$provider.addedBy',
                indoorOrOutdoor: '$provider.indoorOrOutdoor',
                inpersonOrVirtual: '$provider.inpersonOrVirtual',
                privateVsGroup: '$provider.privateVsGroup',
                activityTypes: '$provider.activityTypes',
                earlyDrop_off_LatePick_up:
                  '$provider.earlyDrop_off_LatePick_up',
                provideTransportServicesToAndFromTheVenue:
                  '$provider.provideTransportServicesToAndFromTheVenue',
                providePartyServices: '$provider.providePartyServices',
                provideBirthdaySpecificServices:
                  '$provider.provideBirthdaySpecificServices',
                maximumTravelDistance: '$provider.maximumTravelDistance',
                instructor: '$provider.instructor',
                provideInHomeInstruction: '$provider.provideInHomeInstruction',
                providePrivateInstruction:
                  '$provider.providePrivateInstruction',
                isChildCare: '$provider.isChildCare',
                teamSize: '$provider.teamSize',
                gmb: '$provider.gmb',
                skillGroups: '$provider.skillGroups',
                yelp: '$provider.yelp',
                primaryAddress: '$provider.primaryAddress',
                displayPhoneNumbers: '$provider.displayPhoneNumbers',
                address: '$provider.address',
                emails: '$provider.emails',
                businessName: '$provider.businessName',
                user: '$provider.user',
                subCategoryIds: '$provider.subCategoryIds',
                categories: '$provider.categories',
                primaryPhoneNumbers: '$provider.primaryPhoneNumbers',
                lastModifiedBy: '$provider.lastModifiedBy',
                activeStatus: '$provider.activeStatus',
                reviews: '$provider.reviews',
                rating: '$provider.rating',
                // last_reviewed: "$provider.last_reviewed",
                // next_reviewed: "$provider.next_reviewed",
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
                let: { categoryId: '$categories' },
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
                as: 'categories',
              },
            },
            // {
            //   $lookup: {
            //     from: 'phonenumbers',
            //     let: { primaryPhoneNumbersID: '$primaryPhoneNumbers' },
            //     pipeline: [
            //       {
            //         $match: {
            //           $expr: {
            //             $and: [{ $in: ['$_id', { $ifNull: ['$$primaryPhoneNumbersID', []] }] }],
            //           },
            //         },
            //       },
            //     ],
            //     as: 'primaryPhoneNumbers',
            //   },
            // },
            {
              $lookup: {
                from: 'phonenumbers',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$user', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'primaryPhoneNumbers',
              },
            },
            {
              $lookup: {
                from: 'providerlocations',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$user', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'providerlocations',
              },
            },
            {
              $unwind: {
                path: '$providerlocations',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $set: {
                location: '$providerlocations.name',
                addressLine1: '$providerlocations.name',
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
    //   {
    //     $lookup: {
    //       from: 'citymanagements',
    //       let: { cityId: '$cityId' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: ['$_id', '$$cityId'],
    //             },
    //           },
    //         },
    //       ],
    //       as: 'cityId',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'lastModifiedBy',
    //       foreignField: '_id',
    //       as: 'lastModifiedBy',
    //     }
    //   }
    //   // { $unwind: { path: '$lastModifiedBy', preserveNullAndEmptyArrays: true } },
    // ]);

    // return data;
  }

  async jsonToExl(role: string, status: string, cityId: string) {
    const matchCriteria: Record<string, any> = {};

    if (role) {
      matchCriteria.roles = role;
    }

    if (status) {
      matchCriteria.status = status;
    }

    if (cityId) {
      matchCriteria.cityId = new ObjectId(cityId);
    }

    const data = await this.userModel.aggregate([{ $match: matchCriteria }]);

    if (data.length <= 0) {
      return 'Not Data Yet!!!!!!!!';
    } else if (data.length > 0) {
      if (data) {
        const selectedFields = data.map((provider) => ({
          name: provider.fullname,
          email: provider.email,
          phone_number: provider.phone_number,
          websiteUrl: provider.websiteUrl,
        }));

        const workSheet = XLSX.utils.json_to_sheet(selectedFields);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, 'providers');

        const excelBuffer = XLSX.write(workBook, {
          bookType: 'xlsx',
          type: 'buffer',
        });

        const timestamp = new Date().getTime();
        const fileName = `PurpleProviderData_${
          role ? role : 'all'
        }_${timestamp}.xlsx`;

        const folderPath = path.join(process.cwd(), UserService.filesFolder);
        const filePath = path.join(folderPath, fileName);

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(filePath, excelBuffer);

        // return filePath;
        return `https://do.purpleinvestor.com/excel_files/${fileName}`;
      }
    }
  }

  async downloadProviderJsonToExl({
    role,
    status,
    cityId,
    sort,
    name,
    category,
    subCategory,
    page_size,
    page_number,
    is_child_care,
  }: {
    role: string;
    status: string;
    cityId: string;
    sort: string;
    name: string;
    category: string;
    subCategory: string;
    page_size: number;
    page_number: number;
    is_child_care?: string;
  }) {
    let matchCriteria: Record<string, any> = {};

    if (role) {
      matchCriteria.roles = role;
    }

    if (status) {
      matchCriteria.status = status;
    }

    if (cityId) {
      matchCriteria.cityId = new ObjectId(cityId);
    }

    const query: Record<string, any> = {};

    if (name) {
      query['userName'] = { $regex: name, $options: 'i' };
    }

    if (category) {
      query['categories'] = category;
    }

    if (subCategory) {
      query['subCategoryIds'] = subCategory;
    }

    if (is_child_care) {
      query['isChildCare'] = is_child_care === 'true';
    }

    const match = { ...matchCriteria, ...query };

    const skip = (page_number - 1) * page_size;
    const limit = page_size;

    let sorting = {};
    if (sort === 'byName') {
      sorting = { firstName: 1 };
    } else if (sort === 'byDate') {
      sorting = { createdOn: -1 };
    } else if (sort === 'byDumpStage') {
      sorting = { stage: -1 };
    } else {
      sorting = { firstName: 1, createdOn: 1 };
    }

    const data = await this.userModel.aggregate([
      { $match: match },
      { $skip: skip },
      { $limit: limit },
      { $sort: sorting },
    ]);

    if (data.length <= 0) {
      return 'No Data Available';
    }

    const selectedFields = data.map((provider) => ({
      name: provider.firstName || 'N/A',
      email: provider.email || 'N/A',
      phone_number: provider.phoneNumber || 'N/A',
      websiteUrl: provider.website || 'N/A',
      avatarImages: provider.avatarImages || 'N/A',
      note: provider.note || 'N/A',
      createdOn: provider.createdOn || 'N/A',
      updatedOn: provider.updatedOn || 'N/A',
      status: provider.status || 'N/A',
      teamSize: provider.teamSize || 'No Info',
      role: provider.roles || 'No Info',
      providerCopy: provider.providerCopy || 'No',
      reference: provider.reference || false,
      isActivated: provider.isActivated || false,
      isDeleted: provider.isDeleted || false,
      isAmbassador: provider.isAmbassador || false,
      isUserVerified: provider.isUserVerified || false,
      isPhoneVerified: provider.isPhoneVerified || false,
      isFav: provider.isFav || false,
      loginCount: provider.loginCount || 0,
      lastLoginTime: provider.lastLoginTime || 0,
      betaUser: provider.betaUser || false,
      isPasswordSet: provider.isPasswordSet || false,
      isEmailVerified: provider.isEmailVerified || false,
      isPhoneNumberVerified: provider.isPhoneNumberVerified || false,
      last_reviewed: provider.last_reviewed || 'N/A',

      subCategoryCount: provider.subCategoryIds
        ? provider.subCategoryIds.length
        : 0,
      bottomGoogleReviewsCount: provider.bottomGoogleReviews
        ? provider.bottomGoogleReviews.length
        : 0,
      mostRecentGoogleReviewsCount: provider.mostRecentGoogleReviews
        ? provider.mostRecentGoogleReviews.length
        : 0,
      yelpTopReviewsCount: provider.yelpTopReviews
        ? provider.yelpTopReviews.length
        : 0,
      yelpMostRecentReviewsCount: provider.yelpMostRecentReviews
        ? provider.yelpMostRecentReviews.length
        : 0,
      indoorOrOutdoorCount: provider.indoorOrOutdoor
        ? provider.indoorOrOutdoor.length
        : 0,
      inpersonOrVirtualCount: provider.inpersonOrVirtual
        ? provider.inpersonOrVirtual.length
        : 0,
      privateVsGroupCount: provider.privateVsGroup
        ? provider.privateVsGroup.length
        : 0,
      activityTypesCount: provider.activityTypes
        ? provider.activityTypes.length
        : 0,
      skillGroupsCount: provider.skillGroups ? provider.skillGroups.length : 0,
      emailsCount: provider.emails ? provider.emails.length : 0,
      coversWithAltCount: provider.coversWithAlt
        ? provider.coversWithAlt.length
        : 0,
      imageWithAltCount: provider.imageWithAlt
        ? provider.imageWithAlt.length
        : 0,
      webBannersCount: provider.webBanners ? provider.webBanners.length : 0,
      mobileBannersCount: provider.mobileBanners
        ? provider.mobileBanners.length
        : 0,
      pwaListingCount: provider.pwaListing ? provider.pwaListing.length : 0,
      webListingCount: provider.webListing ? provider.webListing.length : 0,
      subCategoryIdsCount: provider.subCategoryIds
        ? provider.subCategoryIds.length
        : 0,
    }));

    console.log(selectedFields);

    const workSheet = XLSX.utils.json_to_sheet(selectedFields);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'providers');

    const excelBuffer = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    const timestamp = new Date().getTime();
    const fileName = `PurpleProviderData_${status ? status : 'all'}_${timestamp}.xlsx`;
    const folderPath = path.join(process.cwd(), UserService.ProviderfilesFolder);
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, excelBuffer);

    // return filePath;
    return `https://do.purpleinvestor.com/files/${fileName}`;
  }

  async createUserToProvider() {
    const users = await this.userModel.find({ roles: 'purpleprovider' });

    const provider = [];

    users.forEach((user) => {
      const providerkModel = {
        user: user._id,
        task_from: user.type,
        // userName: user.fullname,
        lastModifiedBy: user.lastModifiedBy,
        last_reviewed: user.last_reviewed,
        next_reviewed: user.next_reviewed,
        // googleReviewsURL: user.googleReviewsURL,
        // numberOfGoogleReviews: user.numberOfGoogleReviews,
        // averageGoogleRating: user.averageGoogleRating,
        // topGoogleReviews: user.topGoogleReviews,
        // bottomGoogleReviews: user.bottomGoogleReviews,
        // mostRecentGoogleReviews: user.mostRecentGoogleReviews,
        // facebookURL: user.facebookURL,
        // facebookNumberOfFollowers: user.facebookNumberOfFollowers,
        // facebookNumberOfLikes: user.facebookNumberOfLikes,
        // yelpProfileURL: user.yelpProfileURL,
        // numberOfYelpRatings: user.numberOfYelpRatings,
        // averageYelpRating: user.averageYelpRating,
        // yelpTopReviews: user.yelpTopReviews,
        // yelpBottomReviews: user.yelpBottomReviews,
        // yelpMostRecentReviews: user.yelpMostRecentReviews,
        // instagramProfileLink: user.instagramProfileLink,
        // numberOfInstagramFollowers: user.numberOfInstagramFollowers,
        // website: user.websiteUrl,
        website: user.website,
        cityId: user.cityId,
        createdOn: user.createdOn,
        updatedOn: user.updatedOn,
      };
      provider.push(providerkModel);
    });

    await this.ProviderModel.insertMany(provider);

    return provider;
  }

  async countCharProviderNameMinAndMax() {
    const data = await this.userModel.aggregate([
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          userName: 1,
          fullName: { $concat: [{ $ifNull: ["$firstName", ""] }, " ", { $ifNull: ["$lastName", ""] }] },
          fullNameLength: {
            $add: [
              { $strLenCP: { $ifNull: ["$firstName", ""] } },
              { $strLenCP: { $ifNull: ["$lastName", ""] } },
            ],
          },
          firstNameLength: { $strLenCP: { $ifNull: ["$firstName", ""] } },
          lastNameLength: { $strLenCP: { $ifNull: ["$lastName", ""] } },
          userNameLength: { $strLenCP: { $ifNull: ["$userName", ""] } },
        },
      },
      {
        $group: {
          _id: null,
          maxFirstName: { $max: "$firstNameLength" },
          minFirstName: { $min: "$firstNameLength" },
          maxLastName: { $max: "$lastNameLength" },
          minLastName: { $min: "$lastNameLength" },
          maxFullName: { $max: "$fullNameLength" },
          minFullName: { $min: "$fullNameLength" },
          maxUserName: { $max: "$userNameLength" },
          minUserName: { $min: "$userNameLength" },
          firstNames: { $push: { firstName: "$firstName", length: "$firstNameLength" } },
          lastNames: { $push: { lastName: "$lastName", length: "$lastNameLength" } },
          fullNames: { $push: { fullName: "$fullName", length: "$fullNameLength" } },
          userNames: { $push: { userName: "$userName", length: "$userNameLength" } },
        },
      },
      {
        $project: {
          _id: 0,
          maxFirstName: 1,
          minFirstName: 1,
          maxLastName: 1,
          minLastName: 1,
          maxFullName: 1,
          minFullName: 1,
          maxUserName: 1,
          minUserName: 1,
          maxFirstNameName: {
            $arrayElemAt: [
              { $filter: { input: "$firstNames", as: "item", cond: { $eq: ["$$item.length", "$maxFirstName"] } } },
              0,
            ],
          },
          maxLastNameName: {
            $arrayElemAt: [
              { $filter: { input: "$lastNames", as: "item", cond: { $eq: ["$$item.length", "$maxLastName"] } } },
              0,
            ],
          },
          maxFullNameName: {
            $arrayElemAt: [
              { $filter: { input: "$fullNames", as: "item", cond: { $eq: ["$$item.length", "$maxFullName"] } } },
              0,
            ],
          },
          maxUserNameName: {
            $arrayElemAt: [
              { $filter: { input: "$userNames", as: "item", cond: { $eq: ["$$item.length", "$maxUserName"] } } },
              0,
            ],
          },
        },
      },
      {
        $project: {
          maxFirstName: 1,
          minFirstName: 1,
          maxLastName: 1,
          minLastName: 1,
          maxFullName: 1,
          minFullName: 1,
          maxUserName: 1,
          minUserName: 1,
          maxFirstNameName: "$maxFirstNameName.firstName",
          maxLastNameName: "$maxLastNameName.lastName",
          maxFullNameName: "$maxFullNameName.fullName",
          maxUserNameName: "$maxUserNameName.userName",
        },
      },
    ]);
  
    return data[0];
  }

  async getAmbassadors() {
    const data = await this.userModel.aggregate([
        {
          $match:{ isAmbassador: true,role:"parent",type:{$ne:'campaign'} }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'referenceUser',
            foreignField: '_id',
            as: 'referenceUser',
          },
        },
        { $unwind: { path: "$referenceUser", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
              from: 'friendcircles',
              localField: '_id',
              foreignField: 'parentId',
              as: 'friendCircle',
            },
          },
          { $unwind: { path: "$friendCircle", preserveNullAndEmptyArrays: true } },
          {
            $facet: {
              result: [
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
          TotalCount: totalCount,
          data: items,
        };
  }

  async getTestParents() {
    const data = await this.userModel.aggregate([
      {
        $match: {
          'role': 'parent',
          testMode: true,
          type: { $ne: 'campaign' }
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'referenceUser',
          foreignField: '_id',
          as: 'referenceUser',
        },
      },
      // { $unwind: "$referenceUser" },
      { $unwind: { path: "$referenceUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'friendcircles',
          localField: '_id',
          foreignField: 'parentId',
          as: 'friendCircle',
        },
      },
      { $unwind: { path: "$friendCircle", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          result: [
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
      TotalCount: totalCount,
      data: items,
    };
  }

  async getAllInvitation(role: string = 'parent') {
    const invitations = {};

    // Aggregation pipeline for invitations
  

    // Aggregation pipelines for counts
    const countPipeline = (status: string | null = null) => [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.role': role,
          'user.testMode': false,
          joined: true,
          ...(status ? { [`status.${status}`]: true } : {}),
        },
      },
      { $count: 'totalCount' },
    ];

    const [] = await Promise.all([
    
    ]);

    return
  }

  async getUsersByTypeAndInvitations(
    // filterType: 'testParents' | 'ambassadors',
    // includeInvitations: boolean = false,
    // role: string = 'parent'
    invitation: string, role: string, type: string
  ) {
    const matchFilter =
      type === 'testParents'
        ? {
            role: 'parent',
            testMode: true,
            type: { $ne: 'campaign' },
          }
        : {
            isAmbassador: true,
            role: 'parent',
            type: { $ne: 'campaign' },
          };
  
    // Base pipeline for user data
    const userPipeline: any[] = [
      { $match: matchFilter },
      {
        $lookup: {
          from: 'users',
          localField: 'referenceUser',
          foreignField: '_id',
          as: 'referenceUser',
        },
      },
      { $unwind: { path: '$referenceUser', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'friendcircles',
          localField: '_id',
          foreignField: 'parentId',
          as: 'friendCircle',
        },
      },
      { $unwind: { path: '$friendCircle', preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ];
  
    // Invitation pipeline
    const invitationPipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'friendcircles',
          localField: 'user._id',
          foreignField: 'parentId',
          as: 'friendCircle',
        },
      },
      { $unwind: { path: '$friendCircle', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          'user.role': role,
          $expr: {
            $cond: {
              if: { $eq: ['$status.pending', true] },
              then: true,
              else: { $eq: ['$user.testMode', false] },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user.referenceUser',
          foreignField: '_id',
          as: 'referenceUser',
        },
      },
      { $unwind: { path: '$referenceUser', preserveNullAndEmptyArrays: true } },
      { $sort: { createdOn: -1 } },
    ];
  
    // Count pipeline
    const countPipeline = (status: string | null = null) => [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.role': role,
          'user.testMode': false,
          joined: true,
          ...(status ? { [`status.${status}`]: true } : {}),
        },
      },
      { $count: 'totalCount' },
    ];
  
    // Execute all pipelines concurrently
   
  
    // Prepare counts result
    let invitationCounts = {};
   
  
    // Final result
    return {
      counts: invitation ? invitationCounts : undefined,
    };
  }

  async getCount( ) {
  
  const userCount = await this.userModel.find({ type: { $ne: 'campaign' } }).count();
  const providerCount = await this.userModel.find({ role: "provider" }).count();
  const parentCount = await this.userModel.find({ role: "parent", type: { $ne: 'campaign' } }).count();
  const childrenCount = await this.childModel.find({ isActivated: true }).count();
  const expiredPrograms = await this.programModel.find({ isExpired: true }).count();
  const activePrograms = await this.programModel.find({ $or: [{ isExpired: false }, { isExpired: null }] }).count();
  // const activePrograms = await db.program.find({ isExpired: false}).count();
  const publishPrograms = await this.programModel
    .find({ isExpired: false, isPublished: true })
    .count();
  const unPublishPrograms = await this.programModel
    .find({ isExpired: false, isPublished: false })
    .count();
  const allPrograms = await this.programModel.find({}).count();
  let count = {
    userCount: userCount,
    providerCount: providerCount,
    parentCount: parentCount,
    childrenCount: childrenCount,
    allProgramsCount: allPrograms,
    expiredProgramsCount: expiredPrograms,
    activeProgramsCount: activePrograms,
    publishProgramsCount: publishPrograms,
    unPublishProgramsCount: unPublishPrograms,
  };
  
  return {count: count};
  }
  
  

}
