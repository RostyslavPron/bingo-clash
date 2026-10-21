type Props = {
  displayName: string
  setDisplayName: (
    value: string
  ) => void

  inviteCode: string
  setInviteCode: (
    value: string
  ) => void

  onJoin: () => void

  onBack: () => void
}

export default function JoinSessionPage({
  displayName,
  setDisplayName,
  inviteCode,
  setInviteCode,
  onJoin,
  onBack,
}: Props) {
  return (
    <>
      <button onClick={onBack}>
        ← Back
      </button>

      <h2>Join Session</h2>

      <input
        type="text"
        placeholder="Your Name"
        value={displayName}
        onChange={(e) =>
          setDisplayName(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Invite Code"
        value={inviteCode}
        onChange={(e) =>
          setInviteCode(
            e.target.value.toUpperCase()
          )
        }
      />

      <br />
      <br />

      <button onClick={onJoin}>
        Join Session
      </button>
    </>
  )
}