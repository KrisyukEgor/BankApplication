import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/services/env.config';
import { ApiSuccessInterceptor } from './shared/presentation/interceptors/api-success.interceptor';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ApiErrorResponse } from './shared/presentation/types/api-error-response.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './shared/presentation/filters/validation.exception-filter';
import { DomainExceptionFilter } from './shared/presentation/filters/domain.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envConfig = app.get(EnvConfigService);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (validationErrors: ValidationError[]) => {
      const messages = validationErrors.map(error => {
        return Object.values(error.constraints!).join(', ');
      }).join('; ');

      const customErrorResponse: ApiErrorResponse = {
        success: false, 
        message: `Ошибка валидации: ${messages}`,
        statusCode: HttpStatus.BAD_REQUEST, 
      };

      throw new HttpException(customErrorResponse, HttpStatus.BAD_REQUEST);
    }
  }));


  app.useGlobalInterceptors(new ApiSuccessInterceptor());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  const config = new DocumentBuilder()
  .setTitle('Bank API')
  .setDescription('Bank application API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, 
    },
  });
  
  await app.listen(envConfig.port);
  console.log(`Server running on http://localhost:${envConfig.port}`);
}
bootstrap();
