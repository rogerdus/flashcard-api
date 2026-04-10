import { DomainEvent } from '../domain.event'

export class FlashCardCreated extends DomainEvent {
  readonly eventName = 'flashcard.created'
  constructor (
    public readonly flashcardId: string,
    public readonly categoryId: string,
    public readonly question: string
  ) {
    super()
  }
}
