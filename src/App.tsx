import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'

import TemplatesPage from './pages/TemplatesPage'
import TemplateEditorPage from './pages/TemplateEditorPage'

import {
  createTemplate,
  getTemplates,
  getTemplateEntries,
  addTemplateEntry,
  deleteTemplateEntry,
} from './services/templateService'

type Template = {
  id: string
  title: string
  board_size: number
  status: string
}

type Entry = {
  id: string
  entry_text: string
}

function App() {
  const [userId, setUserId] = useState('')
  const [title, setTitle] = useState('')
  const [boardSize, setBoardSize] =
    useState(5)

  const [templates, setTemplates] =
    useState<Template[]>([])

  const [selectedTemplate, setSelectedTemplate] =
    useState<Template | null>(null)

  const [entries, setEntries] = useState<
    Entry[]
  >([])

  const [newEntry, setNewEntry] =
    useState('')

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const { data } =
          await supabase.auth.signInAnonymously()

        if (data.user) {
          await createProfile(data.user.id)

          setUserId(data.user.id)
        }

        return
      }

      await createProfile(session.user.id)

      setUserId(session.user.id)
    }

    init()
  }, [])

  useEffect(() => {
    if (!userId) return

    loadTemplates()
  }, [userId])

  const loadTemplates = async () => {
    const data =
      await getTemplates(userId)

    setTemplates(data)
  }

  const handleCreateTemplate =
    async () => {
      await createTemplate(
        userId,
        title,
        boardSize
      )

      setTitle('')

      await loadTemplates()
    }

  const handleSelectTemplate =
    async (template: Template) => {
      setSelectedTemplate(template)

      const data =
        await getTemplateEntries(
          template.id
        )

      setEntries(data)
    }

  const handleAddEntry = async () => {
    if (!selectedTemplate) return

    if (!newEntry.trim()) return

    await addTemplateEntry(
      selectedTemplate.id,
      newEntry.trim()
    )

    setNewEntry('')

    const data =
      await getTemplateEntries(
        selectedTemplate.id
      )

    setEntries(data)
  }

  const handleDeleteEntry =
    async (entryId: string) => {
      await deleteTemplateEntry(entryId)

      if (!selectedTemplate) return

      const data =
        await getTemplateEntries(
          selectedTemplate.id
        )

      setEntries(data)
    }

  const handleBack = () => {
    setSelectedTemplate(null)
    setEntries([])
    setNewEntry('')
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
      }}
    >
      <h1>Bingo Clash</h1>

      {selectedTemplate ? (
        <TemplateEditorPage
          templateTitle={
            selectedTemplate.title
          }
          boardSize={
            selectedTemplate.board_size
          }
          entries={entries}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onAddEntry={handleAddEntry}
          onDeleteEntry={
            handleDeleteEntry
          }
          onBack={handleBack}
        />
      ) : (
        <TemplatesPage
          templates={templates}
          title={title}
          boardSize={boardSize}
          setTitle={setTitle}
          setBoardSize={setBoardSize}
          onCreateTemplate={
            handleCreateTemplate
          }
          onSelectTemplate={
            handleSelectTemplate
          }
        />
      )}
    </div>
  )
}

export default App