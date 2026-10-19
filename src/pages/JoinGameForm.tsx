import PlayerList from '../components/lobby/PlayerList'

type Player = {
  id: string
  display_name: string
  is_host: boolean
  is_ready: boolean
}

type Props = {
  inviteCode: string
  players: Player[]
  isReady: boolean
  onToggleReady: () => void
}

export default function LobbyPage({
  inviteCode,
  players,
  isReady,
  onToggleReady,
}: Props) {
  return (
    <>
      <h2>Lobby</h2>

      <p>
        <strong>Invite Code:</strong>{' '}
        {inviteCode}
      </p>

      <button onClick={onToggleReady}>
        {isReady
          ? 'Not Ready'
          : 'Ready'}
      </button>

      <h3>Players</h3>

      <PlayerList players={players} />

      <p>
        Waiting for host to start...
      </p>
    </>
  )
}