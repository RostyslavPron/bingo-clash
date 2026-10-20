type Entry = {
  id: string
  entry_text: string
}

type Props = {
  templateTitle: string
  boardSize: number
  status: string

  entries: Entry[]

  newEntry: string

  setNewEntry: (value: string) => void

  onAddEntry: () => void

  onDeleteEntry: (
    entryId: string
  ) => void

  onPublish: () => void

  onArchive: () => void

  onBack: () => void
}

export default function TemplateEditorPage({
  templateTitle,
  boardSize,
  status,
  entries,
  newEntry,
  setNewEntry,
  onAddEntry,
  onDeleteEntry,
  onPublish,
  onArchive,
  onBack,
}: Props) {
  const requiredEntries =
    boardSize * boardSize - 1

  const remainingEntries =
    requiredEntries - entries.length

  const canPublish =
    entries.length >= requiredEntries

  return (
    <>
      <button onClick={onBack}>
        ← Back To Templates
      </button>

      <h2>{templateTitle}</h2>

      <p>
        Status: {status}
      </p>

      <p>
        Board Size: {boardSize} x {boardSize}
      </p>

      <p>
        Entries Added: {entries.length}
      </p>

      <p>
        Entries Remaining: {remainingEntries}
      </p>

      {canPublish ? (
        <p>✅ Ready To Publish</p>
      ) : (
        <p>
          ❌ Need {remainingEntries}{' '}
          more entries
        </p>
      )}

      <button
        disabled={!canPublish}
        onClick={onPublish}
      >
        Publish
      </button>

      <button
        onClick={onArchive}
        style={{
          marginLeft: '10px',
        }}
      >
        Archive
      </button>

      <hr />

      {entries.length <
        requiredEntries && (
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

          <button
            onClick={onAddEntry}
          >
            Add Entry
          </button>

          <hr />
        </>
      )}

      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.entry_text}

            <button
              onClick={() =>
                onDeleteEntry(
                  entry.id
                )
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