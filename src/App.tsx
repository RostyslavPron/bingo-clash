import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'

import TemplatesPage from './pages/TemplatesPage'
import TemplateEditorPage from './pages/TemplateEditorPage'
import TriviaEditorPage from './pages/TriviaEditorPage'
import TemplateContentPage from './pages/TemplateContentPage'

import {
  createTemplate,
  getTemplates,
  getTemplateEntries,
  addTemplateEntry,
  deleteTemplateEntry,
  publishTemplate,
  archiveTemplate,
} from './services/templateService'

import {
  getQuestions,
  createQuestion,
  createAnswer,
} from './services/triviaService'

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

type Question = {
  id: string
  question_text: string
  time_limit_seconds: number
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

  const [entries, setEntries] =
    useState<Entry[]>([])

  const [questions, setQuestions] =
    useState<Question[]>([])

  const [newEntry, setNewEntry] =
    useState('')

  const [activeTab, setActiveTab] =
    useState<'entries' | 'trivia'>(
      'entries'
    )

  const [questionText, setQuestionText] =
    useState('')

  const [answerA, setAnswerA] =
    useState('')

  const [answerB, setAnswerB] =
    useState('')

  const [answerC, setAnswerC] =
    useState('')

  const [answerD, setAnswerD] =
    useState('')

  const [correctAnswer, setCorrectAnswer] =
    useState('A')

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

      const entryData =
        await getTemplateEntries(
          template.id
        )

      const questionData =
        await getQuestions(template.id)

      setEntries(entryData)
      setQuestions(questionData)
    }

  const handleBack = async () => {
    setSelectedTemplate(null)

    await loadTemplates()
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

  const handlePublish =
    async () => {
      if (!selectedTemplate) return

      await publishTemplate(
        selectedTemplate.id
      )

      setSelectedTemplate({
        ...selectedTemplate,
        status: 'published',
      })

      await loadTemplates()
    }

  const handleArchive =
    async () => {
      if (!selectedTemplate) return

      await archiveTemplate(
        selectedTemplate.id
      )

      setSelectedTemplate({
        ...selectedTemplate,
        status: 'archived',
      })

      await loadTemplates()
    }

  const handleCreateQuestion =
    async () => {
      if (!selectedTemplate) return

      const question =
        await createQuestion(
          selectedTemplate.id,
          questionText,
          15
        )

      await createAnswer(
        question.id,
        answerA,
        correctAnswer === 'A'
      )

      await createAnswer(
        question.id,
        answerB,
        correctAnswer === 'B'
      )

      await createAnswer(
        question.id,
        answerC,
        correctAnswer === 'C'
      )

      await createAnswer(
        question.id,
        answerD,
        correctAnswer === 'D'
      )

      setQuestionText('')
      setAnswerA('')
      setAnswerB('')
      setAnswerC('')
      setAnswerD('')
      setCorrectAnswer('A')

      const data =
        await getQuestions(
          selectedTemplate.id
        )

      setQuestions(data)
    }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '900px',
      }}
    >
      <h1>Bingo Clash</h1>

      {!selectedTemplate ? (
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
      ) : (
        <>
          <TemplateContentPage
            templateTitle={
              selectedTemplate.title
            }
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {activeTab === 'entries' ? (
              <TemplateEditorPage
                templateTitle={
                  selectedTemplate.title
                }
                boardSize={
                  selectedTemplate.board_size
                }
                status={
                  selectedTemplate.status
                }
                entries={entries}
                newEntry={newEntry}
                setNewEntry={setNewEntry}
                onAddEntry={
                  handleAddEntry
                }
                onDeleteEntry={
                  handleDeleteEntry
                }
                onPublish={
                  handlePublish
                }
                onArchive={
                  handleArchive
                }
                onBack={handleBack}
              />
            ) : (
              <TriviaEditorPage
                questions={questions}
                questionText={
                  questionText
                }
                answerA={answerA}
                answerB={answerB}
                answerC={answerC}
                answerD={answerD}
                correctAnswer={
                  correctAnswer
                }
                setQuestionText={
                  setQuestionText
                }
                setAnswerA={setAnswerA}
                setAnswerB={setAnswerB}
                setAnswerC={setAnswerC}
                setAnswerD={setAnswerD}
                setCorrectAnswer={
                  setCorrectAnswer
                }
                onCreateQuestion={
                  handleCreateQuestion
                }
              />
            )}
          </TemplateContentPage>
        </>
      )}
    </div>
  )
}

export default App