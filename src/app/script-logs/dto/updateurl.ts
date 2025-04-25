import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class urls {
  @IsString()
  @IsOptional()
  @ApiProperty()
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  status: 'pending' | 'accepted' | 'decline' | string;
}

export class updateQueueUrlDto {
  @IsObject()
  @IsOptional()
  @ApiProperty()
  urls: urls;
}
