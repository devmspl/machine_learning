import {
  Controller,
  Logger,
  Get,
  Body,
  Post,
  UseInterceptors,
  Param,
  Delete,
  UploadedFiles,
  Query,
  ParseIntPipe,
  Put,
  UseGuards,
  Request,
  ParseBoolPipe,
  Res,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createUserDto, LoginDto, OtpVerfication } from './dto/create.dto';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiHeader,
  ApiProperty,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  ResponseInterceptor,
  ResponseMessage,
  MessageResponseInterceptor,
  uploadDiskFile,
  AuthGuards,
  hash,
} from '@app/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload';
import path, { join } from 'path';
import * as user_mapper from '../../mappers/user.map';
import {
  UpdateUserDto,
  ChangePasswordDto,
  ForgetPassword,
  verifyPasswordOtp,
  resetPasswordDto,
} from './dto/update';
import { access_token_payload } from '../../global/swagger';
import { IsOptional, IsString } from 'class-validator';
import * as csvWriter from 'csv-writer';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const userfileUploadeFields = [
  {
    name: 'image',
    maxCount: 1,
  },
];

const uploadImage_dir = join(process.cwd(), 'assets/images');
const multer_uploader = uploadDiskFile(uploadImage_dir);

class userSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullname: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cityId?: string;
}

class invitationSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  role: string;

}

class invitationSearch1Dto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invitation: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  role: string;

}

class convertDataDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cityId?: string;
}

class providerSearchDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  changeDetection?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subCategory?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  is_child_care?: string;

  // @ApiProperty({ required: true })
  // @IsNumber()
  // page_size?: Number;

  // @ApiProperty({ required: true })
  // @IsNumber()
  // page_number?: Number;
}

class providerChildCareSearchDto {
  @ApiProperty({ required: true })
  @IsString()
  sort: string;

  @ApiProperty({ required: true })
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  changeDetection?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  childCare?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  event?: string;
}

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ResponseMessage('User Created Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async signup(@Body() model: createUserDto) {
    this.logger.log('[signup:user:create]');
    model.password = model.password ? hash(model.password) : '';
    const data = await this.userService.createUser(model);
    // const data = await this.userService.sentSignupOtp(model);
    return data;
  }

  @Post('/login')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('user logged in')
  async login(@Body() model: LoginDto) {
    this.logger.log('[login:user]');
    const data = await this.userService.login(model);
    const mapped = user_mapper.toModel(data);
    mapped['token'] = data.token;
    return mapped;
  }

  @Get('/getById/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('user fetched')
  @UseInterceptors(ResponseInterceptor)
  async getById(@Param('id') id: string) {
    this.logger.log('[user:getById]');
    const data = await this.userService.getById(id);
    return data;
    // return user_mapper.toModel(data);
  }

  @Delete('/remove/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  remove(@Param('id') id: string) {
    this.logger.log('[service:user:remove]');
    const data = this.userService.remove(id);
    return data;
  }

  @Delete('/removeProvider/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  removeProvider(@Param('id') id: string) {
    this.logger.log('[service:user:removeProvider]');
    const data = this.userService.removeProvider(id);
    return data;
  }

  @Post('/uploadProfile/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @UseInterceptors(
    FileFieldsInterceptor(userfileUploadeFields, {
      storage: multer_uploader,
    }),
  )
  @UseInterceptors(MessageResponseInterceptor)
  uploadUserProfileImage(
    @UploadedFiles() files: UploadImageDto,
    @Param('id') id: string,
  ) {
    const res = this.userService.uploadProfileImage(files.image, id);
    return res;
  }

  @Get('/getAll')
  @ResponseMessage('user fetched')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async getAllUser(
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    const data = await this.userService.getAllUser(page_size, page_number);
    return data;
  }

  @Post('/verifyUser')
  @ResponseMessage('user verified.')
  @UseInterceptors(ResponseInterceptor)
  async userVerification(@Body() model: OtpVerfication) {
    this.logger.log('[user:verfication]');
    const data = await this.userService.verifySignupOtp(model);
    return data;
  }

  @Put('/update/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('user updated.')
  @UseInterceptors(ResponseInterceptor)
  async updateUser(@Param('id') id: string, @Body() model: UpdateUserDto) {
    const data = await this.userService.update(id, model);
    return data;
  }

  @Put('/changePassword/:id')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async changeUserPassword(
    @Body() model: ChangePasswordDto,
    @Param('id') id: string,
  ) {
    const result = await this.userService.changePassword(id, model);
    return result;
  }

  @Post('/forgetPassword')
  @ResponseMessage('otp sent.')
  @UseInterceptors(ResponseInterceptor)
  async forgetPassword(@Body() model: ForgetPassword) {
    const data = await this.userService.forgetPassword(model);
    return data;
  }

  @Post('/verifyPasswordOtp')
  @ResponseMessage('otp verified.')
  @UseInterceptors(ResponseInterceptor)
  async verifyPasswordOtp(@Body() model: verifyPasswordOtp) {
    const data = await this.userService.verifyOtp(model.token, model.otp);
    return data;
  }

  @Post('/resetPassword')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async resetPassword(@Body() model: resetPasswordDto, @Request() req: any) {
    const data = await this.userService.resetPassword(
      model.password,
      req['user'],
    );
    return data;
  }

  @Get('/getProviders/:id')
  @ResponseMessage('Providers fetched')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async getProviders(
    @Param('id') id: string,
    @Query() model: providerSearchDto,
    // @Query('sort') sort: string,
    // @Query('status') status: string,
    // @Query('category') category: string,
    // @Query('subCategory') subCategory: string,
    // @Query('name') name: string,
    // @Query('changeDetection') changeDetection: string,boolean,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    const data = await this.userService.getProviders(
      id,
      model.sort,
      model.status,
      model.name,
      model.category,
      model.subCategory,
      model.changeDetection,
      page_size,
      page_number,
      model.is_child_care,
    );
    return data;
  }

  @Get('/getProvidersChildCareEvent/:id')
  @ResponseMessage('Providers fetched')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async getProvidersChildCareEvent(
    @Param('id') id: string,
    @Query() model: providerChildCareSearchDto,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    const data = await this.userService.getProvidersChildCareEvent(
      id,
      model.sort,
      model.status,
      model.changeDetection,
      page_size,
      page_number,
      model.childCare,
      model.event,
    );
    return data;
  }

  @Get('/searchProvider')
  @ResponseMessage('searchProvider Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  async searchProvider(@Query() model: userSearchDto) {
    this.logger.log('[service:provider:getAllProvider]');
    const data = await this.userService.searchProvider(
      model.fullname,
      model.cityId,
    );
    return data;
  }

  @Get('/jsonToExl')
  @ResponseMessage('Json To Exl Data Sucessfully')
  @UseInterceptors(ResponseInterceptor)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  async jsonToExl(@Query() model: convertDataDto) {
    this.logger.log('[service:provider:jsonToExl]');
    const data = await this.userService.jsonToExl(
      model.role,
      model.status,
      model.cityId,
    );
    return data;
  }

  @Get('/downloadProviderJsonToExl')
  @ResponseMessage('Download Excel Data Successfully')
  @UseInterceptors(ResponseInterceptor)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  async downloadProviderJsonToExl(
    @Query() model: convertDataDto,
    @Query() Model: providerSearchDto,
    @Query('page_size', ParseIntPipe) page_size: number,
    @Query('page_number', ParseIntPipe) page_number: number,
  ) {
    this.logger.log('[service:provider:downloadProviderJsonToExl]');

    const searchParams = {
      role: model.role,
      status: model.status,
      cityId: model.cityId,
      sort: Model.sort,
      name: Model.name,
      category: Model.category,
      subCategory: Model.subCategory,
      page_size,
      page_number,
      is_child_care: Model.is_child_care,
    };

    const filePath = await this.userService.downloadProviderJsonToExl(
      searchParams,
    );

    if (filePath === 'No Data Available') {
      throw new NotFoundException('No matching data found');
    }

    return {
      message: 'Excel file created successfully',
      filePath,
    };
  }

  // @Get('/downloadProviders/:id')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  // async downloadProviders(
  //   @Param('id') id: string,
  // @Query() model: providerSearchDto,
  // @Query('page_size', ParseIntPipe) page_size: number,
  // @Query('page_number', ParseIntPipe) page_number: number,
  //   @Query('format') format: 'csv' | 'excel' = 'csv',
  //   @Res() res: Response,
  // ) {
  //   const data = await this.userService.getProvidersCsv(
  //     id,
  //     model.sort,
  //     model.status,
  //     model.name,
  //     model.category,
  //     model.subCategory,
  //     model.changeDetection,
  //     page_size,
  //     page_number,
  //     model.is_child_care,
  //   );

  //   if (format === 'csv') {
  //     return this.generateCSV(res, data.result);
  //   } else if (format === 'excel') {
  //     return this.generateExcel(res, data.result);
  //   } else {
  //     throw new Error('Unsupported format. Please use "csv" or "excel".');
  //   }
  // }

  // private async generateCSV(res: Response, data: any[]) {
  //   const directoryPath = path.join(process.cwd(), 'assets/files');

  //   const uniqueId = uuidv4();
  //   const filePath = path.join(directoryPath, `providers_${uniqueId}.csv`);

  //   if (!fs.existsSync(directoryPath)) {
  //     fs.mkdirSync(directoryPath, { recursive: true });
  //   }

  //   const csv = csvWriter.createObjectCsvWriter({
  //     path: filePath,
  //     header: [
  //       { id: '_id', title: 'ID' },
  //       { id: 'firstName', title: 'First Name' },
  //       { id: 'lastName', title: 'Last Name' },
  //       { id: 'phoneNumber', title: 'Phone Number' },
  //       { id: 'email', title: 'Email' },
  //       { id: 'location', title: 'Location' },
  //       { id: 'isActivated', title: 'Activated' },
  //       { id: 'createdOn', title: 'Created On' },
  //     ],
  //   });

  //   try {
  //     await csv.writeRecords(data);
  //     res.json({
  //       message: 'CSV file generated successfully',
  //       filePath: `/assets/files/providers_${uniqueId}.csv`,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'Error generating CSV file',
  //       error: error.message,
  //     });
  //   }
  // }

  // private async generateExcel(res: Response, data: any[]) {
  //   const directoryPath = path.join(process.cwd(), 'assets/files');

  //   const uniqueId = uuidv4();
  //   const filePath = path.join(directoryPath, `providers_${uniqueId}.xlsx`);

  //   if (!fs.existsSync(directoryPath)) {
  //     fs.mkdirSync(directoryPath, { recursive: true });
  //   }

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Providers');

  //   worksheet.columns = [
  //     { header: 'ID', key: '_id', width: 25 },
  //     { header: 'First Name', key: 'firstName', width: 25 },
  //     { header: 'Last Name', key: 'lastName', width: 25 },
  //     { header: 'Phone Number', key: 'phoneNumber', width: 20 },
  //     { header: 'Email', key: 'email', width: 30 },
  //     { header: 'Location', key: 'location', width: 30 },
  //     { header: 'Activated', key: 'isActivated', width: 10 },
  //     { header: 'Created On', key: 'createdOn', width: 25 },
  //   ];

  //   data.forEach((provider) => {
  //     worksheet.addRow({
  //       _id: provider._id,
  //       firstName: provider.firstName,
  //       lastName: provider.lastName,
  //       phoneNumber: provider.phoneNumber,
  //       email: provider.email,
  //       location: provider.location,
  //       isActivated: provider.isActivated,
  //       createdOn: provider.createdOn,
  //     });
  //   });

  //   try {
  //     await workbook.xlsx.writeFile(filePath);
  //     res.json({
  //       message: 'Excel file generated successfully',
  //       filePath: `/assets/files/providers_${uniqueId}.xlsx`,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'Error generating Excel file',
  //       error: error.message,
  //     });
  //   }
  // }

  // @Put('/script')
  // @ResponseMessage('searchProvider Sucessfully')
  // @UseInterceptors(ResponseInterceptor)
  // async script() {
  //   this.logger.log('[service:provider:script]');
  //   const data = await this.userService.script();
  //   return data;
  // }

  // @Get('/userDatatScript')
  // @ResponseMessage('searchProvider Sucessfully')
  // @UseInterceptors(ResponseInterceptor)
  // async userDatatScript() {
  //   this.logger.log('[service:provider:userDatatScript]');
  //   const data = await this.userService.userDatatScript();
  //   return data;
  // }

  // @Get('/createUserToProvider')
  // @ResponseMessage('searchProvider Sucessfully')
  // @UseInterceptors(ResponseInterceptor)
  // async createUserToProvider() {
  //   this.logger.log('[service:provider:createUserToProvider]');
  //   const data = await this.userService.createUserToProvider();
  //   return data;
  // }

  @Get('countCharProviderNameMinAndMax')
  async countCharProviderNameMinAndMax( ) {
    try {
      const resultLinks = await this.userService.countCharProviderNameMinAndMax( );
      return resultLinks;
    } catch (error) {
      console.error('Error in count Char Provider Name Min And Max:', error);
      throw new HttpException('Failed to count Char Provider Name Min And Max: ' + error.message,HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }

  @Get('getAmbassadors')
  async getAmbassadors( ) {
    try {
      const resultLinks = await this.userService.getAmbassadors( );
      return resultLinks;
    } catch (error) {
      console.error('Error in count Char Provider Name Min And Max:', error);
      throw new HttpException('Failed to count Char Provider Name Min And Max: ' + error.message,HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }

  @Get('getTestParents')
  async getTestParents( ) {
    try {
      const resultLinks = await this.userService.getTestParents( );
      return resultLinks;
    } catch (error) {
      console.error('Error in count Char Provider Name Min And Max:', error);
      throw new HttpException('Failed to count Char Provider Name Min And Max: ' + error.message,HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }

  @Get('getAllInvitation')
  async getAllInvitation(@Query() model: invitationSearchDto ) {
    try {
      const resultLinks = await this.userService.getAllInvitation( model.role );
      return resultLinks;
    } catch (error) {
      console.error('Error in count Char Provider Name Min And Max:', error);
      throw new HttpException('Failed to count Char Provider Name Min And Max: ' + error.message,HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }

  @Get('getUsersByTypeAndInvitations')
  async getUsersByTypeAndInvitations(
  // @Query('type') type: 'testParents' | 'ambassadors',
  // @Query('includeInvitations') includeInvitations: boolean = false,
  // @Query('role') role: string = 'parent'
  @Query() model: invitationSearch1Dto
) {
  const resultLinks = await this.userService.getUsersByTypeAndInvitations(model.invitation, model.role, model.type);
  return resultLinks;
} catch (error) {
  console.error('Error in count Char Provider Name Min And Max:', error);
  throw new HttpException('Failed to count Char Provider Name Min And Max: ' + error.message,HttpStatus.INTERNAL_SERVER_ERROR );
}

@Get('getCount')
  async getCount() {
  const resultLinks = await this.userService.getCount();
  return resultLinks;
}
}
