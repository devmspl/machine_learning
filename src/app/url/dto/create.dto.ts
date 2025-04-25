import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum statusEnum {
  COMPLETED = 'completed',
  PENDING = 'pending',
}
export class createUrlDto {
  @IsString()
  @IsEnum(statusEnum)  
  @IsOptional()
  @ApiProperty({ default: 'pending' })
  status: string;
  
  @IsArray()
  @IsOptional()
  @ApiProperty()
  urls: string[];
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  Fromurl: string;
}
