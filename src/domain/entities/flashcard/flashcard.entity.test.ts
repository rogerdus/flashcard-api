import { describe, it, expect } from 'vitest'
import { FlashCard } from './flashcard.entity'

describe('Flashcard', () => {
  describe('create', () => {
    it('crea una flashcard válida', () => {
      const flashcard = FlashCard.create({
        id: 'flash-123',
        question: '¿Qué es DDD?',
        answer: 'Domain Driven Design',
        categoryId: '1'
      })

      expect(flashcard.id).toBeDefined()
      expect(flashcard.question).toBe('¿Qué es DDD?')
      expect(flashcard.answer).toBe('Domain Driven Design')
    })

    it('limpia espacios de question y answer', () => {
      const flashcard = FlashCard.create({
        id: 'flash-123',
        question: '  ¿Qué es DDD?  ',
        answer: '  Domain Driven Design  ',
        categoryId: '1'
      })

      expect(flashcard.question).toBe('¿Qué es DDD?')
      expect(flashcard.answer).toBe('Domain Driven Design')
    })

    it('acumula el evento FlashcardCreated', () => {
      const flashcard = FlashCard.create({
        id: 'flash-123',
        question: '¿Qué es DDD?',
        answer: 'Domain Driven Design',
        categoryId: '1'
      })

      const events = flashcard.pullEvent()
      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('flashcard.created')
    })
  })

  describe('fromPrimitives', () => {
    it('reconstituye una flashcard sin eventos', () => {
      const now = new Date()
      const flashcard = FlashCard.fromPrimitives({
        id: 'flash-123',
        question: '¿Qué es DDD?',
        answer: 'Domain Driven Design',
        categoryId: '1',
        createdAt: now,
        updatedAt: now
      })

      expect(flashcard.id).toBe('flash-123')
      expect(flashcard.pullEvent()).toHaveLength(0)
    })
  })
})
