import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createUseCase.execute(createCategoryDto);
  }
}
