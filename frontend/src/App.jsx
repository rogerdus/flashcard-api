import { useState, useCallback } from 'react'
import CategoryList from './components/CategoryList'
import CreateCategory from './components/CreateCategory'
import FlashcardList from './components/FlashcardList'
import CreateFlashcard from './components/CreateFlashcard'
import StudyView from './components/StudyView'
import './App.css'

const TABS = {
  STUDY: 'study',
  FLASHCARDS: 'flashcards',
  CATEGORIES: 'categories',
}

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.FLASHCARDS)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flashcards</h1>
        <p>Tu herramienta de estudio</p>
      </header>

      <div className="tabs">
        <button
          className={activeTab === TABS.STUDY ? 'active' : ''}
          onClick={() => setActiveTab(TABS.STUDY)}
        >
          Estudiar
        </button>
        <button
          className={activeTab === TABS.FLASHCARDS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.FLASHCARDS)}
        >
          Flashcards
        </button>
        <button
          className={activeTab === TABS.CATEGORIES ? 'active' : ''}
          onClick={() => setActiveTab(TABS.CATEGORIES)}
        >
          Categorías
        </button>
      </div>

      {activeTab === TABS.FLASHCARDS && (
        <>
          <CreateFlashcard
            onCreated={refresh}
            preselectedCategoryId={selectedCategoryId}
          />

          <div className="section">
            <div className="flex-between">
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Tus flashcards
              </h2>
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
        </>
      )}

      {activeTab === TABS.STUDY && <StudyView />}

      {activeTab === TABS.CATEGORIES && (
        <>
          <CreateCategory onCreated={refresh} />

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
        </>
      )}
    </div>
  )
}
