type Answer = {
  id: string
  answer_text: string
  is_correct: boolean
}

type Question = {
  id: string
  question_text: string
  time_limit_seconds: number
  trivia_answers: Answer[]
}

type Props = {
  question: Question

  questionText: string
  timeLimit: number

  answerA: string
  answerB: string
  answerC: string
  answerD: string

  correctAnswer: string

  setQuestionText: (
    value: string
  ) => void

  setTimeLimit: (
    value: number
  ) => void

  setAnswerA: (
    value: string
  ) => void

  setAnswerB: (
    value: string
  ) => void

  setAnswerC: (
    value: string
  ) => void

  setAnswerD: (
    value: string
  ) => void

  setCorrectAnswer: (
    value: string
  ) => void

  onSave: () => void
  onCancel: () => void
}

export default function EditQuestionPage({
  questionText,
  timeLimit,
  answerA,
  answerB,
  answerC,
  answerD,
  correctAnswer,
  setQuestionText,
  setTimeLimit,
  setAnswerA,
  setAnswerB,
  setAnswerC,
  setAnswerD,
  setCorrectAnswer,
  onSave,
  onCancel,
}: Props) {
  return (
    <>
      <h3>Edit Question</h3>

      <input
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
        type="number"
        value={timeLimit}
        onChange={(e) =>
          setTimeLimit(
            Number(e.target.value)
          )
        }
      />

      <br />
      <br />

      <input
        value={answerA}
        onChange={(e) =>
          setAnswerA(e.target.value)
        }
      />

      <br />
      <br />

      <input
        value={answerB}
        onChange={(e) =>
          setAnswerB(e.target.value)
        }
      />

      <br />
      <br />

      <input
        value={answerC}
        onChange={(e) =>
          setAnswerC(e.target.value)
        }
      />

      <br />
      <br />

      <input
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
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>

      <br />
      <br />

      <button onClick={onSave}>
        Save
      </button>

      <button
        onClick={onCancel}
        style={{
          marginLeft: '10px',
        }}
      >
        Cancel
      </button>
    </>
  )
}