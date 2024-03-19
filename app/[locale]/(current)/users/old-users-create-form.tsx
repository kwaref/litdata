'use client'

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {FormFieldControl, InputField} from '@/components/ui/Form'
import CheckboxField from '@/components/ui/Form/CheckboxField'
import {useDialog} from '@/components/utils/use-dialog'
import toastAlert from '@/utils/toastAlert'
import useGetAllCompanies from '@/utils/useGetAllCompanies'
import {zodResolver} from '@hookform/resolvers/zod'
import {createClient} from '@supabase/supabase-js'
import {getURL} from 'next/dist/shared/lib/utils'
import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import z from 'zod'
import {useTranslations} from 'next-intl'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export const OLD_ADD_USER_DIALOG = 'old-add-user-dialog'

const OldUsersCreateForm = () => {
  const {isOpen, closeDialog, payload} = useDialog(OLD_ADD_USER_DIALOG)
  const {companies} = useGetAllCompanies()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [inputFocus, setInputFocus] = useState(false)
  const router = useRouter()
  // @ts-ignore
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)
  const [isCreating, setIsCreating] = useState(false)
  const t = useTranslations('Users.dialog-create')

  const userSchema = z.object({
    email: z.string().email(t(`invalid-email`)),
    full_name: z.string().optional(),
    role: z.string().optional(),
    is_active: z.boolean(),
    associated_company: z.string().optional(),
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {isSubmitting},
  } = useForm<z.infer<typeof userSchema>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      full_name: '',
      role: 'client',
      is_active: false,
      associated_company: '',
    },
  })

  const [companyName, setCompanyName] = useState('')
  const role = watch('role', '')

  useEffect(() => {
    if (companies?.length > 0 && companyName) {
      const filteredSuggestions = companies
        .filter(company =>
          // @ts-ignore
          company.full_name.toLowerCase().includes(companyName),
        )
        .map((e: any) => ({label: e.full_name, value: e._id}))
      setSuggestions(filteredSuggestions)
    }
  }, [companyName])

  useEffect(() => {
    if (companies?.length > 0)
      setSuggestions(companies?.map((e: any) => ({label: e.full_name, value: e.id})))
  }, [companies])

  const handleCreateUser = handleSubmit(async formData => {
    const {email} = formData
    setIsCreating(true)
    try {
      const {error} = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${getURL()}/auth/callback`,
        data: {
          ...formData,
          is_company: false,
        },
      })

      if (error) {
        toastAlert({message: error.message, type: 'error'})
        setIsCreating(false)
        return
      }

      toastAlert({
        message: t(`toast-success`),
        type: 'success',
      })
      setIsCreating(false)
      closeDialog()
      router.refresh()
    } catch (error) {
      setIsCreating(false)
      console.error(error)
    }
  })

  return (
    <Dialog
      isOpen={isOpen}
      title={
        // @ts-ignore
        t(`title`)
      }
      closeDialog={closeDialog}
    >
      {/* Modal content */}
      <form>
        <div className="px-5 py-4">
          <div className="text-sm">
            <div className="text-primary-500 mb-3 font-medium">
              {
                // @ts-ignore
                t('title2')
              }
            </div>
          </div>
          <FormFieldControl
            control={control}
            Component={InputField}
            name="email"
            label={t(`label-email`)}
            variant="outlined"
            required={true}
          />
          <div className="relative">
            <InputField
              name="associated_company"
              onChange={e => setCompanyName(e.target.value)}
              value={companyName}
              label={t(`label-company`)}
              variant="outlined"
              placeholder={t(`placeholder-company`)}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setTimeout(() => setInputFocus(false), 100)}
            />
            {inputFocus && suggestions.length > 0 && (
              // eslint-disable-next-line tailwindcss/no-custom-classname
              <div className="absolute z-50 mt-2 flex max-h-96 w-full flex-col space-y-2 overflow-auto rounded border border-slate-600 bg-white px-2 py-3 text-gray-900">
                {suggestions.map(({label, value}: any) => (
                  <div
                    className={`cursor-pointer text-sm text-gray-900 hover:text-gray-600 ${
                      companyName === label && 'text-gray-900'
                    }`}
                    key={value}
                    onClick={() => {
                      setValue('associated_company', value)
                      setCompanyName(label)
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <>
            {role === 'client' && (
              <div className="sm:w-fit">
                <p className="mb-1 block text-sm font-medium">
                  {t('p')} <span className="text-rose-500">*</span>
                </p>
                <FormFieldControl
                  control={control}
                  Component={CheckboxField}
                  name="is_active"
                  label={t(`check`)}
                  labelClass="text-xs font-light"
                />
              </div>
            )}
          </>
        </div>
        {/* Modal footer */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex flex-wrap justify-end space-x-2">
            <Button color="inherit" onClick={closeDialog}>
              {t('btn-cancel')}
            </Button>
            <Button onClick={handleCreateUser} loading={isSubmitting || isCreating}>
              {t('btn-send')}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default OldUsersCreateForm
