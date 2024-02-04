import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule } from 'src/nest-modules/config/config.module';
import { DatabaseModule } from 'src/nest-modules/database/database.module';
import { CategoriesModule } from './nest-modules/categories/categories.module';

@Module({
  imports: [
    NestConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
