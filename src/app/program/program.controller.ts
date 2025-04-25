import {
  AuthGuards,
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { access_token_payload } from 'src/global/swagger';
import { createProgramDto } from './dto/create.dto';
import { updateProgramDto } from './dto/update';
import { updateProgramBatchDto } from './dto/updatebatch';
import { updateProgramQUeAnsDto } from './dto/updatequeans';
import { updateProgramSessionDto } from './dto/updateSession';
import { ProgramService } from './program.service';

class programSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cityId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  changeDetection?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  isArchived?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  verifiedstatus?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  programType?: string;
}

class programLocationUpdateDto {
  @ApiProperty({ required: false })
  // @IsString()
  @IsOptional()
  multiLocations: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  user?: string;
}

@ApiTags('program')
@Controller('program')
export class ProgramController {
  private readonly logger = new Logger(ProgramController.name);

  constructor(private readonly programService: ProgramService) {}
  @Post('/create')
  @ResponseMessage('Provider Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async create(@Body() model: createProgramDto) {
    this.logger.log('[service:program:create]');
    const data = await this.programService.createProgram(model);
    return data;
  }

  @Get('/getById/:id')
  @ResponseMessage('Program fetched')
  @UseInterceptors(ResponseInterceptor)
  async getById(@Param('id') id: string) {
    this.logger.log('[service:program:getById]');
    const data = await this.programService.getById(id);
    return data;
  }

  @Get('/getByUserId/:id')
  @ResponseMessage('Program Get By User Fetched')
  @UseInterceptors(ResponseInterceptor)
  async getByUser(
    @Param('id') id: string,
    @Query('archived') archived: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:program:getByUserId]');
    const data = await this.programService.getByUser(
      id,
      archived,
      page_size,
      page_number,
    );
    return data;
  }

  @Get('/getAllPrograms')
  @ResponseMessage('Programs Fetched All Sucessfully')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async getAllProvider(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
    @Req() req,
  ) {
    this.logger.log('[service:provider:getAllProvider]');
    const data = await this.programService.getAllPrograms(
      page_size,
      page_number,
      req,
    );
    return data;
  }

  @Delete('/remove/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  remove(@Param('id') id: string) {
    this.logger.log('[service:provider:remove]');
    const data = this.programService.remove(id);
    return data;
  }

  @Put('/update/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  update(@Param('id') id: string, @Body() model: updateProgramDto, @Req() req) {
    this.logger.log('[service:provider:update]');
    const data = this.programService.update(id, model, req);
    return data;
  }

  @Put('/updateProgramBatch/:id/:BatchId')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  updateProgramBatch(
    @Param('id') id: string,
    @Param('BatchId') BatchId: string,
    @Body() model: updateProgramBatchDto,
    @Req() req,
  ) {
    this.logger.log('[service:provider:updateProgramBatch]');
    const data = this.programService.updateProgramBatch(
      id,
      BatchId,
      model,
      req,
    );
    return data;
  }

  @Put('/updateProgramSession/:id/:SessionId')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  updateProgramSession(
    @Param('id') id: string,
    @Param('SessionId') SessionId: string,
    @Body() model: updateProgramSessionDto,
    @Req() req,
  ) {
    this.logger.log('[service:provider:updateProgramSession]');
    const data = this.programService.updateProgramSession(
      id,
      SessionId,
      model,
      req,
    );
    return data;
  }

  @Put('/updateProgramQuestionAndAnswer/:id/:QueAnsId')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  updateProgramQuestionAndAnswer(
    @Param('id') id: string,
    @Param('QueAnsId') QueAnsId: string,
    @Body() model: updateProgramQUeAnsDto,
    @Req() req,
  ) {
    this.logger.log('[service:provider:updateProgramQuestionAndAnswer]');
    const data = this.programService.updateProgramQuestionAndAnswer(
      id,
      QueAnsId,
      model,
      req,
    );
    return data;
  }

  @Get('/search')
  @ResponseMessage('Programs Search Successfully')
  @UseInterceptors(ResponseInterceptor)
  async search(
    @Query() model: programSearchDto,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:provider:getAllProvider]');
    const data = await this.programService.search(
      model.cityId,
      model.user,
      model.changeDetection,
      model.isArchived,
      model.verifiedstatus,
      page_size,
      page_number,
      model.programType,
    );
    return data;
  }
  

  @Get('/createDuplicateById/:id')
  @ResponseMessage('Create Duplicate Program By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createDuplicateById(@Param('id') id: string) {
    this.logger.log('[service:program:createDuplicateById]');
    const data = await this.programService.createDuplicateById(id);
    return data;
  }

  @Get('/getProgramDataFromUrl')
  @ResponseMessage('Create Duplicate Program By url Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getProgramDataFromUrl(
    @Query('url') url: string,
    @Query('providerId') providerId: string,
  ) {
    this.logger.log('[service:program:getProgramDataFromUrl]');
    const data = await this.programService.getProgramDataFromUrl(
      url,
      providerId,
    );
    return data;
  }

  @Get('/getTempProgramToWondrflyProgramChanges/:id')
  @ResponseMessage('Create Duplicate Program By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTempProgramToWondrflyProgramChanges(@Param('id') id: string) {
    this.logger.log('[service:program:getTempProgramToWondrflyProgramChanges]');
    const data =
      await this.programService.getTempProgramToWondrflyProgramChanges(id);
    return data;
  }

  @Get('/getUrlFromXml')
  @ResponseMessage('Create Duplicate Program By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async fetchAndParseSitemap(@Query('url') url: string) {
    this.logger.log('[service:program:fetchAndParseSitemap]');
    const data = await this.programService.fetchAndParseSitemap(url);
    return data;
  }

  @Get('/getMissingData/:id')
  @ResponseMessage('Missing Data Get Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getMissingData(
    @Param('id') id: string,
    @Query('missingFields') missingFields: string,
  ) {
    this.logger.log('[service:program:getMissingData]');
    const data = await this.programService.getMissingData(id, missingFields);
    return data;
  }

  @Put('/updateProgramLocation/:id')
  @ResponseMessage('Update Program By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateProgramLocation(
    @Param('id') id: string,
    @Query() model: programLocationUpdateDto,
  ) {
    this.logger.log('[service:program:updateProgramLocation]');
    const data = await this.programService.updateProgramLocation(id, model);
    return data;
  }

  @Get('/searchByName')
  @ResponseMessage('Program Search By Name Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async searchByName(
    @Query('name') name: string,
    @Query('provider') provider: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:program:getByUserId]');
    const data = await this.programService.searchByName(
      name,
      provider,
      page_size,
      page_number,
    );
    return data;
  }

  @Get('/addChangeDetection')
  @ResponseMessage('All Programs Add Change Detection Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async addChangeDetection() {
    this.logger.log('[service:program:getByUserId]');
    const data = await this.programService.addChangeDetection();
    return data;
  }
}
