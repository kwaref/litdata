'use client'

import LitLogo from '@/components/icons/LitLogo'
import {FormFieldControl, InputField} from '@/components/ui/Form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslations} from 'next-intl'
import {type SubmitHandler, useForm} from 'react-hook-form'
import z from 'zod'
import {getURL} from '@/utils/helpers'
import Button, {buttonVariants} from '@/components/ui/ButtonCVA'
import axios from 'axios'
import {MailType} from '@/utils/sendgridConstants'
import {useState} from 'react'
import Link from 'next/link'
import {cn} from '@/components/utils/tailwindMerge'

// interface ForgotPasswordProps {}

const EmailSchema = z.object({
  email: z.string().email('Please enter your email address correctly'),
})

function ForgotPassword() {
  const t = useTranslations('ForgotPass')
  const commonT = useTranslations('Common')
  const [sended, setSended] = useState<boolean>(false)

  const {control, handleSubmit} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(EmailSchema),
  })

  const onSubmitEmail: SubmitHandler<z.infer<typeof EmailSchema>> = async data => {
    // await supabase.auth.resetPasswordForEmail(data.email, {
    //   redirectTo: `${getURL()}forgot-password?email=${data.email}`,
    // })

    axios
      .post('/api/sendgrid', {
        params: {
          type: MailType.Recovery,
          emails: [data.email],
          data: {
            link: '/reset-password',
          },
        },
      })
      .then(() => setSended(true))
  }

  return (
    <div className="relative h-[100dvh] w-full bg-gray-100">
      <LitLogo className="h-8 w-7 absolute z-20 sm:left-8 top-11 max-sm:left-1/2 max-sm:-translate-x-1/2" />

      <div className="bg-white h-full flex justify-center items-center w-full sm:w-6/12">
        <div
          className={cn('px-4 relative w-full md:w-[380px] lg:w-[400px]', {'lg:w-[420px]': sended})}
        >
          <Link href="/signin" className={cn(buttonVariants({variant: 'link'}), 'p-0 mb-3.5')}>
            {commonT('back')}
          </Link>
          <h1 className="font-degular text-[32px] font-semibold text-primary-500">
            {sended ? t('reset-verify') : t('reset')}
          </h1>
          <p className="text-sm font-normal mt-3.5 mb-8">
            {sended ? t('reset-verify-desc') : t('reset-desc')}
          </p>
          {!sended && (
            // @ts-ignore
            <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmitEmail)}>
              <FormFieldControl
                control={control}
                Component={InputField}
                name="email"
                label="Email"
                variant="outlined"
                type="email"
              />
              <Button
                className="bg-primary-500 hover:!bg-primary-500 mt-4 self-end"
                // @ts-ignore
                onClick={handleSubmit(onSubmitEmail)}
              >
                {commonT('send')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
