import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError,
} from '@core/cast-member/domain/cast-member-type.vo';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberModelMapper } from '@core/cast-member/infra/db/sequelize/cast-member-model-mapper';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { setupSequelize } from '@core/shared/infra/testing/helper';

describe('CastMemberModelMapper Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });
  it('should throws error when cast member is invalid', () => {
    const model = CastMemberModel.build({
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    });
    try {
      CastMemberModelMapper.toEntity(model);
      fail(
        'The cast member is valid, but it needs throws a InvalidCastMemberTypeError',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidCastMemberTypeError);
    }
  });

  it('should convert a cast member model to a cast member aggregate', () => {
    const created_at = new Date();
    const model = CastMemberModel.build({
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'some value',
      type: CastMemberTypes.ACTOR,
      created_at,
    });
    const aggregate = CastMemberModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new CastMember({
        cast_member_id: new CastMemberId(
          '9366b7dc-2d71-4799-b91c-c64adb205104',
        ),
        name: 'some value',
        type: new CastMemberType(CastMemberTypes.ACTOR),
        created_at,
      }).toJSON(),
    );
  });
});
