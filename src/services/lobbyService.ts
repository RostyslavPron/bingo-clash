import { supabase } from '../lib/supabase'

export async function getPlayers(sessionId: string) {
  const { data, error } = await supabase
    .from('session_players')
    .select('*')
    .eq('session_id', sessionId)
    .order('joined_at')

  if (error) {
    throw error
  }

  return data
}

export async function updateReadyStatus(
  playerId: string,
  sessionId: string,
  isReady: boolean
) {
  const { error } = await supabase
    .from('session_players')
    .update({
      is_ready: isReady,
    })
    .eq('player_id', playerId)
    .eq('session_id', sessionId)

  if (error) {
    throw error
  }
}