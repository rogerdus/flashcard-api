export class Category {
  private constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create (props: { id: string; name: string }): Category {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Category name is required')
    }
    return new Category(props.id, props.name, new Date(), new Date())
  }

  static fromPrimitives (data: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
  }): Category {
    return new Category(data.id, data.name, data.createdAt, data.updatedAt)
  }
}
