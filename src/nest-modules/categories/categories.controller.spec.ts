import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesModule } from 'src/nest-modules/categories/categories.module';
import { ConfigModule } from 'src/nest-modules/config/config.module';
import { DatabaseModule } from 'src/nest-modules/database/database.module';
import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
      controllers: [],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
