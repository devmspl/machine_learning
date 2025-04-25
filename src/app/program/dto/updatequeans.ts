import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class questionAndAnswer {
  @IsOptional()
  @ApiProperty()
  question: string;
  @IsOptional()
  @ApiProperty()
  answer1: string;
  @IsOptional()
  @ApiProperty()
  answer2: string;
  @IsOptional()
  @ApiProperty()
  other: string;
}

export class updateProgramQUeAnsDto {
  @IsOptional()
  @ApiProperty()
  questionAndAnswer: questionAndAnswer;
}
