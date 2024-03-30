import { ApplicationService } from '@core/shared/application/application.service';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { DomainEventMediator } from '@core/shared/events/domain-event-mediator';
import { Global, Module, Scope } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventMediator: DomainEventMediator,
      ) => {
        return new ApplicationService(uow, domainEventMediator);
      },
      inject: ['UnitOfWork', DomainEventMediator],
      scope: Scope.REQUEST,
    },
  ],
  exports: [ApplicationService],
})
export class UseCaseModule {}
