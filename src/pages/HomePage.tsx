import CreateGameForm from '../components/lobby/CreateGameForm'
import JoinGameForm from '../components/lobby/JoinGameForm'

type Props = {
  hostName: string
  gameName: string
  displayName: string
  inviteCodeInput: string

  setHostName: (value: string) => void
  setGameName: (value: string) => void
  setDisplayName: (value: string) => void
  setInviteCodeInput: (value: string) => void

  onCreateGame: () => void
  onJoinGame: () => void
}

export default function HomePage({
  hostName,
  gameName,
  displayName,
  inviteCodeInput,
  setHostName,
  setGameName,
  setDisplayName,
  setInviteCodeInput,
  onCreateGame,
  onJoinGame,
}: Props) {
  return (
    <>
      <CreateGameForm
        hostName={hostName}
        gameName={gameName}
        setHostName={setHostName}
        setGameName={setGameName}
        onCreate={onCreateGame}
      />

      <hr />

      <JoinGameForm
        displayName={displayName}
        inviteCode={inviteCodeInput}
        setDisplayName={setDisplayName}
        setInviteCode={setInviteCodeInput}
        onJoin={onJoinGame}
      />
    </>
  )
}