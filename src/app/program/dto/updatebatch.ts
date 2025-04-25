import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class batches {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  startDate: Date;

  @IsOptional()
  @ApiProperty()
  endDate: Date;

  @IsOptional()
  @ApiProperty()
  startTime: Date;

  @IsOptional()
  @ApiProperty()
  endTime: Date;

  @IsOptional()
  @ApiProperty({ default: false })
  isFree: boolean;
  @IsOptional()
  @ApiProperty()
  pricePerParticipant: string;

  @IsOptional()
  @ApiProperty()
  instructor: string;

  @IsOptional()
  @ApiProperty()
  numberOfSeats: string;

  @IsOptional()
  @ApiProperty()
  location: string;
}

export class updateProgramBatchDto {
  @IsOptional()
  @ApiProperty()
  batches: batches;
}
