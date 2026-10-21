type Template = {
  id: string
  title: string
  board_size: number
  status: string
}

type Props = {
  templates: Template[]

  title: string
  boardSize: number

  setTitle: (value: string) => void
  setBoardSize: (value: number) => void

  onCreateTemplate: () => void

  onSelectTemplate: (
    template: Template
  ) => void

  onDeleteTemplate: (
    templateId: string
  ) => void

  onDuplicateTemplate: (
    templateId: string
  ) => void

  displayName: string

  setDisplayName: (
    value: string
  ) => void

  onShowJoinPage: () => void
}

export default function TemplatesPage({
  templates,
  title,
  boardSize,
  displayName,
  setTitle,
  setBoardSize,
  onCreateTemplate,
  onSelectTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  setDisplayName,
  onShowJoinPage,
}: Props) {
  return (
    <>
      <h2>My Games</h2>
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
        placeholder="Template Name"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={boardSize}
        onChange={(e) =>
          setBoardSize(
            Number(e.target.value)
          )
        }
      >
        <option value={5}>5 x 5</option>
        <option value={6}>6 x 6</option>
        <option value={7}>7 x 7</option>
      </select>

      <br />
      <br />

      <button onClick={onCreateTemplate}>
        Create Template
      </button>
      <button
        onClick={onShowJoinPage}
        style={{
          marginLeft: '10px',
        }}
      >
        Join Session
      </button>

      <hr />

      {templates.map((template) => (
        <div
          key={template.id}
          style={{
            border: '1px solid #ccc',
            padding: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            onClick={() =>
              onSelectTemplate(template)
            }
            style={{
              cursor: 'pointer',
            }}
          >
            <h3>{template.title}</h3>

            <p>
              Board Size:{' '}
              {template.board_size} x{' '}
              {template.board_size}
            </p>

            <p>
              Status:{' '}
              {template.status}
            </p>
          </div>

          <button
            onClick={() =>
              onDuplicateTemplate(
                template.id
              )
            }
          >
            Duplicate
          </button>

          <button
            onClick={() =>
              onDeleteTemplate(
                template.id
              )
            }
            style={{
              marginLeft: '10px',
            }}
          >
            Delete Template
          </button>
        </div>
      ))}
    </>
  )
}