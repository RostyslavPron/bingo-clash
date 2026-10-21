import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'

import TemplatesPage from './pages/TemplatesPage'
import TemplateEditorPage from './pages/TemplateEditorPage'
import TriviaEditorPage from './pages/TriviaEditorPage'
import TemplateContentPage from './pages/TemplateContentPage'
import EditQuestionPage from './pages/EditQuestionPage'
import SessionLobbyPage from './pages/SessionLobbyPage'
import {createGameSession, endSession, joinGameSession, getSession,} from './services/sessionService'
import JoinSessionPage from './pages/JoinSessionPage'


import {
  getSessionPlayers,
  leaveSession,
} from './services/playerService'

import {
  createTemplate,
  getTemplates,
  getTemplateEntries,
  addTemplateEntry,
  deleteTemplateEntry,
  publishTemplate,
  unpublishTemplate,
  deleteTemplate,
  duplicateTemplate,
} from './services/templateService'

import {
  getQuestions,
  createQuestion,
  createAnswer,
  deleteQuestion,
  updateQuestion,
  updateAnswer,
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

type Answer = {
  id: string
  answer_text: string
  is_correct: boolean
}

type Question = {
  id: string
  question_text: string
  time_limit_seconds: number
  trivia_answers: Answer[]
}

function App() {
  const [userId, setUserId] = useState('')

  const [title, setTitle] = useState('')
  const [boardSize, setBoardSize] = useState(5)

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

  const [timeLimit, setTimeLimit] =
    useState(15)

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

  const [editingQuestion, setEditingQuestion] =
    useState<Question | null>(null)
  
  const [activeSession, setActiveSession] =
    useState<any>(null)

  const [players, setPlayers] =
    useState<any[]>([])
  
  const [displayName, setDisplayName] =
    useState('')
  
  const [inviteCode, setInviteCode] =
    useState('')

  const [showJoinPage, setShowJoinPage] =
      useState(false)

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

  useEffect(() => {
  const channel = supabase
    .channel('debug-all-players')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'session_players',
      },
      (payload) => {
        console.log(
          'DEBUG PLAYER EVENT',
          payload.eventType,
          payload
        )
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

useEffect(() => {
  if (!activeSession) return

  const loadPlayers = async () => {
    const data =
      await getSessionPlayers(
        activeSession.id
      )

    setPlayers(data)
  }

  loadPlayers()

  const channel = supabase
    .channel(
      `players-${activeSession.id}`
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'session_players',
      },
      async (payload) => {
        const sessionId =
          (payload.new as any)
            ?.session_id ??
          (payload.old as any)
            ?.session_id

        if (
          sessionId !==
          activeSession.id
        )
          return

        const data =
          await getSessionPlayers(
            activeSession.id
          )

        setPlayers(data)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [activeSession])

useEffect(() => {
  if (!activeSession) return

  const channel = supabase
    .channel(
      `session-status-${activeSession.id}`
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_sessions',
      },
      (payload) => {
        const session =
          payload.new as any

        if (!session) return

        if (
          session.id ===
            activeSession.id &&
          session.status === 'ended'
        ) {
          setPlayers([])

          setActiveSession(null)

          setInviteCode('')

          alert(
            'The host ended the session.'
          )
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [activeSession])

useEffect(() => {
  if (!activeSession) return

  const interval = setInterval(async () => {
    try {
      const session = await getSession(
        activeSession.id
      )

      if (session.status === 'ended') {
        setPlayers([])

        setActiveSession(null)

        setInviteCode('')

        alert(
          'The host ended the session.'
        )
      }
    } catch (error) {
      console.error(error)
    }
  }, 2000)

  return () => clearInterval(interval)
}, [activeSession])

  const loadTemplates = async () => {
    const data =
      await getTemplates(userId)

    setTemplates(data)
  }

  const loadQuestions = async (
    templateId: string
  ) => {
    const data =
      await getQuestions(templateId)

    setQuestions(data)
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

  const handleDuplicateTemplate =
    async (
      templateId: string
    ) => {
     await duplicateTemplate(
      templateId
    )

    await loadTemplates()
    }

  const handleDeleteTemplate =
    async (
      templateId: string
    ) => {
      const confirmed =
        window.confirm(
          'Delete this template?'
        )

      if (!confirmed) return

      await deleteTemplate(templateId)

      await loadTemplates()
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

  const handleUnpublish =
    async () => {
      if (!selectedTemplate) return

      await unpublishTemplate(
       selectedTemplate.id
      )

      setSelectedTemplate({
        ...selectedTemplate,
        status: 'draft',
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
          timeLimit
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
      setTimeLimit(15)
      setAnswerA('')
      setAnswerB('')
      setAnswerC('')
      setAnswerD('')
      setCorrectAnswer('A')

      await loadQuestions(
        selectedTemplate.id
      )
    }

  const handleCreateSession =
  async () => {
    if (!selectedTemplate)
      return
    
  const session =
    await createGameSession(
      selectedTemplate.id,
      selectedTemplate.title,
      userId,
      displayName || 'Host'
    )

    const playerData =
      await getSessionPlayers(
        session.id
      )

    setPlayers(playerData)

    setActiveSession(session)
  }


  const handleDeleteQuestion =
    async (questionId: string) => {
      if (!selectedTemplate) return

      await deleteQuestion(questionId)

      await loadQuestions(
        selectedTemplate.id
      )
    }

  const handleEditQuestion = (
    question: Question
  ) => {
    setEditingQuestion(question)

    setQuestionText(
      question.question_text
    )

    setTimeLimit(
      question.time_limit_seconds
    )

    setAnswerA(
      question.trivia_answers[0]
        ?.answer_text || ''
    )

    setAnswerB(
      question.trivia_answers[1]
        ?.answer_text || ''
    )

    setAnswerC(
      question.trivia_answers[2]
        ?.answer_text || ''
    )

    setAnswerD(
      question.trivia_answers[3]
        ?.answer_text || ''
    )

    const answers =
      question.trivia_answers

    if (answers[0]?.is_correct)
      setCorrectAnswer('A')
    if (answers[1]?.is_correct)
      setCorrectAnswer('B')
    if (answers[2]?.is_correct)
      setCorrectAnswer('C')
    if (answers[3]?.is_correct)
      setCorrectAnswer('D')
  }
  const handleJoinSession =
  async () => {
    const session =
      await joinGameSession(
        inviteCode,
        userId,
        displayName || 'Player'
      )

    const playerData =
      await getSessionPlayers(
        session.id
      )

    setPlayers(playerData)

    setActiveSession(session)

    setShowJoinPage(false)
  }

  const handleLeaveSession =
  async () => {
    if (!activeSession)
      return

    const currentPlayer =
      players.find(
        (player) =>
          player.player_id === userId
      )

    if (currentPlayer?.is_host) {
      await endSession(
        activeSession.id
      )

      await leaveSession(
        activeSession.id,
        userId
      )
    } else {
      await leaveSession(
        activeSession.id,
        userId
      )
    }

    setPlayers([])

    setActiveSession(null)

    setInviteCode('')
  }

  const handleSaveEdit =
  async () => {
    if (
      !editingQuestion ||
      !selectedTemplate
    )
      return

    await updateQuestion(
      editingQuestion.id,
      questionText,
      timeLimit
    )

    await updateAnswer(
      editingQuestion.trivia_answers[0]
        .id,
      answerA,
      correctAnswer === 'A'
    )

    await updateAnswer(
      editingQuestion.trivia_answers[1]
        .id,
      answerB,
      correctAnswer === 'B'
    )

    await updateAnswer(
      editingQuestion.trivia_answers[2]
        .id,
      answerC,
      correctAnswer === 'C'
    )

    await updateAnswer(
      editingQuestion.trivia_answers[3]
        .id,
      answerD,
      correctAnswer === 'D'
    )

    setEditingQuestion(null)

    setQuestionText('')
    setTimeLimit(15)

    setAnswerA('')
    setAnswerB('')
    setAnswerC('')
    setAnswerD('')

    setCorrectAnswer('A')

    await loadQuestions(
      selectedTemplate.id
    )
  }

  if (editingQuestion) {
    return (
      <EditQuestionPage
        question={editingQuestion}
        questionText={questionText}
        timeLimit={timeLimit}
        answerA={answerA}
        answerB={answerB}
        answerC={answerC}
        answerD={answerD}
        correctAnswer={correctAnswer}
        setQuestionText={
          setQuestionText
        }
        setTimeLimit={setTimeLimit}
        setAnswerA={setAnswerA}
        setAnswerB={setAnswerB}
        setAnswerC={setAnswerC}
        setAnswerD={setAnswerD}
        setCorrectAnswer={
          setCorrectAnswer
        }
        onSave={handleSaveEdit}
        onCancel={() => {
          setEditingQuestion(null)

          setQuestionText('')
          setTimeLimit(15)

          setAnswerA('')
          setAnswerB('')
          setAnswerC('')
          setAnswerD('')

          setCorrectAnswer('A')
        }}
      />
    )
  }
  
  if (activeSession) {
    return (
      <SessionLobbyPage
        gameName={
          activeSession.game_name
        }
        inviteCode={
          activeSession.invite_code
        }
        players={players}
        onLeave={handleLeaveSession}
      />
   )
  } 
 
  if (showJoinPage) {
    return (
      <JoinSessionPage
        displayName={displayName}
        setDisplayName={
          setDisplayName
        }
        inviteCode={inviteCode}
        setInviteCode={
          setInviteCode
        }
        onJoin={handleJoinSession}
        onBack={() =>
          setShowJoinPage(false)
        }
      />
    )
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
          onDeleteTemplate={
            handleDeleteTemplate
          }
          onDuplicateTemplate={
            handleDuplicateTemplate
          }
          displayName={displayName}
          setDisplayName={setDisplayName}
          onShowJoinPage={() =>
            setShowJoinPage(true)
          }
        />
        ) : (
        <TemplateContentPage
          templateTitle={
            selectedTemplate.title
          }
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          {activeTab === 'entries' ? (
            <TemplateEditorPage
              onCreateSession={
                 handleCreateSession
              }
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
              questionCount={
                questions.length
              }
              newEntry={newEntry}
              setNewEntry={setNewEntry}
              onAddEntry={handleAddEntry}
              onDeleteEntry={
                handleDeleteEntry
              }
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onBack={handleBack}
            />
          ) : (
            <TriviaEditorPage
              status={
                selectedTemplate.status
              }
              questions={questions}
              questionText={questionText}
              timeLimit={timeLimit}
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
              setTimeLimit={
                setTimeLimit
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
              onDeleteQuestion={
                handleDeleteQuestion
              }
              onEditQuestion={
                handleEditQuestion
              }
            />
          )}
        </TemplateContentPage>
      )}
    </div>
  )
}

export default App