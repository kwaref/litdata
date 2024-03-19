'use client'

import LitLogo from '@/components/icons/LitLogo'
import {FormFieldControl, InputField} from '@/components/ui/Form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslations} from 'next-intl'
import {type SubmitHandler, useForm} from 'react-hook-form'
import z from 'zod'
import {useSupabase} from '@/app/supabase-provider'
import toastAlert from '@/utils/toastAlert'
import Button, {buttonVariants} from '@/components/ui/ButtonCVA'
import Link from 'next/link'
import {cn} from '@/components/utils/tailwindMerge'
import useToggle from '@/components/utils/useToggle'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Cookies from 'js-cookie'
// interface ResetPasswordProps {}

const PassSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    schema =>
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(schema.password) ||
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/.test(schema.password),
    {
      message:
        'Use a password at least 8 characters long containing at least one alphabet and one number',
      path: ['password'],
    },
  )
  .refine(schema => schema.password === schema.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

function ResetPassword() {
  const {supabase} = useSupabase()
  const t = useTranslations('ChangePass')
  const commonT = useTranslations('Common')
  const {isOpen: canSee, onToggle} = useToggle()
  const [expired, setExpired] = useState<boolean>(false)
  const {push} = useRouter()

  const {control, handleSubmit} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(PassSchema),
  })

  useEffect(() => {
    const hash = window.location.hash

    if (hash.includes('error')) {
      setExpired(true)
      return
    }

    const query = hash.replace('#', '')?.split('&')
    const access_token = query[0]?.split('=')[1]
    const refresh_token = query[3]?.split('=')[1]
    Cookies.set('sb-type', 'recovery')
    const setSession = async () => {
      const {data, error} = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (error) toastAlert({message: error.message, type: 'error'})
    }

    setSession()
  }, [])

  const onSubmitPass: SubmitHandler<z.infer<typeof PassSchema>> = async data => {
    console.log('Changing password')
    const {error} = await supabase.auth.updateUser({
      password: data.password,
    })
    if (error) {
      console.log(error.message)
      toastAlert({message: error.message, type: 'error'})
    } else {
      toastAlert({message: 'Password restored!', type: 'success'})
      const {error} = await supabase.auth.signOut()
      Cookies.remove('sb-access-token')
      Cookies.remove('sb-refresh-token')
      push('/signin')
    }
  }

  return (
    <div className="relative h-[100dvh] w-full bg-gray-100">
      <LitLogo className="h-8 w-7 absolute z-20 sm:left-8 top-11 max-sm:left-1/2 max-sm:-translate-x-1/2" />

      <div className="bg-white h-full flex justify-center items-center w-full sm:w-6/12">
        <div className="px-4 relative w-full md:w-[380px] lg:w-[400px]">
          <h1 className="font-degular text-[32px] font-semibold text-primary-500 mb-8">
            {expired ? t('expired') : t('change')}
          </h1>
          {expired ? (
            <Link
              className={cn(buttonVariants(), 'bg-primary-500 hover:!bg-primary-500 mt-4')}
              href="/signin"
            >
              {t('back')}
            </Link>
          ) : (
            // @ts-ignore
            <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmitPass)}>
              <FormFieldControl
                control={control}
                Component={InputField}
                name="password"
                label="New password"
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
              <FormFieldControl
                control={control}
                Component={InputField}
                name="confirmPassword"
                label="Confirm password"
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
              <Button
                className="bg-primary-500 hover:!bg-primary-500 mt-4 self-end"
                // @ts-ignore
                onClick={handleSubmit(onSubmitPass)}
              >
                {commonT('save')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
