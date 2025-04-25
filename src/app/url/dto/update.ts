import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum statusEnum {
  COMPLETED = 'completed',
  PENDING = 'pending',
}
export class updateUrlDto {
  @IsString()
  @IsEnum(statusEnum)  
  @IsOptional()
  @ApiProperty()
  status: string;
  
  @IsArray()
  @IsOptional()
  @ApiProperty()
  urls: string[]; 
}
