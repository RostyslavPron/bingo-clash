type Props = {
  templateTitle: string

  activeTab: 'entries' | 'trivia'

  setActiveTab: (
    tab: 'entries' | 'trivia'
  ) => void

  children: React.ReactNode
}

export default function TemplateContentPage({
  templateTitle,
  activeTab,
  setActiveTab,
  children,
}: Props) {
  return (
    <>
      <h2>{templateTitle}</h2>

      <button
        onClick={() =>
          setActiveTab('entries')
        }
      >
        Entries
      </button>

      <button
        onClick={() =>
          setActiveTab('trivia')
        }
        style={{
          marginLeft: '10px',
        }}
      >
        Trivia
      </button>

      <hr />

      {children}
    </>
  )
}