import { IDomainEvent } from '@core/shared/events/domain-event.interface';

export interface IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void>;
}
