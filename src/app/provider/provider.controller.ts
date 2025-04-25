import {
  ResponseMessage,
  ResponseInterceptor,
  AuthGuards,
  MessageResponseInterceptor,
  hash,
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
  Query,
  UseGuards,
  UseInterceptors,
  Req,
  Put,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { createProviderDto } from './dto/create.dto';
import { ProviderService } from './provider.service';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { access_token_payload } from 'src/global/swagger';
import { updateProviderDto } from './dto/update';
import { IsString } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

class duplicateProviderDto {
  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsString()
  lng: string;

  @ApiProperty()
  @IsString()
  cityId: string;
}

class updateRatingDto {
  @ApiProperty({ required: true })
  @IsString()
  city: string;

  // @ApiProperty({ required: false })
  // @IsString()
  // lat?: string;

  // @ApiProperty({ required: false })
  // @IsString()
  // lng?: string;
}

class findProviderDto {
  @ApiProperty({ required: true })
  @IsString()
  city: string;

  @ApiProperty({ required: false })
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  is_child_care?: string;

}

@ApiTags('provider')
@Controller('provider')
export class ProviderController {
  private readonly logger = new Logger(ProviderController.name);

  constructor(private readonly providerService: ProviderService) {}
  @Post('/create')
  @ResponseMessage('Provider Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async create(@Body() model: createProviderDto) {
    this.logger.log('[service:provider:create]');
    model.password = model.password ? hash(model.password) : '';
    const data = await this.providerService.createProvider(model);
    return data;
  }

  @Get('/getById/:id')
  @ResponseMessage('Provider fetched')
  @UseInterceptors(ResponseInterceptor)
  async getById(@Param('id') id: string) {
    this.logger.log('[service:provider:getById]');
    const data = await this.providerService.getById(id);
    return data;
  }

  @Get('/googlePlaceAddProvider')
  @ResponseMessage('Provider fetched')
  @UseInterceptors(ResponseInterceptor)
  async googlePlaceAddProvider(
    @Query('search') search: string,
    @Query('cityId') cityId: string,
    @Req() req,
  ) {
    this.logger.log('[service:provider:googlePlaceAddProvider]');
    const data = await this.providerService.googlePlaceAddProvider(
      search,
      cityId,
      req,
    );
    return data;
  }
  @Get('/scriptForGooglePlace')
  @ResponseMessage('Provider fetched')
  @UseInterceptors(ResponseInterceptor)
  async scriptForGooglePlace(@Query('cityId') cityId: string, @Req() req) {
    this.logger.log('[service:provider:googlePlaceAddProvider]');
    const data = await this.providerService.scriptForGooglePlace(cityId, req);
    return data;
  }
  @Get('/getAllProvider')
  @ResponseMessage('provider fetched all')
  @UseInterceptors(ResponseInterceptor)
  async getAllProvider(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:provider:getAllProvider]');
    const data = await this.providerService.getAllProvider(
      page_size,
      page_number,
    );
    return data;
  }

  @Delete('/remove/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  remove(@Param('id') id: string, @Req() req) {
    this.logger.log('[service:provider:remove]');
    const data = this.providerService.remove(id);
    return data;
  }

  @Put('/update/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('provider updated.')
  @UseInterceptors(ResponseInterceptor)
  async updateProvider(
    @Param('id') id: string,
    @Body() model: updateProviderDto,
    @Req() req,
  ) {
    try {
      const data = await this.providerService.update(id, model, req);
      return data;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/locationWithDuplicateProvider')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('provider updated.')
  @UseInterceptors(ResponseInterceptor)
  async locationWithDuplicateProvider(
    @Body() model: duplicateProviderDto,
    @Req() req,
  ) {
    const data = await this.providerService.locationWithDuplicateProvider(
      model,
    );
    return data;
  }

  @Get('/importTakeLessonProvider/:takeLessonProviderId/:providerId')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Provider fetched')
  @UseInterceptors(ResponseInterceptor)
  async importTakeLessonProvider(
    @Param('takeLessonProviderId') takeLessonProviderId: string,
    @Param('providerId') providerId: string,
    @Req() req,
  ) {
    this.logger.log('[service:provider:importTakeLessonProvider]');
    const data = await this.providerService.importTakeLessonProvider(
      takeLessonProviderId,
      providerId,
      req,
    );
    return data;
  }

  @Get('/getAllSoloProvider')
  @ResponseMessage('provider fetched all')
  @UseInterceptors(ResponseInterceptor)
  async getAllSoloProvider(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('status') status: string,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:provider:getAllSoloProvider]');
    const data = await this.providerService.getAllSoloProvider(
      status,
      page_size,
      page_number,
    );
    return data;
  }

  @Get('/getAllSoloProviderPrograms')
  @ResponseMessage('provider fetched all')
  @UseInterceptors(ResponseInterceptor)
  async getAllSoloProviderPrograms(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('isArchived') isArchived?: string,
    @Query('isPublished') isPublished?: string,
    @Query('inReview') inReview?: string,
  ) {
    this.logger.log('[service:provider:getAllSoloProviderPrograms]');
    const data = await this.providerService.getAllSoloProviderPrograms(
      page_size,
      page_number,
      isArchived,
      isPublished,
      inReview,
    );
    return data;
  }

  @Get('/getSoloProgramsByProviderId/:id')
  @ResponseMessage('provider fetched all')
  @UseInterceptors(ResponseInterceptor)
  async getSoloProgramsByProviderId(
    @Param('id') id: string,
    @Query('page_size') page_size?: string,
    @Query('page_number') page_number?: string,
    @Query('isArchived') isArchived?: string,
    @Query('isPublished') isPublished?: string,
    @Query('inReview') inReview?: string,
  ) {
    this.logger.log('[service:provider:getSoloProgramsByProviderId]');
    const data = await this.providerService.getSoloProgramsByProviderId(
      id,
      page_size,
      page_number,
      isArchived,
      isPublished,
      inReview,
    );
    return data;
  }

  @Put('updateGoogleRatingsScriptsByLocation')
  @ResponseMessage('Ratings fetched')
  @UseInterceptors(ResponseInterceptor)
  async getGoogleRatingsByProviderId(@Query() model: updateRatingDto) {
    this.logger.log('[service:provider:getGoogleRatingsByProviderId]');
    const data = await this.providerService.getGoogleRatingsByProviderId(
      model.city,
    );
    return data;
  }

  // @Put('updateGoogleRatingsAndGoogleUrlByProviderId/:id')
  // @ResponseMessage('Update Ratings And Url Successfully')
  // @UseInterceptors(ResponseInterceptor)
  // async updateGoogleRatingsAndGoogleUrlByProviderId(@Param('id') id: string) {
  //   this.logger.log('[service:provider:updateGoogleRatingsAndGoogleUrlByProviderId]');
  //   const data = await this.providerService.updateGoogleRatingsAndGoogleUrlByProviderId(id);
  //   return data;
  // }

  @Get('getReviewsByProviderId/:id')
  @ResponseMessage('Ratings fetched')
  @UseInterceptors(ResponseInterceptor)
  async getReviewsByProviderId(@Param('id') id: string) {
    this.logger.log('[service:provider:getReviewsByProviderId]');
    const data = await this.providerService.getReviewsByProviderId(id);
    return data;
  }

  @Get('createWebDumpRegularProviderByCity')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('web dump create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createWebDumpRegularProviderByCity(
    @Query() model: updateRatingDto,
    @Req() req,
  ) {
    this.logger.log('[service:provider:createWebDumpRegularProviderByCity]');
    const data = await this.providerService.createWebDumpRegularProviderByCity(
      model.city,
      req,
    );
    return data;
  }

  @Get('createWebDumpChildCareProviderByCityAndStatus')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('web dump create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createWebDumpChildCareProviderByCityAndStatus(
    @Query() model: findProviderDto,
    @Req() req,
  ) {
    this.logger.log('[service:provider:createWebDumpChildCareProviderByCityAndStatus]');
    const data = await this.providerService.createWebDumpChildCareProviderByCityAndStatus(
      model.city,
      model.status,
      model.is_child_care,
      req,
    );
    return data;
  }

  @Get('cleanWebDumpRegularProviderByCity')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('web dump create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async cleanWebDumpRegularProviderByCity(
    @Query() model: updateRatingDto,
    // @Req() req
  ) {
    this.logger.log('[service:provider:cleanWebDumpRegularProviderByCity]');
    const data = await this.providerService.cleanWebDumpRegularProviderByCity(
      model.city,
    );
    return data;
  }

  @Get('userMoveStaggingToWondrflyById/:id')
  @ResponseMessage('Get All User Related Collection Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async userMoveStaggingToWondrflyById(@Param('id') id: string) {
    this.logger.log('[service:provider:userMoveStaggingToWondrflyById]');
    const data = await this.providerService.userMoveStaggingToWondrflyById(id);
    return data;
  }

  @Put('providerMoved/:id')
  @ResponseMessage('Provider Moved Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async providerMoved(@Param('id') id: string) {
    this.logger.log('[service:provider:providerMoved]');
    const data = await this.providerService.providerMoved(id);
    return data;
  }

  @Get('createProviderByQueue/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderByQueue(
    @Param('id') id: string,
    @Query('cityId') cityId: string,
    @Req() req,
  ) {
    this.logger.log('[service:provider:createProviderByQueue]');
    const data = await this.providerService.createProviderByQueue(
      id,
      cityId,
      req,
    );
    return data;
  }

  @Get('createProviderByQueueAndCity/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderByQueueAndCity(
    @Query('cityId') cityId: string,
    @Query('status') status: string,
    @Query('type') type: string,
    @Req() req,
  ) {
    this.logger.log('[service:provider:createProviderByQueueAndCity]');
    const data = await this.providerService.createProviderByQueueAndCity(
      cityId,
      status,
      type,
      req,
    );
    return data;
  }

  @Get('createProviderByZipCode')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('create provider sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderByZipCode(@Query('ZipCode') ZipCode: string, @Req() req) {
    this.logger.log('[service:provider:createProviderByZipCode]');
    const data = await this.providerService.createProviderByZipCode(
      ZipCode,
      req,
    );
    return data;
  }

  @Post('upload')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Create provider successfully')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProviders(
    @UploadedFile() file: Express.Multer.File,
    @Query('cityId') cityId: string,
    @Req() req,
  ) {
    console.log('File:', file);
    if (!file) {
      throw new Error('File upload failed');
    }
    return this.providerService.createProvidersFromJson(file, cityId, req);
  }

  @Get('createProviderByStatusCityAndType/:cityId')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderByStatusCityAndType(
    @Param('cityId') cityId: string,
    @Query('status') status: string,
    @Query('type') type: string,
    @Req() req
) {
    this.logger.log('[service:provider:createProviderByStatusCityAndType]');
    const data = await this.providerService.createProviderByStatusCityAndType(cityId,status,type,req);
    return data;
  }

  @Get('createProviderWebDumpByCity/:cityId')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderWebDumpByCity(
    @Param('cityId') cityId: string,
    @Req() req
) {
    this.logger.log('[service:provider:createProviderWebDumpByCity]');
    const data = await this.providerService.createProviderWebDumpByCity(cityId,req);
    return data;
  }

  @Get('/createWebDumpJSONProviderByCityId/:city')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Create Child Care Web Dump By City Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createWebDumpJSONProviderByCityId(
    @Query('city') city:string,
    @Query('status') status: string,
    @Query('is_child_care') is_child_care: string,
    @Req() req
  ) {
    this.logger.log('[service:url:createWebDumpJSONProviderByCityId]');
    const data = await this.providerService.createWebDumpJSONProviderByCityId(city,status,is_child_care,req);
    return data;
  }

  @Get('createProviderWebDumpByProviderId/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createProviderWebDumpByProviderId(
    @Param('id') id: string,
    @Req() req
) {
    this.logger.log('[service:provider:createProviderWebDumpByProviderId]');
    const data = await this.providerService.createProviderWebDumpByProviderId(id,req);
    return data;
  }

  @Get('createWebDumpByProviderId/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('web dump create sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createWebDumpByProviderId(
    @Param('id') id: string,
    @Req() req,
  ) {
    this.logger.log('[service:provider:createWebDumpByProviderId]');
    const data = await this.providerService.createWebDumpByProviderId( id,req );
    return data;
  }

}
