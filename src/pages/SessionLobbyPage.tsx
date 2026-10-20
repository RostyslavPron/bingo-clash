type Props = {
  gameName: string
  inviteCode: string
}

export default function SessionLobbyPage({
  gameName,
  inviteCode,
}: Props) {
  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '900px',
      }}
    >
      <h1>{gameName}</h1>

      <hr />

      <h2>Lobby</h2>

      <p>
        Invite Code:{' '}
        <strong>
          {inviteCode}
        </strong>
      </p>

      <p>
        Share this code with
        players to join.
      </p>

      <hr />

      <h3>Players</h3>

      <ul>
        <li>✅ Host</li>
      </ul>

      <p>
        Waiting for players...
      </p>
    </div>
  )
}