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