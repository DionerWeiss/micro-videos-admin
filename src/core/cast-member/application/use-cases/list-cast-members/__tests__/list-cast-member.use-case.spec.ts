import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { ListCastMembersUseCase } from '@core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberSearchResult } from '@core/cast-member/domain/cast-member.repository';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { SortDirection } from '@core/shared/domain/repository/search-params';

describe('ListCastMembersUseCase Unit Tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new ListCastMembersUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new CastMemberSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = CastMember.fake().anActor().build();
    result = new CastMemberSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(CastMemberOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should search sorted by created_at when input param is empty', async () => {
    const items = [
      CastMember.fake().anActor().build(),
      CastMember.fake()
        .anActor()
        .withCreatedAt(new Date(new Date().getTime() + 100))
        .build(),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should search applying paginate and filter by name', async () => {
    const created_at = new Date();
    const castMembers = [
      CastMember.fake()
        .anActor()
        .withName('test')
        .withCreatedAt(created_at)
        .build(),
      CastMember.fake()
        .anActor()
        .withName('a')
        .withCreatedAt(created_at)
        .build(),
      CastMember.fake()
        .anActor()
        .withName('TEST')
        .withCreatedAt(created_at)
        .build(),
      CastMember.fake()
        .anActor()
        .withName('TeSt')
        .withCreatedAt(created_at)
        .build(),
    ];
    await repository.bulkInsert(castMembers);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      filter: 'TEST',
    });
    expect(output).toStrictEqual({
      items: [castMembers[0], castMembers[2]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      filter: 'TEST',
    });
    expect(output).toStrictEqual({
      items: [castMembers[3]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });

  it('should search applying paginate and sort', async () => {
    expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);

    const castMembers = [
      CastMember.fake().anActor().withName('b').build(),
      CastMember.fake().anActor().withName('a').build(),
      CastMember.fake().anActor().withName('d').build(),
      CastMember.fake().anActor().withName('e').build(),
      CastMember.fake().anActor().withName('c').build(),
    ];
    await repository.bulkInsert(castMembers);

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
        },
        output: {
          items: [castMembers[1], castMembers[0]].map(
            CastMemberOutputMapper.toOutput,
          ),
          total: 5,
          current_page: 1,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
        },
        output: {
          items: [castMembers[4], castMembers[2]].map(
            CastMemberOutputMapper.toOutput,
          ),
          total: 5,
          current_page: 2,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'desc' as SortDirection,
        },
        output: {
          items: [castMembers[3], castMembers[2]].map(
            CastMemberOutputMapper.toOutput,
          ),
          total: 5,
          current_page: 1,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          sort_dir: 'desc' as SortDirection,
        },
        output: {
          items: [castMembers[4], castMembers[0]].map(
            CastMemberOutputMapper.toOutput,
          ),
          total: 5,
          current_page: 2,
          per_page: 2,
          last_page: 3,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
    }
  });

  describe('should search applying filter by name, sort and paginate', () => {
    const castMembers = [
      CastMember.fake().anActor().withName('test').build(),
      CastMember.fake().anActor().withName('a').build(),
      CastMember.fake().anActor().withName('TEST').build(),
      CastMember.fake().anActor().withName('e').build(),
      CastMember.fake().aDirector().withName('TeSt').build(),
    ];

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'TEST',
        },
        output: {
          items: [castMembers[2], castMembers[4]].map(
            CastMemberOutputMapper.toOutput,
          ),
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'TEST',
        },
        output: {
          items: [castMembers[0]].map(CastMemberOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await repository.bulkInsert(castMembers);
    });

    test.each(arrange)(
      'when value is $search_params',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toStrictEqual(expectedOutput);
      },
    );
  });
});
