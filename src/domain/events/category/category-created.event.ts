import { DomainEvent } from '../domain.event'

export class CategoryCreated extends DomainEvent {
  readonly eventName = 'category.created'

  constructor (
    public readonly categoryId: string,
    public readonly name: string
  ) {
    super()
  }
}
