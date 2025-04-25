import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

interface exceptionResponseType {
  isSuccess: false;
  statusCode: number;
  error: number | string | any[] | Record<string, any>;
}

@Catch(HttpException)
export class MyHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const exception_response: exceptionResponseType = {
      isSuccess: false,
      statusCode: status,
      error: exception.message,
    };

    if (exception['response']) {
      exception['response'].message &&
        (exception_response['message'] = exception['response'].message);
    }
    response.status(status).json({ ...exception_response });
  }
}
