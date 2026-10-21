type Player = {
  id: string
  player_id: string
  display_name: string
  is_ready: boolean
  is_host: boolean
}

type Props = {
  gameName: string
  inviteCode: string
  players: Player[]

  currentUserId: string

  onLeave: () => void

  onKickPlayer: (
    sessionPlayerId: string
  ) => void
}

export default function SessionLobbyPage({
  gameName,
  inviteCode,
  players,
  currentUserId,
  onLeave,
  onKickPlayer,
}: Props) {
  const currentPlayer =
    players.find(
      (player) =>
        player.player_id ===
        currentUserId
    )

  const userIsHost =
    currentPlayer?.is_host ?? false

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

            {userIsHost &&
              !player.is_host && (
                <button
                  style={{
                    marginLeft:
                      '10px',
                  }}
                  onClick={() =>
                    onKickPlayer(
                      player.id
                    )
                  }
                >
                  Kick
                </button>
              )}
          </li>
        ))}
      </ul>

      <hr />

      <button onClick={onLeave}>
        Leave Session
      </button>
    </div>
  )
}