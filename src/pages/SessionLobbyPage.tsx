type Player = {
  id: string
  display_name: string
  is_ready: boolean
  is_host: boolean
}

type Props = {
  gameName: string
  inviteCode: string
  players: Player[]
}

export default function SessionLobbyPage({
  gameName,
  inviteCode,
  players,
}: Props) {
  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '900px',
      }}
    >
      <h1>{gameName}</h1>

      <p>
        Invite Code:{' '}
        <strong>
          {inviteCode}
        </strong>
      </p>

      <hr />

      <h2>Players</h2>

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.is_ready
              ? '✅'
              : '⬜'}{' '}
            {player.display_name}

            {player.is_host &&
              ' (Host)'}
          </li>
        ))}
      </ul>

      <hr />

      <p>
        Waiting for players...
      </p>
    </div>
  )
}