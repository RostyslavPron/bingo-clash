import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'
import { createGameSession } from './services/sessionService'

function App() {
  const [userId, setUserId] = useState('')
  const [gameName, setGameName] = useState('')
  const [message, setMessage] = useState('')

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

  const handleCreateGame = async () => {
    try {
      const session = await createGameSession(
        gameName,
        userId
      )

      setMessage(
        `Invite Code: ${session.invite_code}`
      )
    } catch (error) {
      console.error(error)

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unknown error'
      )
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bingo Clash</h1>

      <p>User: {userId}</p>

      <input
        type="text"
        placeholder="Game Name"
        value={gameName}
        onChange={(e) =>
          setGameName(e.target.value)
        }
      />

      <button onClick={handleCreateGame}>
        Create Game
      </button>

      <pre>{message}</pre>
    </div>
  )
}

export default App
