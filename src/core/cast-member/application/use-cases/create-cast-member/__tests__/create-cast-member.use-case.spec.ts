import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { CastMemberTypes } from '@core/cast-member/domain/cast-member-type.vo';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(repository);
    jest.restoreAllMocks();
  });

  describe('execute method', () => {
    it('should throw an error', async () => {
      const insertError = new Error('insert error');
      jest.spyOn(repository, 'insert').mockRejectedValue(insertError);
      await expect(
        useCase.execute({
          name: 'test',
          type: CastMemberTypes.ACTOR,
        }),
      ).rejects.toThrow(insertError);
    });

    it('should create a cast member', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      let output = await useCase.execute({
        name: 'test',
        type: CastMemberTypes.ACTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: repository.items[0].cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.ACTOR,
        created_at: repository.items[0].created_at,
      });

      output = await useCase.execute({
        name: 'test',
        type: CastMemberTypes.DIRECTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: repository.items[1].cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.DIRECTOR,
        created_at: repository.items[1].created_at,
      });
    });
  });
});
