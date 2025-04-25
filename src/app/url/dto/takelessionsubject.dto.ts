import { IsString, IsOptional, IsBoolean } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateTakeLessionSubjectDto {
  
    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty()
    description: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    source: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    takelessioncategory: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty()
    url: string;  
  
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ default: false })
    isPopular: boolean;  
  
    @IsOptional()
    @IsString()
    @ApiProperty()
    notes: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    admin_notes: string;
  
  }


  