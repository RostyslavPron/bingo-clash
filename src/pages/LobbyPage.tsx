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
  isHost: boolean
  allPlayersReady: boolean
  onToggleReady: () => void
  onStartGame: () => void
}

export default function LobbyPage({
  inviteCode,
  players,
  isReady,
  isHost,
  allPlayersReady,
  onToggleReady,
  onStartGame,
}: Props) {
  return (
    <>
      <h2>Lobby</h2>

      <p>
        <strong>Invite Code:</strong> {inviteCode}
      </p>

      <button onClick={onToggleReady}>
        {isReady ? 'Not Ready' : 'Ready'}
      </button>

      <h3>Players</h3>

      <PlayerList players={players} />

      {isHost && (
        <button
          disabled={!allPlayersReady}
          onClick={onStartGame}
        >
          Start Game
        </button>
      )}
    </>
  )
}
