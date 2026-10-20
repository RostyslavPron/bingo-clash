import { supabase } from '../lib/supabase'

export async function createTemplate(
  ownerId: string,
  title: string,
  boardSize: number
) {
  const { data, error } = await supabase
    .from('bingo_templates')
    .insert({
      owner_id: ownerId,
      title,
      board_size: boardSize,
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getTemplates(
  ownerId: string
) {
  const { data, error } = await supabase
    .from('bingo_templates')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', {
      ascending: false,
    })

  if (error) throw error

  return data
}

export async function getTemplateEntries(
  templateId: string
) {
  const { data, error } = await supabase
    .from('bingo_template_entries')
    .select('*')
    .eq('template_id', templateId)
    .order('created_at')

  if (error) throw error

  return data
}

export async function addTemplateEntry(
  templateId: string,
  entryText: string
) {
  const { error } = await supabase
    .from('bingo_template_entries')
    .insert({
      template_id: templateId,
      entry_text: entryText,
    })

  if (error) throw error
}

export async function deleteTemplateEntry(
  entryId: string
) {
  const { error } = await supabase
    .from('bingo_template_entries')
    .delete()
    .eq('id', entryId)

  if (error) throw error
}

export async function publishTemplate(
  templateId: string
) {
  const { error } = await supabase
    .from('bingo_templates')
    .update({
      status: 'published',
    })
    .eq('id', templateId)

  if (error) throw error
}

export async function unpublishTemplate(
  templateId: string
) {
  const { error } = await supabase
    .from('bingo_templates')
    .update({
      status: 'draft',
    })
    .eq('id', templateId)

  if (error) throw error
}

export async function deleteTemplate(
  templateId: string
) {
  const { error } = await supabase
    .from('bingo_templates')
    .delete()
    .eq('id', templateId)

  if (error) throw error
}

export async function duplicateTemplate(
  templateId: string
) {
  const { data: template } = await supabase
    .from('bingo_templates')
    .select('*')
    .eq('id', templateId)
    .single()

  if (!template) {
    throw new Error('Template not found')
  }

  const { data: newTemplate, error } =
    await supabase
      .from('bingo_templates')
      .insert({
        owner_id: template.owner_id,
        title: `${template.title} (Copy)`,
        board_size: template.board_size,
        status: 'draft',
      })
      .select()
      .single()

  if (error) throw error

  const { data: entries } =
    await supabase
      .from('bingo_template_entries')
      .select('*')
      .eq('template_id', templateId)

  if (entries?.length) {
    await supabase
      .from('bingo_template_entries')
      .insert(
        entries.map((entry) => ({
          template_id: newTemplate.id,
          entry_text: entry.entry_text,
        }))
      )
  }

  const { data: questions } =
    await supabase
      .from('trivia_questions')
      .select(`
        *,
        trivia_answers(*)
      `)
      .eq('template_id', templateId)

  if (questions?.length) {
    for (const question of questions) {
      const {
        data: newQuestion,
      } = await supabase
        .from('trivia_questions')
        .insert({
          template_id: newTemplate.id,
          question_text:
            question.question_text,
          time_limit_seconds:
            question.time_limit_seconds,
        })
        .select()
        .single()

      if (
        question.trivia_answers
          ?.length
      ) {
        await supabase
          .from('trivia_answers')
          .insert(
            question.trivia_answers.map(
              (answer: any) => ({
                question_id:
                  newQuestion.id,
                answer_text:
                  answer.answer_text,
                is_correct:
                  answer.is_correct,
              })
            )
          )
      }
    }
  }

  return newTemplate
}