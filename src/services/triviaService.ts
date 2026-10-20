import { supabase } from '../lib/supabase'

export async function getQuestions(
  templateId: string
) {
  const { data, error } = await supabase
    .from('trivia_questions')
    .select(`
      *,
      trivia_answers (
        id,
        answer_text,
        is_correct
      )
    `)
    .eq('template_id', templateId)
    .order('created_at')

  if (error) {
    throw error
  }

  return data
}

export async function createQuestion(
  templateId: string,
  questionText: string,
  timeLimitSeconds: number
) {
  const { data, error } = await supabase
    .from('trivia_questions')
    .insert({
      template_id: templateId,
      question_text: questionText,
      time_limit_seconds: timeLimitSeconds,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function createAnswer(
  questionId: string,
  answerText: string,
  isCorrect: boolean
) {
  const { error } = await supabase
    .from('trivia_answers')
    .insert({
      question_id: questionId,
      answer_text: answerText,
      is_correct: isCorrect,
    })

  if (error) {
    throw error
  }
}

export async function deleteQuestion(
  questionId: string
) {
  const { error } = await supabase
    .from('trivia_questions')
    .delete()
    .eq('id', questionId)

  if (error) {
    throw error
  }
}

export async function updateQuestion(
  questionId: string,
  questionText: string,
  timeLimit: number
) {
  const { error } = await supabase
    .from('trivia_questions')
    .update({
      question_text: questionText,
      time_limit_seconds: timeLimit,
    })
    .eq('id', questionId)

  if (error) {
    throw error
  }
}

export async function updateAnswer(
  answerId: string,
  answerText: string,
  isCorrect: boolean
) {
  const { error } = await supabase
    .from('trivia_answers')
    .update({
      answer_text: answerText,
      is_correct: isCorrect,
    })
    .eq('id', answerId)

  if (error) {
    throw error
  }
}