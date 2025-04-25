import { ResponseMessage, ResponseInterceptor } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { access_token_payload } from 'src/global/swagger';
import { ProgramurlService } from './programurl.service';
import { createMultipleProgramurlDto, createProgramurlDto } from './dto/create.dto';
import { updateProgramurlDto } from './dto/update';
@ApiTags('programurl')
@Controller('programurl')
export class ProgramurlController {
  private readonly logger = new Logger(ProgramurlController.name);

  constructor(private readonly programurlService: ProgramurlService) { }
  @Post('/create')
  @ResponseMessage('Program Url Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async create(@Body() model: createProgramurlDto) {
    this.logger.log('[service:programurl:create]');
    const data = await this.programurlService.create(model);
    return data;
  }
  @Post('/createMultiple')
  @ResponseMessage('Program Url Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async createMultiple(@Body() model: createMultipleProgramurlDto) {
    this.logger.log('[service:programurl:createMultiple]');
    const data = await this.programurlService.crecreateMultipleate(model);
    return data;
  }
  @Get('/getById/:id')
  @ResponseMessage('Program Url fetched By Id')
  @UseInterceptors(ResponseInterceptor)
  async getById(@Param('id') id: string) {
    this.logger.log('[service:programurl:getById]');
    const data = await this.programurlService.getById(id);
    return data;
  }

  @Get('/getByUserId/:id')
  @ResponseMessage('Program Url Get By User Fetched')
  @UseInterceptors(ResponseInterceptor)
  async getByUser(
    @Param('id') id: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
    @Query('status') status: string,
  ) {
    this.logger.log('[service:programurl:getByUserId]');
    const data = await this.programurlService.getByUser(
      id,
      page_size,
      page_number,
      status
    );
    return data;
  }

  @Get('/getAll')
  @ResponseMessage('Program Url Fetched All Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAll(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:programurl:getAll]');
    const data = await this.programurlService.getAll(page_size, page_number);
    return data;
  }

  @Delete('/deleteById/:id')
  @ResponseMessage('Delete Program Url By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async deleteById(@Param('id') id: string) {
    try {
      this.logger.log('[controller:programurl:deleteById]');
      const data = await this.programurlService.deleteById(id);
      return data;
    } catch (error) {
      this.logger.error('[controller:programurl:deleteById] Error:', error.message);
      throw new NotFoundException('Program Url Not Found');
    }
  }

  @Put('/updateById/:id')
  @ResponseMessage('Update Program Url By Id Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async updateById(
    @Param('id') id: string,
    @Body() model: updateProgramurlDto,) {
    try {
      this.logger.log('[controller:programurl:deleteById]');
      const data = await this.programurlService.updateById(id, model);
      return data;
    } catch (error) {
      this.logger.error('[controller:programurl:deleteById] Error:', error.message);
      throw new NotFoundException('Program Url Not Found');
    }
  }
  @Get('/addTempProgramsFromProgramsUrlList/:id')
  @ResponseMessage('Programs Added Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async addTempProgramsFromProgramsUrlList(@Param('id') id: string) {
    this.logger.log('[service:programurl:addTempProgramsFromProgramsUrlList]');
    const data = await this.programurlService.addTempProgramsFromProgramsUrlList(id);
    return data;
  }
}
