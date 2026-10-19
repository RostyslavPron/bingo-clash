import { supabase } from '../lib/supabase'

export async function createProfile(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
    })

  if (error) {
    console.error('Profile creation failed:', error)
  }
}