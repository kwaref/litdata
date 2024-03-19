import {NextResponse} from 'next/server'
import {createServerSupabaseClient} from '@/app/supabase-server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  let answers: any[] = []
  let hasMore = true
  let page = 0
  const limit = 500

  try {
    while (hasMore) {
      const {data, error, count} = await supabase
        .from('answers_temp')
        .select('data', {count: 'exact'})
        .range(page * limit, (page + 1) * limit - 1)

      if (error) throw error

      answers = [...answers, ...data.map(el => el.data)]
      page += 1
      // @ts-ignore
      hasMore = count > page * limit
    }

    // Enviar la respuesta como JSON
    return NextResponse.json({data: answers}, {status: 200})
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
