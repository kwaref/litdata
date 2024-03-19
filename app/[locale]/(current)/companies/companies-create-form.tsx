'use client'

import Button, {buttonVariants} from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {FormFieldControl, InputField, SelectField} from '@/components/ui/Form'
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
import DatePickerField from '@/components/ui/Form/DatePickerField'
import {FlagIcon, TrashIcon} from '@heroicons/react/24/outline'
import {cn} from '@/components/utils/tailwindMerge'
import {COMPANIES_DELETE_CONFIRM} from './companies-delete-confirm'
import useGroupCompanies from '@/utils/useGroupCompanies'
import {generate} from 'generate-password'
import axios from 'axios'
import {MailType} from '@/utils/sendgridConstants'
import format from 'date-fns/format'
import isEqual from 'date-fns/isEqual'
import {countries} from 'countries-list'
import {useUser} from '@/components/utils/use-user'
import {useSupabase} from '@/app/supabase-provider'

export const ADD_COMPANY_DIALOG = 'add-company-dialog'

// const groups_mocked = [{label: 'Lit Data', value: crypto.randomUUID()}]

const CompaniesCreateForm = () => {
  const {isOpen, closeDialog, payload} = useDialog(ADD_COMPANY_DIALOG)
  const {openDialog} = useDialog(COMPANIES_DELETE_CONFIRM)
  const router = useRouter()
  // @ts-ignore
  const {supabase} = useSupabase()
  const [isCreating, setIsCreating] = useState(false)
  const t = useTranslations('Companies.dialog-create')
  const tableT = useTranslations('Companies.table')
  const {groups} = useGroupCompanies()
  const {userDetails} = useUser()

  const userSchema = z
    .object({
      full_name: z.string().min(1, 'Please provide your full name'),
      address: z.string(),
      location: z.string().nullable(),
      zip_code: z.string(),
      city: z.string(),
      primary_contact: z.string().min(1, 'Please provide a manager contact name'),
      email: z.string().email(t(`invalid-email`)),
      ap_primary_contact: z.string(),
      ap_primary_contact_email: z.string().email(t(`invalid-email`)).or(z.literal('')),
      mk_primary_contact: z.string(),
      mk_primary_contact_email: z.string().email(t(`invalid-email`)).or(z.literal('')),
      aditional_contact: z.string(),
      aditional_email: z.string().email(t(`invalid-email`)).or(z.literal('')),
      licence_expiry_date: z.date().array().min(1, 'Please provide a license expiry date.'),
      group_id: z.coerce.string().min(1, 'Please select a group'),
      phone: z.string(),
      mobile: z.string(),
      job_title: z.string(),
      department: z.string(),
      manager_address: z.string(),
      manager_city: z.string(),
      manager_zip_code: z.string(),
    })
    .refine(
      async schema => {
        if (payload?.company && payload?.company?.email === schema.email) {
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
        const names = schema.primary_contact?.split(' ')
        return names?.[0]?.length > 0 && names?.[1]?.length > 0
      },
      {
        message: 'First name and last name are required',
        path: ['primary_contact'],
      },
    )

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {isSubmitting, errors},
  } = useForm<z.infer<typeof userSchema>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    reset({
      full_name: payload?.company?.full_name ?? '',
      address: payload?.company?.address ?? '',
      location: payload?.company?.location ?? '',
      zip_code: payload?.company?.zip_code ?? '',
      city: payload?.company?.city ?? '',
      primary_contact: payload?.company?.primary_contact ?? '',
      email: payload?.company?.email ?? '',
      ap_primary_contact: payload?.company?.ap_primary_contact ?? '',
      ap_primary_contact_email: payload?.company?.ap_primary_contact_email ?? '',
      mk_primary_contact: payload?.company?.mk_primary_contact ?? '',
      mk_primary_contact_email: payload?.company?.mk_primary_contact_email ?? '',
      aditional_contact: payload?.company?.aditional_contact ?? '',
      aditional_email: payload?.company?.aditional_email ?? '',
      licence_expiry_date: payload?.company?.licence_expiry_date
        ? [new Date(payload?.company?.licence_expiry_date)]
        : [],
      group_id: payload?.company?.group_id?.id ?? '',
      phone: payload?.company?.phone ?? '',
      mobile: payload?.company?.mobile ?? '',
      job_title: payload?.company?.job_title ?? '',
      department: payload?.company?.department ?? '',
      manager_address: payload?.company?.manager_address ?? '',
      manager_city: payload?.company?.manager_city ?? '',
      manager_zip_code: payload?.company?.manager_zip_code ?? '',
    })
  }, [payload?.company])

  const handleCreateCompany = handleSubmit(async formData => {
    const {email, licence_expiry_date} = formData

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
              licence_expiry_date: new Date(licence_expiry_date?.[0]).toUTCString(),
              is_company: true,
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
    const {licence_expiry_date} = formData
    setIsCreating(true)
    try {
      const {data, error} = await supabase
        .from('users')
        .update({
          ...formData,
          licence_expiry_date: new Date(licence_expiry_date?.[0]).toUTCString(),
        })
        .eq('id', payload?.company?.id)

      if (error) {
        toastAlert({message: error.message, type: 'error'})
        setIsCreating(false)
        return
      }
      const sameExpire = isEqual(
        new Date(payload?.company?.licence_expiry_date),
        new Date(licence_expiry_date?.[0]),
      )
      if (formData.email !== payload?.company?.email) {
        const genPass = generate({
          length: 8,
          numbers: true,
        })

        axios
          .post('/api/user-update', {
            data: {id: payload?.company?.id, email: formData.email, password: genPass},
          })
          .then(
            async () =>
              await axios.post('/api/sendgrid', {
                params: {
                  type: MailType.ChangeManagerEmail,
                  emails: [formData.email],
                  data: {
                    name: formData.primary_contact,
                    company: formData.full_name,
                    email: formData.email,
                    password: genPass,
                  },
                },
              }),
          )
      }

      if (!sameExpire) {
        await axios.post('/api/sendgrid', {
          params: {
            type: MailType.MembershipRenewal,
            emails: [formData?.email],
            data: {
              username: formData?.primary_contact,
              company: formData?.full_name,
              'license-expiry': format(new Date(licence_expiry_date?.[0]), 'PP'),
            },
          },
        })
      }

      toastAlert({message: 'Company info updated!', type: 'success'})
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
      // title={t(payload?.company?.id ? 'title-edit' : 'title-new')}
      closeDialog={onCancel}
      classNames={{
        panel: 'md:min-w-[700px] max-h-[calc(100dvh-12rem)]',
        // panel: 'py-5 px-6',
        // title: 'mb-5',
      }}
    >
      {/* Modal content */}
      <form onSubmit={payload?.company?.id ? handleUpdate : handleCreateCompany}>
        <div className="max-h-[calc(100dvh-18rem)] overflow-hidden overflow-y-auto py-5 px-6">
          <h3 className="mt-3 mb-5 text-primary-500 text-lg font-degular tracking-normal font-semibold leading-6">
            {t(payload?.company?.id ? 'title-edit' : 'title-new')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="full_name"
              label={tableT('col-company')}
              variant="outlined"
              required
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
              name="zip_code"
              label={tableT('col-zip')}
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
              Component={DatePickerField}
              name="licence_expiry_date"
              label={tableT('col-license-expire')}
              variant="outlined"
              position="auto"
              dateFormat="M J, Y"
              placement="top"
              required
              // defaultValue={new Date()}
            />
            <FormFieldControl
              control={control}
              Component={SelectField}
              name="group_id"
              label={tableT('col-group')}
              variant="outlined"
              items={groups.map(g => ({label: g?.title, value: g?.id}))}
              // disabled={!!payload?.company?.id}
              required
              // placement="top"
              classNames={{option: 'border-b border-border last:border-none'}}
            />
          </div>
          <h3 className="mt-3 mb-5 text-primary-500 text-lg font-degular tracking-normal font-semibold leading-6">
            Manager info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="primary_contact"
              label={tableT('col-manager-contact')}
              variant="outlined"
              required
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="email"
              // disabled={!!payload?.company?.id}
              label={tableT('col-manager-contact-email')}
              variant="outlined"
              required
            />

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
              name="job_title"
              label={tableT('col-job-title')?.replace('Manager ', '')}
              variant="outlined"
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="department"
              label={tableT('col-department')?.replace('Manager ', '')}
              variant="outlined"
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="manager_address"
              label={tableT('col-manager-address')?.replace('Manager ', '')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="manager_city"
              label={tableT('col-manager-city')?.replace('Manager ', '')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="manager_zip_code"
              label={tableT('col-manager-zip')?.replace('Manager ', '')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={SelectField}
              name="location"
              label={tableT('col-country')?.replace('Manager ', '')}
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
          </div>
          <h3 className="mt-3 mb-5 text-primary-500 text-lg font-degular tracking-normal font-semibold leading-6">
            Other info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="ap_primary_contact"
              label={tableT('col-ap-contact-name')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="ap_primary_contact_email"
              label={tableT('col-ap-contact-email')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="mk_primary_contact"
              label={tableT('col-mk-contact-name')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="mk_primary_contact_email"
              label={tableT('col-mk-contact-email')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="aditional_contact"
              label={tableT('col-aditional-contact')}
              variant="outlined"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="aditional_email"
              label={tableT('col-aditional-email')}
              variant="outlined"
            />
          </div>
        </div>
        {/* Modal footer */}
        <div
          className={cn('mt-2 w-full flex justify-end gap-2 py-5 px-6', {
            'justify-between': !!payload?.company?.id,
          })}
        >
          {payload?.company?.id && (
            // <Button color="inherit" variant="link" onClick={() => openDialog(payload)}>
            <a
              className={cn('p-0', buttonVariants({color: 'danger', variant: 'link'}))}
              href={'mailto:support@litdata.org'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* <TrashIcon className="w-5 h-5 sm:hidden" /> */}
              <span className="max-sm:hidden">{t('btn-delete')}</span>
            </a>
          )}
          <div className="space-x-2">
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              {t('btn-cancel')}
            </Button>
            <Button
              onClick={payload?.company?.id ? handleUpdate : handleCreateCompany}
              loading={isSubmitting || isCreating}
            >
              {t('btn-send')}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default CompaniesCreateForm
