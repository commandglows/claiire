import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { situation, automaticThoughts, emotions, distortion, evidenceFor, evidenceAgainst, alternativeThought, newEmotion } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('thought_entries')
    .insert([
      { 
        situation, 
        automatic_thoughts: automaticThoughts, 
        emotions, 
        distortion, 
        evidence_for: evidenceFor, 
        evidence_against: evidenceAgainst, 
        alternative_thought: alternativeThought, 
        new_emotion: newEmotion, 
        user_id: user.id 
      }
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

