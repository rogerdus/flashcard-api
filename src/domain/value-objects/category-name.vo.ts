export class CategoryName {
  readonly value: string

  constructor (value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Category name is required')
    }
    if (value.trim().length < 3) {
      throw new Error('Category name must be at least 3 characters long')
    }
    this.value = value.trim();
  }
}
