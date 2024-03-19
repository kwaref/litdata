'use client'

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {
  AutocompleteInputField,
  FormFieldControl,
  InputField,
  SelectField,
} from '@/components/ui/Form'
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
import axios from 'axios'
import {MailType} from '@/utils/sendgridConstants'
import {generate} from 'generate-password'
import {FlagIcon} from '@heroicons/react/24/outline'
import {countries} from 'countries-list'
import {useSupabase} from '@/app/supabase-provider'

export const ADD_USER_DIALOG = 'add-user-dialog'

const UsersCreateForm = () => {
  const {isOpen, closeDialog, payload} = useDialog(ADD_USER_DIALOG)
  const {companies} = useGetAllCompanies()
  const router = useRouter()
  // @ts-ignore
  const {supabase} = useSupabase()
  const [isCreating, setIsCreating] = useState(false)
  const t = useTranslations('Users.dialog-create')
  const tableT = useTranslations('Users.table')

  const userSchema = z
    .object({
      full_name: z.string().min(1, 'Please provide your full name'),
      // role: z.string(),
      phone: z.string(),
      mobile: z.string(),
      email: z.string().email(t(`invalid-email`)),
      company: z.string().min(1, 'Please select a company.'),
      department: z.string(),
      job_title: z.string(),
      address: z.string(),
      location: z.string().nullable(),
      zip_code: z.string(),
      city: z.string(),
    })
    .refine(
      async schema => {
        if (payload?.user && payload?.user?.email === schema.email) {
          return true
        }

        const {data: user, error} = await supabase
          .from('users')
          .select('*')
          .eq('email', schema.email)
        if (error) {
          toastAlert({message: error?.message, type: 'error'})
          throw error
        } else {
          return user.length === 0
        }
      },
      {
        message: 'Email already exist',
        path: ['email'],
      },
    )
    .refine(
      schema => {
        const names = schema.full_name?.split(' ')
        return names?.[0]?.length > 0 && names?.[1]?.length > 0
      },
      {
        message: 'First name and last name are required',
        path: ['full_name'],
      },
    )

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {isSubmitting},
  } = useForm<z.infer<typeof userSchema>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    reset({
      full_name: payload?.user?.full_name ?? '',
      // role: payload?.user?.role ?? '',
      phone: payload?.user?.phone ?? '',
      mobile: payload?.user?.mobile ?? '',
      email: payload?.user?.email ?? '',
      company: payload?.user?.company?.id ?? '',
      department: payload?.user?.department ?? '',
      job_title: payload?.user?.job_title ?? '',
      address: payload?.user?.address ?? '',
      location: payload?.user?.location ?? '',
      zip_code: payload?.user?.zip_code ?? '',
      city: payload?.user?.city ?? '',
    })
  }, [payload?.user])

  const handleCreate = handleSubmit(async formData => {
    const {email} = formData

    const genPass = generate({
      length: 8,
      numbers: true,
    })

    setIsCreating(true)
    try {
      axios
        .post('/api/user-create', {
          data: {
            email,
            password: genPass,
            user_metadata: {
              ...formData,
              role: 'client',
              is_company: false,
            },
            email_confirm: true,
          },
        })
        .then(async () => {
          toastAlert({
            message: t(`toast-success`),
            type: 'success',
          })
          const {data} = await axios.post('/api/sendgrid', {
            params: {
              type: MailType.Invite,
              emails: [email],
              data: {
                password: genPass,
              },
            },
          })

          setIsCreating(false)
          closeDialog()
          reset()
          router.refresh()
        })
        .catch(error => {
          toastAlert({message: error.message, type: 'error'})
          setIsCreating(false)
        })
    } catch (error) {
      setIsCreating(false)
      console.error(error)
    }
  })

  const handleUpdate = handleSubmit(async formData => {
    setIsCreating(true)
    try {
      const {data, error} = await supabase
        .from('users')
        .update(formData)
        .eq('id', payload?.user?.id)

      if (error) toastAlert({message: error.message, type: 'error'})
      else {
        if (formData.email !== payload?.user?.email) {
          const genPass = generate({
            length: 8,
            numbers: true,
          })

          axios
            .post('/api/user-update', {
              data: {id: payload?.user?.id, email: formData.email, password: genPass},
            })
            .then(
              async () =>
                await axios.post('/api/sendgrid', {
                  params: {
                    type: MailType.ChangeUserEmail,
                    emails: [formData.email],
                    data: {
                      name: formData.full_name,
                      email: formData.email,
                      password: genPass,
                    },
                  },
                }),
            )
        }
        toastAlert({message: 'User info updated!', type: 'success'})
      }
      setIsCreating(false)
      closeDialog()
      router.refresh()
    } catch (error) {
      setIsCreating(false)
      console.error(error)
    }
  })

  const onCancel = () => {
    closeDialog()
    reset()
  }

  return (
    <Dialog
      isOpen={isOpen}
      title={t(payload?.user?.id ? 'title-edit' : 'title-new')}
      closeDialog={onCancel}
      classNames={{panel: 'py-5 px-6', title: 'mb-5'}}
    >
      {/* Modal content */}
      <form className="md:min-w-[700px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-13rem)] overflow-hidden overflow-y-auto">
          <FormFieldControl
            control={control}
            Component={InputField}
            name="full_name"
            label={tableT('col-fullname').replace(' *', '')}
            variant="outlined"
            required
          />
          {/* <FormFieldControl
            control={control}
            Component={SelectField}
            name="role"
            label={tableT('col-role')}
            variant="outlined"
            items={roles}
          /> */}
          <FormFieldControl
            control={control}
            Component={InputField}
            name="phone"
            label={tableT('col-phone')}
            variant="outlined"
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="mobile"
            label={tableT('col-mobile')}
            variant="outlined"
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="email"
            label={tableT('col-email').replace(' *', '')}
            variant="outlined"
            required
          />
          <FormFieldControl
            control={control}
            Component={SelectField}
            name="company"
            required
            label={tableT('col-company')}
            variant="outlined"
            items={companies?.map((e: any) => ({
              label: e.full_name,
              value: e.id,
            }))}
            classNames={{option: 'border-b border-border last:border-none'}}
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="department"
            label={tableT('col-department')}
            variant="outlined"
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="job_title"
            label={tableT('col-job-title')}
            variant="outlined"
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="address"
            label={tableT('col-address')}
            variant="outlined"
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="city"
            label={tableT('col-city')}
            variant="outlined"
          />
          <FormFieldControl
            control={control}
            Component={SelectField}
            name="location"
            label={tableT('col-country')}
            variant="outlined"
            className="col-span-full sm:col-span-1"
            // startIcon={<FlagIcon className="w-4 h-4" />}
            items={Object.keys(countries).map((code: string) => ({
              // @ts-ignore
              label: countries[code].name,
              value: code,
            }))}
            classNames={{option: 'border-b border-border last:border-none'}}
          />
          <FormFieldControl
            control={control}
            Component={InputField}
            name="zip_code"
            label={tableT('col-zip')}
            variant="outlined"
          />
        </div>
        {/* Modal footer */}
        {/* <p className="mt-4">{t('password-info')}</p> */}
        <div className="mt-4 flex flex-wrap justify-end space-x-2">
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            {t('btn-cancel')}
          </Button>
          <Button
            onClick={payload?.user?.id ? handleUpdate : handleCreate}
            loading={isSubmitting || isCreating}
          >
            {t('btn-send')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default UsersCreateForm
