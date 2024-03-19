import {createClient} from '@supabase/supabase-js'
import {NextResponse, type NextRequest} from 'next/server'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  const {data: payload} = await request.json()
  console.log(payload)

  // @ts-ignore
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)

  try {
    const {id} = payload
    const {error} = await supabase.auth.admin.updateUserById(id, payload)
    if (error) {
      // console.log(error)
      return NextResponse.json({
        error,
      })
    }
    return NextResponse.json({}, {status: 200})
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
