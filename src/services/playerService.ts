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