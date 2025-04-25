import { Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Website_structure } from 'src/schemas/website_structure.schema';
import { WebsiteStructureService } from './website_structure.service';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { query } from 'express';

@ApiTags('website-structure')
@Controller('website-structure')
export class WebsiteStructureController {
    private readonly logger = new Logger(Website_structure.name);

  constructor(private readonly website_structureService: WebsiteStructureService) {}

  @Get('/checkChangesBySourceId/:source_id')
  @ResponseMessage('Check Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async checkChanges(
    @Param('source_id') source_id: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.website_structureService.checkChanges(source_id);
    return data;
  }

  @Get('/cronToCreateNextEvents')
  async cronToCreateNextEvents() {
    try {
      const result = await this.website_structureService.cronToCreateNextEvents();
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
      const result = await this.website_structureService.startCron();
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to extract event data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getAll')
  @ResponseMessage('Get All Website Structure Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAll( ) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.website_structureService.getAll();
    return data;
  }

  @Get('/getById/:id')
  @ResponseMessage('Get By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getById(
    @Param('id') id: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.website_structureService.getById(id);
    return data;
  }

  @Delete('/removeById/:id')
  @ResponseMessage('Delete By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async removeById(
    @Param('id') id: string) {
    this.logger.log('[checkChanges:user:create]');
    const data = await this.website_structureService.removeById(id);
    return data;
  }

}
