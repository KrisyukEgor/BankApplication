import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { ApiErrorResponse } from "../types/api-error-response.type";
import { DomainException } from "src/shared/domain/exceptions/domain.exception";

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