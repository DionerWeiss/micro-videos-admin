import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EntityValidationErrorFilter } from 'src/nest-modules/shared-module/filter/entity-validation-error/entity-validation-error.filter';
import { NotFoundErrorFilter } from 'src/nest-modules/shared-module/filter/not-found/not-found.filter';
import { WrapperDataInterceptor } from './shared-module/interceptors/wrapper-data/wrapper-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new NotFoundErrorFilter(),
  );
}
