import { supabase } from '../lib/supabase'

export async function getSessionPlayers(
  sessionId: string
) {
  const { data, error } =
    await supabase
      .from('session_players')
      .select('*')
      .eq('session_id', sessionId)
      .order('joined_at')

  if (error) {
    throw error
  }

  return data
}

export async function setReadyStatus(
  playerId: string,
  isReady: boolean
) {
  const { error } = await supabase
    .from('session_players')
    .update({
      is_ready: isReady,
    })
    .eq('id', playerId)

  if (error) {
    throw error
  }
}

export async function leaveSession(
  sessionId: string,
  playerId: string
) {
  const { data, error } =
    await supabase
      .from('session_players')
      .delete()
      .eq('session_id', sessionId)
      .eq('player_id', playerId)
      .select()

  console.log(
    'LEAVE RESULT',
    data,
    error
  )

  if (error) {
    throw error
  }

  return data
}
