export interface userInterface {

  firstName?: string;
  lastName?: string;
  userName?: string;
  sex?: string;
  age?: number;
  dob?: string;
  email?: string;
  password?: string;
  type?: string;
  platForm?: string;
  platFormId?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  state?: string;
  city?: string;
  country?: string;
  source?: string;
  zipCode?: string;
  location?: {
    coordinates: [number, number];
  };
  stripeId?: string;
  lastLoggedIn?: Date;
  inviteBy?: string;
  isActivated?: boolean;
  lastModifiedBy?: string;
  isDeleted?: boolean;
  deletedBy?: string;
  deleteReason?: string;
  deleteReasonDetail?: string;
  deletedDate?: Date;
  createdBy?: string;
  createdByUser?: string;
  note?: string;
  averageFinalRating?: number;
  totalReviews?: number;
  notificationsOnOff?: boolean;
  isAmbassador?: boolean;
  isUserVerified?: boolean;
  isAmbassadorOn?: Date;
  role?: string | 'superadmin' | 'admin' | 'mturkers' | 'provider';
  roles?: string | 'superadmin' | 'admin' | 'mturkers' | 'purpleprovider';
  isPhoneVerified?: boolean;
  isFav?: boolean;
  browserName?: string;
  ipAddress?: string;
  osName?: string;
  loginCount?: number;
  lastLoginTime?: number;
  betaUser?: boolean;
  isPasswordSet?: boolean;
  isEmailVerified?: boolean;
  isPhoneNumberVerified?: boolean;
  createdOn?: Date;
  updatedOn?: Date;
  last_reviewed?: Date;
  next_reviewed?: Date;
  providerCopy?: string;
  reference?: boolean;
  referenceUser?: string;
  provider_reference?: string;
  loginDetails?: any;
  isInvitedBy?: string;
  testMode?: boolean;
  memeberShipUpdate?: boolean;
  defaultSaveList?: string;
  cityId?: string;
  addFrom?: string;
  moveToWondrfly?: boolean;
  status?: string | 'Unverfied' | 'Verified' | 'Archived';
  userUpdateCount?: number;
  address?: string;
  userUpdateFirstTime?: boolean;
  website?: string;
  is_deleted?: boolean;
  secondaryPhonenumber?: string;

  //////////////////////////////// FIELD'S MOVED IN PROVIDER SCHEMA ////////////////////////////////


  // fullname?: string;
  // email?: string;
  // dob?: string;
  // password?: string;
  // type?: string | 'chatgpt' | 'gemini';  
  // phone_number?: string;
  // roles?: string | 'superadmin' | 'admin' | 'mturkers' | 'purpleprovider';
  // gender?: string | 'male' | 'female';
  // websiteUrl?: string;
  // googleReviewsURL?: string;
  // numberOfGoogleReviews?: string;
  // averageGoogleRating?: string;
  // topGoogleReviews?: string[];
  // bottomGoogleReviews?: string[];
  // mostRecentGoogleReviews?: string[];
  // facebookURL?: string;
  // facebookNumberOfFollowers?: string;
  // facebookNumberOfLikes?: string;
  // yelpProfileURL?: string;
  // numberOfYelpRatings?: string;
  // averageYelpRating?: string;
  // yelpTopReviews?: string[];
  // yelpBottomReviews?: string[];
  // yelpMostRecentReviews?: string[];
  // instagramProfileLink?: string;
  // numberOfInstagramFollowers?: string;
  // location?: {
  //   coordinates: [number, number];
  // };
  // onBoardingDoneDate?: Date;
  // onBoardingDoneFrom?: any;
  // onBoardingSteps?: any;
  // sourceOfHearing?: string;
  // topThreeIssues?: string;
  // stripeToken?: string;
  // yelpBottomReviews?: boolean;
  // gender?: string | 'male' | 'female';
  // facebookId?: string;
  // googleId?: string;
  // avatarImages?: string;
  // isClaimed?: boolean;
  // stripeKey?: string;
  // personalNote?: string;
  // loginLimit?: number;
  // securityQuestion?: string;
  // answer?: string;
  // ssn?: string;
  // token?: string;
  // profileCompleteEmail?: boolean;
  // profileCompleteNotification?: boolean;
  // weeklyDate?: string;
  // resetPasswordToken?: string;
  // resetPasswordExpires?: Date;
  // totalPoints?: number;
  // parentInvitationLimit?: number;
  // guardianInvitationLimit?: number;
  // deviceToken?: string;
  // isFreeTrial?: boolean;
  // isOnBoardingDone?: boolean;
  // usercreatedOn?: Date;
  // onBoardingCount?: object;

}

export type userLoginType = Pick<userInterface, 'email' | 'password'>;
