import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// class urls {
//   @IsOptional()
//   @IsString()
//   @ApiProperty()
//   url: string;
//   @IsOptional()
//   @IsString()
//   @ApiProperty({ default: 'pending' })
//   status: 'pending' | 'accepted' | 'decline' | string;
// }

export class createQueueDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  cityId: string;

  // @IsArray()
  // @IsOptional()
  // @ApiProperty({ type: [urls] })
  // urls: [urls];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  urls: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  addProvider: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 5 })
  urls_limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'pending' })
  status: 'pending' | 'accepted' | 'decline' | 'processed' | string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  admin_notes: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  notes: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'manual' })
  type: 'manual' | 'chatgpt' | 'gemini' | string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  is_deleted: boolean;
}
