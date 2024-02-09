import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError,
} from '../cast-member-type.vo';

describe('CastMemberType Unit Tests', () => {
  it('should return error when type is invalid', () => {
    const validateSpy = jest.spyOn(CastMemberType.prototype, 'validate' as any);
    expect(() => CastMemberType.create('1' as any)).toThrow(
      new InvalidCastMemberTypeError('1'),
    );
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a director', () => {
    const director1 = CastMemberType.create(CastMemberTypes.DIRECTOR);
    expect(director1).toBeInstanceOf(CastMemberType);
    expect(director1.type).toBe(CastMemberTypes.DIRECTOR);

    const director2 = CastMemberType.createADirector();
    expect(director2).toBeInstanceOf(CastMemberType);
    expect(director2.type).toBe(CastMemberTypes.DIRECTOR);
  });

  it('should create an actor', () => {
    const actor1 = CastMemberType.create(CastMemberTypes.ACTOR);
    expect(actor1).toBeInstanceOf(CastMemberType);
    expect(actor1.type).toBe(CastMemberTypes.ACTOR);

    const actor2 = CastMemberType.createAnActor();
    expect(actor2).toBeInstanceOf(CastMemberType);
    expect(actor2.type).toBe(CastMemberTypes.ACTOR);
  });
});
