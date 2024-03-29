import { FileMediaInput } from '@core/video/application/common/file-media.input';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';

export type UploadImageMediasInputConstructorProps = {
  video_id: string;
  field: 'banner' | 'thumbnail' | 'thumbnail_half';
  file: FileMediaInput;
};

export class UploadImageMediasInput {
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @IsNotEmpty()
  @IsIn(['banner', 'thumbnail', 'thumbnail_half'])
  field: 'banner' | 'thumbnail' | 'thumbnail_half';

  @ValidateNested()
  file: FileMediaInput;

  constructor(props: UploadImageMediasInputConstructorProps) {
    if (!props) return;

    this.field = props.field;
    this.file = props.file;
    this.video_id = props.video_id;
  }
}

export class ValidateUploadImageMediasInput {
  static validate(input: UploadImageMediasInput) {
    return validateSync(input);
  }
}
