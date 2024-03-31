import { IDomainEvent } from '@core/shared/events/domain-event.interface';

export interface IMessageBroker {
  publishEvent(event: IDomainEvent): Promise<void>;
}
