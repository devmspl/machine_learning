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

export class createDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  cityId: string;

  // @IsArray()
  // @IsOptional()
  // @ApiProperty({ type: [urls] })
  // urls: [urls];

  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  startedBy: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'pending' })
  status: 'pending' | 'accepted' | 'decline' | 'processed' | string;

}
