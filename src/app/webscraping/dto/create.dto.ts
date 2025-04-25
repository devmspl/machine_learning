import { IsDateString, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createWebscrapingDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  programId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  isChanged: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  lastChangedTime: Date;
}
