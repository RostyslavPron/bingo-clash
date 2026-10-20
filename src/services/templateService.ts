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
    })
    .select()
    .single()

  if (error) {
    throw error
  }

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

  if (error) {
    throw error
  }

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

  if (error) {
    throw error
  }

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

  if (error) {
    throw error
  }
}

export async function deleteTemplateEntry(
  entryId: string
) {
  const { error } = await supabase
    .from('bingo_template_entries')
    .delete()
    .eq('id', entryId)

  if (error) {
    throw error
  }
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

  if (error) {
    throw error
  }
}

export async function archiveTemplate(
  templateId: string
) {
  const { error } = await supabase
    .from('bingo_templates')
    .update({
      status: 'archived',
    })
    .eq('id', templateId)

  if (error) {
    throw error
  }
}