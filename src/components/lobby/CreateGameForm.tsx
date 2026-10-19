type Props = {
  hostName: string
  gameName: string
  setHostName: (value: string) => void
  setGameName: (value: string) => void
  onCreate: () => void
}

export default function CreateGameForm({
  hostName,
  gameName,
  setHostName,
  setGameName,
  onCreate,
}: Props) {
  return (
    <>
      <h2>Create Game</h2>

      <input
        type="text"
        placeholder="Your Display Name"
        value={hostName}
        onChange={(e) =>
          setHostName(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Game Name"
        value={gameName}
        onChange={(e) =>
          setGameName(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={onCreate}>
        Create Game
      </button>
    </>
  )
}