/* eslint-disable @typescript-eslint/no-redeclare */
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
import {useForm} from 'react-hook-form'
import z from 'zod'
import {useTranslations} from 'next-intl'
import {useEffect, useState} from 'react'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export const OLD_ADD_COMPANY_DIALOG = 'old-add-company-dialog'

const CompaniesCreateForm = () => {
  const {isOpen, closeDialog, payload} = useDialog(OLD_ADD_COMPANY_DIALOG)
  const {companies} = useGetAllCompanies()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [inputFocus, setInputFocus] = useState(false)
  const router = useRouter()
  // @ts-ignore
  const supabase = createClient(PUBLIC_URL, SERVICE_ROLE_KEY)
  const [isCreating, setIsCreating] = useState(false)
  const t = useTranslations('Companies.dialog-create')

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
      is_active: true,
      // @ts-ignore
      is_company: true,
    },
  })

  const companyName = watch('full_name', '')
  const role = watch('role', '')

  useEffect(() => {
    const filteredSuggestions = companies
      .filter(company =>
        // @ts-ignore
        company.full_name.toLowerCase().includes(companyName),
      )
      .map((e: any) => ({label: e.full_name, value: e._id}))
    // @ts-ignore
    setSuggestions(filteredSuggestions)
  }, [companyName])

  useEffect(() => {
    if (companies?.length > 0) setSuggestions(companies.map((e: any) => e.company_name))
  }, [companies])

  const handleCreateUser = handleSubmit(async formData => {
    const {email} = formData
    setIsCreating(true)
    try {
      const {error} = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${getURL()}/auth/callback`,
        data: {
          ...formData,
          is_company: !!payload?.isCompany,
        },
      })

      if (error) {
        toastAlert({message: error.message, type: 'error'})
        setIsCreating(false)
        return
      }

      toastAlert({
        message: t('toast-success'),
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
      <form className="min-w-[500px]">
        <div className="px-5 py-4">
          <div className="text-sm">
            <div className="mb-3 font-medium text-slate-800 dark:text-slate-100">
              {t(
                // @ts-ignore
                'title2',
              )}
            </div>
          </div>
          <FormFieldControl
            control={control}
            Component={InputField}
            name="full_name"
            label={t(`label-company`)}
            variant="outlined"
            required={true}
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="email"
            label={t(`label-email`)}
            variant="outlined"
            required={true}
          />
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

export default CompaniesCreateForm
