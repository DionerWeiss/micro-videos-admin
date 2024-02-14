import {
  CastMemberType,
  CastMemberTypes,
} from '@core/cast-member/domain/cast-member-type.vo';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberModelMapper } from '@core/cast-member/infra/db/sequelize/cast-member-model-mapper';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { LoadEntityError } from '@core/shared/domain/validators/validation.error';
import { setupSequelize } from '@core/shared/infra/testing/helper';

describe('CastMemberModelMapper Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  it('should throws error when cast member is invalid', () => {
    const model = CastMemberModel.build({
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    });
    try {
      CastMemberModelMapper.toEntity(model);
      fail('The cast member is valid, but it needs throws a LoadEntityError');
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect((e as LoadEntityError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
        { type: ['Invalid cast member type: undefined'] },
      ]);
    }
  });

  it('should convert a cast member model to a cast member entity', () => {
    const created_at = new Date();
    const model = CastMemberModel.build({
      cast_member_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      type: CastMemberTypes.ACTOR,
      created_at,
    });
    const entity = CastMemberModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new CastMember({
        cast_member_id: new CastMemberId(
          '5490020a-e866-4229-9adc-aa44b83234c4',
        ),
        name: 'some value',
        type: CastMemberType.createAnActor(),
        created_at,
      }).toJSON(),
    );
  });
});
