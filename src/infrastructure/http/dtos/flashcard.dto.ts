import { FlashCard } from '../../../domain/entities/flashcard/flashcard.entity'

export interface FlashCardResponseDto {
  id: string
  question: string
  answer: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

export function toFlashCardResponseDto (
  flascard: FlashCard
): FlashCardResponseDto {
  return {
    id: flascard.id,
    question: flascard.question,
    answer: flascard.answer,
    categoryId: flascard.categoryId,
    createdAt: flascard.createdAt.toISOString(),
    updatedAt: flascard.updatedAt.toISOString()
  }
}
