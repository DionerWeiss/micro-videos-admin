import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CastMembersModule } from 'src/nest-modules/cast-members/cast-members.module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { EventModule } from 'src/nest-modules/event-module/event.module';
import { GenresModule } from 'src/nest-modules/genres-module/genres.module';
import { SharedModule } from 'src/nest-modules/shared-module/shared.module';
import { UseCaseModule } from 'src/nest-modules/use-case-module/use-case.module';
import { VideosModule } from 'src/nest-modules/videos-module/videos.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';

@Module({
  imports: [
    NestConfigModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    EventModule,
    SharedModule,
    CastMembersModule,
    UseCaseModule,
    GenresModule,
    VideosModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@rabbitmq:5672',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
