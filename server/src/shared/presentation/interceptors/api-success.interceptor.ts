import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { ApiSuccessResponse } from "../types/api-success-response.type";
import { map, Observable } from "rxjs";


export class ApiSuccessInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessResponse<T>> | Promise<Observable<ApiSuccessResponse<T>>> {
   
    return next.handle().pipe(map((data => {
      return {
        success: true,
        data: data
      }
    })))
  }
}