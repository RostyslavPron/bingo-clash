import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'
import { createGameSession } from './services/sessionService'
import { getPlayers } from './services/lobbyService'

type Player = {
  id: string
  display_name: string
  is_host: boolean
}

function App() {
  const [userId, setUserId] = useState('')
  const [gameName, setGameName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [players, setPlayers] = useState<Player[]>([])

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
      .channel('players')
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
      userId
    )

    setInviteCode(session.invite_code)
    setSessionId(session.id)
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
          <input
            type="text"
            placeholder="Game Name"
            value={gameName}
            onChange={(e) =>
              setGameName(e.target.value)
            }
          />

          <button
            onClick={handleCreateGame}
          >
            Create Game
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

          <h3>Players</h3>

          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.display_name}

                {player.is_host &&
                  ' (Host)'}
              </li>
            ))}
          </ul>

          <p>
            Waiting for players...
          </p>
        </>
      )}
    </div>
  )
}

export default App