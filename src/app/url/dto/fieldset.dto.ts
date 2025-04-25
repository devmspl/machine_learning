import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class createFieldSetDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    businessName: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    emails: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    PhoneNumbers: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    primaryPhoneNumbers: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    address: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    primaryAddress: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    categories: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    subCategory: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    websiteUrl: number;

  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    instructor: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    instructorImages: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    providePrivateInstruction: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    provideInHomeInstruction: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    provideBirthdaySpecificServices: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    providePartyServices: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    provideTransportServicesToAndFromTheVenue: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    earlyDrop_off_LatePick_up: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    activityTypes: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    privateVsGroup: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    inpersonOrVirtual: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    indoorOrOutdoor: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    description: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    skillGroups: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    gmb: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    teamSize: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    isChildCare: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    merchantVerified: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    isAssociate: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    govtIdUrl: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    govtIdNote: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    healthAndSafety: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    logo: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    cancellation_and_refund: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    cycle_time: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    proof_reader_notes: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    exceptionDates: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    joiningLink: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    city: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    maximumTravelDistance: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    about: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    bio: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    activeStatus: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    reviews: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    awards: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    taxNumber: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    sourceUrl: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    providerType: number;



    @IsNumber()
    @IsOptional()
    @ApiProperty()
    provider_video: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    additionalInformation: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    is_child_care: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    is_event: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    isVerified: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    isRequestVerified: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    isCallBooking: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    headline: number;
  
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    languages: number;
  
}
