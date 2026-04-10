import { CategoryCreated } from '../../events/category/category-created.event'
import { DomainEvent } from '../../events/domain.event'
import { CategoryName } from '../../value-objects/category-name.vo'

export class Category {
  private _events: DomainEvent[] = []

  private constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  pullEvents (): DomainEvent[] {
    const events = this._events
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
  }): Category {
    return new Category(
      data.id,
      data.name,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date()
    )
  }
}
