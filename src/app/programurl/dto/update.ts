import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateProgramurlDto {
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
