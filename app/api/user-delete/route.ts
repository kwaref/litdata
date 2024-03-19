import {createClient} from '@supabase/supabase-js'
import {NextResponse, type NextRequest} from 'next/server'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  // user_id
  const {params} = await request.json()
  console.log(params)

  // @ts-ignore
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)

  try {
    const {data, error} = await supabase.auth.admin.deleteUser(params?.user_id)
    if (error) {
      console.log(error)
    }
    return NextResponse.json({}, {status: 200})
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
