import { CategoryArchivedError } from '../../errors/category-archived.error'
import { FlashcardLimitReachedError } from '../../errors/flashcard-limit-rached.error'
import { CategoryArchived } from '../../events/category-archived.event'
import { CategoryCreated } from '../../events/category/category-created.event'
import { DomainEvent } from '../../events/domain.event'
import { CategoryName } from '../../value-objects/category-name.vo'
import { FlashCard } from '../flashcard/flashcard.entity'

const MAX_FLASHCARDS = 50

export class Category {
  private _events: DomainEvent[] = []
  private _flashcards: FlashCard[]
  private _archivedAt: Date | null

  private constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    flashcards: FlashCard[] = [],
    archivedAt: Date | null = null
  ) {
    this._flashcards = flashcards
    this._archivedAt = archivedAt
  }

  get flashcards (): ReadonlyArray<FlashCard> {
    return this._flashcards
  }

  get isArchived (): boolean {
    return this._archivedAt !== null
  }

  addFlashcard (props: {
    id: string
    question: string
    answer: string
  }): FlashCard {
    if (this.isArchived) {
      throw new CategoryArchivedError(this.id)
    }
    if (this.flashcards.length >= MAX_FLASHCARDS) {
      throw new FlashcardLimitReachedError(MAX_FLASHCARDS)
    }

    const flashcard = FlashCard.create({
      ...props,
      categoryId: this.id
    })

    this._flashcards.push(flashcard)

    return flashcard
  }

  archive (): void {
    if (this.isArchived) {
      throw new CategoryArchivedError(this.id)
    }

    this.flashcards.forEach(flashcard => flashcard.archive())
    this._archivedAt = new Date()

    this._events.push(new CategoryArchived(this.id, this.name))
  }

  pullEvents (): DomainEvent[] {
    const flashcardEvents = this._flashcards.flatMap(f => f.pullEvent())
    const events = [...this._events, ...flashcardEvents]
    this._events = []
    return events
  }

  static create (props: { id: string; name: string }): Category {
    const name = new CategoryName(props.name)

    const category = new Category(props.id, name.value, new Date(), new Date())

    category._events.push(new CategoryCreated(category.id, category.name))

    return category
  }

  static fromPrimitives (data: {
    id: string
    name: string
    createdAt: Date | null
    updatedAt: Date | null
    flashcards?: Array<{
      id: string
      question: string
      answer: string
      categoryId: string
      createdAt: Date | null
      updatedAt: Date | null
      archivedAt?: Date | null
    }>
    archivedAt?: Date | null
  }): Category {
    const flashcards = (data.flashcards ?? []).map(FlashCard.fromPrimitives)
    return new Category(
      data.id,
      data.name,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
      flashcards,
      data.archivedAt ?? null
    )
  }
}
