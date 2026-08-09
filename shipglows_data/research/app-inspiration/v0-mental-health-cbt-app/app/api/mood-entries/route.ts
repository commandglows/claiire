import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { mood, context } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!mood) {
    return NextResponse.json({ error: 'Mood is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert([
        { mood, context, user_id: user.id }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error saving mood entry:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

