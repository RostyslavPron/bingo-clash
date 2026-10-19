import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { createProfile } from './services/profileService'

function App() {
  const [userId, setUserId] = useState('Loading...')

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

      const { data, error } =
        await supabase.auth.signInAnonymously()

      if (error) {
        setUserId(`Error: ${error.message}`)
        return
      }

      if (data.user) {
        await createProfile(data.user.id)
      }

      setUserId(data.user?.id ?? 'No user')
    }

    authenticate()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bingo Clash</h1>

      <h2>User ID</h2>

      <pre>{userId}</pre>
    </div>
  )
}

export default App