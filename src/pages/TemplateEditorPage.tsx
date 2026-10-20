type Entry = {
  id: string
  entry_text: string
}

type Props = {
  templateTitle: string
  boardSize: number

  entries: Entry[]

  newEntry: string

  setNewEntry: (value: string) => void

  onAddEntry: () => void
  onDeleteEntry: (
    entryId: string
  ) => void

  onBack: () => void
}

export default function TemplateEditorPage({
  templateTitle,
  boardSize,
  entries,
  newEntry,
  setNewEntry,
  onAddEntry,
  onDeleteEntry,
  onBack,
}: Props) {
  const requiredEntries =
    boardSize * boardSize - 1

  const remainingEntries =
    requiredEntries - entries.length

  const canAdd =
    entries.length < requiredEntries

  return (
    <>
      <button onClick={onBack}>
        ← Back To Templates
      </button>

      <h2>{templateTitle}</h2>

      <p>
        Board Size: {boardSize} x {boardSize}
      </p>

      <p>
        Entries Added: {entries.length}
      </p>

      <p>
        Entries Remaining:{' '}
        {remainingEntries}
      </p>

      {canAdd && (
        <>
          <input
            type="text"
            placeholder="New Entry"
            value={newEntry}
            onChange={(e) =>
              setNewEntry(
                e.target.value
              )
            }
          />

          <button onClick={onAddEntry}>
            Add Entry
          </button>
        </>
      )}

      {!canAdd && (
        <p>
          ✅ Required entries complete
        </p>
      )}

      <hr />

      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.entry_text}

            <button
              onClick={() =>
                onDeleteEntry(entry.id)
              }
              style={{
                marginLeft: '10px',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}