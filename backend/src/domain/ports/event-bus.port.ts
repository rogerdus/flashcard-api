import { DomainEvent } from '../events/domain.event'

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>
}
