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
import { createQueueDto } from './dto/create.dto';
import { updateQueueDto } from './dto/update';
import { updateQueueUrlDto } from './dto/updateurl';
import { QueueService } from './queue.service';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  private readonly logger = new Logger(QueueController.name);

  constructor(private readonly queueService: QueueService) {}
  @Post('/create')
  @ResponseMessage('Queue Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async create(@Body() model: createQueueDto) {
    this.logger.log('[service:queue:create]');
    const data = await this.queueService.createQueue(model);
    return data;
  }

  @Get('/getById/:id')
  @ResponseMessage('Queue fetched')
  @UseInterceptors(ResponseInterceptor)
  async getById(@Param('id') id: string) {
    this.logger.log('[service:Queue:getById]');
    const data = await this.queueService.getById(id);
    return data;
  }

  @Get('/getByCity/:id')
  @ResponseMessage('Program Get By User Fetched')
  @UseInterceptors(ResponseInterceptor)
  async getByCity(
    @Param('id') id: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:program:getByCity]');
    const data = await this.queueService.getByCity(id, page_size, page_number);
    return data;
  }

  @Get('/getAllQueue')
  @ResponseMessage('Queue Fetched All Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAllProvider(
    @Query('id') id: string,
    @Query('status') status: string,
    @Query('sort') sort: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:queue:getAllQueue]');
    const data = await this.queueService.getAllQueue(
      id,
      status,
      sort,
      page_size,
      page_number,
    );
    return data;
  }

  @Delete('/remove/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  remove(@Param('id') id: string) {
    this.logger.log('[service:queue:remove]');
    const data = this.queueService.remove(id);
    return data;
  }

  @Put('/update/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  update(@Param('id') id: string, @Body() model: updateQueueDto, @Req() req) {
    this.logger.log('[service:queue:update]');
    const data = this.queueService.update(id, model, req);
    return data;
  }

  // @Put('/updateQueueUrl/:id/:UrlId')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  // @UseInterceptors(MessageResponseInterceptor)
  // updateProgramBatch(
  //   @Param('id') id: string,
  //   @Param('UrlId') UrlId: string,
  //   @Body() model: updateQueueUrlDto,
  //   @Req() req,
  // ) {
  //   this.logger.log('[service:queue:updateQueueUrl]');
  //   const data = this.queueService.updateQueueUrl(id, UrlId, model, req);
  //   return data;
  // }

  // @Put('/deleteQueueUrl/:id/:UrlId')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  // @UseInterceptors(MessageResponseInterceptor)
  // deleteQueueUrl(@Param('id') id: string, @Param('UrlId') UrlId: string) {
  //   this.logger.log('[service:queue:deleteQueueUrl]');
  //   const data = this.queueService.deleteQueueUrl(id, UrlId);
  //   return data;
  // }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  @Post('/duplicateQue')
  @ResponseMessage('Get Duplicate Queue Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async duplicateQue(@Body() model: createQueueDto) {
    this.logger.log('[service:queue:create]');
    const data = await this.queueService.duplicateQue(model);
    return data;
  }

  @Get('/searchQueue')
  @ResponseMessage('Queue Fetched All Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async searchQueue(
    @Query('id') id: string,
    @Query('status') status: string,
    @Query('name') name: string,
    @Query('sort') sort: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:queue:searchQueue]');
    const data = await this.queueService.searchQueue(
      id,
      status,
      name,
      sort,
      page_size,
      page_number,
    );
    return data;
  }
}
