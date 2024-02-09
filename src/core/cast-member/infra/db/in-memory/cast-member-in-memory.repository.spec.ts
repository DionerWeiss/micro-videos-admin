import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';

describe('CastMemberInMemoryRepository', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => (repository = new CastMemberInMemoryRepository()));
  it('should no filter items when filter object is null', async () => {
    const items = [
      CastMember.fake().anActor().build(),
      CastMember.fake().aDirector().build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items by name', async () => {
    const faker = CastMember.fake().anActor();
    const items = [
      faker.withName('test').build(),
      faker.withName('TEST').build(),
      faker.withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const items = [
      CastMember.fake()
        .anActor()
        .withName('test')
        .withCreatedAt(new Date())
        .build(),
      CastMember.fake()
        .anActor()
        .withName('TEST')
        .withCreatedAt(new Date(new Date().getTime() + 1))
        .build(),
      CastMember.fake()
        .anActor()
        .withName('fake')
        .withCreatedAt(new Date(new Date().getTime() + 2))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      CastMember.fake().anActor().withName('c').build(),
      CastMember.fake().anActor().withName('b').build(),
      CastMember.fake().anActor().withName('a').build(),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});