import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createProgramurlDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'pending' })
  status: 'pending' | 'accepted' | 'decline' | 'processed' | string;

}

export class createMultipleProgramurlDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  userId: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  urls: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'pending' })
  status: 'pending' | 'accepted' | 'decline' | 'processed' | string;

}