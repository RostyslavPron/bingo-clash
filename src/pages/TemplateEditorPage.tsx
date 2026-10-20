type Entry = {
  id: string
  entry_text: string
}

type Props = {
  templateTitle: string
  boardSize: number
  status: string

  entries: Entry[]

  questionCount: number

  newEntry: string

  setNewEntry: (value: string) => void

  onAddEntry: () => void

  onDeleteEntry: (
    entryId: string
  ) => void

  onPublish: () => void

  onUnpublish: () => void

  onBack: () => void
}

export default function TemplateEditorPage({
  templateTitle,
  boardSize,
  status,
  entries,
  questionCount,
  newEntry,
  setNewEntry,
  onAddEntry,
  onDeleteEntry,
  onPublish,
  onUnpublish,
  onBack,
}: Props) {
  const requiredEntries =
    boardSize * boardSize - 1

  const entriesComplete =
    entries.length >= requiredEntries

  const isPublished =
    status === 'published'

  const templateReady =
    entriesComplete && isPublished

  const remainingEntries =
    requiredEntries - entries.length

  return (
    <>
      <button onClick={onBack}>
        ← Back To Templates
      </button>

      <h2>{templateTitle}</h2>

      <p>Status: {status}</p>

      <hr />

      <h3>Template Health</h3>

      <p>
        {entriesComplete
          ? '✅'
          : '❌'} Entries Complete (
        {entries.length} /{' '}
        {requiredEntries})
      </p>

      <p>
        ✅ Trivia Questions (
        {questionCount})
      </p>

      <p>
        {isPublished
          ? '✅'
          : '❌'} Published
      </p>

      <p>
        <strong>
          {templateReady
            ? 'READY FOR GAME SESSION'
            : 'NOT READY'}
        </strong>
      </p>

      <hr />

      {isPublished ? (
        <>
          <p>
            🔒 Published templates are
            locked.
          </p>

          <button
            onClick={onUnpublish}
          >
            Unpublish
          </button>
        </>
      ) : (
        <button
          disabled={!entriesComplete}
          onClick={onPublish}
        >
          Publish
        </button>
      )}

      <hr />

      <p>
        Board Size: {boardSize} x{' '}
        {boardSize}
      </p>

      <p>
        Entries Remaining:{' '}
        {remainingEntries}
      </p>

      {!isPublished &&
        entries.length <
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

            {!isPublished && (
              <button
                onClick={() =>
                  onDeleteEntry(
                    entry.id
                  )
                }
                style={{
                  marginLeft:
                    '10px',
                }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}