export class FlashCard {
  private constructor (
    public readonly id: string,
    public readonly question: string,
    public readonly answer: string,
    public readonly categoryId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create (props: {
    id: string
    question: string
    answer: string
    categoryId: string
  }): FlashCard {
    if (!props.question || props.question.trim().length === 0) {
      throw new Error('Question is required')
    }

    if (!props.answer || props.answer.trim().length === 0) {
      throw new Error('Answer is required')
    }

    if (!props.categoryId) {
      throw new Error('Category is required')
    }

    return new FlashCard(
      props.id,
      props.question,
      props.answer,
      props.categoryId,
      new Date(),
      new Date()
    )
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
