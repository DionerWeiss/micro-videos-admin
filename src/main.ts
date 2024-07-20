import { NestFactory } from '@nestjs/core';
import { applyGlobalConfig } from 'src/nest-modules/global-config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? console : undefined,
  });

  applyGlobalConfig(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
