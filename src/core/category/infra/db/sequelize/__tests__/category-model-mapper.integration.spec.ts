import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { CategoryModelMapper } from '@core/category/infra/db/sequelize/category-model-mapper';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { setupSequelize } from '@core/shared/infra/testing/helper';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should throws error when category is invalid', () => {
    const model = CategoryModel.build({
      category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail(
        'The category is valid, but it needs throws a EntityValidationError',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  it('should convert a category model to a category aggregate', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new CategoryId('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        description: 'some description',
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });

  test('should convert a category aggregate to a category model', () => {
    const created_at = new Date();
    const aggregate = new Category({
      category_id: new CategoryId('5490020a-e866-4229-9adc-aa44b83234c4'),
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
    const model = CategoryModelMapper.toModel(aggregate);
    expect(model.toJSON()).toStrictEqual({
      category_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
  });
});
