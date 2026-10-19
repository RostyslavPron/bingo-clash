import { supabase } from '../lib/supabase'

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  let result = ''

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    )
  }

  return result
}

export async function createGameSession(
  gameName: string,
  hostId: string,
  displayName: string
) {
  const inviteCode = generateInviteCode()

  const { data: session, error } =
    await supabase
      .from('game_sessions')
      .insert({
        game_name: gameName,
        invite_code: inviteCode,
        host_id: hostId,
      })
      .select()
      .single()

  if (error) {
    throw error
  }

  const { error: playerError } =
    await supabase
      .from('session_players')
      .insert({
        session_id: session.id,
        player_id: hostId,
        display_name: displayName,
        is_host: true,
      })

  if (playerError) {
    throw playerError
  }

  return session
}

export async function joinGameSession(
  inviteCode: string,
  playerId: string,
  displayName: string
) {
  const { data: session, error } =
    await supabase
      .from('game_sessions')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

  if (error) {
    throw error
  }

  const { error: playerError } =
    await supabase
      .from('session_players')
      .insert({
        session_id: session.id,
        player_id: playerId,
        display_name: displayName,
        is_host: false,
      })

  if (playerError) {
    throw playerError
  }

  return session
}

export async function startGame(
  sessionId: string
) {
  const { error } = await supabase
    .from('game_sessions')
    .update({
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .eq('id', sessionId)

  if (error) {
    throw error
  }
}