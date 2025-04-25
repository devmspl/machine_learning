import {
  Controller,
  Logger,
  Body,
  Post,
  UseInterceptors,
  Query,
  ParseIntPipe,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { createTagDto } from './dto/create.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly categoryService: TagsService) {}

  @Post('/create')
  @ResponseMessage('tag create sucessfull')
  @UseInterceptors(ResponseInterceptor)
  async create(@Body() model: createTagDto) {
    this.logger.log('[api:create:tags]');
    const data = await this.categoryService.createTag(model);
    return data;
  }

  @Get('/getById/:id')
  @ResponseMessage('Tag fetched By Id')
  @UseInterceptors(ResponseInterceptor)
  async getById(@Param('id') id: string) {
    this.logger.log('[service:tag:getById]');
    const data = await this.categoryService.getById(id);
    return data;
  }

  @Get('/getByCategoryId')
  @ResponseMessage('Tag Get By Category Id Fetched')
  @UseInterceptors(ResponseInterceptor)
  async getByCategory(
    @Query('id') id: string,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:tag:getByCategory]');
    const data = await this.categoryService.getByCategory(
      id,
      page_size,
      page_number,
    );
    return data;
  }

  @Get('/getAll')
  @ResponseMessage('Tag Fetched All Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async getAll(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:tag:getAll]');
    const data = await this.categoryService.getAll(page_size || 1000, page_number || 1);
    return data;
  }
}
