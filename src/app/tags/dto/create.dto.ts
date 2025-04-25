import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createTagDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  categoryIds: string[];

  @IsOptional()
  @ApiProperty()
  image: string;

  @IsOptional()
  @ApiProperty()
  logo: string;

  @IsOptional()
  @ApiProperty()
  pattern: string;

  @IsOptional()
  @ApiProperty()
  icon: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  programCount: number;

  @IsOptional()
  @ApiProperty()
  covers: string[];

  @IsOptional()
  @ApiProperty({ default: true })
  isActivated: boolean;
}
