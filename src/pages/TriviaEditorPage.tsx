type Question = {
  id: string
  question_text: string
  time_limit_seconds: number
}

type Props = {
  questions: Question[]

  questionText: string

  answerA: string
  answerB: string
  answerC: string
  answerD: string

  correctAnswer: string

  setQuestionText: (
    value: string
  ) => void

  setAnswerA: (value: string) => void
  setAnswerB: (value: string) => void
  setAnswerC: (value: string) => void
  setAnswerD: (value: string) => void

  setCorrectAnswer: (
    value: string
  ) => void

  onCreateQuestion: () => void
}

export default function TriviaEditorPage({
  questions,

  questionText,

  answerA,
  answerB,
  answerC,
  answerD,

  correctAnswer,

  setQuestionText,

  setAnswerA,
  setAnswerB,
  setAnswerC,
  setAnswerD,

  setCorrectAnswer,

  onCreateQuestion,
}: Props) {
  return (
    <>
      <h3>Trivia Questions</h3>

      <input
        type="text"
        placeholder="Question"
        value={questionText}
        onChange={(e) =>
          setQuestionText(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Answer A"
        value={answerA}
        onChange={(e) =>
          setAnswerA(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Answer B"
        value={answerB}
        onChange={(e) =>
          setAnswerB(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Answer C"
        value={answerC}
        onChange={(e) =>
          setAnswerC(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Answer D"
        value={answerD}
        onChange={(e) =>
          setAnswerD(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={correctAnswer}
        onChange={(e) =>
          setCorrectAnswer(
            e.target.value
          )
        }
      >
        <option value="A">
          A
        </option>

        <option value="B">
          B
        </option>

        <option value="C">
          C
        </option>

        <option value="D">
          D
        </option>
      </select>

      <br />
      <br />

      <button
        onClick={onCreateQuestion}
      >
        Add Question
      </button>

      <hr />

      {questions.map((question) => (
        <div
          key={question.id}
          style={{
            border: '1px solid #ccc',
            padding: '12px',
            marginBottom: '12px',
          }}
        >
          <strong>
            {question.question_text}
          </strong>

          <p>
            Timer:{' '}
            {
              question.time_limit_seconds
            }
            s
          </p>
        </div>
      ))}
    </>
  )
}