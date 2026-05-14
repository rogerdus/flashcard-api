import { DomainError } from './domain.error'

export class FlashcardLimitReachedError extends DomainError {
  constructor (limit: number) {
    super(`Category cannot have more than ${limit} flashcards`)
  }
}
