import {type NextRequest, NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  // @ts-ignore
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)
  const {data: payload} = await request.json()
  console.log(payload)

  try {
    // upload data to supabase
    const {data, error} = await supabase.auth.admin.createUser(payload)

    if (error) {
      return NextResponse.json({
        error,
      })
    }

    return NextResponse.json({data}, {status: 200})
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
