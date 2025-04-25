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
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import {
  ApiHeader,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { access_token_payload } from 'src/global/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProgramScrapService } from './program-scrap.service';


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

@ApiTags('program-scrap')
@Controller('program-scrap')
export class ProgramScrapController{
  private readonly logger = new Logger(ProgramScrapController.name);

  constructor(private readonly programSrapService: ProgramScrapService) {}

  @Get('/getProgramFromDump/:id')
  @ResponseMessage('Clean Dump Data Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getProgramFromDump(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.getProgramFromDump(id);
    return data;
  }

  @Get('/cleanProgramDumpByQueue/:id')
  @ResponseMessage('Clean Program Dump Data Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanProgramDumpByQueue(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.cleanProgramDumpByQueue(id);
    return data;
  }

  @Get('/cleanProgramDumpAndCreateDummyProgramByCity/:id')
  @ResponseMessage('Clean Program Dump Data Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanProgramDumpAndCreateDummyProgramByCity(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.cleanProgramDumpAndCreateDummyProgramByCity(id);
    return data;
  }

  @Get('/getDummyProgramByProvider/:id')
  @ResponseMessage('Get Dummy Program By provider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getDummyProgramByProvider(@Param('id') id: string) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.getDummyProgramByProvider(id);
    return data;
  }

  @Get('/getDataFromGeminiAdvanceByProgramDumpId/:id')
  @ResponseMessage('Get Program Data By provider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  async getDataFromGeminiAdvanceByProgramDumpId(@Param('id') id: string, @Req() req) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.getDataFromGeminiAdvanceByProgramDumpId(id, req);
    return data;
  }

  @Get('/createDummyProgramFromGeminiAdvanceByProvider/:id')
  @ResponseMessage('Get Program Data By provider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  async createDummyProgramFromGeminiAdvanceByProvider(@Param('id') id: string, @Req() req) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.createDummyProgramFromGeminiAdvanceByProvider(id, req);
    return data;
  }

  @Get('/createDummyProgramFromGeminiAdvanceByDumpId/:id')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program Dump Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createDummyProgramFromGeminiAdvanceByDumpId(
    @Param('id') id: string
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.createDummyProgramFromGeminiAdvanceByDumpId(id);
    return data;
  }

  @Get('/createDummyProgramFromChatGptByDumpId/:id')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program Dump Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createDummyProgramFromChatGptByDumpId(
    @Param('id') id: string
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.createDummyProgramFromChatGptByDumpId(id);
    return data;
  }

  @Get('/createProviderByWebsite')
  @ResponseMessage('Create Provider By Website Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderByWebsite(
    @Query('website') website:string,
    @Query('city') city:string
  ) {
    this.logger.log('[service:url:createProviderByWebsite]');
    const data = await this.programSrapService.createProviderByWebsite(website,city);
    return data;
  }

  @Get('/cleanDoubleQuoteInh1h2Script')
  @ResponseMessage('Clean All H1 H2 By Script Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanDoubleQuoteInh1h2Script() {
    this.logger.log('[service:url:cleanDoubleQuoteInh1h2Script]');
    const data = await this.programSrapService.cleanDoubleQuoteInh1h2Script();
    return data;
  }

  @Get('/createAllDummyProgramFromGeminiAdvance')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program Dump Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createAllDummyProgramFromGeminiAdvance( ) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.createAllDummyProgramFromGeminiAdvance();
    return data;
  }

  @Get('/createAllDummyProgramFromCHATGPT')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program Dump Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createAllDummyProgramFromCHATGPT( ) {
    this.logger.log('[service:url:createAllDummyProgramFromCHATGPT]');
    const data = await this.programSrapService.createAllDummyProgramFromCHATGPT();
    return data;
  }

  @Get('/createExtraFromGeminiAdvance/:id')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program Dump Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createExtraFromGeminiAdvance(@Param('id') id: string) {
    this.logger.log('[service:url:createExtraFromGeminiAdvance]');
    const data = await this.programSrapService.createExtraFromGeminiAdvance(id);
    return data;
  }

  @Get('/updateStaffAndCertificationByProviderId/:ProviderId')
  @ResponseMessage('Update Staff And Certification By Provider Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateStaffAndCertificationByProviderId(
    @Param('ProviderId') ProviderId: string
  ) {
    this.logger.log('[service:url:updateStaffAndCertificationByProviderId]');
    const data = await this.programSrapService.updateStaffAndCertificationByProviderId(ProviderId);
    return data;
  }

  @Get('/updateStaffAndCertificationChagGptWebSearchByProviderIdAndPromptId/:ProviderId/:PromptId')
  @ResponseMessage('Update Staff And Certification By Provider Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateStaffAndCertificationChagGptWebSearchByProviderIdAndPromptId(
    @Param('ProviderId') ProviderId: string,
    @Param('PromptId') PromptId: string
  ) {
    this.logger.log('[service:url:updateStaffAndCertificationChagGptWebSearchByProviderIdAndPromptId]');
    const data = await this.programSrapService.updateStaffAndCertificationChagGptWebSearchByProviderIdAndPromptId(ProviderId,PromptId);
    return data;
  }

  @Get('/childCareProvider/:city_id')
  @ResponseMessage('proxy Agent By Search Website Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async childCareProvider(@Param('city_id') city_id: string) {
    this.logger.log('[service:url:childCareProvider]');
    const data = await this.programSrapService.childCareProvider(city_id);
    return data;
  }

  @Get('/getChildCareProvidersByGoogleMaps')
  @ResponseMessage('Create Provider By Website Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getChildCareProvidersByGoogleMaps(
    @Query('city') city:string
  ) {
    this.logger.log('[service:url:getChildCareProvidersByGoogleMaps]');
    const data = await this.programSrapService.getChildCareProvidersByGoogleMaps(city);
    return data;
  }

  @Get('/createChildCareQueueByCitySubParts')
  @ResponseMessage('Create Child Care Queue By City Sub Parts Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createChildCareQueueByCitySubParts(
    @Query('city') city:string
  ) {
    this.logger.log('[service:url:createChildCareQueueByCitySubParts]');
    const data = await this.programSrapService.createChildCareQueueByCitySubParts(city);
    return data;
  }

  @Get('/updateQueueStatusByCityAndType')
  @ResponseMessage('Create Child Care Queue By City Sub Parts Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateQueueStatusByCityAndType(
    @Query('city') city:string,
    @Query('type') type:string,
    @Query('Fromstatus') Fromstatus:string,
    @Query('Tostatus') Tostatus:string
  ) {
    this.logger.log('[service:url:updateQueueStatusByCityAndType]');
    const data = await this.programSrapService.updateQueueStatusByCityAndType(city,type,Fromstatus,Tostatus);
    return data;
  }

  @Get('/updateChildCareProviderStatusByCity')
  @ResponseMessage('Create Child Care Queue By City Sub Parts Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateChildCareProviderStatusByCity(
    @Query('city') city:string,
    @Query('Fromstatus') Fromstatus:string,
    @Query('Tostatus') Tostatus:string,
    @Query('is_child_care') is_child_care:string
  ) {
    this.logger.log('[service:url:updateChildCareProviderStatusByCity]');
    const data = await this.programSrapService.updateChildCareProviderStatusByCity(city,Fromstatus,Tostatus,is_child_care);
    return data;
  }

  @Get('/updateTimingChildCareProviderByStatusAndCity')
  @ResponseMessage('Update Child Care Providers In Timing Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateTimingChildCareProviderByStatusAndCity(
    @Query('city') city:string,
    @Query('Fromstatus') Fromstatus:string,
    @Query('is_child_care') is_child_care:string
  ) {
    this.logger.log('[service:url:updateTimingChildCareProviderByStatusAndCity]');
    const data = await this.programSrapService.updateTimingChildCareProviderByStatusAndCity(city,Fromstatus,is_child_care);
    return data;
  }

  @Get('/updateTimingChildCareProviderByProviderId')
  @ResponseMessage('Update Child Care Providers In Timing Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateTimingChildCareProviderByProviderId(
    @Query('providerId') providerId:string
  ) {
    this.logger.log('[service:url:updateTimingChildCareProviderByProviderId]');
    const data = await this.programSrapService.updateTimingChildCareProviderByProviderId(providerId);
    return data;
  }

  @Get('/createDummyProgramFromGeminiAdvanceByCityAndStatus/:cityId')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program City Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createDummyProgramFromGeminiAdvanceByCityAndStatus(
    @Param('cityId') cityId: string,
    @Query('status') status: string,
    @Query('is_child_care') is_child_care: string
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.createDummyProgramFromGeminiAdvanceByCityAndStatus(cityId,status,is_child_care);
    return data;
  }

  @Get('/createExtraFieldsFromGeminiAdvanceByCityAndStatus/:cityId')
  @ResponseMessage('Create Dummy Program From Gemini Advance By Program City Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createExtraFieldsFromGeminiAdvanceByCityAndStatus(
    @Param('cityId') cityId: string,
    @Query('status') status: string,
    @Query('is_child_care') is_child_care: string
  ) {
    this.logger.log('[service:url:create]');
    const data = await this.programSrapService.createExtraFieldsFromGeminiAdvanceByCityAndStatus(cityId,status,is_child_care);
    return data;
  }

  @Get('/createProgramFromDummyProgramByCityId/:cityId')
  @ResponseMessage('Programs Create Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProgramFromDummyProgramByCityId(
    @Param('cityId') cityId: string,
  ) {
    this.logger.log('[service:program:createProgramFromDummyProgramByCityId]');
    const data = await this.programSrapService.createProgramFromDummyProgramByCityId(cityId);
    return data;
  }

  @Get('/createDummyProgramsFromProviderURL')
  @ResponseMessage('Programs Create Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createDummyProgramsFromProviderURL(
    @Query('url') url: string,
  ) {
    this.logger.log('[service:program:createDummyProgramsFromProviderURL]');
    const data = await this.programSrapService.createDummyProgramsFromProviderURL(url);
    return data;
  }

  @Get('/createDummyProgramsByProviderAndPrompt/:providerId/:promptId')
  @ResponseMessage('Programs Create Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createDummyProgramsByProviderAndPrompt(
    @Param('providerId') providerId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:createDummyProgramsByProviderAndPrompt]');
    const data = await this.programSrapService.createDummyProgramsByProviderAndPrompt(providerId,promptId);
    return data;
  }

  @Get('/createNextDummyProgramsByProviderAndPrompt/:providerId/:promptId')
  @ResponseMessage('Programs Create Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createNextDummyProgramsByProviderAndPrompt(
    @Param('providerId') providerId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:createNextDummyProgramsByProviderAndPrompt]');
    const data = await this.programSrapService.createNextDummyProgramsByProviderAndPrompt(providerId,promptId);
    return data;
  }

  @Get('/updateDummyProgramsByProgramAndPrompt/:programId/:promptId')
  @ResponseMessage('Programs Create Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateDummyProgramsByProgramAndPrompt(
    @Param('programId') programId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:updateDummyProgramsByProgramAndPrompt]');
    const data = await this.programSrapService.updateDummyProgramsByProgramAndPrompt(programId,promptId);
    return data;
  }

  @Get('/updateScheduleInDummyProgramByProgramAndPrompt/:programId/:promptId')
  @ResponseMessage('Schedule Update Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateScheduleInDummyProgramByProgramAndPrompt(
    @Param('programId') programId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:updateScheduleInDummyProgramByProgramAndPrompt]');
    const data = await this.programSrapService.updateScheduleInDummyProgramByProgramAndPrompt(programId,promptId);
    return data;
  }

  @Get('/updatePricesInDummyProgramByProgramAndPrompt/:programId/:promptId')
  @ResponseMessage('Price Update Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updatePricesInDummyProgramByProgramAndPrompt(
    @Param('programId') programId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:updatePricesInDummyProgramByProgramAndPrompt]');
    const data = await this.programSrapService.updatePricesInDummyProgramByProgramAndPrompt(programId,promptId);
    return data;
  }

  @Get('/updateActivityAgeGroupInDummyProgramByProgramAndPrompt/:programId/:promptId')
  @ResponseMessage('Activity Recurring And Age Group Update Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateActivityAgeGroupInDummyProgramByProgramAndPrompt(
    @Param('programId') programId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:updateActivityAgeGroupInDummyProgramByProgramAndPrompt]');
    const data = await this.programSrapService.updateActivityAgeGroupInDummyProgramByProgramAndPrompt(programId,promptId);
    return data;
  }

  @Get('/updateCurriculumAndCertificatesInDummyProviderByProviderAndPrompt/:providerId/:promptId')
  @ResponseMessage('Dummy Provider Curriculum And Certificates Update Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateCurriculumAndCertificatesInDummyProviderByProviderAndPrompt(
    @Param('providerId') providerId: string,
    @Param('promptId') promptId: string,
  ) {
    this.logger.log('[service:program:updateCurriculumAndCertificatesInDummyProviderByProviderAndPrompt]');
    const data = await this.programSrapService.updateCurriculumAndCertificatesInDummyProviderByProviderAndPrompt(providerId,promptId);
    return data;
  }

  @Get('/checkChildCareProviderExistWebDumpOrNot')
  @ResponseMessage('Check Exist Web Dump Or Not Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async checkChildCareProviderExistWebDumpOrNot(
    @Query('city') city:string,
    @Query('Fromstatus') Fromstatus:string,
    @Query('is_child_care') is_child_care:string
  ) {
    this.logger.log('[service:program:checkChildCareProviderExistWebDumpOrNot]');
    const data = await this.programSrapService.checkChildCareProviderExistWebDumpOrNot(city,Fromstatus, is_child_care);
    return data;
  }

  @Get('/checkWebDumpLengthLessThanFive')
  @ResponseMessage('Check Exist Web Dump Or Not Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async checkWebDumpLengthLessThanFive(
    @Query('city') city:string,
    @Query('Fromstatus') Fromstatus:string,
    @Query('is_child_care') is_child_care:string
  ) {
    this.logger.log('[service:program:checkWebDumpLengthLessThanFive]');
    const data = await this.programSrapService.checkWebDumpLengthLessThanFive(city,Fromstatus, is_child_care);
    return data;
  }

}
