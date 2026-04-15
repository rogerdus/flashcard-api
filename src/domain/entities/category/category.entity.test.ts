import { describe, it, expect } from 'vitest'
import { Category } from './category.entity'
import { CategoryArchivedError } from '../../errors/category-archived.error'
import { FlashcardLimitReachedError } from '../../errors/flashcard-limit-rached.error'

describe('Category Aggregate', () => {
  // ---- create ----
  describe('create', () => {
    it('crea una categoría válida', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })

      expect(category.id).toBeDefined()
      expect(category.name).toBe('JavaScript')
      expect(category.isArchived).toBe(false)
      expect(category.flashcards).toHaveLength(0)
    })

    it('emite el evento CategoryCreated', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      const events = category.pullEvents()

      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('category.created')
    })

    it('lanza error si el nombre es inválido', () => {
      expect(() => Category.create({ id: 'cat-123', name: '' })).toThrow(
        'Category name is required'
      )

      expect(() => Category.create({ id: 'cat-123', name: 'ab' })).toThrow(
        'at least 3 characters'
      )
    })
  })

  // ---- addFlashcard ----
  describe('addFlashcard', () => {
    it('agrega una flashcard válida', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })

      const flashcard = category.addFlashcard({
        id: 'flash-1',
        question: '¿Qué es closure?',
        answer: 'Una función que recuerda su ámbito léxico'
      })

      expect(flashcard.id).toBeDefined()
      expect(flashcard.categoryId).toBe(category.id)
      expect(category.flashcards).toHaveLength(1)
    })

    it('emite el evento FlashcardCreated al agregar', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.pullEvents() // limpia CategoryCreated

      category.addFlashcard({
        id: 'flash-1',
        question: '¿Qué es closure?',
        answer: 'Una función que recuerda su ámbito léxico'
      })

      const events = category.pullEvents()
      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('flashcard.created')
    })

    it('lanza error si la categoría está archivada', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.archive()

      expect(() =>
        category.addFlashcard({
          id: 'flash-1',
          question: '¿Qué es closure?',
          answer: 'Una función que recuerda su ámbito léxico'
        })
      ).toThrow(CategoryArchivedError)
    })

    it('lanza error al superar el límite de 50 flashcards', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })

      // Agrega 50 flashcards
      for (let i = 0; i < 50; i++) {
        category.addFlashcard({
          id: `flash-${i}`,
          question: `¿Pregunta ${i}?`,
          answer: `Respuesta ${i}`
        })
      }

      expect(() =>
        category.addFlashcard({
          id: 'flash-51',
          question: '¿Pregunta 51?',
          answer: 'Respuesta 51'
        })
      ).toThrow(FlashcardLimitReachedError)
    })

    it('lanza error si la pregunta es inválida', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })

      expect(() =>
        category.addFlashcard({
          id: 'flash-1',
          question: '',
          answer: 'Una respuesta válida'
        })
      ).toThrow('Question is required')
    })
  })

  // ---- archive ----
  describe('archive', () => {
    it('archiva la categoría correctamente', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      expect(category.isArchived).toBe(false)

      category.archive()

      expect(category.isArchived).toBe(true)
    })

    it('archiva todas las flashcards internas', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.addFlashcard({
        id: 'flash-1',
        question: '¿Qué es closure?',
        answer: 'Una función que recuerda su ámbito léxico'
      })
      category.addFlashcard({
        id: 'flash-2',
        question: '¿Qué es hoisting?',
        answer: 'Elevación de declaraciones'
      })

      category.archive()

      expect(category.flashcards.every(f => f.isArchived)).toBe(true)
    })

    it('emite el evento CategoryArchived', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.pullEvents() // limpia CategoryCreated

      category.archive()

      const events = category.pullEvents()
      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('category.archived')
    })

    it('lanza error si ya está archivada', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.archive()

      expect(() => category.archive()).toThrow(CategoryArchivedError)
    })
  })

  // ---- fromPrimitives ----
  describe('fromPrimitives', () => {
    it('reconstituye el aggregate con sus flashcards', () => {
      const now = new Date()
      const category = Category.fromPrimitives({
        id: 'cat-123',
        name: 'JavaScript',
        createdAt: now,
        updatedAt: now,
        flashcards: [
          {
            id: 'flash-1',
            question: '¿Qué es closure?',
            answer: 'Una función que recuerda su ámbito léxico',
            categoryId: 'cat-123',
            createdAt: now,
            updatedAt: now
          }
        ]
      })

      expect(category.flashcards).toHaveLength(1)
      expect(category.flashcards[0].id).toBe('flash-1')
    })

    it('no emite eventos al reconstituir', () => {
      const now = new Date()
      const category = Category.fromPrimitives({
        id: 'cat-123',
        name: 'JavaScript',
        createdAt: now,
        updatedAt: now
      })

      expect(category.pullEvents()).toHaveLength(0)
    })

    it('reconstituye correctamente el estado archivado', () => {
      const now = new Date()
      const category = Category.fromPrimitives({
        id: 'cat-123',
        name: 'JavaScript',
        createdAt: now,
        updatedAt: now,
        archivedAt: now
      })

      expect(category.isArchived).toBe(true)
    })
  })

  // ---- pullEvents ----
  describe('pullEvents', () => {
    it('recoge eventos propios y de flashcards internas', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.addFlashcard({
        id: 'flash-1',
        question: '¿Qué es closure?',
        answer: 'Una función que recuerda su ámbito léxico'
      })

      const events = category.pullEvents()

      // CategoryCreated + FlashcardCreated
      expect(events).toHaveLength(2)
      expect(events.map(e => e.eventName)).toContain('category.created')
      expect(events.map(e => e.eventName)).toContain('flashcard.created')
    })

    it('limpia los eventos después de llamar pullEvents', () => {
      const category = Category.create({ id: 'cat-123', name: 'JavaScript' })
      category.pullEvents()

      expect(category.pullEvents()).toHaveLength(0)
    })
  })
})
