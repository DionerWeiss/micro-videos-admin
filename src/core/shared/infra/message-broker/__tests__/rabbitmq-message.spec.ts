import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { IDomainEvent } from '@core/shared/events/domain-event.interface';
import { EVENTS_MESSAGE_BROKER_CONFIG } from '@core/shared/infra/message-broker/events-message-broker-config';
import { RabbitMQMessageBroker } from '@core/shared/infra/message-broker/rabbitmq-message-broker';
import { ChannelWrapper } from 'amqp-connection-manager';

class TestEvent implements IDomainEvent {
  occurred_on: Date = new Date();
  event_version: number = 1;
  constructor(readonly aggregate_id: Uuid) {}
}

describe('RabbitMQMessageBroker Unit tests', () => {
  let service: RabbitMQMessageBroker;
  let connection: ChannelWrapper;
  beforeEach(async () => {
    connection = {
      publish: jest.fn(),
    } as any;
    service = new RabbitMQMessageBroker(connection as any);
  });

  describe('publish', () => {
    it('should publish events to channel', async () => {
      const event = new TestEvent(new Uuid());

      await service.publishEvent(event);

      expect(connection.publish).toBeCalledWith(
        EVENTS_MESSAGE_BROKER_CONFIG[TestEvent.name].exchange,
        EVENTS_MESSAGE_BROKER_CONFIG[TestEvent.name].routing_key,
        event,
      );
    });
  });
});
