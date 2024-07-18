import { Module } from '@nestjs/common';
import { AuthModule } from 'src/nest-modules/auth-module/auth.module';
import { CastMembersModule } from 'src/nest-modules/cast-members/cast-members.module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { EventModule } from 'src/nest-modules/event-module/event.module';
import { GenresModule } from 'src/nest-modules/genres-module/genres.module';
import { RabbitmqModule } from 'src/nest-modules/rabbitmq-module/rabbitmq.module';
import { SharedModule } from 'src/nest-modules/shared-module/shared.module';
import { UseCaseModule } from 'src/nest-modules/use-case-module/use-case.module';
import { VideosModule } from 'src/nest-modules/videos-module/videos.module';
import { RabbitMQFakeConsumer } from 'src/rabbitmq-fake.consumer';
import { RabbitmqFakeController } from 'src/rabbitmq-fake/rabbitmq-fake.controller';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    DatabaseModule,
    EventModule,
    UseCaseModule,
    RabbitmqModule.forRoot(),
    AuthModule,
    CategoriesModule,
    CastMembersModule,
    GenresModule,
    VideosModule,
  ],
  providers: [RabbitMQFakeConsumer],
  controllers: [RabbitmqFakeController],
})
export class AppModule {}
