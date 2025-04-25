import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class sessions {
  @IsOptional()
  @ApiProperty()
  sessionName: string;
  @IsOptional()
  @ApiProperty()
  sessionAddress: string;
  @IsOptional()
  @ApiProperty()
  sessionStartDate: Date;
  @IsOptional()
  @ApiProperty()
  sessionEndDate: Date;
  @IsOptional()
  @ApiProperty()
  sessionStartTime: Date;
  @IsOptional()
  @ApiProperty()
  sessionEndTime: Date;
  @IsOptional()
  @ApiProperty()
  noOfSeats: string;
  @IsOptional()
  @ApiProperty()
  instructor: string;
}

export class updateProgramSessionDto {
  @IsOptional()
  @ApiProperty()
  sessions: sessions;
}
