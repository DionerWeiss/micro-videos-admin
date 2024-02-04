import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';

@Module({
  imports: [
    NestConfigModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
