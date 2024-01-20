import { Sequelize } from "sequelize-typescript";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";

describe("CategorySequelizeRepository Integration Test", () => {
  let sequelize;
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
    });

    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  test("should insert a new category", async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const model = await CategoryModel.findByPk(category.category_id.id);

    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
