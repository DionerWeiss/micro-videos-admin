import { Sequelize } from "sequelize-typescript";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
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
      logging: false,
    });

    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  test("should insert a new category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const entity = await repository.findById(category.category_id);

    expect(entity.toJSON()).toStrictEqual(category.toJSON());
  });

  test("should finds a new entity by id", async () => {
    let entityFound = await repository.findById(new Uuid());
    expect(entityFound).toBeNull();

    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  test("should return all categories", async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  test("should throw error on update when an entity not found", async () => {
    const entity = Category.fake().aCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.category_id.id, Category)
    );
  });

  test("should update an entity", async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    entity.changeName("Movie updated");
    await repository.update(entity);

    const entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  test("should throw error on delete when an entity not found", async () => {
    const categoryId = new Uuid();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    );
  });

  test("should delete a entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    await repository.delete(entity.category_id);
    await expect(repository.findById(entity.category_id)).resolves.toBeNull();
  });
});
