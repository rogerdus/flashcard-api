export class Answer {
  readonly value: string
  constructor (value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Answer is required')
    }

    this.value = value.trim();
  }
}
