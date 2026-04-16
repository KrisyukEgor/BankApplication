import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { ApiErrorResponse } from "../types/api-error-response.type";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = HttpStatus.BAD_REQUEST;
    let message = 'Validation failed';

    const errorResponse: ApiErrorResponse = {
      success: false,
      message: message,
      statusCode: status,
    }

    response.status(status).json(errorResponse);    
  }
}