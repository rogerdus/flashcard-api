import { DomainEvent } from '../../events/domain.event'
import { FlashCardCreated } from '../../events/flashcard/flashcard-created.event'
import { Answer } from '../../value-objects/answer.vo'
import { Question } from '../../value-objects/question.vo'

export class FlashCard {
  private _events: DomainEvent[] = [];

  private constructor (
    public readonly id: string,
    public readonly question: string,
    public readonly answer: string,
    public readonly categoryId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  pullEvent (): DomainEvent[] {
    const events = this._events
    this._events = []
    return events
  }

  static create (props: {
    id: string
    question: string
    answer: string
    categoryId: string
  }): FlashCard {
    const question = new Question(props.question)
    const answer = new Answer(props.answer)

    if (!props.categoryId) {
      throw new Error('Category is required')
    }

    const flashcard = new FlashCard(
      props.id,
      question.value,
      answer.value,
      props.categoryId,
      new Date(),
      new Date()
    )

    flashcard._events.push(
      new FlashCardCreated(
        flashcard.id,
        flashcard.categoryId,
        flashcard.question
      )
    )
    return flashcard
  }

  static fromPrimitives (data: {
    id: string
    question: string
    answer: string
    categoryId: string
    createdAt: Date | null
    updatedAt: Date | null
  }): FlashCard {
    return new FlashCard(
      data.id,
      data.question,
      data.answer,
      data.categoryId,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    )
  }
}
