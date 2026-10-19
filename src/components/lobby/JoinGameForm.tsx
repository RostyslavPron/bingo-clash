type Props = {
  displayName: string
  inviteCode: string
  setDisplayName: (value: string) => void
  setInviteCode: (value: string) => void
  onJoin: () => void
}

export default function JoinGameForm({
  displayName,
  inviteCode,
  setDisplayName,
  setInviteCode,
  onJoin,
}: Props) {
  return (
    <>
      <h2>Join Game</h2>

      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) =>
          setDisplayName(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Invite Code"
        value={inviteCode}
        onChange={(e) =>
          setInviteCode(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={onJoin}>
        Join Game
      </button>
    </>
  )
}