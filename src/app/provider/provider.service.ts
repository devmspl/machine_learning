import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { providerInterface } from 'src/@types/interfaces/provider';
import { Provider } from 'src/schemas/provider.schema';
import { User } from 'src/schemas/user.schema';
import { createProviderDto } from './dto/create.dto';
import { userInterface } from 'src/@types/interfaces/user';
import { is_valid_string } from '@app/common';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { PlacesService } from '../services/mail/placesService';
import { Queue } from 'src/schemas/queue.schema';
import { Webdump } from 'src/schemas/webdump.schema';
import { Tags } from 'src/schemas/tags.schema';
import { Citymanagement } from 'src/schemas/citymanagement.schema';
import { Program } from 'src/schemas/program.schema';
import { UrlService } from '../url/url.service';
import { Takelessionprovider } from 'src/schemas/takelessionprovider.schema';
import { Takelessonproviderjson } from 'src/schemas/takelessonproviderjson.schema';
import { Tasklessonreview } from 'src/schemas/tasklessonreview.schema';
import { Subjectprovider } from 'src/schemas/subjectprovider.schema';
import { Takelessionsubject } from 'src/schemas/takelessionsubject.schema';
import * as fs from 'fs/promises';
import axios from 'axios';
import { Dummyprovider } from 'src/schemas/dummyprovider.schema';

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ProviderService {
  constructor(
    private placeService: PlacesService,
    @InjectModel(User.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly userModel: Model<User>,
    
    @InjectModel(Queue.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly queueModel: Model<Queue>,
    @InjectModel(Webdump.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly webdumpModel: Model<Webdump>,
    @InjectModel(Provider.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly ProviderModel: Model<Provider>,
   
    
    
    @InjectModel(Tags.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly TagsModel: Model<Tags>,
    @InjectModel(Citymanagement.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly cityModel: Model<Citymanagement>,
    @InjectModel(Program.name, DATABASE_CONNECTION.WONDRFLY)
    private readonly programModel: Model<Program>,
    private urlService: UrlService,
    @InjectModel(Subjectprovider.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly providerReportsModel: Model<Subjectprovider>,
    @InjectModel(Takelessionprovider.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessionproviderModel: Model<Takelessionprovider>,
    @InjectModel(Takelessionsubject.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessionsubjectModel: Model<Takelessionsubject>,
    @InjectModel(Tasklessonreview.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessionreviewModel: Model<Tasklessonreview>,
    @InjectModel(Takelessonproviderjson.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly takelessonproviderjsonModel: Model<Takelessonproviderjson>,
    @InjectModel(Dummyprovider.name, DATABASE_CONNECTION.WEBSCRAPING)
    private readonly dummyproviderModel: Model<Dummyprovider>,
  ) {}

  async createProvider(model: createProviderDto) {
    try {
      const {
        user,
        // userName,
        businessName,
        subCategoryIds,
        categories,
        primaryPhoneNumbers,
        emails,
        address,
        // location,
        displayPhoneNumbers,
        primaryAddress,
        yelp,
        skillGroups,
        gmb,
        teamSize,
        isChildCare,
        providePrivateInstruction,
        provideInHomeInstruction,
        instructor,
        maximumTravelDistance,
        provideBirthdaySpecificServices,
        providePartyServices,
        provideTransportServicesToAndFromTheVenue,
        earlyDrop_off_LatePick_up,
        activityTypes,
        privateVsGroup,
        inpersonOrVirtual,
        indoorOrOutdoor,
        addedBy,
        // lastModifiedBy,
        county,
        about,
        bio,
        description,
        facebook,
        fullAddress,
        hours,
        imageURL,
        linkedin,
        listingURL,
        banners,
        links,
        cycle,
        alias,
        activeStatus,
        reviews,
        twitter,
        website,
        youtube,
        instagram,
        awards,
        taxNumber,
        merchantVerified,
        isAssociate,
        govtIdUrl,
        govtIdNote,
        healthAndSafety,
        lastActive,
        // source,
        sourceUrl,
        // createdBy,
        adminNotes,
        logo,
        cancellation_and_refund,
        // last_reviewed,
        // next_reviewed,
        cycle_time,
        proof_reader_notes,
        exceptionDates,
        online,
        joiningLink,
        student_location,
        student_maximumTravelDistance,
        provider_gallery,
        providerType,
        provider_video,
        additionalInformation,
        myLocation,
        headline,
        rating,
        googleReviewsURL,
        numberOfGoogleReviews,
        averageGoogleRating,
        topGoogleReviews,
        bottomGoogleReviews,
        mostRecentGoogleReviews,
        facebookURL,
        facebookNumberOfFollowers,
        facebookNumberOfLikes,
        yelpProfileURL,
        numberOfYelpRatings,
        averageYelpRating,
        yelpTopReviews,
        yelpBottomReviews,
        yelpMostRecentReviews,
        instagramProfileLink,
        numberOfInstagramFollowers,
        /////// user's ////////
        firstName,
        lastName,
        userName,
        sex,
        location,
        age,
        role,
        roles,
        dob,
        email,
        password,
        type,
        facebookId,
        googleId,
        avatarImages,
        secondaryPhonenumber,
        phoneNumber,
        addressLine1,
        addressLine2,
        street,
        state,
        city,
        country,
        source,
        isClaimed,
        zipCode,
        stripeKey,
        lastLoggedIn,
        personalNote,
        loginLimit,
        securityQuestion,
        answer,
        inviteBy,
        ssn,
        isActivated,
        lastModifiedBy,
        isDeleted,
        deletedBy,
        deleteReason,
        deleteReasonDetail,
        deletedDate,
        token,
        createdBy,
        createdByUser,
        note,
        averageFinalRating,
        totalReviews,
        notificationsOnOff,
        profileCompleteEmail,
        profileCompleteNotification,
        isAmbassador,
        isUserVerified,
        isAmbassadorOn,
        weeklyDate,
        resetPasswordToken,
        // resetPasswordExpires,
        isPhoneVerified,
        totalPoints,
        isFav,
        parentInvitationLimit,
        guardianInvitationLimit,
        browserName,
        ipAddress,
        osName,
        loginCount,
        lastLoginTime,
        deviceToken,
        betaUser,
        isFreeTrial,
        isOnBoardingDone,
        isPasswordSet,
        isEmailVerified,
        isPhoneNumberVerified,
        createdOn,
        usercreatedOn,
        updatedOn,
        last_reviewed,
        next_reviewed,
        providerCopy,
        reference,
        referenceUser,
        provider_reference,
        onBoardingCount,
        cityId,
        moveToWondrfly,
        is_deleted,
        // location,
        status,
      } = model;

      // Create the user
      const users = await this.createUser({
        firstName,
        lastName,
        userName,
        sex,
        age,
        dob,
        email,
        password,
        type,
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
        role: 'provider',
        roles: 'purpleprovider',
        // role,
        // roles,
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
        cityId,
        status,
        address,
        website,
        is_deleted,
        secondaryPhonenumber,
      });
      const userId = users._id;

      //////// create provider email  ///////////////////

      const providerEmailModel = {
        user: userId,
        email: email,
      };

      const providerPhoneModel = {
        user: userId,
        phoneNumber: phoneNumber,
      };

      const providerLocationModel = {
        user: userId,
        name: addressLine1,
        location: location,
        address: addressLine1,
        // category: category
      };

      const provider = await this.ProviderModel.create({
        user: userId,
        userName,
        phoneNumber,
        businessName,
        subCategoryIds,
        categories,
        primaryPhoneNumbers,
        emails,
        address,
        // location,
        displayPhoneNumbers,
        primaryAddress,
        yelp,
        skillGroups,
        gmb,
        teamSize,
        isChildCare,
        providePrivateInstruction,
        provideInHomeInstruction,
        instructor,
        maximumTravelDistance,
        provideBirthdaySpecificServices,
        providePartyServices,
        provideTransportServicesToAndFromTheVenue,
        earlyDrop_off_LatePick_up,
        activityTypes,
        privateVsGroup,
        inpersonOrVirtual,
        indoorOrOutdoor,
        addedBy,
        lastModifiedBy,
        county,
        about,
        bio,
        description,
        facebook,
        fullAddress,
        hours,
        imageURL,
        linkedin,
        listingURL,
        banners,
        links,
        cycle,
        alias,
        activeStatus,
        reviews,
        twitter,
        website,
        youtube,
        instagram,
        awards,
        taxNumber,
        merchantVerified,
        isAssociate,
        govtIdUrl,
        govtIdNote,
        healthAndSafety,
        lastActive,
        source,
        sourceUrl,
        createdBy,
        adminNotes,
        logo,
        cancellation_and_refund,
        last_reviewed,
        next_reviewed,
        cycle_time,
        proof_reader_notes,
        exceptionDates,
        online,
        joiningLink,
        student_location,
        student_maximumTravelDistance,
        provider_gallery,
        providerType,
        provider_video,
        additionalInformation,
        myLocation,
        headline,
        rating,
        cityId,
        googleReviewsURL,
        numberOfGoogleReviews,
        averageGoogleRating,
        topGoogleReviews,
        bottomGoogleReviews,
        mostRecentGoogleReviews,
        facebookURL,
        facebookNumberOfFollowers,
        facebookNumberOfLikes,
        yelpProfileURL,
        numberOfYelpRatings,
        averageYelpRating,
        yelpTopReviews,
        yelpBottomReviews,
        yelpMostRecentReviews,
        instagramProfileLink,
        numberOfInstagramFollowers,
      });

      return provider;
    } catch (error) {
      console.error('Error creating provider:', error);
      throw error;
    }
  }

  async createUser(model: userInterface) {
    try {
      const data = await new this.userModel(model).save();
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getById(id: string) {
    const listResult = await this.userModel.aggregate([
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
      { $unwind: '$provider' },
    ]);
    return listResult.length ? listResult[0] : null;
  }

  async getAllProvider(page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    const data = await this.ProviderModel.aggregate([
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

  async googlePlaceAddProvider(search, cityId, req) {
    const city = await this.cityModel.findById(cityId);
    const cityName = city.city.split(' ')[0].toLowerCase();
    const providers = await this.placeService.findProvidersByQuery(
      search,
      cityName,
    );
    console.log('providers====>>>>', providers);
    for (let provider of providers) {
      const url = provider.website;
      const existingQueue = await this.queueModel.findOne({
        urls: url,
      });
      const providerExist = await this.ProviderModel.findOne({
        website: url,
      });
      console.log('provider====>>>>', provider);
      if (
        !existingQueue &&
        !providerExist &&
        provider?.addressLine1.toLowerCase().includes(cityName)
      ) {
        const data = await new this.queueModel({
          cityId: cityId,
          urls: [url],
          type: 'google',
          status: 'processed',
        }).save();
        const providerData = {
          firstName: provider?.name,
          phoneNumber: provider.phoneNumber,
          addressLine1: provider?.addressLine1,
          lat: provider ? provider?.location?.lat : null,
          lng: provider ? provider?.location?.lng : null,
          cityId: cityId,
          role: 'provider',
          roles: 'purpleprovider',
        };
        const user = await this.userModel.create(providerData);
        await this.webdumpModel.create({
          url: 'googleapi',
          content: JSON.stringify(provider),
          provider: user._id,
          modifiedBy: 'google',
          source: 'google',
        });
        this.ProviderModel.create({
          user: user._id,
          is_child_care: true,
          isChildCare: true,
          website: provider.website,
          topGoogleReviews: provider.reviews,
          rating: {
            googleRating: provider.rating,
            googleLink: provider.totalRatings,
          },
        });
        if (providerData.lat && providerData.lng) {
          const providerLocationModel = {
            user: user._id,
            name: providerData.addressLine1,
            location: {
              type: 'Point',
              coordinates: [providerData.lng, providerData.lat],
            },
            address: provider.addressLine1,
            // category: category
          };

        }
        if (providerData.phoneNumber) {
          const providerPhoneModel = {
            user: user._id,
            phoneNumber: providerData.phoneNumber,
          };
        }
        this.urlService.dumpDataByProviderId(user._id.toString(), req);
      }
    }
    return providers.length;
  }

  async scriptForGooglePlace(cityId, req) {
    const tags = await this.TagsModel.find({});
    const city = await this.cityModel.findById(cityId);
    const types = [
      'Group class',
      'Private',
      'Camp',
      'Child care',
      'event',
      'Party activities',
    ];
    for (let type of types) {
      const prompt = `find ${type}  providers for “child”  in “${city.city}”.`;
      try {
        await this.googlePlaceAddProvider(prompt, cityId, req);
      } catch (e) {
        console.log(e);
      }
    }
  }
  async remove(id: string) {
    const user = await this.ProviderModel.findByIdAndDelete({ _id: id });

    if (!user) {
      throw new HttpException('provider not found', HttpStatus.BAD_REQUEST);
    }

    return 'provider removed';
  }

  async update(id: string, model: Partial<providerInterface>, @Req() req) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (user.moveInProduction) {
      return 'User Moved In Production If Any Think Changed Please Update In Production';
    }

    const provider = await this.ProviderModel.findOne({ user: user._id });
    if (!provider) {
      throw new HttpException('Provider not found', HttpStatus.BAD_REQUEST);
    }

    // Preserve old categories and subCategoryIds before update
    const oldCategories = provider.categories;
    const oldSubCategoryIds = provider.subCategoryIds;
    const providerUpdated = await this.Setprovider(model, provider, req);
    const removedCategories = oldCategories.filter(
      (category) => !providerUpdated.categories.includes(category),
    );
    const removedSubCategoryIds = oldSubCategoryIds.filter(
      (subCategoryId) =>
        !providerUpdated.subCategoryIds.includes(subCategoryId),
    );
    if (removedCategories.length > 0 || removedSubCategoryIds.length > 0) {
      // Update programs related to the provider
      await this.programModel.updateMany(
        { user: id },
        {
          $pull: {
            categoryId: { $in: removedCategories },
            subCategoryIds: { $in: removedSubCategoryIds },
          },
        },
      );
    }

    if (model.firstName) {
      if (
        model.firstName !== 'string' &&
        model.firstName !== '' &&
        model.firstName !== undefined
      ) {
        user.firstName = model.firstName.trim();
      }
    }

    if (model.lastName) {
      if (
        model.lastName !== 'string' &&
        model.lastName !== '' &&
        model.lastName !== undefined
      ) {
        user.lastName = model.lastName.trim();
      }
    }

    if (model.userName) {
      if (
        model.userName !== 'string' &&
        model.userName !== '' &&
        model.userName !== undefined
      ) {
        user.userName = model.userName.trim();
      }
    }

    if (model.sex) {
      if (model.sex === 'male' || model.sex === 'female') {
        user.sex = model.sex.trim();
      }
    }

    if (model.age !== undefined) {
      user.age = model.age;
    }
    if (model.dob) {
      if (
        model.dob !== 'string' &&
        model.dob !== '' &&
        model.dob !== undefined
      ) {
        user.dob = model.dob.trim();
      }
    }

    if (model.email) {
      if (
        model.email !== 'string' &&
        model.email !== '' &&
        model.email !== undefined
      ) {
        user.email = model.email.trim();
      }
    }
    if (model.type) {
      if (
        model.type !== 'string' &&
        model.type !== '' &&
        model.type !== undefined
      ) {
        user.type = model.type.trim();
      }
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
      model.zipCode !== 'string' &&
      model.zipCode !== '' &&
      model.zipCode !== undefined
    ) {
      user.zipCode = model.zipCode;
    }
    // if (model.location !== undefined)  {
    //   user.location = model.location;
    // }
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
    if (model.status) {
      user.status = model.status;
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
    // if (model.source) {
    //   user.source = model.source;
    // }
    if (is_valid_string(model.zipCode)) {
      user.zipCode = model.zipCode;
    }
    if (model.lastLoggedIn) {
      user.lastLoggedIn = model.lastLoggedIn;
    }
    if (model.inviteBy) {
      if (is_valid_string(model.inviteBy)) {
        user.inviteBy = model.inviteBy.trim();
      }
    }

    if (model.isActivated) {
      user.isActivated = model.isActivated;
    }
    if (req.user && req.user._id) {
      user.lastModifiedBy = req.user._id;
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
    if (model.role) {
      if (is_valid_string(model.role)) {
        user.role = model.role.trim();
      }
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

    user.updatedOn = new Date();
    user.userUpdateFirstTime = true;
    user.userUpdateCount = (user.userUpdateCount || 0) + 1;
    await user.save();
    this.checkProviderChanges(provider.user);
  }

  Setprovider(model: Partial<providerInterface>, provider, req) {
    if (req.user && req.user._id) {
      provider.lastModifiedBy = req.user._id;
    }
    if (
      model.user !== 'string' &&
      model.user !== '' &&
      model.user !== undefined
    ) {
      provider.user = model.user;
    }

    if (
      model.userName !== 'string' &&
      model.userName !== '' &&
      model.userName !== undefined
    ) {
      provider.userName = model.userName;
    }

    if (
      model.businessName !== 'string' &&
      model.businessName !== '' &&
      model.businessName !== undefined
    ) {
      provider.businessName = model.businessName;
    }

    if (
      model.emails !== 'string' &&
      model.emails !== '' &&
      model.emails !== undefined
    ) {
      provider.emails = model.emails;
    }

    if (model.myLocation !== undefined) {
      provider.myLocation = model.myLocation;
    }

    if (model.subCategoryIds !== undefined) {
      provider.subCategoryIds = model.subCategoryIds;
    }

    if (model.categories !== undefined) {
      provider.categories = model.categories;
    }

    if (model.primaryPhoneNumbers !== undefined) {
      provider.primaryPhoneNumbers = model.primaryPhoneNumbers;
    }

    if (
      model.address !== 'string' &&
      model.address !== '' &&
      model.address !== undefined
    ) {
      provider.address = model.address;
    }
    if (
      model.displayPhoneNumbers !== 'string' &&
      model.displayPhoneNumbers !== '' &&
      model.displayPhoneNumbers !== undefined
    ) {
      provider.displayPhoneNumbers = model.displayPhoneNumbers;
    }
    if (
      model.primaryAddress !== 'string' &&
      model.primaryAddress !== '' &&
      model.primaryAddress !== undefined
    ) {
      provider.primaryAddress = model.primaryAddress;
    }
    if (
      model.yelp !== 'string' &&
      model.yelp !== '' &&
      model.yelp !== undefined
    ) {
      provider.yelp = model.yelp;
    }
    if (model.skillGroups !== undefined) {
      provider.skillGroups = model.skillGroups;
    }
    if (model.gmb !== 'string' && model.gmb !== '' && model.gmb !== undefined) {
      provider.gmb = model.gmb;
    }
    if (
      model.teamSize !== 'string' &&
      model.teamSize !== '' &&
      model.teamSize !== undefined
    ) {
      provider.teamSize = model.teamSize;
    }
    if (
      typeof model.isChildCare !== 'string' &&
      model.isChildCare !== undefined
    ) {
      provider.isChildCare = model.isChildCare;
    }
    if (
      typeof model.providePrivateInstruction !== 'string' &&
      model.providePrivateInstruction !== undefined
    ) {
      provider.providePrivateInstruction = model.providePrivateInstruction;
    }
    if (
      typeof model.provideInHomeInstruction !== 'string' &&
      model.provideInHomeInstruction !== undefined
    ) {
      provider.provideInHomeInstruction = model.provideInHomeInstruction;
    }
    if (model.instructor !== undefined) {
      // provider.instructor = (model.instructor as any).split(',');
      provider.instructor = model.instructor;
    }
    if (
      model.maximumTravelDistance !== 0 &&
      model.maximumTravelDistance !== undefined
    ) {
      provider.maximumTravelDistance = model.maximumTravelDistance;
    }
    if (
      typeof model.provideBirthdaySpecificServices !== 'string' &&
      model.provideBirthdaySpecificServices !== undefined
    ) {
      provider.provideBirthdaySpecificServices =
        model.provideBirthdaySpecificServices;
    }
    if (
      typeof model.providePartyServices !== 'string' &&
      model.providePartyServices !== undefined
    ) {
      provider.providePartyServices = model.providePartyServices;
    }
    if (
      typeof model.provideTransportServicesToAndFromTheVenue !== 'string' &&
      model.provideTransportServicesToAndFromTheVenue !== undefined
    ) {
      provider.provideTransportServicesToAndFromTheVenue =
        model.provideTransportServicesToAndFromTheVenue;
    }
    if (
      typeof model.earlyDrop_off_LatePick_up !== 'string' &&
      model.earlyDrop_off_LatePick_up !== undefined
    ) {
      provider.earlyDrop_off_LatePick_up = model.earlyDrop_off_LatePick_up;
    }
    if (model.activityTypes !== undefined) {
      provider.activityTypes = model.activityTypes;
    }
    if (model.privateVsGroup !== undefined) {
      provider.privateVsGroup = model.privateVsGroup;
    }
    if (model.inpersonOrVirtual !== undefined) {
      provider.inpersonOrVirtual = model.inpersonOrVirtual;
    }
    if (model.indoorOrOutdoor !== undefined) {
      provider.indoorOrOutdoor = model.indoorOrOutdoor;
    }
    if (
      model.addedBy !== 'string' &&
      model.addedBy !== '' &&
      model.addedBy !== undefined
    ) {
      provider.addedBy = model.addedBy;
    }
    if (
      model.county !== 'string' &&
      model.county !== '' &&
      model.county !== undefined
    ) {
      provider.county = model.county;
    }
    if (model.bio !== 'string' && model.bio !== '' && model.bio !== undefined) {
      provider.bio = model.bio;
    }
    if (
      model.description !== 'string' &&
      model.description !== '' &&
      model.description !== undefined
    ) {
      provider.description = model.description;
    }
    if (
      model.facebook !== 'string' &&
      model.facebook !== '' &&
      model.facebook !== undefined
    ) {
      provider.facebook = model.facebook;
    }
    if (
      model.fullAddress !== 'string' &&
      model.fullAddress !== '' &&
      model.fullAddress !== undefined
    ) {
      provider.fullAddress = model.fullAddress;
    }
    if (
      model.hours !== 'string' &&
      model.hours !== '' &&
      model.hours !== undefined
    ) {
      provider.hours = model.hours;
    }
    if (
      model.linkedin !== 'string' &&
      model.linkedin !== '' &&
      model.linkedin !== undefined
    ) {
      provider.linkedin = model.linkedin;
    }
    if (
      model.listingURL !== 'string' &&
      model.listingURL !== '' &&
      model.listingURL !== undefined
    ) {
      provider.listingURL = model.listingURL;
    }
    if (model.banners !== undefined) {
      provider.banners = model.banners;
    }
    if (model.links !== undefined) {
      provider.links = model.links;
    }
    if (
      model.cycle !== 'string' &&
      model.cycle !== '' &&
      model.cycle !== undefined
    ) {
      provider.cycle = model.cycle;
    }
    if (
      model.alias !== 'string' &&
      model.alias !== '' &&
      model.alias !== undefined
    ) {
      provider.alias = model.alias;
    }
    if (
      model.activeStatus !== 'string' &&
      model.activeStatus !== '' &&
      model.activeStatus !== undefined
    ) {
      provider.activeStatus = model.activeStatus;
    }
    if (
      model.reviews !== 'string' &&
      model.reviews !== '' &&
      model.reviews !== undefined
    ) {
      provider.reviews = model.reviews;
    }
    if (
      model.twitter !== 'string' &&
      model.twitter !== '' &&
      model.twitter !== undefined
    ) {
      provider.twitter = model.twitter;
    }
    if (
      model.website !== 'string' &&
      model.website !== '' &&
      model.website !== undefined
    ) {
      provider.website = model.website;
    }
    if (
      model.youtube !== 'string' &&
      model.youtube !== '' &&
      model.youtube !== undefined
    ) {
      provider.youtube = model.youtube;
    }
    if (
      model.instagram !== 'string' &&
      model.instagram !== '' &&
      model.instagram !== undefined
    ) {
      provider.instagram = model.instagram;
    }
    if (
      model.awards !== 'string' &&
      model.awards !== '' &&
      model.awards !== undefined
    ) {
      provider.awards = model.awards;
    }
    if (
      model.taxNumber !== 'string' &&
      model.taxNumber !== '' &&
      model.taxNumber !== undefined
    ) {
      provider.taxNumber = model.taxNumber;
    }
    if (
      typeof model.merchantVerified !== 'string' &&
      model.merchantVerified !== undefined
    ) {
      provider.merchantVerified = model.merchantVerified;
    }
    if (
      model.isAssociate !== 'string' &&
      model.isAssociate !== '' &&
      model.isAssociate !== undefined
    ) {
      provider.isAssociate = model.isAssociate;
    }
    if (
      model.govtIdUrl !== 'string' &&
      model.govtIdUrl !== '' &&
      model.govtIdUrl !== undefined
    ) {
      provider.govtIdUrl = model.govtIdUrl;
    }
    if (
      model.govtIdNote !== 'string' &&
      model.govtIdNote !== '' &&
      model.govtIdNote !== undefined
    ) {
      provider.govtIdNote = model.govtIdNote;
    }
    if (
      model.healthAndSafety !== 'string' &&
      model.healthAndSafety !== '' &&
      model.healthAndSafety !== undefined
    ) {
      provider.healthAndSafety = model.healthAndSafety;
    }
    if (model.lastActive !== undefined) {
      provider.lastActive = model.lastActive;
    }
    // if (model.source !== undefined) {
    //   provider.source = model.source;
    // }
    if (model.sourceUrl !== undefined) {
      provider.sourceUrl = model.sourceUrl;
    }
    if (
      model.createdBy !== 'string' &&
      model.createdBy !== '' &&
      model.createdBy !== undefined
    ) {
      provider.createdBy = model.createdBy;
    }
    if (
      model.adminNotes !== 'string' &&
      model.adminNotes !== '' &&
      model.adminNotes !== undefined
    ) {
      provider.adminNotes = model.adminNotes;
    }
    if (
      model.logo !== 'string' &&
      model.logo !== '' &&
      model.logo !== undefined
    ) {
      provider.logo = model.logo;
    }
    if (
      model.cancellation_and_refund !== 'string' &&
      model.cancellation_and_refund !== '' &&
      model.cancellation_and_refund !== undefined
    ) {
      provider.cancellation_and_refund = model.cancellation_and_refund;
    }
    if (model.last_reviewed !== undefined) {
      provider.last_reviewed = model.last_reviewed;
    }
    if (model.next_reviewed !== undefined) {
      provider.next_reviewed = model.next_reviewed;
    }
    if (
      model.cycle_time !== 0 &&
      model.cycle_time !== null &&
      model.cycle_time !== undefined
    ) {
      provider.cycle_time = model.cycle_time;
    }
    if (
      model.proof_reader_notes !== 'string' &&
      model.proof_reader_notes !== '' &&
      model.proof_reader_notes !== undefined
    ) {
      provider.proof_reader_notes = model.proof_reader_notes;
    }
    if (model.exceptionDates !== undefined) {
      provider.exceptionDates = model.exceptionDates;
    }
    if (model.online !== undefined) {
      provider.online = model.online;
    }
    if (
      model.joiningLink !== undefined &&
      model.joiningLink !== 'string' &&
      model.joiningLink !== ''
    ) {
      provider.joiningLink = model.joiningLink;
    }
    if (model.student_location !== undefined) {
      provider.student_location = model.student_location;
    }
    if (model.student_maximumTravelDistance !== undefined) {
      provider.student_maximumTravelDistance =
        model.student_maximumTravelDistance;
    }
    if (model.joiningLink !== undefined) {
      provider.joiningLink = model.joiningLink;
    }
    if (model.provider_gallery !== undefined) {
      provider.provider_gallery = model.provider_gallery;
    }
    if (
      model.providerType !== undefined &&
      model.providerType !== 'string' &&
      model.providerType !== ''
    ) {
      provider.providerType = model.providerType;
    }
    if (
      model.provider_video !== undefined &&
      model.provider_video !== 'string' &&
      model.provider_video !== ''
    ) {
      provider.provider_video = model.provider_video;
    }
    if (
      model.additionalInformation !== undefined &&
      model.additionalInformation !== 'string' &&
      model.additionalInformation !== ''
    ) {
      provider.additionalInformation = model.additionalInformation;
    }
    if (model.myLocation !== undefined) {
      provider.myLocation = model.myLocation;
    }
    if (
      model.headline !== undefined &&
      model.headline !== 'string' &&
      model.headline !== ''
    ) {
      provider.headline = model.headline;
    }
    if (model.rating !== undefined) {
      provider.rating = model.rating;
    }
    if (
      model.websiteUrl !== undefined &&
      model.websiteUrl !== 'string' &&
      model.websiteUrl !== ''
    ) {
      provider.websiteUrl = model.websiteUrl;
    }
    if (
      model.numberOfInstagramFollowers !== undefined &&
      model.numberOfInstagramFollowers !== 'string' &&
      model.numberOfInstagramFollowers !== ''
    ) {
      provider.numberOfInstagramFollowers = model.numberOfInstagramFollowers;
    }
    if (
      model.instagramProfileLink !== undefined &&
      model.instagramProfileLink !== 'string' &&
      model.instagramProfileLink !== ''
    ) {
      provider.instagramProfileLink = model.instagramProfileLink;
    }
    if (model.yelpMostRecentReviews) {
      provider.yelpMostRecentReviews = model.yelpMostRecentReviews;
    }
    if (model.yelpBottomReviews) {
      provider.yelpBottomReviews = model.yelpBottomReviews;
    }
    if (model.yelpTopReviews) {
      provider.yelpTopReviews = model.yelpTopReviews;
    }
    if (
      model.averageYelpRating !== undefined &&
      model.averageYelpRating !== 'string' &&
      model.averageYelpRating !== ''
    ) {
      provider.averageYelpRating = model.averageYelpRating;
    }
    if (
      model.numberOfYelpRatings !== undefined &&
      model.numberOfYelpRatings !== 'string' &&
      model.numberOfYelpRatings !== ''
    ) {
      provider.numberOfYelpRatings = model.numberOfYelpRatings;
    }
    if (
      model.yelpProfileURL !== undefined &&
      model.yelpProfileURL !== 'string' &&
      model.yelpProfileURL !== ''
    ) {
      provider.yelpProfileURL = model.yelpProfileURL;
    }

    if (
      model.facebookNumberOfLikes !== undefined &&
      model.facebookNumberOfLikes !== 'string' &&
      model.facebookNumberOfLikes !== ''
    ) {
      provider.facebookNumberOfLikes = model.facebookNumberOfLikes;
    }

    if (
      model.facebookNumberOfFollowers !== undefined &&
      model.facebookNumberOfFollowers !== 'string' &&
      model.facebookNumberOfFollowers !== ''
    ) {
      provider.facebookNumberOfFollowers = model.facebookNumberOfFollowers;
    }

    if (
      model.facebookURL !== undefined &&
      model.facebookURL !== 'string' &&
      model.facebookURL !== ''
    ) {
      provider.facebookURL = model.facebookURL;
    }
    if (model.mostRecentGoogleReviews) {
      provider.mostRecentGoogleReviews = model.mostRecentGoogleReviews;
    }
    if (model.bottomGoogleReviews) {
      provider.bottomGoogleReviews = model.bottomGoogleReviews;
    }
    if (model.topGoogleReviews) {
      provider.topGoogleReviews = model.topGoogleReviews;
    }
    if (
      model.averageGoogleRating !== 'string' &&
      model.averageGoogleRating !== undefined
    ) {
      provider.averageGoogleRating = model.averageGoogleRating;
    }
    if (
      model.googleProfileURL !== 'string' &&
      model.googleProfileURL !== undefined
    ) {
      provider.googleProfileURL = model.googleProfileURL;
    }
    if (
      model.googleReviewsURL !== 'string' &&
      model.googleReviewsURL !== undefined
    ) {
      provider.googleReviewsURL = model.googleReviewsURL;
    }
    if (
      model.numberOfGoogleReviews !== 'string' &&
      model.numberOfGoogleReviews !== undefined
    ) {
      provider.numberOfGoogleReviews = model.numberOfGoogleReviews;
    }
    provider.save();

    this.checkProviderChanges(provider.user);

    return provider;
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
    console.log('userChangeDetection ====>>>>', userChangeDetection);
    const userUpdateResult = await this.userModel.updateOne(
      { _id: new ObjectId(user) },
      { $set: { changeDetection: userChangeDetection } },
    );
  }

  async locationWithDuplicateProvider(model) {
    let user = await this.userModel.findById(model.providerId);

    if (!user) {
      throw new Error('provider Not Found');
    }

    let location1;

    const latitude = parseFloat(model.lat);
    const longitude = parseFloat(model.lng);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      location1 = { type: 'Point', coordinates: [longitude, latitude] };
    } else {
      console.error('Invalid coordinates provided.');
      location1 = { type: 'Point', coordinates: [0, 0] };
    }

    let providr = await this.ProviderModel.findOne({ user: model.providerId });

    if (providr) {
      const duplicateDone = await new this.userModel({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        sex: user.sex,
        age: user.age,
        dob: user.dob,
        email: user.email,
        type: user.type,
        platForm: user.platForm,
        platFormId: user.platFormId,
        avatarImages: user.avatarImages,
        phoneNumber: user.phoneNumber,
        addressLine1: model.addressLine1,
        addressLine2: user.addressLine2,
        street: user.street,
        state: user.state,
        city: user.city,
        country: user.country,
        source: user.source,
        zipCode: user.zipCode,
        stripeId: user.stripeId,
        lastLoggedIn: user.lastLoggedIn,
        inviteBy: user.inviteBy,
        isActivated: user.isActivated,
        lastModifiedBy: user.lastModifiedBy,
        isDeleted: user.isDeleted,
        deletedBy: user.deletedBy,
        deleteReason: user.deleteReason,
        // deleteReasonDetails: user.deleteReasonDetails,
        deletedDate: user.deletedDate,
        token: user.token,
        createdBy: user.createdBy,
        createdByUser: user.createdByUser,
        // notes: user.notes,
        averageFinalRating: user.averageFinalRating,
        totalReviews: user.totalReviews,
        notificationsOnOff: user.notificationsOnOff,
        isAmbassador: user.isAmbassador,
        isUserVerified: user.isUserVerified,
        isAmbassadorOn: user.isAmbassadorOn,
        role: user.role,
        roles: user.roles,
        isPhoneVerified: user.isPhoneVerified,
        isFav: user.isFav,
        browserName: user.browserName,
        ipAddress: user.ipAddress,
        osName: user.osName,
        loginCount: user.loginCount,
        lastLoginTime: user.lastLoginTime,
        betaUser: user.betaUser,
        isPasswordSet: user.isPasswordSet,
        isEmailVerified: user.isEmailVerified,
        isPhoneNumberVerified: user.isPhoneNumberVerified,
        last_reviewed: user.last_reviewed,
        next_reviewed: user.next_reviewed,
        // providerCopy: user.providerCopy,
        reference: user.reference,
        changeDetection: user.changeDetection,
        referenceUser: user.referenceUser,
        // provider_reference: user.provider_reference,
        loginDetails: user.loginDetails,
        testMode: user.testMode,
        memeberShipUpdate: user.memeberShipUpdate,
        defaultSaveList: user.defaultSaveList,
        userUpdateFirstTime: user.userUpdateFirstTime,
        website: user.website,
        is_deleted: user.is_deleted,
        // secondaryPhonenumber: user.secondaryPhoneNumber,
        facebookId: user.facebookId,
        googleId: user.googleId,
        // cityId: user.cityId,
        addFrom: user.addFrom,
        moveToWondrfly: user.moveToWondrfly,
        status: user.status,
        userUpdateCount: user.userUpdateCount,
        address: user.address,
        // location: location1,
        // isAmbassadorOn: user.isAmbassadorOn,
        // role: "provider",
        // roles: "purpleprovider",
        providerCopy: 'Yes',
        provider_reference: model.providerId,
        cityId: model.cityId ? model.cityId : user.cityId,
        createdOn: new Date(),
        updateOn: new Date(),
      }).save();

      const provider = await new this.ProviderModel({
        user: duplicateDone._id,
        subCategoryIds: providr.subCategoryIds,
        categories: providr.categories,
        updateDescription: providr.updateDescription,
        updateCategory: providr.updateCategory,
        updateSubCategory: providr.updateSubCategory,
        primaryPhoneNumbers: providr.primaryPhoneNumbers,
        userName: providr.userName,
        businessName: providr.businessName,
        emails: providr.emails,
        address: providr.address,
        displayPhoneNumbers: providr.displayPhoneNumbers,
        primaryAddress: providr.primaryAddress,
        yelp: providr.yelp,
        skillGroups: providr.skillGroups,
        gmb: providr.gmb,
        teamSize: providr.teamSize,
        isChildCare: providr.isChildCare,
        providePrivateInstruction: providr.providePrivateInstruction,
        provideInHomeInstruction: providr.provideInHomeInstruction,
        instructor: providr.instructor,
        instructorImages: providr.instructorImages,
        maximumTravelDistance: providr.maximumTravelDistance,
        provideBirthdaySpecificServices:
          providr.provideBirthdaySpecificServices,
        providePartyServices: providr.providePartyServices,
        provideTransportServicesToAndFromTheVenue:
          providr.provideTransportServicesToAndFromTheVenue,
        earlyDrop_off_LatePick_up: providr.earlyDrop_off_LatePick_up,
        activityTypes: providr.activityTypes,
        privateVsGroup: providr.privateVsGroup,
        inpersonOrVirtual: providr.inpersonOrVirtual,
        indoorOrOutdoor: providr.indoorOrOutdoor,
        addedBy: providr.addedBy,
        lastModifiedBy: providr.lastModifiedBy,
        county: providr.county,
        about: providr.about,
        bio: providr.bio,
        description: providr.description,
        facebook: providr.facebook,
        fullAddress: providr.fullAddress,
        hours: providr.hours,
        imageURL: providr.imageURL,
        linkedin: providr.linkedin,
        listingURL: providr.listingURL,
        banners: providr.banners,
        links: providr.links,
        cycle: providr.cycle,
        alias: providr.alias,
        activeStatus: providr.activeStatus,
        reviews: providr.reviews,
        twitter: providr.twitter,
        website: providr.website,
        youtube: providr.youtube,
        instagram: providr.instagram,
        awards: providr.awards,
        taxNumber: providr.taxNumber,
        merchantVerified: providr.merchantVerified,
        isAssociate: providr.isAssociate,
        govtIdUrl: providr.govtIdUrl,
        govtIdNote: providr.govtIdNote,
        healthAndSafety: providr.healthAndSafety,
        lastActive: providr.lastActive,
        sourceUrl: providr.sourceUrl,
        createdBy: providr.createdBy,
        adminNotes: providr.adminNotes,
        logo: providr.logo,
        cancellation_and_refund: providr.cancellation_and_refund,
        last_reviewed: providr.last_reviewed,
        next_reviewed: providr.next_reviewed,
        cycle_time: providr.cycle_time,
        proof_reader_notes: providr.proof_reader_notes,
        exceptionDates: providr.exceptionDates,
        // categoryIds: providr.categoryIds,
        online: providr.online,
        joiningLink: providr.joiningLink,
        student_location: providr.student_location,
        student_maximumTravelDistance: providr.student_maximumTravelDistance,
        provider_gallery: providr.provider_gallery,
        providerType: providr.providerType,
        provider_video: providr.provider_video,
        additionalInformation: providr.additionalInformation,
        myLocation: providr.myLocation,
        isVerified: providr.isVerified,
        advanceAnalitcs: providr.advanceAnalitcs,
        isRequestVerified: providr.isRequestVerified,
        isCallBooking: providr.isCallBooking,
        headline: providr.headline,
        rating: providr.rating,
        languages: providr.languages,
        googleReviewsURL: providr.googleReviewsURL,
        googleProfileURL: providr.googleProfileURL,
        numberOfGoogleReviews: providr.numberOfGoogleReviews,
        numberOfGoogleRatings: providr.numberOfGoogleRatings,
        averageGoogleRating: providr.averageGoogleRating,
        topGoogleReviews: providr.topGoogleReviews,
        bottomGoogleReviews: providr.bottomGoogleReviews,
        mostRecentGoogleReviews: providr.mostRecentGoogleReviews,
        facebookURL: providr.facebookURL,
        facebookNumberOfFollowers: providr.facebookNumberOfFollowers,
        facebookNumberOfLikes: providr.facebookNumberOfLikes,

        // isRequestVerified: providr.isRequestVerified,
        // website: providr.website,
        websiteUrl: providr.websiteUrl,
        yelpTopReviews: providr.yelpTopReviews,
        yelpBottomReviews: providr.yelpBottomReviews,
        yelpProfileURL: providr.yelpProfileURL,
        yelpMostRecentReviews: providr.yelpMostRecentReviews,
        // googleReviewsURL: providr.googleReviewsURL,
        numberOfYelpRatings: providr.numberOfYelpRatings,
        averageYelpRating: providr.averageYelpRating,
        instagramProfileLink: providr.instagramProfileLink,
        numberOfInstagramFollowers: providr.numberOfInstagramFollowers,
        // healthAndSafety: providr.healthAndSafety,
        // cancellation_and_refund: providr.cancellation_and_refund,
      }).save();

      return 'location is added successfully';
    }
  }

  async importTakeLessonProvider(
    takeLessonProviderId: string,
    userId: string,
    req,
  ) {
    const alreadyImported = await this.userModel.findOne({
      takeLessonProviderId: takeLessonProviderId,
    });
    //  if(alreadyImported){
    //   return "already imported"
    //  }
    const takeLessonProvider = await this.takelessionproviderModel.findById(
      takeLessonProviderId,
    );
    const takeLessonProviderJson =
      await this.takelessonproviderjsonModel.findOne({
        providerId: takeLessonProviderId,
      });
    const takeLessonProviderReviews = await this.takelessionreviewModel.find({
      providerId: takeLessonProviderId,
    });
    const takeLessonProviderReports = await this.providerReportsModel.find({
      providerId: takeLessonProviderId,
    });
    const takeLessonProviderSubjects =
      takeLessonProvider.tutorBooking.tutorService.map((s) => s.service.name);
    console.log('takeLessonProviderSubjects', takeLessonProviderSubjects);
    const tgs = await this.TagsModel.find({
      name: { $in: takeLessonProviderSubjects },
    });
    const tagIds = tgs.map((t) => t._id.toString());
    
    const imageGallery = [];
    const videoGallery = [];
    for (let media of takeLessonProvider.gallery) {
      if (media['mediaType'] == 'IMAGE') {
        const imageUrl = 'provider/provider_gallery/' + media['mediaPath'];
        imageGallery.push(imageUrl);
      }
      if (media['mediaType'] == 'VIDEO') {
        const videoUrl = 'provider/provider_gallery/' + media['mediaPath'];
      }
    }
    console.log(imageGallery);
    const provider = await this.ProviderModel.findOne({ user: userId });
    if (!provider) {
      await this.ProviderModel.create({
        providerType: 'solo',
        provider_gallery: imageGallery,
        additionalInformation: takeLessonProvider.tagline,
        subCategoryIds: tagIds,
      });
    } else {
      (provider.providerType = 'solo'),
        (provider.provider_gallery = imageGallery);
      provider.additionalInformation = takeLessonProvider.tagline;
      provider.subCategoryIds = tagIds;
      await provider.save();
    }
    let classMinimumPrice = 0;
    if (takeLessonProvider.price.length) {
      let priceArray = [];
      priceArray = takeLessonProvider.price;
      const minPrice = priceArray.reduce((min, item) => {
        return item.price < min ? item.price : min;
      }, Infinity);
      classMinimumPrice = minPrice;
    }
    const user = await this.userModel.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          firstName: takeLessonProvider.name,
          businessName: takeLessonProvider.name,
          note: takeLessonProvider.tutorDescription,
          takeLessonProviderId: takeLessonProviderId,
          takeLessonProvider: true,
          avatarImages: 'images/' + takeLessonProvider.profileImage,
          tagline: takeLessonProvider.tagline,
          classMinimumPrice: classMinimumPrice,
          status: 'Verified',
        },
      },
    );
    const reviews = takeLessonProviderReviews.map((review) => {
      const { _id, providerId, ...rest } = review.toObject();
      return { ...rest, takelessionproviderId: providerId, providerId: userId };
    });
    
    const providerLocations = takeLessonProvider.tutorBooking.locations;
    let inpersonOrVirtual;
    if (providerLocations.length == 1) {
      inpersonOrVirtual = providerLocations.includes('ONLINE')
        ? 'Virtual'
        : 'Inperson';
    } else if (providerLocations.length > 1) {
      inpersonOrVirtual = providerLocations.includes('ONLINE')
        ? 'In-person or Online'
        : 'Inperson';
    }
    let ageGroup = {};
    if (takeLessonProvider.AgeRange.length) {
      let ageArray = {
        minMaleConsumerAge: 0,
        maxMaleConsumerAge: 0,
        minFemaleConsumerAge: 0,
        maxFemaleConsumerAge: 0,
      };
      ageArray = takeLessonProvider.AgeRange[0];
      if (ageArray.minMaleConsumerAge == 1) {
        ageGroup['month'] = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        ageGroup['year'] = Array.from(
          { length: ageArray.maxMaleConsumerAge - 2 + 1 }, // Start from 2, so subtract 2 from the total length
          (_, i) => i + 2, // Begin the sequence at 2
        );
      }
      if (ageArray.minMaleConsumerAge > 1) {
        ageGroup['month'] = [];
        ageGroup['year'] = Array.from(
          {
            length:
              ageArray.maxMaleConsumerAge - ageArray.minMaleConsumerAge + 1,
          },
          (_, i) => i + ageArray.minMaleConsumerAge,
        );
      }
    }
    for (let report of takeLessonProviderReports) {
      const subject = await this.takelessionsubjectModel.findById(
        report.subjectId,
      );
      const subjects = subject.wondrflyRefrence
        ? await this.TagsModel.find({ _id: subject.wondrflyRefrence })
        : [];
      const prices = report.profile_price.map((price) => {
        const timeInHours = parseInt(price.time) / 60; // Convert time to hours
        const pricePerHour =
          parseInt(price.price.replace(/[^0-9]/g, '')) / timeInHours;

        return {
          priceUnit: 'month',
          pricePerParticipant: parseInt(price.price.replace(/[^0-9]/g, '')),
          noOfUnits: 'unlimited',
          pricePerHour: pricePerHour,
          recurrence: 'monthly',
          priceProrated: true,
          setDefault: null,
          halfOrFullDay: null,
          title: null,
          duration: parseInt(price.time),
          noOfHours: null,
          noOfDays: null,
          addOnprices: [],
          priceType: 'weekly/monthly/Yearly',
          candace: `unlimited lessons x ${parseInt(price.time)}min lessons`,
          noOfWeeks: null,
          additionalInfo: null,
          durationType: 'mins',
        };
      });
      const program = {
        name: `${subject.name} with ${takeLessonProvider.name}`,
        type: 'Private Class',
        user: userId,
        inpersonOrVirtual: inpersonOrVirtual,
        ageGroup: ageGroup,
        specialInstructions: report.tag_line,
        prices: prices,
        isPublished: false,
        pricing: prices.length ? 'Price available' : 'No data available',
        // isFreeTrial: true,
        // offerDiscount: "",
        description: report.description,
        subCategoryIds: subjects.map((subject) => subject._id),
        // parentalSupervisionRequired: 'Parent attendance required'
      };
      await this.programModel.create(program);
    }

    if (providerLocations && providerLocations.length >= 1) {
      if (
        providerLocations.includes('PROVIDER_LOCATION') &&
        providerLocations.includes('CONSUMER_LOCATION')
      ) {
        const providerLoc =
          takeLessonProvider.tutorBooking.teacherStudio[0].location;
        const stuLoc = takeLessonProvider.tutorBooking.studentHome.location;
        if (providerLocations.includes('PROVIDER_LOCATION')) {
          const providerLoc =
            takeLessonProvider.tutorBooking.teacherStudio[0].location;
          
        }
        if (providerLocations.includes('CONSUMER_LOCATION')) {
          const providerLoc =
            takeLessonProvider.tutorBooking.studentHome.location;
          const distance = takeLessonProvider.tutorBooking.maxTravelDistance;

          const pro = await this.ProviderModel.findOneAndUpdate(
            { user: new ObjectId(userId) },
            {
              $set: {
                student_location: true,
                student_maximumTravelDistance: {
                  type: 'Point',
                  coordinates: [
                    providerLoc.coordinates.longitude,
                    providerLoc.coordinates.latitude,
                  ],
                  address: `${providerLoc.streetAddress}${','}${
                    providerLoc.city
                  }${','}${providerLoc.state}`,
                },
                address: `${providerLoc.streetAddress}${','}${
                  providerLoc.city
                }${','}${providerLoc.state}`,
                maximumTravelDistance: distance,
              },
            },
          );

        }
      } else if (providerLocations.includes('PROVIDER_LOCATION')) {
        const providerLoc =
          takeLessonProvider.tutorBooking.teacherStudio[0].location;
        
      } else if (providerLocations.includes('CONSUMER_LOCATION')) {
        const providerLoc =
          takeLessonProvider.tutorBooking.studentHome.location;
        const distance = takeLessonProvider.tutorBooking.maxTravelDistance;

        const pro = await this.ProviderModel.findOneAndUpdate(
          { user: new ObjectId(userId) },
          {
            $set: {
              student_location: true,
              student_maximumTravelDistance: {
                type: 'Point',
                coordinates: [
                  providerLoc.coordinates.longitude,
                  providerLoc.coordinates.latitude,
                ],
                address: `${providerLoc.streetAddress}${','}${
                  providerLoc.city
                }${','}${providerLoc.state}`,
              },
              maximumTravelDistance: distance,
              address: `${providerLoc.streetAddress}${','}${
                providerLoc.city
              }${','}${providerLoc.state}`,
            },
          },
        );
      }
    }

    return {
      takeLessonProviderJson: takeLessonProviderJson,
      takeLessonProvider: takeLessonProvider,
    };
  }

  async getAllSoloProvider(
    status: string,
    page_size: number,
    page_number: number,
  ) {
    const skip = (page_number - 1) * page_size;
    const match = { role: 'provider' };
    if (status) {
      match['status'] = status;
    }
    const data = await this.userModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      { $unwind: '$provider' },
      {
        $match: {
          'provider.providerType': 'solo',
        },
      },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            {
              $lookup: {
                from: 'programs',
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
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$user', '$$userId'] },
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
                programs: false,
              },
            },
            { $sort: { createdOn: -1 } },
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

  async getAllSoloProviderPrograms(
    page_size: number,
    page_number: number,
    isArchived?: string,
    isPublished?: string,
    inReview?: string,
  ) {
    const skip = (page_number - 1) * page_size;

    let match1 = {};

    if (isArchived) {
      if (isArchived == 'true') {
        match1['isArchived'] = true;
      } else if (isArchived == 'false') {
        match1['isArchived'] = false;
      }
    }

    if (isPublished) {
      if (isPublished == 'true') {
        match1['isPublished'] = true;
      } else if (isPublished == 'false') {
        match1['isPublished'] = false;
      }
    }

    if (inReview) {
      if (inReview == 'true') {
        match1['isRequestVerified'] = 'In review';
      }
    }
    const data = await this.programModel.aggregate([
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
          from: 'providers',
          localField: 'user._id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      { $unwind: '$provider' },
      {
        $match: {
          'provider.providerType': 'solo',
        },
      },
      { $match: match1 },
      {
        $facet: {
          result: [
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { createdOn: -1 } },
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

  async getSoloProgramsByProviderId(
    id: string,
    page_size?,
    page_number?,
    isArchived?: string,
    isPublished?: string,
    inReview?: string,
  ) {
    let match = { user: new ObjectId(id) };

    if (isArchived) {
      if (isArchived == 'true') {
        match['isArchived'] = true;
      } else if (isArchived == 'false') {
        match['isArchived'] = false;
      }
    }

    if (isPublished) {
      if (isPublished == 'true') {
        match['isPublished'] = true;
      } else if (isPublished == 'false') {
        match['isPublished'] = false;
      }
    }
    if (inReview) {
      if (inReview == 'true') {
        match['isRequestVerified'] = 'In review';
      }
    }
    const paginationQuery = [];
    if (page_number) {
      const skip = (Number(page_number) - 1) * Number(page_size);
      paginationQuery.push(
        { $limit: Number(page_size) + skip },
        { $skip: skip },
      );
    }

    const data = await this.programModel.aggregate([
      { $match: match },
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
        $facet: {
          result: [...paginationQuery, { $sort: { created_at: -1 } }],
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

  async searchPlaces(name, id, lat, lng) {
    console.log('name ====>>>>', name);
    console.log('lat, lng ====>>>>', lat, lng);
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'; // Correct endpoint

    // Define the request object
    const request = {
      // location: { lat: 40.745255, lng: -74.034775 },  // Coordinates for Jersey City or nearby
      location: { lat: lat, lng: lng },
      radius: 50000, // 50 km radius
      keyword: name, // Search for studios
      types: ['establishment', 'point_of_interest'], // Search for establishments
    };

    try {
      const response = await axios.get(url, {
        params: {
          location: `${request.location.lat},${request.location.lng}`, // Convert location to string
          radius: request.radius,
          keyword: request.keyword,
          type: request.types.join('|'), // Join types as a pipe-separated string
          key: 'YOUR_GOOGLE_KEY', // Replace with your actual API key
        },
      });

      const places = response.data.results;
      if (places.length === 0) {
        console.log('No places found!');
        return null;
      }

      const placeDetails = [];
      for (const place of places) {
        const placeInfo = {
          name: place.name,
          placeId: place.place_id,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
        };
        console.log('placeInfo ====>>>>', placeInfo);
        placeDetails.push(placeInfo);
        // Fetch user reviews for each place
        await this.getUserReviews(place.place_id, placeInfo, id);
      }

      return placeDetails; // Return all places' data
    } catch (error) {
      console.error('Error searching for places:', error.message);
      throw new Error('Error searching for places');
    }
  }

  async getUserReviews(placeId, placeInfo, id) {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';

    try {
      const response = await axios.get(url, {
        params: {
          place_id: placeId,
          key: 'YOUR_GOOGLE_KEY', // Replace with your actual API key
        },
      });

      const reviews = response.data.result.reviews;
      if (reviews && reviews.length > 0) {
        // Use Promise.all to handle async operations in parallel
        placeInfo.reviews = await Promise.all(
          reviews.map(async (review) => {
          }),
        );
      } else {
        placeInfo.reviews = [];
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error.message);
    }
  }

  async getGoogleRatingsByProviderId(city) {
    let lat;
    let lng;

    const ct = await this.cityModel.findById(city);
    console.log('ct ===>>>>', ct);

    if (!ct) {
      throw new Error('City Not Found');
    } else if (ct.city == 'Jersey City') {
      lat = 40.719074;
      lng = -74.050552;
    } else if (ct.city == 'Hoboken') {
      lat = 40.745255;
      lng = -74.034775;
    } else if (ct.city !== 'Jersey City' && ct.city !== 'Hoboken') {
      return 'City Not Available';
    }
    const data = await this.userModel.aggregate([
      { $match: { cityId: new ObjectId(city), role: 'provider' } },
    ]);
    // console.log('data ===>>>>',data)
    const items = data[0].result;
    // console.log('items ===>>>>',items)

    const updatedProviders = []; // Store the updated provider data
    for (let item of data) {
      console.log('item._id ===>>>', item._id);
      // Fetch user details from the UserModel using the provider's user reference (_id)
      const user = await this.ProviderModel.findOne({
        user: item._id,
        providerType: 'regular',
      }); // Using item.user to get the actual user document
      // console.log('_id ===>>>',user._id)
      // console.log('_id ===>>>',user.website)

      // Check if the user has a valid website
      if (user && user.website && user.website.trim() !== '') {
        const places = await this.searchPlaces(
          item.firstName,
          item._id,
          lat,
          lng,
        ); // Search for places using the user's first name

        if (places && places.length > 0) {
          console.log('places  ===>>>>', places);
          const googleRating = places[0].rating; // Get the rating of the first place (modify as needed)
          const numberOfGoogle = places[0].userRatingsTotal;
          const googleLink = `https://www.google.com/maps/place/?q=place_id:${places[0].placeId}`;
          // const googleLink = `https://www.google.com/maps/search/?q=${encodeURIComponent(item.firstName)}`;

          const updatedProvider = await this.ProviderModel.findOneAndUpdate(
            { user: item._id },
            {
              $set: {
                'rating.googleRating': googleRating,
                'rating.numberOfGoogle': numberOfGoogle,
                'rating.googleLink': googleLink,
              },
            },
            { new: true },
          );
          updatedProviders.push(updatedProvider); // Store the updated provider details
        } else {
          console.log(`No Google rating found for ${item.firstName}`);
        }
      } else {
        console.log(
          `User ${item.firstName} does not have a valid website, skipping rating update.`,
        );
      }
    }

    return updatedProviders; // Return updated provider details
  }


  async getReviewsByProviderId(id: string) {
   

    return 
  }

  async createWebDumpRegularProviderByCity(city, req) {
    const data = await this.userModel.aggregate([
      {
        $match: {
          cityId: new ObjectId(city),
          role: 'provider',
          status: 'Verified',
        },
      },
    ]);
    // console.log('data ===>>>>',data)
    const items = data[0].result;
    for (let item of data) {
      console.log('item._id ===>>>', item._id);
      // Fetch user details from the UserModel using the provider's user reference (_id)
      const user = await this.ProviderModel.findOne({
        user: item._id,
        providerType: 'regular',
      }); // Using item.user to get the actual user document

      // Check if the user has a valid website
      if (user && user.website && user.website.trim() !== '') {
        console.log('user ===>>>', user.website);
        await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait for 20 seconds
        this.urlService.scratch_data(user.user.toString());
        this.urlService.scratchDataByChatGpt(user.user.toString());
        this.urlService.scratchDataByGemini(user.user.toString(), req);
      } else {
        console.log(
          `User ${item.firstName} does not have a valid website, skipping create web dump.`,
        );
      }
    }

    return 'web dump create sucessfully'; // Return updated provider details
  }

  async createWebDumpChildCareProviderByCityAndStatus(city:string,status:string,is_child_care:string, req) {
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
          let pr = await this.webdumpModel.find({provider: item._id});
          if(pr.length > 5){
            console.log('web dump already created')
          }else if(pr.length < 5){
            await this.urlService.dumpDataByProviderId(item._id.toString(), req);
          }if(!pr){
            await this.urlService.dumpDataByProviderId(item._id.toString(), req);
          }
        }
      }
    return 'web dump create sucessfully';
  }

  async cleanWebDumpRegularProviderByCity(city) {
    const data = await this.userModel.aggregate([
      {
        $match: {
          cityId: new ObjectId(city),
          role: 'provider',
          status: 'Verified',
        },
      },
    ]);
    // console.log('data ===>>>>',data)
    const items = data[0].result;
    for (let item of data) {
      console.log('item._id ===>>>', item._id);
      const user = await this.ProviderModel.findOne({
        user: item._id,
        providerType: 'regular',
      });
      if (!user) {
        console.log('These User Has No Provider');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait for 20 seconds
        this.urlService.cleanDumpDataByQueue(user.user.toString());
      }
    }

    return 'web dump create sucessfully'; // Return updated provider details
  }

  async googlePlaceQueueProvider(search, id, cityId, req) {
    try {
      const city = await this.cityModel.findById(cityId);
      if (!city) {
        console.log('City not found.');
        return;
      }
      let ctyName = city.city;
      const providers = await this.placeService.findDetails(search, ctyName);
      console.log('providers ====>>>>> 1', providers);
      if (!providers) {
        console.log('No providers found.');
        return;
      }
      // console.log("Providers found:", providers);

      // console.log("City found:", city);

      const cityName = city.city.split(' ')[0].toLowerCase();
      console.log('City name:', cityName);

      const url = providers.website;
      console.log('url ====>>>> 1', url);
      if (!url) {
        console.log('No website URL found for provider.');
        return;
      }
      console.log('Provider website URL:', url);

      const existingQueue = await this.queueModel.findById({
        _id: new ObjectId(id),
      });
      if (!existingQueue) {
        console.log('Queue not found.');
        return;
      } else if (existingQueue.status === 'pending') {
        console.log('Queue in pending.');
        return;
      } else if (existingQueue.status === 'decline') {
        console.log('Queue in decline.');
        return;
      } else if (existingQueue.status === 'processed') {
        console.log('Queue already processed.');
        return;
      }
      // console.log("Existing queue:", existingQueue);

      const providerExist = await this.ProviderModel.findOne({ website: url });
      console.log('Provider existence check:', providerExist);

      if (providers) {
        if (existingQueue.status !== 'processed' && !providerExist) {
          console.log('Processing new provider creation...');

          // Prepare provider data
          const providerData = {
            firstName: providers.name,
            phoneNumber: providers.phoneNumber,
            addressLine1: providers.addressLine1,
            lat: providers.location?.lat || null,
            lng: providers.location?.lng || null,
            cityId,
            role: 'provider',
            roles: 'purpleprovider',
          };
          console.log('Prepared provider data:', providerData);

          // Create user
          const user = await this.userModel.create(providerData);
          console.log('User created:', user);

          // Create web dump
          await this.webdumpModel.create({
            url: 'googleapi',
            content: JSON.stringify(providers),
            provider: user._id,
            modifiedBy: 'google',
            source: 'google',
          });

          // Create provider entry
          await this.ProviderModel.create({
            user: user._id,
            is_child_care: true,
            isChildCare: true,
            website: providers.website,
            topGoogleReviews: providers.reviews,
            rating: {
              googleRating: providers.rating,
              googleLink: providers.mapsLink,
              numberOfGoogle: providers.totalRatings,
            },
          });

          // Add provider location
          if (providerData.lat && providerData.lng) {
            
          }

          // Add provider phone number
          if (providerData.phoneNumber) {
           
          }

          // Dump data by provider ID
          await this.urlService.dumpDataByProviderId(user._id.toString(), req);

          // Update queue status
          await this.queueModel.findByIdAndUpdate(
            existingQueue._id,
            { $set: { status: 'processed' } },
            { new: true },
          );

          console.log('Provider successfully created and data processed.');
        } else {
          console.log(
            "Provider not created. Either status is 'accepted' or provider already exists.",
          );
        }
      }
    } catch (error) {
      console.error('Error in googlePlaceQueueProvider:', error);
    }
  }

  async queueForGooglePlace(id, data, req) {
    const tags = await this.TagsModel.find({});
    // const city = await this.cityModel.findById(cityId)
    const types = [
      'Group class',
      'Private',
      'Camp',
      'Child care',
      'event',
      'Party activities',
    ];
    const prompt = `${data.urls[0]}`;
    console.log('prompt ===>>>>', prompt);
    try {
      const pr = await this.googlePlaceQueueProvider(
        prompt,
        id,
        data.cityId,
        req,
      );
      // console.log('pr ===>>>>',pr)
    } catch (e) {
      console.log(e);
    }
  }

  async createProviderByQueue(id: string, cityId: string, req) {
    const data = await this.queueModel.findById(id);
    // console.log('data ===>>>>',data)

    if (!data) {
      throw new HttpException('Queue not found', HttpStatus.BAD_REQUEST);
    } else if (data.status !== 'accepted') {
      throw new HttpException('Queue not accepted', HttpStatus.BAD_REQUEST);
    } else if (data.status === 'accepted') {
      await this.queueForGooglePlace(id, data, req);
      await this.queueModel.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: 'processed' } },
        { new: true },
      );
    }
  }

  async userMoveStaggingToWondrflyById(id) {
    const data = await this.userModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'providers',
          localField: '_id',
          foreignField: 'user',
          as: 'provider',
        },
      },
      {
        $lookup: {
          from: 'phonenumbers',
          localField: '_id',
          foreignField: 'user',
          as: 'phonenumbers',
        },
      },
      {
        $lookup: {
          from: 'provideremails',
          localField: '_id',
          foreignField: 'user',
          as: 'provideremails',
        },
      },
      {
        $lookup: {
          from: 'providerreviews',
          localField: '_id',
          foreignField: 'providerId',
          as: 'providerreviews',
        },
      },
      {
        $lookup: {
          from: 'providerinstructors',
          localField: '_id',
          foreignField: 'user',
          as: 'providerinstructors',
        },
      },
      {
        $lookup: {
          from: 'providerschedules',
          localField: '_id',
          foreignField: 'user',
          as: 'providerschedules',
        },
      },
      {
        $lookup: {
          from: 'providerlocations',
          localField: '_id',
          foreignField: 'user',
          as: 'providerlocations',
        },
      },
      {
        $lookup: {
          from: 'invitations',
          localField: '_id',
          foreignField: 'user',
          as: 'invitations',
        },
      },
      {
        $lookup: {
          from: 'programs',
          localField: '_id',
          foreignField: 'user',
          as: 'programs',
        },
      },
      {
        $lookup: {
          from: 'activities',
          let: { programIds: '$programs._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$programId', '$$programIds'], // Match activities where `programId` is in `programs._id`
                },
              },
            },
          ],
          as: 'activities',
        },
      },
      {
        $addFields: {
          programs: {
            $map: {
              input: '$programs',
              as: 'program',
              in: {
                $mergeObjects: [
                  '$$program',
                  {
                    activities: {
                      $filter: {
                        input: '$activities',
                        as: 'activity',
                        cond: {
                          $eq: ['$$activity.programId', '$$program._id'],
                        }, // Filter activities for each program
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
        $lookup: {
          from: 'temporaryprograms',
          let: { programIds: '$programs._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$programId', '$$programIds'], // Match temporary programs using program IDs
                },
              },
            },
          ],
          as: 'temporaryprograms',
        },
      },
      {
        $addFields: {
          programs: {
            $map: {
              input: '$programs',
              as: 'program',
              in: {
                $mergeObjects: [
                  '$$program',
                  {
                    temporaryPrograms: {
                      $filter: {
                        input: '$temporaryprograms',
                        as: 'temporaryProgram',
                        cond: {
                          $eq: [
                            '$$temporaryProgram.programId',
                            '$$program._id',
                          ],
                        }, // Attach temporary programs to the corresponding program
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
        $project: {
          activities: 0, // Remove the top-level `activities` field as it is already nested within `programs`
          temporaryprograms: 0, // Remove the top-level `temporaryprograms` field as it is already nested within `programs`
        },
      },
    ]);

    // return {data: data};
    console.log('data ===>>>>', data);
    return data;
  }

  async providerMoved(id) {
    const data = await this.userModel.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { moveInProduction: true } },
      { new: true },
    );

    // return {data: data};
    console.log('data ===>>>>', data);
    return data;
  }

  async createProviderByQueueAndCity(
    cityId: string,
    status: string,
    type: string,
    req,
  ) {
    const data = await this.queueModel.find({
      cityId: new ObjectId(cityId),
      status: status,
      type: type,
    });
    // console.log('data ===>>>>',data)

    if (!data) {
      throw new HttpException('Queue not found', HttpStatus.BAD_REQUEST);
    }
    if (data) {
      for (let dta of data) {
        await this.queueForGooglePlace(dta._id, dta, req);
        await this.queueModel.findByIdAndUpdate(
          { _id: new ObjectId(dta._id) },
          { $set: { status: 'processed' } },
          { new: true },
        );
      }
    }
  }

  async createProviderByZipCode(ZipCode: string, req) {
    try {
      let phone, email, location;
      const zipCodeToCityId = {
        };

      if (!zipCodeToCityId[ZipCode]) {
        throw new Error('City Not Added !!!!');
      }

      let ctyId = zipCodeToCityId[ZipCode];
      let url = `https://www.childcarenj.gov/Services/GetProviders.aspx?zipcode=${ZipCode}&county=&programName=&camp=false&center=false&home=false&rating=&programTypes=&subsidised=false&sortKey=ProgramName&sortDirection=0&pageSize=10000&currentPage=0`;

      let response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      console.log(data);

      if (data.Facilities.length) {
        for (let dta of data.Facilities) {
          const provider = await this.ProviderModel.findOne({
            website: dta.ProgramWebsiteLink,
          });
          if (!provider) {
            const user = await this.userModel.findOne({
              firstName: dta.ProgramName,
            });
            if (!user) {
              const user = await this.userModel.create({
                firstName: dta.ProgramName,
                phoneNumber: dta.ProgramPhoneNumber,
                addressLine1: `${dta.ProgramAddressStreetName}, ${dta.ProgramCity}, ${dta.ProgramCounty}`,
                role: 'provider',
                roles: 'purpleprovider',
                providerCopy: 'No',
                cityId: ctyId,
                addFrom: 'purpleInvester',
                status: 'Verified',
                stage: 'completed',
                lastModifiedBy: req.user._id,
                email: dta.ProgramEmail,
              });
              if (dta.ProgramPhoneNumber !== '') {
                
              }
              if (dta.ProgramEmail !== '') {
              
              }
              if (dta.ProgramAddressStreetName !== '') {
                const API_KEY = process.env.MAP_KEY;
              }
              await this.ProviderModel.create({
                user: user._id,
                website: dta.ProgramWebsiteLink,
                userName: dta.ProgramName,
                businessName: dta.ProgramName,
                emails: email,
                primaryPhoneNumbers: phone,
                displayPhoneNumbers: dta.ProgramPhoneNumber,
                primaryAddress: `${dta.ProgramAddressStreetName}, ${dta.ProgramCity}, ${dta.ProgramCounty}`,
                providerType: 'regular',
                is_child_care: true,
                isChildCare: true,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Error searching for providers');
    }
    return 'Provider created successfully';
  }

  async createProviderByStatusCityAndType(cityId: string,status: string,type: string,req) {
   
    const data = await this.queueModel.find({ cityId: new ObjectId(cityId), status: status, type: type });
  
    if (!data.length) {
      throw new HttpException('Queue not found', HttpStatus.BAD_REQUEST);
    }if(data.length){
      for(let dta of data){
        if (dta.status !== 'accepted'){
          throw new HttpException('Queue not accepted', HttpStatus.BAD_REQUEST);
        } else if (dta.status === 'accepted'){
          await this.queueForGooglePlace(dta._id, dta,req)
          await this.queueModel.findByIdAndUpdate(
            { _id: new ObjectId(dta._id) },
            { $set: { status: 'processed'} },
            { new: true }
          )    
        }
      }
    }
  }

  async createProvidersFromJson(file: Express.Multer.File,cityId: string,req) {
    try {
      console.log('Uploaded file received');

      if (!file || !file.buffer) {
        throw new Error('File is missing or invalid');
      }

      const fileData = file.buffer.toString('utf-8');
      const data = JSON.parse(fileData);
      console.log('Parsed JSON successfully');

      if (!data.Facilities || !Array.isArray(data.Facilities)) {
        throw new Error('Invalid JSON structure: "Facilities" array missing');
      }

      for (const dta of data.Facilities) {
        if (
          !dta.ProgramName ||
          !dta.ProgramCity ||
          !dta.ProgramWebsiteLink?.trim()
        ) {
          console.warn(
            `Skipping entry due to missing essential fields:`,
            dta.ProgramName,
          );
          continue;
        }

        const website = dta.ProgramWebsiteLink.trim();

        let existingProvider = await this.ProviderModel.findOne({
          firstName: dta.ProgramName,
          cityId: new ObjectId(cityId),
          // website: website,
        });
console.log('existingProvider ===>>>>',existingProvider)
        let user, provider;

        if (!existingProvider) {
          user = await this.userModel.create({
            firstName: dta.ProgramName,
            phoneNumber: dta.ProgramPhoneNumber || null,
            addressLine1: `${dta.ProgramAddressStreetNumber || ''} ${
              dta.ProgramAddressStreetName || ''
            }, 
                           ${dta.ProgramCity}, ${dta.ProgramCounty || ''}, ${
              dta.ProgramZipCode || ''
            }`,
            role: 'provider',
            roles: 'purpleprovider',
            providerCopy: 'No',
            cityId: cityId,
            addFrom: 'purpleInvester',
            status: 'Unverfied',
            stage: 'completed',
            webdump: false,
            lastModifiedBy: req.user._id,
            email: dta.ProgramEmail || null,
          });

          if (dta.ProgramPhoneNumber) {
            
          }

          if (dta.ProgramEmail) {
           
          }

          let Lat, Lng;
          if (dta.ProgramAddressStreetName) {
            try {
              const address = encodeURIComponent(
                `${dta.ProgramAddressStreetNumber || ''} ${
                  dta.ProgramAddressStreetName
                }, 
                ${dta.ProgramCity}, ${dta.ProgramCounty || ''}, ${
                  dta.ProgramZipCode || ''
                }`,
              );
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAP_KEY}`,
              );
              const geoData = await response.json();

              if (geoData.status === 'OK') {
                Lat = geoData.results[0].geometry.location.lat;
                Lng = geoData.results[0].geometry.location.lng;
              } else {
                console.warn(
                  `Geocoding failed for: ${dta.ProgramName}, Response:`,
                  geoData,
                );
              }
            } catch (error) {
              console.error(
                `Geocoding API error for ${dta.ProgramName}:`,
                error,
              );
            }
          }

          if (Lat && Lng) {
            
          }

          provider = await this.ProviderModel.create({
            user: user._id,
            website: website,
            userName: dta.ProgramName,
            businessName: dta.ProgramName,
            primaryAddress: `${dta.ProgramAddressStreetNumber || ''} ${dta.ProgramAddressStreetName || '' },  ${dta.ProgramCity}, ${dta.ProgramCounty || ''}, ${ dta.ProgramZipCode || '' }`,
            providerType: 'regular',
            is_child_care: true,
            isChildCare: true,
            licenseNumber: dta.LicenseNumber || null,
            languagesSpoken: dta.LanguagesSpokenByStaff || null,
            qualityRating: dta.QualityRating || null,
            agesLicensedToServe: dta.AgesLicensedToServe || null,
          });

          console.log(`Successfully added provider: ${dta.ProgramName}`);
        } 
        
      }

      return { message: 'Providers created successfully' };
    } catch (error) {
      console.error('Error processing JSON file:', error);
      throw new Error('Error creating providers from JSON');
    }
  }

  async createProviderWebDumpByCity(cityId: string,req) {
   
    const data = await this.userModel.find({ cityId: new ObjectId(cityId),"webdump" : false });
  
    if (!data.length) {
      throw new HttpException('Queue not found', HttpStatus.BAD_REQUEST);
    }if(data.length){
      for(let dta of data){
       try{
        await this.urlService.dumpDataByProviderId(dta._id.toString(), req);  
       }catch(e){
         console.log(e) 
       }
        
      }
    }
  }

  async  createWebDumpJSONProviderByCityId(city,status,is_child_care,req) {
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
        const dts = await this.dummyproviderModel.findOne({ provider: item._id });
        if (!dts) {
          try{
            await this.userModel.findByIdAndUpdate(
              { _id: new ObjectId(item._id) }, 
              { $unset:{ stage: 1 }},
              { new: true }
            );
            await this.urlService.dumpDataByProviderId(item._id.toString(), req);  
           }catch(e){
             console.log(e) 
           }
        }else if(dts){
          console.log('Already Created ====>>>>>',dts)
        }
      }
    }
  }

  async createProviderWebDumpByProviderId(id: string,req) {
   
    const data = await this.userModel.findById({ _id: new ObjectId(id)});
  
    if (!data) {
      throw new HttpException('Provider not found', HttpStatus.BAD_REQUEST);
    }if(data){
       try{
        await this.urlService.dumpDataByProviderId(data._id.toString(), req);  
       }catch(e){
         console.log(e) 
       }
    }
  }

async createWebDumpByProviderId(id,req) {
  try {

    const usr = await this.userModel.findById({ _id: new ObjectId(id) });
    if (!usr) {
      console.log('User not found.');
      return 'User Not Found';
    }
    const us = await this.userModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $unset: { stage: 1 } },
      { new: true },
    );
    const web = await this.webdumpModel.deleteMany({ provider: id });
    let cityId = usr.cityId;
    const city = await this.cityModel.findById(cityId);
    if (!city) {
      console.log('City not found.');
      return 'City Not Found';
    }
    let ctyName = city.city;
    const provider = await this.ProviderModel.findOne({ user: new ObjectId(id) });
    if (!provider) {
      console.log('Provider not found.');
      return 'Provider Not Found';
    }
    let urlsearch = provider.website;
    const providers = await this.placeService.findDetails(urlsearch, ctyName);
    console.log('providers ====>>>>> 1', providers);
    if (!providers) {
      console.log('No providers found.');
      return 'Google Not Provider Data Found';
    }
    
    const cityName = city.city.split(' ')[0].toLowerCase();
    console.log('City name:', cityName);

    const url = providers.website;
    console.log('url ====>>>> 1', url);
    if (!url) {
      console.log('No website URL found for provider.');
      return;
    }
    console.log('Provider website URL:', url);

    if (providers) {

        console.log('Processing new provider creation...');

        // Prepare provider data
        const providerData = {
          firstName: providers.name,
          phoneNumber: providers.phoneNumber,
          addressLine1: providers.addressLine1,
          lat: providers.location?.lat || null,
          lng: providers.location?.lng || null,
          // cityId,
          // role: 'provider',
          // roles: 'purpleprovider',
        };
        console.log('Prepared provider data:', providerData);

        // Create user
        const user = await this.userModel.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: providerData },
          { new: true },
        );
        console.log('User updated:', user);

        // Create web dump
        await this.webdumpModel.create({
          url: 'googleapi',
          content: JSON.stringify(providers),
          provider: user._id,
          modifiedBy: 'google',
          source: 'google',
        });

        // Create provider entry
        await this.ProviderModel.findOneAndUpdate(
          {user: id},
          {$set: {
            is_child_care: true,
            isChildCare: true,
            // website: providers.website,
            topGoogleReviews: providers.reviews,
            'rating.googleRating': providers.rating,
            'rating.googleLink': providers.mapsLink,
            'rating.numberOfGoogle': providers.totalRatings,
          } },
          { new: true },
          );

        // Add provider location
        if (providerData.lat && providerData.lng) {
          
        }

        // Add provider phone number
        if (providerData.phoneNumber) {
          
        }

        // Dump data by provider ID
        await this.urlService.dumpDataByProviderId(id.toString(), req);        
        console.log('Provider successfully created and data processed.');
      
    }
  } catch (error) {
    console.error('Error in googlePlaceQueueProvider:', error);
  }
}

}
