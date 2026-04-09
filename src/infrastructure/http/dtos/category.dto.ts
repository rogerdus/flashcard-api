import { Category } from '../../../domain/entities/category/category.entity'

export interface CategoryResponseDto {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export function toCategoryResponseDto (category: Category): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  }
}
