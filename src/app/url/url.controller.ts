import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { createUrlDto } from './dto/create.dto';
import {
  ApiHeader,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { createFieldSetDto } from './dto/fieldset.dto';
import { access_token_payload } from 'src/global/swagger';
import { UpdateTakeLessionCategoryDto } from './dto/takelessioncategory.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateTakeLessionSubjectDto } from './dto/takelessionsubject.dto';
import { City } from './dto/organizer.dto';
import { query } from 'express';

class takelessioncategorySearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;
}

class takelessionsubjectSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

class eventSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;
}

class takelessionsubjectAllDto {
  @ApiProperty({ required: false })
  @IsString()
  page_number: string;

  @ApiProperty({ required: false })
  @IsString()
  page_size: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subjectId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reports?: string;
}

class eventLinkSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  source_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  event_detail?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  is_published?: string;
}

class eventLinkStatusDto {
  @ApiProperty({})
  @IsString()
  @IsOptional({})
  status?:
    | string
    | 'unverified'
    | 'verified'
    | 'internal_proofreading'
    | 'final_proofreading'
    | 'archived';
}

class eventFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  source: string;
}

@ApiTags('url')
@Controller('url')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post('/createUrl')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createUrl(@Query('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.createUrl(url);
    return data;
  }

  @Delete('/deleteUrl/:id')
  @ResponseMessage('Urls Deleted Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async deleteUrl(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.deleteUrl(id);
    return data;
  }

  @Post('/scratch_data/:id')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratch_data(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratch_data(id);
    return data;
  }

  @Get('/getSocialMediaLink/:id')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getSocialMediaLink(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getSocialMediaLink(id);
    return data;
  }

  @Get('/getDumpDataByQueueId/:id')
  @ResponseMessage('Dump Data Fetch Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getDumpDataByQueueId(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getDumpDataByQueueId(id);
    return data;
  }

  @Get('/cleanDumpDataById/:id')
  @ResponseMessage('Clean Dump Data Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanDumpDataById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.cleanDumpDataById(id);
    return data;
  }

  @Get('/cleanCategoryAndSubcategory/:id')
  @ResponseMessage('Clean Category And Subcategory Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanCategoryAndSubcategory(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.cleanCategoryAndSubcategory(id);
    return data;
  }

  @Get('/cleanDumpDataByQueue/:id')
  @ResponseMessage('Clean Dump Data Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanDumpDataByQueue(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.cleanDumpDataByQueue(id);
    return data;
  }

  @Get('/getCleanDumpDataByQueueId/:id')
  @ResponseMessage('Clean Dump Get By Queue Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getCleanDumpDataByQueueId(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getCleanDumpDataByQueueId(id);
    return data;
  }

  @Get('/setProviderDataFromFinal/:id')
  @ResponseMessage('Provider update Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async setProviderDataFromFinal(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.setProviderDataFromFinal(id);
    return data;
  }

  @Post('/updateDummyProviderLikesAndFollowers')
  @ResponseMessage('Dummy provider created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateDummyProviderLikesAndFollowers(@Query('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.updateDummyProviderLikesAndFollowers(id);
    return data;
  }

  @Post('/updateDummyProvider')
  @ResponseMessage('Dummy provider updated Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateDummyProvider(@Query('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.updateDummyProvider(id);
    return data;
  }

  @Get('/getDummyProviderByQueueId/:id')
  @ResponseMessage('Dump Provider Get By Queue Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getDummyProviderByQueueId(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getDummyProviderByQueueId(id);
    return data;
  }

  @Post('/createFieldSet')
  @ResponseMessage('FielSet Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createFieldSet(@Body() model: createFieldSetDto) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.createFieldSet(model);
    return data;
  }

  @Get('/getDataByHtml/:fieldSetId/:DumpId')
  @ResponseMessage('Dump Provider Get By Queue Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getDataByHtml(
    @Param('fieldSetId') fieldSetId: string,
    @Param('DumpId') DumpId: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getDataByHtml(fieldSetId, DumpId);
    return data;
  }

  @Post('/scratchDataByChatGpt/:id')
  @ResponseMessage('Dump Created By CHATGPT Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchDataByChatGpt(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchDataByChatGpt(id);
    return data;
  }

  @Post('/scratchDataByGemini/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Dump Created By CHATGPT Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchDataByGemini(@Param('id') id: string, @Req() req) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchDataByGemini(id, req);
    return data;
  }

  @Post('/dumpDataByProviderId/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Dump Created By CHATGPT Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async dumpDataByProviderId(@Param('id') id: string, @Req() req) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.dumpDataByProviderId(id, req);
    return data;
  }

  @Post('/dumpDataByCityId/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Dump Created By CHATGPT Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async dumpDataByCityId(@Param('id') id: string, @Req() req) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.dumpDataByCityId(id, req);
    return data;
  }

  @Get('/checkDataExistOrNot/:fieldSetId/:DumpId')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Check Data Exist Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async checkDataExistOrNot(
    @Param('fieldSetId') fieldSetId: string,
    @Param('DumpId') DumpId: string,
    @Req() req,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.checkDataExistOrNot(
      fieldSetId,
      DumpId,
      req,
    );
    return data;
  }

  @Post('/cleanByPython/:id')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanByPython(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.cleanByPython(id);
    return data;
  }

  @Post('/scratchUrl/:url')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchUrl(@Param('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchUrl(url);
    return data;
  }

  @Get('/refreshscratch_data/:id/:source')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async refreshscratch_data(
    @Param('id') id: string,
    @Param('source') source: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.refreshscratch_data(id, source);
    return data;
  }

  @Delete('/removeWebDumpById/:id')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async removeWebDumpById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.removeWebDumpById(id);
    return data;
  }

  @Get('/refreshWebDumpById/:id')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async refreshWebDumpById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.refreshWebDumpById(id);
    return data;
  }

  @Get('/CheckProviderOrProgram/:id')
  @ResponseMessage('Urls Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async CheckProviderOrProgram(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.CheckProviderOrProgram(id);
    return data;
  }

  @Get('/getAllWebsiteImages/:id')
  @ResponseMessage('Get All Website Images Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllWebsiteImages(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllWebsiteImages(id);
    return data;
  }

  @Get('/scratchDataByUrl/:url')
  @ResponseMessage('Data Scratch By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchDataByUrl(@Param('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchDataByUrl(url);
    return data;
  }

  @Get('/getTakelessionproviderById/:id')
  @ResponseMessage('Take Lession Provider Get By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakelessionproviderById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakelessionproviderById(id);
    return data;
  }

  @Get('/getAllTakelessionprovider')
  @ResponseMessage('Take Lession All provider Get Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllTakelessionprovider(
    @Query() model: takelessionsubjectAllDto,
    // @Query('page_number', ParseIntPipe) page_number: number,
    // @Query('page_size', ParseIntPipe) page_size: number,
    // @Query('subjectId') subjectId?: string
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllTakelessionprovider(
      model.page_number,
      model.page_size,
      model.subjectId,
      model.reports,
    );
    return data;
  }

  @Delete('/removeTakelessionproviderById/:id')
  @ResponseMessage('Take Lession All provider Get Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async removeTakelessionproviderById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.removeTakelessionproviderById(id);
    return data;
  }

  @Get('/getPopularTagWithImageByCategoryUrl/:url')
  @ResponseMessage('Get All Popular Tag By Category Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getPopularTagWithImageByCategoryUrl(@Param('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getPopularTagWithImageByCategoryUrl(url);
    return data;
  }

  @Get('/getAllTagByCategoryUrl/:url')
  @ResponseMessage('Get All Popular Tag By Category Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllTagByCategoryUrl(@Param('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllTagByCategoryUrl(url);
    return data;
  }

  @Get('/getTakelessionCategoryById/:id')
  @ResponseMessage('Category Get By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakelessionCategoryById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakelessionCategoryById(id);
    return data;
  }

  @Get('/getAllTakelessionCategory')
  @ResponseMessage('Get All Category Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllTakelessionCategory() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllTakelessionCategory();
    return data;
  }

  @Put('/TakelessionCategoryupdate/:id')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('category updated sucessfully.')
  @UseInterceptors(ResponseInterceptor)
  async TakelessionCategoryupdate(
    @Param('id') id: string,
    @Body() model: UpdateTakeLessionCategoryDto,
  ) {
    const data = await this.urlService.TakelessionCategoryupdate(id, model);
    return data;
  }

  @Get('/searchTakeLessionCategory')
  @ResponseMessage('Search TakeLession Category Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async searchTakeLessionCategory(
    @Query() model: takelessioncategorySearchDto,
  ) {
    this.logger.log('[service:provider:getAllProvider]');
    const data = await this.urlService.searchTakeLessionCategory(model.name);
    return data;
  }

  @Get('/getTakelessionSubjectById/:id')
  @ResponseMessage('Take Lession Subject Get By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakelessionSubjectById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakelessionSubjectById(id);
    return data;
  }

  @Get('/getAllTakelessionSubject')
  @ResponseMessage('Get All Take lession Subject Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllTakelessionSubject(
    // @Query() model: takelessionsubjectAllDto
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('categoryId') categoryId?: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllTakelessionSubject(
      page_number,
      page_size,
      categoryId,
    );
    return data;
  }

  @Get('/getTakelessionCategoryBySubject')
  @ResponseMessage('Get All Take lession Subject Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakelessionCategoryBySubject(
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('id') id: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakelessionCategoryBySubject(
      page_number,
      page_size,
      id,
    );
    return data;
  }
  @Get('/getTakelessionAllSubject')
  @ResponseMessage('Get All Take lession Subject Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakelessionAllSubject() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakelessionAllSubject();
    return data;
  }
  @Put('/TakelessionSubjectupdate/:id')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('subject updated sucessfully.')
  @UseInterceptors(ResponseInterceptor)
  async TakelessionSubjectupdate(
    @Param('id') id: string,
    @Body() model: UpdateTakeLessionSubjectDto,
  ) {
    const data = await this.urlService.TakelessionSubjectupdate(id, model);
    return data;
  }

  @Get('/searchTakeLessionSubject')
  @ResponseMessage('Search TakeLession Subject Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async searchTakeLessionSubject(@Query() model: takelessionsubjectSearchDto) {
    this.logger.log('[service:provider:getAllProvider]');
    const data = await this.urlService.searchTakeLessionSubject(
      model.name,
      model.categoryId,
    );
    return data;
  }

  @Get('/getProviderProfile/:url')
  @ResponseMessage('Get All Provider Profile By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getProviderProfile(@Param('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getProviderProfile(url);
    return data;
  }

  @Get('/getTakeLessionProviderProfileById/:id')
  @ResponseMessage('Get All Provider Profile By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakeLessionProviderProfileById(
    @Param('id') id: string,
    @Query('url') url: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakeLessionProviderProfileById(
      id,
      url,
    );
    return data;
  }

  @Get('/getReviewsByProviderId/:id')
  @ResponseMessage('Get All Provider reviews Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getReviewsByProviderId(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getReviewsByProviderId(id);
    return data;
  }

  @Get('/allProviders')
  @ResponseMessage('Get All Provider Profile By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async allProviders() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.allProviders();
    return data;
  }

  @Get('/allSubjectProviders')
  @ResponseMessage('Get All Subject Provider Profile By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async allSubjectProviders() {
    // @Query('sub') sub: string,
    this.logger.log('[service:url:create]');
    const data = await this.urlService.allSubjectProviders();
    return data;
  }

  @Get('/createSubjectProvidersByJson')
  @ResponseMessage('Get All Subject Provider Profile By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createSubjectProvidersByJson() {
    // @Query('sub') sub: string,
    this.logger.log('[service:url:create]');
    const data = await this.urlService.createSubjectProvidersByJson();
    return data;
  }

  @Get('/getTakeLessonsSubjectsProviderById/:id')
  @ResponseMessage('Get All Subject Provider Profile By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getTakeLessonsSubjectsProviderById(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getTakeLessonsSubjectsProviderById(id);
    return data;
  }

  @Get('/updateAwardAndAffiliation')
  @ResponseMessage('Get All Provider Update Award And Affiliation Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateAwardAndAffiliation() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.updateAwardAndAffiliation();
    return data;
  }

  @Get('/providerReport')
  @ResponseMessage('Get All Provider Report Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async providerReport(
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.providerReport(page_number, page_size);
    return data;
  }

  @Get('/scrapProviderPrice')
  @ResponseMessage('Get All Provider Price By Profile Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scrapProviderPrice() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scrapProviderPrice();
    return data;
  }

  @Get('/reportAnalytics')
  @ResponseMessage('Get All Category Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async reportAnalytics() {
    this.logger.log('[service:url:reportAnalytics]');
    const data = await this.urlService.reportAnalytics();
    return data;
  }

  @Get('/subjectReportAnalytics')
  @ResponseMessage('Get All Category Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async subjectReportAnalytics() {
    this.logger.log('[service:url:subjectReportAnalytics]');
    const data = await this.urlService.subjectReportAnalytics();
    return data;
  }

  @Get('/categorySubjectReportAnalytics')
  @ResponseMessage('Get All Category Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async categorySubjectReportAnalytics() {
    this.logger.log('[service:url:categorySubjectReportAnalytics]');
    const data = await this.urlService.categorySubjectReportAnalytics();
    return data;
  }

  // @Get('/getAllProgramDumpByProviderId/:id')
  // @ResponseMessage('Get All Program Dump Sucessfully')
  // @UseInterceptors(ResponseInterceptor)
  // async getAllProgramDumpByProviderId(
  //   @Param('id') id: string,
  // ) {
  //   this.logger.log('[service:url:getAllProgramDumpByProviderId]');
  //   const data = await this.urlService.getAllProgramDumpByProviderId(id);
  //   return data;
  // }

  // @Get('/getProgramDataByContentById/:id')
  // @ResponseMessage('Get All Category Sucessfully')
  // @UseInterceptors(ResponseInterceptor)
  // async getProgramDataByContentById(
  //   @Param('id') id: string,
  //  ) {
  //   this.logger.log('[service:url:getProgramDataByContentById]');
  //   const data = await this.urlService.getProgramDataByContentById(id);
  //   return data;
  // }

  @Get('/updateDummyProviderScript')
  @ResponseMessage('Update All Dummy Provider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateDummyProviderScript() {
    this.logger.log('[service:url:updateDummyProviderScript]');
    const data = await this.urlService.updateDummyProviderScript();
    return data;
  }

  @Get('/searchTakelessionprovider')
  @ResponseMessage('Take Lession provider Get Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async searchTakelessionprovider(
    @Query('name') name?: string,
    @Query('institution') institution?: string,
    @Query('subjects') subjects?: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.searchTakelessionprovider(
      name,
      institution,
      subjects,
    );
    return data;
  }

  @Get('/checkProgramOrProviderDataByProviderId/:providerId')
  @ResponseMessage(
    'Update All Program And Provider Data Avilibilty Sucessfully',
  )
  @UseInterceptors(ResponseInterceptor)
  async checkProgramOrProviderDataByProviderId(
    @Param('providerId') providerId: string,
  ) {
    this.logger.log('[service:url:checkProgramOrProviderDataByProviderId]');
    const data = await this.urlService.checkProgramOrProviderDataByProviderId(
      providerId,
    );
    return data;
  }

  @Get('/scratchEventLinks/:city/:date')
  @ResponseMessage('Events Links Scratch By Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchEventLinks(
    @Param('city') city: string,
    @Param('date') date: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchEventLinks(city, date);
    return data;
  }

  @Get('getEventsLinksByDateAndCity/:source_id')
  async getEventsLinksByDateAndCity(
    @Param('source_id') source_id: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('keyword') keyword: string,
  ) {
    try {
      const events = await this.urlService.getEventsLinksByDateAndCity(
        source_id,
        start_date,
        end_date,
        keyword,
      );
      return { events };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/event-details')
  async getEventDetails(@Query('id') id: string) {
    if (!id) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const eventDetails = await this.urlService.fetchEventDetails(id);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/event-details')
  async updateEventDetails(@Query('id') id: string) {
    if (!id) {
      throw new HttpException('Event ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const updatedEventDetails = await this.urlService.updateEventDetails(id);
      return updatedEventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to update event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/createAllEventsDateWise')
  async createAllEventsDateWise(
    @Query('date') date: string,
    @Query('source_id') source_id: string,
  ) {
    if (!date) {
      throw new HttpException('Date is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const eventDetails = await this.urlService.createAllEventsDateWise(
        date,
        source_id,
      );
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getAllEventsLinksDateAndCityWise')
  async getAllEventsLinksDateAndCityWise(
    @Query('city') city: string,
    @Query('source') source: string,
    @Query('Fromdate') Fromdate: string,
    @Query('Todate') Todate: string,
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
  ) {
    if (!Fromdate || !Todate) {
      throw new HttpException(
        'From and To Date is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const eventDetails =
        await this.urlService.getAllEventsLinksDateAndCityWise(
          city,
          source,
          Fromdate,
          Todate,
          page_number,
          page_size,
        );
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getEventsLinkById/:id')
  async getEventsLinkById(@Param('id') id: string) {
    try {
      const eventDetails = await this.urlService.getEventsLinkById(id);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event link details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getAllEventsDetailDateAndCityWise')
  async getAllEventsDetailDateAndCityWise(
    @Query('city') city: string,
    @Query('date') date: string,
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
  ) {
    if (!date) {
      throw new HttpException('Date is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const eventDetails =
        await this.urlService.getAllEventsDetailDateAndCityWise(
          city,
          date,
          page_number,
          page_size,
        );
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getEventsDetailById/:id')
  async getEventsDetailById(@Param('id') id: string) {
    try {
      const eventDetails = await this.urlService.getEventsDetailById(id);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getEventsDetailByLinkId/:id')
  async getEventsDetailByLinkId(@Param('id') id: string) {
    try {
      const eventDetails = await this.urlService.getEventsDetailByLinkId(id);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/addCityIdInEventLinkScript')
  async addCityIdInEventLinkScript(@Query('city') city: string) {
    if (!city) {
      throw new HttpException('City is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const eventDetails = await this.urlService.addCityIdInEventLinkScript(
        city,
      );
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/addEventLinkIdInEventsScript')
  async addEventLinkIdInEventsScript() {
    try {
      const eventDetails = await this.urlService.addEventLinkIdInEventsScript();
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/addProviderIdInEventsScript')
  async addProviderIdInEventsScript() {
    try {
      const eventDetails = await this.urlService.addProviderIdInEventsScript();
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/removeEventsLinksById/:id')
  async removeEventsLinksById(@Param('id') id: string) {
    try {
      const eventDetails = await this.urlService.removeEventsLinksById(id);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/removeEventsLinksDateAndCityWise')
  async removeEventsLinksDateAndCityWise(
    @Query('city') city: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new HttpException('Date is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const eventDetails =
        await this.urlService.removeEventsLinksDateAndCityWise(city, date);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/removeEventsById/:id')
  async removeEventsById(@Param('id') id: string) {
    try {
      const eventDetails = await this.urlService.removeEventsById(id);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/removeEventsDateAndCityWise')
  async removeEventsDateAndCityWise(
    @Query('city') city: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new HttpException('Date is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const eventDetails = await this.urlService.removeEventsDateAndCityWise(
        city,
        date,
      );
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/script')
  async script() {
    try {
      const eventDetails = await this.urlService.script();
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/scratchEventDetailByUrl')
  async scratchEventDetailByUrl(@Query('url') url: string) {
    try {
      const eventDetails = await this.urlService.scratchEventDetailByUrl(url);
      return eventDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/fetch')
  async fetchEventLinks(@Query('cityId') cityId: string) {
    try {
      const result = await this.urlService.fetchAndSaveEventLinks(cityId);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch event links',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/extract')
  async extractEventData(@Query('name') eventLink: string) {
    try {
      const result = await this.urlService.extractDataFromEventLink(eventLink);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/fetch-meetup/:source_id')
  async fetchMeetupEventLinks(
    @Param('source_id') source_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!source_id) {
      throw new HttpException(
        'source_id parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.urlService.fetchAndSaveMeetupEventLinks(
        source_id,
        startDate,
        endDate,
      );
      return result;
    } catch (error) {
      console.error('Error in fetchMeetupEventLinks:', error);
      throw new HttpException(
        'Failed to fetch meetup event links: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/update-slugs')
  async updateEventLinksWithoutSlug(@Query('source') source: string) {
    if (!source) {
      throw new HttpException(
        'source query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.urlService.updateEventLinksWithoutSlug(source);
      return result;
    } catch (error) {
      console.error('Error in updateEventLinksWithoutSlug:', error);
      throw new HttpException(
        'Failed to update event links without slugs: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/createMeetupEventDetailById/:id')
  async createMeetupEventDetailById(@Param('id') id: string) {
    try {
      const result = await this.urlService.createMeetupEventDetailById(id);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/createMeetupAllEventDetailByCityAndDate')
  async createMeetupAllEventDetailByCityAndDate(
    @Query('city') city: string,
    @Query('Fromdate') Fromdate: string,
    @Query('Todate') Todate: string,
  ) {
    try {
      // const result = await this.urlService.createMeetupAllEventDetailByCityAndDate( city,Fromdate,Todate );
      // return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/cronToCreateNextEvents')
  async cronToCreateNextEvents() {
    try {
      const result = await this.urlService.cronToCreateNextEvents();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCron')
  async startCron() {
    try {
      const result = await this.urlService.startCron();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/searchEvents')
  async searchEvents(@Query() model: eventSearchDto) {
    try {
      const result = await this.urlService.searchEvents(model.name, model.city);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/cronToCreateNextEventsFamily')
  async cronToCreateNextEventsFamily() {
    try {
      const result = await this.urlService.cronToCreateNextEventsFamily();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCronFamily')
  async startCronFamily() {
    try {
      const result = await this.urlService.startCronFamily();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/changeDateScript')
  async changeDateScript() {
    try {
      const result = await this.urlService.changeDateScript();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/createEventLink-activekids/:source_id')
  async fetchActiveKidsEvents(
    @Query('source_id') source_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!source_id || !startDate || !endDate) {
      throw new HttpException(
        'City, start date, and end date parameters are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.urlService.fetchAndSaveActiveKidsEvents(
        source_id,
        startDate,
        endDate,
      );
      return result;
    } catch (error) {
      console.error('Error in fetchActiveKidsEvents:', error);
      throw new HttpException(
        'Failed to fetch ActiveKids events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/createEventDetailActiveKidsById/:id')
  async createEventDetailActiveKidsById(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.urlService.createEventDetailActiveKidsById(id);
      return result;
    } catch (error) {
      console.error('Error in extractEventData:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/createAllEventDetailActiveKidsByCityAndDate')
  async createAllEventDetailActiveKidsByCityAndDate(
    @Query('city') city: string,
    @Query('Startdate') Startdate: string,
    @Query('Enddate') Enddate: string,
  ) {
    try {
      const result =
        await this.urlService.createAllEventDetailActiveKidsByCityAndDate(
          city,
          Startdate,
          Enddate,
        );
      return result;
    } catch (error) {
      console.error('Error in extractEventData:', error);
      throw new HttpException(
        'Failed to extract event data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/removeDuplicateEvents')
  async removeDuplicateEvents() {
    try {
      const result = await this.urlService.removeDuplicateEvents();
      return result;
    } catch (error) {
      console.error('Error in removeDuplicateEvents:', error);
      throw new HttpException(
        'Failed to remove duplicate events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/deleteBySource/:source')
  async deleteEventsBySource(@Param('source') source: string) {
    try {
      const result = await this.urlService.deleteEventsBySource(source);
      return result;
    } catch (error) {
      console.error('Error deleting events by source:', error);
      throw new HttpException(
        'Failed to delete events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scrape-eventLinksJerseyCityLibrary/:source_id')
  async scrapeEvents(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const result = await this.urlService.scrapeEventData(source_id, date);
      return result;
    } catch (error) {
      console.error('Error in scrapeEvents:', error);
      throw new HttpException(
        'Failed to scrape events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('eventDetailsJerseyCityLibrary/:id')
  async getEventDetailsLibrary(@Param('id') id: string) {
    try {
      const result = await this.urlService.getEventDetailsById(id);
      return result;
    } catch (error) {
      console.error('Error fetching event details:', error);
      throw new HttpException(
        'Failed to fetch event details: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getAllEventDetailsJerseyCityLibrary')
  async createEventsFromAllLinks(
    @Query('source_id') source_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.urlService.createEventsFromCityLinks(
      source_id,
      startDate,
      endDate,
    );
  }

  @Put('updateAllEventDetailsJerseyCityLibrary')
  async updateAllEventDetailsJerseyCityLibrary(
    @Query('source_id') source_id: string,
  ) {
    return this.urlService.updateAllEventDetailsJerseyCityLibrary(source_id);
  }

  @Get('getEventLinksHobokenLibrary')
  async getEvents(
    @Query('source_id') source_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const result = await this.urlService.getEvents(
        source_id,
        startDate,
        endDate,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);

      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('updateEventLinksHobokenLibrary')
  async updateEvents(
    @Query('source_id') source_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const result = await this.urlService.updateEvents(
        source_id,
        startDate,
        endDate,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);

      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getHobokenLibraryEventById/:id')
  async getEventById(@Param('id') id: string) {
    try {
      const result = await this.urlService.getHobokenLibraryEventById(id);
      return result;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw new HttpException(
        'Failed to fetch event: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getAllHobokenLibraryEvent')
  async getAllHobokenLibraryEvent(@Query('source_id') source_id: string) {
    try {
      const result = await this.urlService.getAllHobokenLibraryEvent(source_id);
      return result;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw new HttpException(
        'Failed to fetch event: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('updateAllHobokenLibraryEvent')
  async updateAllHobokenLibraryEvent(@Query('source_id') source_id: string) {
    try {
      const result = await this.urlService.updateAllHobokenLibraryEvent(
        source_id,
      );
      return result;
    } catch (error) {
      console.error('Error updating event data:', error);
      throw new HttpException(
        'Failed to update event: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getEventLinksHobokenForHobokenMuseumWebsite/:source_id')
  async getEventLinksHobokenForHobokenMuseumWebsite(
    @Query('Date') Date: string,
    @Query('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.getEventLinksHobokenForHobokenMuseumWebsite(
          Date,
          source_id,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getEventDetailByIdHobokenMuseum/:id')
  async getEventDetailByIdHobokenMuseum(@Param('id') id: string) {
    try {
      const result = await this.urlService.getEventDetailByIdHobokenMuseum(id);
      return result;
    } catch (error) {
      console.error(
        'Error in controller while fetching event details by ID:',
        error,
      );
      throw new HttpException(
        'Failed to fetch event details: ' +
          (error instanceof Error ? error.message : 'Unknown Error'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('createAllEventDetailForHobokenMuseumWebsite')
  async createAllEventDetailForHobokenMuseumWebsite(
    @Query('source_id') source_id: string,
    @Query('Startdate') Startdate: string,
    @Query('Enddate') Enddate: string,
  ) {
    try {
      const result =
        await this.urlService.createAllEventDetailForHobokenMuseumWebsite(
          source_id,
          Startdate,
          Enddate,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('updateAllEventDetailForHobokenMuseumWebsite')
  async updateAllEventDetailForHobokenMuseumWebsite(
    @Query('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.updateAllEventDetailForHobokenMuseumWebsite(
          source_id,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getEventLinksHobokenForHobokenPublicLibrary')
  async getEventLinksHobokenForHobokenPublicLibrary(
    @Query('eventDateInput') eventDateInput: string,
    @Query('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.getEventLinksHobokenForHobokenPublicLibrary(
          eventDateInput,
          source_id,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getEventDetailByIdForHobokenPublicLibrary/:id')
  async getEventDetailByIdForHobokenPublicLibrary(@Param('id') id: string) {
    try {
      const result =
        await this.urlService.getEventDetailByIdForHobokenPublicLibrary(id);
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching event details by ID:', error);
      throw new HttpException(
        'Failed to fetch event details: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('createAllEventDetailForHobokenPublicLibrary')
  async createAllEventDetailForHobokenPublicLibrary(
    @Query('source_id') source_id: string,
    @Query('Startdate') Startdate: string,
    @Query('Enddate') Enddate: string,
  ) {
    try {
      const result =
        await this.urlService.createAllEventDetailForHobokenPublicLibrary(
          source_id,
          Startdate,
          Enddate,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('updateAllEventDetailForHobokenPublicLibrary')
  async updateAllEventDetailForHobokenPublicLibrary(
    @Query('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.updateAllEventDetailForHobokenPublicLibrary(
          source_id,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('filterEventBySourceAndDateWise')
  async filterEventBySourceAndDateWise(
    @Query() model: eventLinkSearchDto,
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
  ) {
    try {
      const result = await this.urlService.filterEventBySourceAndDateWise(
        model.status,
        model.start_date,
        model.end_date,
        model.source_id,
        model.city_id,
        model.name,
        model.event_detail,
        model.is_published,
        page_number,
        page_size,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('updateEventlinkStatusById/:id')
  async updateEventlinkStatusById(
    @Param('id') id: string,
    @Query() model: eventLinkStatusDto,
  ) {
    try {
      const result = await this.urlService.updateEventlinkStatusById(
        id,
        model.status,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('addNewFieldsInEventLinkScript')
  async addNewFieldsInEventLinkScript() {
    try {
      const result = await this.urlService.addNewFieldsInEventLinkScript();
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('removeEventsByDateSourceAndCity')
  async removeEventsByDateSourceAndCity(
    @Query('cityId') cityId: string,
    @Query('sourceId') sourceId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    try {
      const result = await this.urlService.removeEventsByDateSourceAndCity(
        cityId,
        sourceId,
        fromDate,
        toDate,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/cronToCreateNextEvents_link_jc_free_public_library')
  async cronToCreateNextEvents_link_jc_free_public_library() {
    try {
      const result =
        await this.urlService.cronToCreateNextEvents_link_jc_free_public_library();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCron_jc_free_public_library')
  async startCron_jc_free_public_library() {
    try {
      const result = await this.urlService.startCron_jc_free_public_library();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('createEventLinkFromJerseyCityCultureBySourceAndDate/:source_id')
  async createEventLinkFromJerseyCityCultureBySourceAndDate(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const result =
        await this.urlService.createEventLinkFromJerseyCityCultureBySourceAndDate(
          source_id,
          date,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCron_hoboken_city_library')
  async startCron_hoboken_city_library() {
    try {
      const result = await this.urlService.startCron_hoboken_city_library();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getEventByIdOrSlug/:id')
  async getEventByIdOrSlug(@Param('id') id: string) {
    try {
      const result = await this.urlService.getEventByIdOrSlug(id);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCron_hoboken_public_library')
  async startCron_hoboken_public_library() {
    try {
      const result = await this.urlService.startCron_hoboken_public_library();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/create_event_link_jersey_city_culture/:source_id')
  async create_event_link_jersey_city_culture(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const result =
        await this.urlService.create_event_link_jersey_city_culture(
          source_id,
          date,
        );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/create_event_detail_jersey_city_culture/:source_id')
  async create_event_detail_jersey_city_culture(
    @Param('source_id') source_id: string,
    @Query('Fromdate') Fromdate: string,
    @Query('Todate') Todate: string,
  ) {
    try {
      const result =
        await this.urlService.create_event_detail_jersey_city_culture(
          source_id,
          Fromdate,
          Todate,
        );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/create_event_detail_jersey_city_cultureById/:id')
  async create_event_detail_jersey_city_cultureById(@Param('id') id: string) {
    try {
      const result =
        await this.urlService.create_event_detail_jersey_city_cultureById(id);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCron_jersey_city_culture')
  async startCron_jersey_city_culture() {
    try {
      const result = await this.urlService.startCron_jersey_city_culture();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getLatLngByAddress/:address')
  async getLatLngByAddress(@Param('address') address: string) {
    try {
      const result = await this.urlService.getLatLngByAddress(address);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/startCron_hoboken_museum')
  async startCron_hoboken_museum() {
    try {
      const result = await this.urlService.startCron_hoboken_museum();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/striptToAddLatLngAndOtherFieldsInJerseyCityCulture/:source_id')
  async striptToAddLatLngAndOtherFieldsInJerseyCityCulture(
    @Param('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.striptToAddLatLngAndOtherFieldsInJerseyCityCulture(
          source_id,
        );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('remove-duplicates')
  async removeDuplicates() {
    try {
      const result = await this.urlService.removeDuplicates();
      return {
        message: 'Duplicates removed successfully',
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      console.error('Error removing duplicates:', error);
      throw new HttpException(
        'Failed to remove duplicates: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/TakelessionSubjectAddWondrflySubjectId')
  @ResponseMessage('Add All Refrence Take lession Subject Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async TakelessionSubjectAddWondrflySubjectId() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.TakelessionSubjectAddWondrflySubjectId();
    return data;
  }

  @Post('/AllSchoolTeacherInfoJsonScrap')
  @ResponseMessage('All School Teacher Info Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async AllSchoolTeacherInfoJsonScrap() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.AllSchoolTeacherInfoJsonScrap();
    return data;
  }

  @Post('/scratchProviderDataAllSchool')
  @ResponseMessage('All School Teacher Info Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchProviderDataAllSchool(@Query('url') url: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchProviderDataAllSchool(url);
    return data;
  }

  @Post('/scratchProgramDataAllSchool')
  @ResponseMessage('All School Teacher Program Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async scratchProgramDataAllSchool(
    @Query('providerurl') providerurl: string,
    @Query('programurl') programurl: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.scratchProgramDataAllSchool(
      providerurl,
      programurl,
    );
    return data;
  }

  @Post('/AllSchoolProviderBasicInfo')
  @ResponseMessage('All School Teacher Info Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async AllSchoolProviderBasicInfo(
    @Query('v') v: string,
    @Query('teacherId') teacherId: string,
    @Query('provider') provider: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.AllSchoolProviderBasicInfo(
      v,
      teacherId,
      provider,
    );
    return data;
  }

  @Post('/AllSchoolProviderProgram')
  @ResponseMessage('All School Teacher All Program Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async AllSchoolProviderProgram(
    @Query('v') v: string,
    @Query('teacherId') teacherId: string,
    @Query('pageNo') pageNo: string,
    @Query('provider') provider: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.AllSchoolProviderProgram(
      v,
      teacherId,
      pageNo,
      provider,
    );
    return data;
  }

  @Post('/AllSchoolProviderReview')
  @ResponseMessage('All School Teacher All Review Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async AllSchoolProviderReview(
    @Query('v') v: string,
    @Query('teacherId') teacherId: string,
    @Query('pageNo') pageNo: string,
    @Query('provider') provider: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.AllSchoolProviderReview(
      v,
      teacherId,
      pageNo,
      provider,
    );
    return data;
  }

  @Post('/AllSchoolProviderProgramDetail')
  @ResponseMessage('All School Teacher All Review Scrap Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async AllSchoolProviderProgramDetail(
    @Query('v') v: string,
    @Query('teacherId') teacherId: string,
    @Query('provider') provider: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.AllSchoolProviderProgramDetail(
      v,
      teacherId,
      provider,
    );
    return data;
  }

  @Get('/getAllSchoolProviders')
  @ResponseMessage('Get All School Provider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllSchoolProviders(
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllSchoolProviders(
      page_number,
      page_size,
    );
    return data;
  }

  @Get('/getAllSchoolProgramsByProvider')
  @ResponseMessage('Get All School Provider Wise Program Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllSchoolProgramsByProvider(
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('url') url: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllSchoolProgramsByProvider(
      page_number,
      page_size,
      url,
    );
    return data;
  }

  @Get('/getAllSchoolReviewsByProvider')
  @ResponseMessage('Get All School Provider Wise Program Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllSchoolReviewsByProvider(
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('url') url: string,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllSchoolReviewsByProvider(
      page_number,
      page_size,
      url,
    );
    return data;
  }

  @Get('/getAllSchoolProvidersWithSubAndReview')
  @ResponseMessage(
    'Get All School Provider With Subject And Review Sucessfully',
  )
  @UseInterceptors(ResponseInterceptor)
  async getAllSchoolProvidersWithSubAndReview(
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('page_size', ParseIntPipe) page_size: number,
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.getAllSchoolProvidersWithSubAndReview(
      page_number,
      page_size,
    );
    return data;
  }

  @Get('/getAllSchoolProvidersWithSubAndReviewByProviderId/:id')
  @ResponseMessage(
    'Get All School Provider With Subject And Review Sucessfully',
  )
  @UseInterceptors(ResponseInterceptor)
  async getAllSchoolProvidersWithSubAndReviewByProviderId(
    @Param('id') id: string,
  ) {
    this.logger.log('[service:url:create]');
    const data =
      await this.urlService.getAllSchoolProvidersWithSubAndReviewByProviderId(
        id,
      );
    return data;
  }

  @Get('/AllSchoolReport')
  @ResponseMessage('All School Report Get Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async AllSchoolReport() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.AllSchoolReport();
    return data;
  }

  @Put('archiveOldEvents')
  async archiveOldEvents(@Query('sourceId') sourceId: string) {
    try {
      const result = await this.urlService.archiveOldEvents(sourceId);
      return { message: `${result} events archived successfully.` };
    } catch (error) {
      throw new HttpException(
        'Failed to archive events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/scrape-and-create-events-EventBride/:source_id')
  async scrapeAndCreateEventsEventBride(
    @Param('source_id') source_id: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('keyword') keyword: string,
  ) {
    try {
      const eventsLinks = await this.urlService.getEventsLinksByDateAndCity(
        source_id,
        start_date,
        end_date,
        keyword,
      );

      return {
        success: true,
        message: 'Events created and event links fetched successfully.',
        data: {
          eventsLinks,
        },
      };
    } catch (error) {
      console.error('Error in scrapeAndCreateEventsEventBride:', error);
      throw new HttpException(
        'Failed to scrape and create events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scrape-and-create-eventsJerseyCityLibrary/:source_id')
  async scrapeAndCreateEvents(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const result = await this.urlService.scrapeEventData(source_id, date);
      return result;
    } catch (error) {
      console.error('Error in scrapeEvents:', error);
      throw new HttpException(
        'Failed to scrape events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scrape-event-links-and-create-eventsHobokenLibrary')
  async scrapeEventLinksAndCreateEvents(
    @Query('source_id') source_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const result = await this.urlService.getEvents(
        source_id,
        startDate,
        endDate,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);

      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scrape-and-create-events-hoboken-museum')
  async scrapeAndCreateEventsForHobokenMuseum(
    @Query('Date') Date: string,
    @Query('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.getEventLinksHobokenForHobokenMuseumWebsite(
          Date,
          source_id,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scrape-and-create-events-hoboken-public-library')
  async scrapeAndCreateEventsForHobokenPublicLibrary(
    @Query('eventDateInput') eventDateInput: string,
    @Query('source_id') source_id: string,
  ) {
    try {
      const result =
        await this.urlService.getEventLinksHobokenForHobokenPublicLibrary(
          eventDateInput,
          source_id,
        );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/scrape-and-create-events-jersey-city-culture/:source_id')
  async scrapeAndCreateEventsJerseyCityCulture(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const result =
        await this.urlService.create_event_link_jersey_city_culture(
          source_id,
          date,
        );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/updateCountryAllSchoolProviders')
  async updateCountryAllSchoolProviders() {
    try {
      const eventLinks =
        await this.urlService.updateCountryAllSchoolProviders();

      return 'AllSchool Providers Country Update Sucessfully';
    } catch (error) {
      console.error('Error in scrapeAndCreateEventsJerseyCityCulture:', error);
      throw new HttpException(
        'Failed to scrape and create events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/allschoolProviderCountryWiseCount')
  @ResponseMessage('Get All School Provider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async allschoolProviderCountryWiseCount() {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.allschoolProviderCountryWiseCount();
    return data;
  }

  @Delete('/delete-event-link/:source_id')
  async deleteEventLinkByDateAndSource(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const result = await this.urlService.deleteEventLinkByDateAndSourceId(
        source_id,
        date,
      );

      if (!result) {
        throw new HttpException(
          'No matching event found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Event links deleted successfully.',
      };
    } catch (error) {
      console.error('Error deleting event links:', error);
      throw new HttpException(
        'Failed to delete event links: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('deleteEventLink/:id')
  async deleteEventLink(@Param('id') id: string) {
    try {
      await this.urlService.deleteEventLink(id);
      return { message: 'Event link deleted successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to delete event link: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scrapeEventLinkAndEventDetailJCFreePublicLibrary/:source_id')
  async scrapeEventLinkAndEventDetailJCFreePublicLibrary(
    @Param('source_id') source_id: string,
    @Query('date') date: string,
  ) {
    try {
      const resultLinks =
        await this.urlService.scrapeEventLinkAndEventDetailJCFreePublicLibrary(
          source_id,
          date,
        );

      return resultLinks;
    } catch (error) {
      console.error('Error in scrapeAndCreateEvents:', error);
      throw new HttpException(
        'Failed to scrape and create events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getAllEventCount')
  async getAllEventCount() {
    try {
      const resultLinks = await this.urlService.getAllEventCount();
      return resultLinks;
    } catch (error) {
      console.error('Error in scrapeAndCreateEvents:', error);
      throw new HttpException(
        'Failed to scrape and create events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getProgramDumpByProvider/:id')
  async getProgramDumpByProvider(@Param('id') id: string) {
    try {
      const resultLinks = await this.urlService.getProgramDumpByProvider(id);
      return resultLinks;
    } catch (error) {
      console.error('Error in scrapeAndCreateEvents:', error);
      throw new HttpException(
        'Failed to scrape and create events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('DownloadEventCSV')
  async DownloadEventCSV(@Query() model: eventLinkSearchDto) {
    try {
      const result = await this.urlService.DownloadEventCSV(
        model.status,
        model.start_date,
        model.end_date,
        model.source_id,
        model.city_id,
        model.name,
        model.event_detail,
        model.is_published,
      );
      return result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new HttpException(
        'Failed to fetch events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/scrapEventBriteEventWithDetailBySourceAndDate/:source_id')
  async scrapEventBriteEventWithDetailBySourceAndDate(
    @Param('source_id') source_id: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('keyword') keyword: string,
  ) {
    try {
      const eventsLinks =
        await this.urlService.scrapEventBriteEventWithDetailBySourceAndDate(
          source_id,
          start_date,
          end_date,
          keyword,
        );

      return {
        success: true,
        message: 'Events created and event links fetched successfully.',
        data: {
          eventsLinks,
        },
      };
    } catch (error) {
      console.error('Error in scrapeAndCreateEventsEventBride:', error);
      throw new HttpException(
        'Failed to scrape and create events: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/updateEventsFriendly')
  @ResponseMessage('Update Event by ID Successfully')
  @UseInterceptors(ResponseInterceptor)
  async updateEventsFriendly(@Query('id') _id: string) {
    this.logger.log('[service:source:GetAll]');
    const data = await this.urlService.updateEventsFriendly([_id]);
    return data;
  }

  @Get('/setProviderDataFromFinalByCity/:id')
  @ResponseMessage('Provider update Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async setProviderDataFromFinalByCity(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.urlService.setProviderDataFromFinalByCity(id);
    return data;
  }

  @Put('update-multi-locations')
  async updateEventsWithMultiLocations() {
    await this.urlService.updateEventsWithMultiLocations();
    return { message: 'Events updated with multiLocations' };
  }

  @Patch('/updateProviderCategoriesByPrompt/:userId')
  @ResponseMessage('Provider categories updated successfully')
  @UseInterceptors(ResponseInterceptor)
  async updateProviderCategoriesByPrompt(@Param('userId') userId: string) {
    this.logger.log('[service:provider:updateProviderCategoriesByPrompt]');
    const result = await this.urlService.updateProviderCategoriesByPrompt(
      userId,
    );
    return result;
  }

  @Patch('/updateAllDummyProvidersCategories')
  @ResponseMessage('Dummy providers categories update initiated')
  @UseInterceptors(ResponseInterceptor)
  async updateAllDummyProvidersCategories() {
    this.logger.log('[controller:provider:updateAllDummyProvidersCategories]');
    return await this.urlService.updateAllDummyProvidersCategories();
  }

  @Patch('/ProvidersCategoriesAndTagsByProviderId/:providerId/:promptId')
  @ResponseMessage('Dummy providers categories update initiated')
  @UseInterceptors(ResponseInterceptor)
  async ProvidersCategoriesAndTagsByProviderId(
    @Param('providerId') providerId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log(
      '[controller:provider:ProvidersCategoriesAndTagsByProviderId]',
    );
    return await this.urlService.ProvidersCategoriesAndTagsByProviderId(
      providerId,
      promptId,
    );
  }

  @Patch('/TaggingTagAndCategoryInChildCareProgram/:programId/:promptId')
  @ResponseMessage('Dummy program categories update initiated')
  @UseInterceptors(ResponseInterceptor)
  async TaggingTagAndCategoryInChildCareProgram(
    @Param('programId') programId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log(
      '[controller:provider:TaggingTagAndCategoryInChildCareProgram]',
    );
    return await this.urlService.TaggingTagAndCategoryInChildCareProgram(
      programId,
      promptId,
    );
  }

  @Patch('/TaggingAllProgramsInChildCareProviderByProviderId/:providerId/:promptId')
  @ResponseMessage('Dummy program categories update initiated')
  @UseInterceptors(ResponseInterceptor)
  async TaggingAllProgramsInChildCareProviderByProviderId(
    @Param('providerId') providerId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log(
      '[controller:provider:TaggingAllProgramsInChildCareProviderByProviderId]',
    );
    return await this.urlService.TaggingAllProgramsInChildCareProviderByProviderId(
      providerId,
      promptId,
    );
  }

  @Get('/updateAllEventsFriendly')
  @ResponseMessage('Update All Events Successfully')
  @UseInterceptors(ResponseInterceptor)
  async updateAllEventsFriendly() {
    this.logger.log('[service:source:GetAllEvents]');
    const data = await this.urlService.updateAllEventsFriendly();
    return data;
  }
}
