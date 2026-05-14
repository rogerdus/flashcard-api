import { DomainError } from './domain.error'

export class CategoryNotFoundError extends DomainError {
  constructor (id: string) {
    super(`Category with id ${id} not found`)
  }
}
