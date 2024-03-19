'use client'

import {SignUpForm} from '../signup-request/SignUpForm'
import {useSupabase} from '@/app/supabase-provider'
import {useUser} from '@/components/utils/use-user'
import {getURL} from '@/utils/helpers'
import {Auth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import {useTranslations} from 'next-intl'
import {useTheme} from 'next-themes'
import {redirect, usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {retrieve} from '@/components/utils/storage'
import {FormFieldControl, InputField} from '@/components/ui/Form'
import z from 'zod'
import {useForm} from 'react-hook-form'
import Button from '@/components/ui/ButtonCVA'
import {zodResolver} from '@hookform/resolvers/zod'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import useToggle from '@/components/utils/useToggle'

const AuthSchema = z.object({
  email: z.string().email('Incorrect email.'),
  password: z.string().min(2, {message: 'You entered an incorrect username or password.'}),
})

export default function AuthUI() {
  const {supabase} = useSupabase()
  const router = useRouter()
  const {theme} = useTheme()
  const t = useTranslations('SignIn')
  const path = usePathname()
  const {isSubmiting, session, signIn, errorMessage} = useUser()
  const {isOpen: canSee, onToggle} = useToggle()
  const {control, handleSubmit} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(AuthSchema),
    defaultValues: {email: '', password: ''},
  })

  return (
    <form
      className="px-4 relative w-full md:w-[380px] lg:w-[400px]"
      // onSubmit={handleSubmit(signIn)}
    >
      <h1 className="font-degular text-[32px] font-semibold text-primary-500 mb-4">
        {t('header')}
      </h1>
      {/* <Auth
        supabaseClient={supabase}
        providers={[]}
        // redirectTo={getURL()}
        redirectTo={`${getURL()}auth/callback`}
        showLinks={false}
        // magicLink
        localization={{
          variables: {
            sign_in: {
              email_label: t('email'),
              password_label: t('password'),
              button_label: t('button'),
              loading_button_label: '...',
            },
          },
        }}
        appearance={{
          theme: ThemeSupa,
          className: {
            // container: 'md:w-[380px] lg:w-[400px]',
            label: 'font-medium !text-primary-500',
            input:
              '!text-primary-500 placeholder:!text-primary-200 focus:border-primary-500 focus:ring-primary-500 border-primary-50 bg-primary-50 hover:border-primary-50 focus:ring-1',
            button:
              '!w-[73px] mt-4 self-end !bg-primary-500 !text-white hover:!bg-primary-500 !border-primary-500',
            loader: '!hover:!bg-secondary-700',
            message: '!text-danger absolute w-full bottom-[15%] left-0',
          },
        }}
        theme={theme}
      /> */}

      <FormFieldControl
        control={control}
        Component={InputField}
        name="email"
        label={t('email')}
        placeholder={t('email')}
        variant="outlined"
        type="email"
      />
      <FormFieldControl
        control={control}
        Component={InputField}
        name="password"
        label={t('password')}
        placeholder={t('password')}
        variant="outlined"
        endIcon={
          !canSee ? (
            <EyeSlashIcon className="h-5 w-5 cursor-pointer" onClick={onToggle} />
          ) : (
            <EyeIcon className="h-5 w-5 cursor-pointer" onClick={onToggle} />
          )
        }
        type={canSee ? 'text' : 'password'}
      />

      {errorMessage && <p className="!text-danger text-center w-full">{errorMessage}</p>}

      <div className="w-full inline-flex justify-between items-center gap-1.5 mt-8">
        <button
          onClick={() => router.push('/forgot-password')}
          type="button"
          className="text-xs font-medium text-primary-200 hover:text-primary-400 underline underline-offset-4"
          // className="absolute left-[18px] bottom-[3.5%] text-xs font-medium text-primary-200 hover:text-primary-400 underline underline-offset-4"
        >
          {t('forgot')}
        </button>
        <Button
          className="!w-[73px] self-end !bg-primary-500 !text-white hover:!bg-primary-500 !border-primary-500"
          loading={isSubmiting}
          onClick={handleSubmit(signIn)}
          type="submit"
        >
          {t('button')}
        </Button>
      </div>
    </form>
  )
}
