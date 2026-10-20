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
}

export default function TemplatesPage({
  templates,
  title,
  boardSize,
  setTitle,
  setBoardSize,
  onCreateTemplate,
  onSelectTemplate,
}: Props) {
  return (
    <>
      <h2>My Games</h2>

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
          setBoardSize(Number(e.target.value))
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

      <hr />

      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() =>
            onSelectTemplate(template)
          }
          style={{
            border: '1px solid #ccc',
            padding: '12px',
            marginBottom: '12px',
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
            Status: {template.status}
          </p>
        </div>
      ))}
    </>
  )
}