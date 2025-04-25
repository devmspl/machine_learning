import { Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { WebscrapingService } from './webscraping.service';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { WebscrapingInterface } from 'src/@types/interfaces/webscraping';
import { createWebscrapingDto } from './dto/create.dto';
import { access_token_payload } from 'src/global/swagger';

@ApiTags('webscraping')
@Controller('webscraping')
export class WebscrapingController {
    private readonly logger = new Logger(WebscrapingController.name);

  constructor(private readonly webscrapingService: WebscrapingService) {}

  @Get('/checkChanges/:id')
  @ResponseMessage('Web Scraping Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async checkChanges(@Param('id') id: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.checkChanges(id);
    return data;
  }

  @Get('/checkChangesByUrl')
  @ResponseMessage('Web Scraping Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async checkChangesByUrl(@Query('url') url: string) {
    this.logger.log('[checkChangesByUrl:user:create]');
    const data = await this.webscrapingService.checkChangesByUrl(url);
    return data;
  }

  @Get('/getAllCheckChanges')
  @ResponseMessage('Web Scraping Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllCheckChanges() {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.getAllCheckChanges();
    return data;
  }

  @Get('/getAllUrls')
  @ResponseMessage('Get All Urls Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllUrls(@Query('url') url: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.getAllUrls(url);
    return data;
  }

  @Get('/ProvidercheckChanges/:id')
  @ResponseMessage('Web Scraping Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async ProvidercheckChanges(@Param('id') id: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.ProvidercheckChanges(id);
    return data;
  }

  @Get('/ProviderCheck')
  @ResponseMessage('Provider Check True Or False Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async ProviderCheck() {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.ProviderCheck();
    return data;
  }

  @Get('/checkUrlIsProgramOrNot')
  @ResponseMessage('Check Url Is Program Or Not')
  @UseInterceptors(ResponseInterceptor)
  async checkUrlIsProgramOrNot(@Query('url') url: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.checkUrlIsProgramOrNot(url);
    return data;
  }

  @Get('/checkChatGptToUrlIsProgramOrNot')
  @ResponseMessage('Check Url Is Program Or Not')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async checkChatGptToUrlIsProgramOrNot(@Query('url') url: string, @Req() req) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.webscrapingService.checkChatGptToUrlIsProgramOrNot(url,req);
    return data;
  }

  @Get('/addChangeDetectionAllProvidersByCity/:city')
  @ResponseMessage('Add Change Detection In All Providers Successfully')
  @UseInterceptors(ResponseInterceptor)
  async addChangeDetectionAllProvidersByCity(
    @Param('city') city: string,
    @Query('status') status: string,
    @Query('is_child_care') is_child_care: string,
  ) {
    this.logger.log('[checkChanges:user:addChangeDetectionAllProvidersByCity]');
    const data = await this.webscrapingService.addChangeDetectionAllProvidersByCity(city,status,is_child_care);
    return data;
  }
}
