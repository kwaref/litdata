import {NextResponse} from 'next/server'
// pages/api/survey.js
import {createClient} from '@supabase/supabase-js'
import differenceInDays from 'date-fns/differenceInDays'
import axios from 'axios'
import {MailType} from '@/utils/sendgridConstants'
import {getURL} from '@/utils/helpers'
import format from 'date-fns/format'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  // @ts-expect-error
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)

  try {
    const {data: companies, error: errorC} = await supabase
      .from('users')
      .select('*')
      .match({is_company: true})

    const {data: admins, error: errorU} = await supabase
      .from('users')
      .select('*')
      .match({is_company: false, role: 'admin'})

    companies?.forEach(async company => {
      const days = differenceInDays(new Date(company?.licence_expiry_date?.toString()), new Date())
      if (days === 10) {
        try {
          await axios.post(`${getURL()}/api/sendgrid`, {
            params: {
              type: MailType.MembershipExpiry,
              emails: [company?.email],
              data: {
                username: company?.primary_contact,
                company: company?.full_name,
                'license-expiry': format(new Date(company?.licence_expiry_date), 'PP'),
              },
            },
          })
        } catch (error) {
          console.log('🚀 ~ GET ~ error:', error)
        }

        admins?.forEach(async admin => {
          try {
            await axios.post(`${getURL()}/api/sendgrid`, {
              params: {
                type: MailType.MembershipExpiryAdmin,
                emails: [admin?.email],
                data: {
                  username: admin?.full_name,
                  'company-id': company?.id,
                  company: company?.full_name,
                  manager: company?.primary_contact,
                  'manager-email': company?.email,
                  'license-expiry': format(new Date(company?.licence_expiry_date), 'PP'),
                },
              },
            })
          } catch (error) {
            console.log('🚀 ~ GET ~ error:', error)
          }
        })
      }
    })

    if (errorC || errorU) {
      return NextResponse.json({error: errorC || errorU})
    }

    // Enviar la respuesta como JSON
    return NextResponse.json({}, {status: 200})
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
