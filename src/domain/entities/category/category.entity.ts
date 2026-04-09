import { CategoryName } from '../../value-objects/category-name.vo'

export class Category {
  private constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create (props: { id: string; name: string }): Category {
    const name = new CategoryName(props.name)
    return new Category(props.id, props.name, new Date(), new Date())
  }

  static fromPrimitives (data: {
    id: string
    name: string
    createdAt: Date | null
    updatedAt: Date | null
  }): Category {
    return new Category(
      data.id,
      data.name,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date()
    )
  }
}
