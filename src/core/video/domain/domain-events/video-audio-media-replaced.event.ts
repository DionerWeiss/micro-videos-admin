import {
  IDomainEvent,
  IIntegrationEvent,
} from '@core/shared/domain/events/domain-event.interface';
import { Trailer } from '@core/video/domain/trailer.vo';
import { VideoMedia } from '@core/video/domain/video-media.vo';
import { VideoId } from '@core/video/domain/video.aggregate';

type VideoAudioMediaReplacedProps = {
  aggregate_id: VideoId;
  media: Trailer | VideoMedia;
  media_type: 'trailer' | 'video';
};

export class VideoAudioMediaReplaced implements IDomainEvent {
  aggregate_id: VideoId;
  occurred_on: Date;
  event_version: number;

  readonly media: Trailer | VideoMedia;
  readonly media_type: 'trailer' | 'video';

  constructor(props: VideoAudioMediaReplacedProps) {
    this.aggregate_id = props.aggregate_id;
    this.media = props.media;
    this.media_type = props.media_type;
    this.occurred_on = new Date();
    this.event_version = 1;
  }

  //@ts-expect-error - this is not a formal event
  getIntegrationEvent(): VideoAudioMediaUploadedIntegrationEvent {
    return new VideoAudioMediaUploadedIntegrationEvent(this);
  }
}

//@ts-expect-error - this is not a formal event
export class VideoAudioMediaUploadedIntegrationEvent
  implements IIntegrationEvent
{
  resource_id: string;
  file_path: string;
  // event_name: string;
  // payload: any;
  // event_version: number;
  // occurred_on: Date;
  constructor(event: VideoAudioMediaReplaced) {
    this.resource_id = `${event.aggregate_id.id}.${event.media_type}`;
    this.file_path = event.media.raw_url;
    // this.event_version = event.event_version;
    // this.occurred_on = event.occurred_on;
    // this.payload = {
    //   video_id: event.aggregate_id.id,
    //   media: event.media.toJSON(),
    // };
    // this.event_name = this.constructor.name;
  }
}
