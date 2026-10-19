type Player = {
  id: string
  display_name: string
  is_host: boolean
  is_ready: boolean
}

type Props = {
  players: Player[]
}

export default function PlayerList({
  players,
}: Props) {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          {player.is_ready ? '✅' : '⏳'}{' '}
          {player.display_name}
          {player.is_host
            ? ' (Host)'
            : ''}
        </li>
      ))}
    </ul>
  )
}