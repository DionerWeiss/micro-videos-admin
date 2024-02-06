import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NotFoundErrorFilter } from 'src/nest-modules/shared-module/filter/not-found/not-found.filter';
import { WrapperDataInterceptor } from 'src/nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapperDataInterceptor(),
  );
  app.useGlobalFilters(new NotFoundErrorFilter());
  await app.listen(3000);
}
bootstrap();
