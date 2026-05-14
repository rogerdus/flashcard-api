import { FlashCard } from '../../entities/flashcard/flashcard.entity'

export interface FlashcardRepository {
  save(data: FlashCard): Promise<FlashCard>
  findAll(categoryId?: string): Promise<FlashCard[]>
  findById(id: string): Promise<FlashCard | null>
}
