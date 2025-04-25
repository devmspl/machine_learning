import { ResponseMessage, ResponseInterceptor, AuthGuards, MessageResponseInterceptor } from '@app/common';
import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { access_token_payload } from 'src/global/swagger';
import { ScriptLogsService } from './script-logs.service';
import { createDto } from './dto/create.dto';
@ApiTags('Script Logs')
@Controller('script-logs')
export class ScriptLogsController  {
    private readonly logger = new Logger(ScriptLogsController.name);
  
    constructor(private readonly scriptLogsService: ScriptLogsService) {}
    @Post('/create')
    @ResponseMessage('Script logs Created Sucessfully')
    @UseInterceptors(ResponseInterceptor)
    async create(@Body() model:createDto ) {
      this.logger.log('[service:Script logs:create]');
      const data = await this.scriptLogsService.create(model);
      return data;
    }
  
    @Get('/getById/:id')
    @ResponseMessage('Script logs fetched')
    @UseInterceptors(ResponseInterceptor)
    async getById(@Param('id') id: string) {
      this.logger.log('[service:Script logs:getById]');
      const data = await this.scriptLogsService.getById(id);
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
      const data = await this.scriptLogsService.getByCity(id, page_size, page_number);
      return data;
    }
  
    @Get('/getAll')
    @ResponseMessage('Script logs Fetched All Sucessfully')
    @UseInterceptors(ResponseInterceptor)
    async getAllProvider(
      @Query('id') id: string,
      @Query('status') status: string,
      @Query('sort') sort: string,
      @Query('page_size', ParseIntPipe) page_size: number,
      @Query('page_number', ParseIntPipe) page_number: number,
    ) {
      this.logger.log('[service:Script logs:getAllScript logs]');
      const data = await this.scriptLogsService.getAll(
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
      this.logger.log('[service:Script logs:remove]');
      const data = this.scriptLogsService.remove(id);
      return data;
    }
  
    @Put('/update/:id')
    @ApiHeader(access_token_payload)
    @UseGuards(AuthGuards.JwtAuthGuard)
    @UseInterceptors(MessageResponseInterceptor)
    update(@Param('id') id: string, @Body() model: createDto, @Req() req) {
      this.logger.log('[service:Script logs:update]');
      const data = this.scriptLogsService.update(id, model, req);
      return data;
    }
  }
