import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CastMembersModule } from 'src/nest-modules/cast-members/cast-members.module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { SharedModule } from 'src/nest-modules/shared-module/shared.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';

@Module({
  imports: [
    NestConfigModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule,
    CastMembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
