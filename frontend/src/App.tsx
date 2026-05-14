import { useState, useCallback } from 'react'
import CategoryList from './components/CategoryList'
import CreateCategory from './components/CreateCategory'
import FlashcardList from './components/FlashcardList'
import CreateFlashcard from './components/CreateFlashcard'
import StudyView from './components/StudyView'
import Toast from './components/Toast'
import type { ToastData } from './types'
import './App.css'

type TabId = 'study' | 'flashcards' | 'categories'

const TABS: Record<string, TabId> = {
  STUDY: 'study',
  FLASHCARDS: 'flashcards',
  CATEGORIES: 'categories',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(TABS.FLASHCARDS)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [toast, setToast] = useState<ToastData | null>(null)

  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flashcards</h1>
        <p>Tu herramienta de estudio</p>
      </header>

      <div className="tabs" role="tablist">
        <button
          className={activeTab === TABS.STUDY ? 'active' : ''}
          onClick={() => setActiveTab(TABS.STUDY)}
          role="tab"
          aria-selected={activeTab === TABS.STUDY}
        >
          Estudiar
        </button>
        <button
          className={activeTab === TABS.FLASHCARDS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.FLASHCARDS)}
          role="tab"
          aria-selected={activeTab === TABS.FLASHCARDS}
        >
          Flashcards
        </button>
        <button
          className={activeTab === TABS.CATEGORIES ? 'active' : ''}
          onClick={() => setActiveTab(TABS.CATEGORIES)}
          role="tab"
          aria-selected={activeTab === TABS.CATEGORIES}
        >
          Categorías
        </button>
      </div>

      <div className="tab-content">
        {activeTab === TABS.FLASHCARDS && (
          <div className="fade-in">
            <CreateFlashcard onCreated={() => { refresh(); notify('Flashcard creado exitosamente') }} preselectedCategoryId={selectedCategoryId} />

            <div className="section">
              <div className="flex-between">
                <h2 className="section-title">Tus flashcards</h2>
              </div>
              <div className="mt-1">
                <CategoryList
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  refreshKey={refreshKey}
                />
              </div>
              <FlashcardList
                categoryId={selectedCategoryId}
                refreshKey={refreshKey}
              />
            </div>
          </div>
        )}

        {activeTab === TABS.STUDY && (
          <div className="fade-in">
            <StudyView />
          </div>
        )}

        {activeTab === TABS.CATEGORIES && (
          <div className="fade-in">
            <CreateCategory onCreated={() => { refresh(); notify('Categoría creada exitosamente') }} />

            <div className="section">
              <h2 className="section-title">Todas las categorías</h2>
              <CategoryList
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => {
                  setSelectedCategoryId(id)
                  setActiveTab(TABS.FLASHCARDS)
                }}
                refreshKey={refreshKey}
              />
            </div>
          </div>
        )}
      </div>

      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
