import {type NextRequest, NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import {MailType, SendgridTemplates} from '@/utils/sendgridConstants'
import format from 'date-fns/format'
import {getURL} from '@/utils/helpers'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
const emailSender = 'Lit <lit@litdata.org>'
// @ts-ignore
sgMail.setApiKey(process.env.SENGRID_API_KEY)

type SendgridParams = {
  params: {
    type: MailType
    emails: string[]
    data?: {
      users?: any[]
      report?: any
      password?: string
      link?: string
    }
  }
}

export async function POST(request: NextRequest) {
  const {params}: SendgridParams = await request.json()

  // @ts-ignore
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)

  try {
    if (params.type === MailType.Recovery) {
      const {data, error} = await supabase.auth.admin.generateLink({
        type: params.type,
        email: params.emails[0],
      })

      if (error) {
        return NextResponse.json({
          error,
        })
      } else {
        await sendMail({
          reciever: params.emails[0],
          template: SendgridTemplates.Recovery,
          extraData: {
            unsuscribe: '',
            // 'reset-link': params.data?.link,
            'reset-link': data.properties.action_link + params?.data?.link,
          },
        })
      }
    } else if (params.type === MailType.ShareReport) {
      await sendMultipleMail({
        template: SendgridTemplates.ShareReport,
        extraData: {
          unsuscribe: '',
          report: params?.data?.report,
        },
        // @ts-ignore
        users: params?.data?.users,
      })
    } else if (params.type === MailType.Invite) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.Invite,
        extraData: {
          unsuscribe: '',
          email: params.emails[0],
          password: params.data?.password,
          link: getURL() + 'signin',
        },
      })
    } else if (params.type === MailType.MembershipExpiry) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.MembershipExpiry,
        extraData: {
          unsuscribe: '',
          ...params.data,
        },
      })
    } else if (params.type === MailType.MembershipExpiryAdmin) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.MembershipExpiryAdmin,
        extraData: {
          unsuscribe: '',
          ...params.data,
        },
      })
    } else if (params.type === MailType.MembershipRenewal) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.MembershipRenewal,
        extraData: {
          unsuscribe: '',
          ...params.data,
        },
      })
    } else if (params.type === MailType.NewPassword) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.NewPassword,
        extraData: {
          unsuscribe: '',
          ...params.data,
        },
      })
    } else if (params.type === MailType.ChangeManagerEmail) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.ChangeManagerEmail,
        extraData: {
          unsuscribe: '',
          ...params.data,
        },
      })
    } else if (params.type === MailType.ChangeUserEmail) {
      await sendMail({
        reciever: params.emails[0],
        template: SendgridTemplates.ChangeUserEmail,
        extraData: {
          unsuscribe: '',
          ...params.data,
        },
      })
    }

    return NextResponse.json({}, {status: 200})
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}

const sendMail = async (data: {reciever: string; template: string; extraData: any}) => {
  const msg = {
    to: data.reciever,
    from: emailSender,
    template_id: data.template,
    subject: 'test-email',
    // extract the custom fields
    dynamic_template_data: {
      ...data.extraData,
    },
  }

  // @ts-ignore
  await sgMail.send(msg, (error: any, result: any) => {
    if (error) {
      console.log(error)
      return {sended: false}
    } else {
      console.log('Email sent', result)
      return {sended: true}
    }
  })
}

const sendMultipleMail = async (data: {template: string; extraData: any; users: any[]}) => {
  const messages = data.users.map(user => ({
    to: user.email,
    from: emailSender,
    template_id: data.template,
    subject: 'test-mail',
    dynamic_template_data: {
      unsuscribe: '',
      username: user.full_name,
      'report-name': data.extraData.report.name,
      'report-date': format(new Date(data.extraData.report.created_at), 'PP'),
      'report-id': data.extraData.report.id,
      link: getURL(),
    },
  }))

  // @ts-ignore
  await sgMail.send(messages, (error: any, result: any) => {
    if (error) {
      console.log(error)
      return {sended: false}
    } else {
      console.log('Email sent', result)
      return {sended: true}
    }
  })
}
