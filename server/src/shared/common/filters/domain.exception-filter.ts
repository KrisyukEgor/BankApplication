import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { DomainException } from "src/shared/exceptions/domain.exception";
import { ApiErrorResponse } from "../types/api-error-response.type";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter{
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
  
    const status = exception.httpStatus;

    const errorResponse: ApiErrorResponse = {
      success: false,
      message: exception.message,
      statusCode: status
    }

    response.status(status).json(errorResponse);
  }
}