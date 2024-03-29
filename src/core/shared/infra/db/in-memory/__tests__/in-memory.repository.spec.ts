import { CategoryId } from '@core/category/domain/category.aggregate';
import { Entity } from '@core/shared/domain/entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InMemoryRepository } from '@core/shared/infra/db/in-memory/in-memory.repository';

type StubEntityConstructorProps = {
  entity_id?: CategoryId;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: CategoryId;
  name: string;
  price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id || new CategoryId();
    this.name = props.name;
    this.price = this.price;
  }

  toJSON() {
    return {
      entityId: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<
  StubEntity,
  CategoryId
> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      entity_id: new CategoryId(),
      name: 'Test',
      price: 100,
    });

    await repository.insert(entity);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toBe(entity);
  });

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new CategoryId(),
        name: 'Test',
        price: 100,
      }),
      new StubEntity({
        entity_id: new CategoryId(),
        name: 'Test',
        price: 100,
      }),
    ];

    await repository.bulkInsert(entities);

    expect(repository.items.length).toBe(2);
    expect(repository.items[0]).toBe(entities[0]);
    expect(repository.items[1]).toBe(entities[1]);
  });

  test('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 });
    await repository.insert(entity);

    const entities = await repository.findAll();

    expect(entities).toStrictEqual([entity]);
  });

  test('should throws error on update when entity not found', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity),
    );
  });

  test('should updates an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 });
    await repository.insert(entity);

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: 'updated',
      price: 1,
    });
    await repository.update(entityUpdated);
    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  test('should throws error on delete when entity not found', async () => {
    const categoryId = new CategoryId();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, StubEntity),
    );

    await expect(
      repository.delete(new CategoryId('9366b7dc-2d71-4799-b91c-c64adb205104')),
    ).rejects.toThrow(
      new NotFoundError('9366b7dc-2d71-4799-b91c-c64adb205104', StubEntity),
    );
  });

  test('should deletes an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 });
    await repository.insert(entity);

    await repository.delete(entity.entity_id);
    expect(repository.items).toHaveLength(0);
  });
});
