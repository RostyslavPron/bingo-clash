import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'
import {
  createGameSession,
  joinGameSession,
} from './services/sessionService'
import {
  getPlayers,
  updateReadyStatus,
} from './services/lobbyService'

import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'

type Player = {
  id: string
  player_id: string
  display_name: string
  is_host: boolean
  is_ready: boolean
}

function App() {
  const [userId, setUserId] = useState('')
  const [gameName, setGameName] = useState('')
  const [hostName, setHostName] = useState('')
  const [displayName, setDisplayName] =
    useState('')

  const [inviteCodeInput, setInviteCodeInput] =
    useState('')

  const [inviteCode, setInviteCode] =
    useState('')
  const [sessionId, setSessionId] = useState('')
  const [players, setPlayers] = useState<Player[]>(
    []
  )

  useEffect(() => {
    const authenticate = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        await createProfile(session.user.id)
        setUserId(session.user.id)
        return
      }

      const { data } =
        await supabase.auth.signInAnonymously()

      if (data.user) {
        await createProfile(data.user.id)
        setUserId(data.user.id)
      }
    }

    authenticate()
  }, [])

  useEffect(() => {
    if (!sessionId) return

    loadPlayers()

    const channel = supabase
      .channel(`players-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_players',
        },
        () => {
          loadPlayers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  const loadPlayers = async () => {
    const data = await getPlayers(sessionId)
    setPlayers(data)
  }

  const handleCreateGame = async () => {
    const session = await createGameSession(
      gameName,
      userId,
      hostName
    )

    setInviteCode(session.invite_code)
    setSessionId(session.id)
  }

  const handleJoinGame = async () => {
    const session = await joinGameSession(
      inviteCodeInput.toUpperCase(),
      userId,
      displayName
    )

    setInviteCode(session.invite_code)
    setSessionId(session.id)
  }

  const currentPlayer = players.find(
    (p) => p.player_id === userId
  )

  const toggleReady = async () => {
    if (!currentPlayer) return

    await updateReadyStatus(
      userId,
      sessionId,
      !currentPlayer.is_ready
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
      }}
    >
      <h1>Bingo Clash</h1>

      {!sessionId ? (
        <HomePage
          hostName={hostName}
          gameName={gameName}
          displayName={displayName}
          inviteCodeInput={inviteCodeInput}
          setHostName={setHostName}
          setGameName={setGameName}
          setDisplayName={setDisplayName}
          setInviteCodeInput={setInviteCodeInput}
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
        />
      ) : (
        <LobbyPage
          inviteCode={inviteCode}
          players={players}
          isReady={currentPlayer?.is_ready ?? false}
          onToggleReady={toggleReady}
        />
      )}
    </div>
  )
}

export default App