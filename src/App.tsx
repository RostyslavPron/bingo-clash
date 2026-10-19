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

      {!sessionId && (
        <>
          <h2>Create Game</h2>

          <input
            type="text"
            placeholder="Your Display Name"
            value={hostName}
            onChange={(e) =>
              setHostName(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Game Name"
            value={gameName}
            onChange={(e) =>
              setGameName(e.target.value)
            }
          />

          <br />
          <br />

          <button onClick={handleCreateGame}>
            Create Game
          </button>

          <hr />

          <h2>Join Game</h2>

          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) =>
              setDisplayName(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Invite Code"
            value={inviteCodeInput}
            onChange={(e) =>
              setInviteCodeInput(
                e.target.value
              )
            }
          />

          <br />
          <br />

          <button onClick={handleJoinGame}>
            Join Game
          </button>
        </>
      )}

      {sessionId && (
        <>
          <h2>Lobby</h2>

          <p>
            <strong>Invite Code:</strong>{' '}
            {inviteCode}
          </p>

          <button onClick={toggleReady}>
            {currentPlayer?.is_ready
              ? 'Not Ready'
              : 'Ready'}
          </button>

          <h3>Players</h3>

          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.is_ready ? '✅' : '⏳'}{' '}
                {player.display_name}
                {player.is_host
                  ? ' (Host)'
                  : ''}
              </li>
            ))}
          </ul>

          <p>
            Waiting for host to start...
          </p>
        </>
      )}
    </div>
  )
}

export default App