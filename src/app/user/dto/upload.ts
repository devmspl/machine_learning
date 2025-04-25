import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @IsObject()
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
