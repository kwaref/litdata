'use client'

import {useSupabase} from '@/app/supabase-provider'
import Button from '@/components/ui/ButtonCVA'
import {FormFieldControl, InputField, SelectField} from '@/components/ui/Form'
import DatePickerField from '@/components/ui/Form/DatePickerField'
import {useUser} from '@/components/utils/use-user'
import {generateRandomCode} from '@/utils/generateRandomCode'
import toastAlert from '@/utils/toastAlert'
import {FlagIcon, UserCircleIcon} from '@heroicons/react/24/outline'
import {zodResolver} from '@hookform/resolvers/zod'
import {createClient} from '@supabase/supabase-js'
import axios from 'axios'
import {countries} from 'countries-list'
import {useTranslations} from 'next-intl'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import React, {createRef, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {FaUser} from 'react-icons/fa'
import z from 'zod'

export default function AccountPanelManager() {
  const router = useRouter()
  // @ts-ignore
  const {supabase} = useSupabase()
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [fullUrl, setFullUrl] = useState('')
  const [isLoading, setLoading] = useState(false)
  const {userDetails, saveUserDetails} = useUser()
  const t = useTranslations('Settings.MyAccount.AccountPanel')
  const emailT = useTranslations('Companies.dialog-create')
  const extraFieldsT = useTranslations('Companies.table')
  const commonT = useTranslations('Common')

  const accountSchemea = z
    .object({
      full_name: z.string().min(1, 'Please provide your full name'),
      address: z.string(),
      location: z.string().nullable(),
      zip_code: z.string(),
      city: z.string(),
      primary_contact: z.string().min(1, 'Please provide a manager contact name'),
      ap_primary_contact: z.string(),
      ap_primary_contact_email: z.string().email(emailT(`invalid-email`)).or(z.literal('')),
      mk_primary_contact: z.string(),
      mk_primary_contact_email: z.string().email(emailT(`invalid-email`)).or(z.literal('')),
      aditional_contact: z.string(),
      aditional_email: z.string().email(emailT(`invalid-email`)).or(z.literal('')),
      phone: z.string(),
      mobile: z.string(),
      job_title: z.string(),
      department: z.string(),
      manager_address: z.string(),
      manager_city: z.string(),
      manager_zip_code: z.string(),
    })
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
    reset,
    formState: {isDirty, isSubmitting},
  } = useForm<z.infer<typeof accountSchemea>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(accountSchemea),
  })

  // avatar management
  // const handleImageUrl = async () => {
  //   if (uploadedUrl?.length > 0) {
  //     const {data} = await supabase.storage.from('storage').getPublicUrl(uploadedUrl)

  //     if (data && !data.publicUrl.endsWith('undefined') && !data.publicUrl.endsWith('/storage/'))
  //       setFullUrl(data?.publicUrl)
  //   } else if (userDetails?.avatar_url) {
  //     const {data} = await supabase.storage.from('storage').getPublicUrl(userDetails?.avatar_url)
  //     console.log(data)
  //     if (data && !data.publicUrl.endsWith('undefined') && !data.publicUrl.endsWith('/storage/'))
  //       setFullUrl(data?.publicUrl)
  //   } else {
  //     setFullUrl('')
  //   }
  // }
  // async function handleFileUpload(event: any) {
  //   const file = event.target.files[0]
  //   setLoading(true)
  //   try {
  //     const oldImageURL = userDetails?.avatar_url
  //     // sube el archivo a Supabase Storage
  //     const {data, error} = await supabase.storage
  //       .from('storage')
  //       .upload(`avatars/${generateRandomCode()}-${userDetails?.id}-${file?.name}`, file)

  //     if (error) {
  //       toastAlert({message: error.message, type: 'error'})
  //       setUploadedUrl('')
  //     } else {
  //       const {error} = await supabase
  //         .from('users')
  //         .update({
  //           avatar_url: data?.path || '',
  //         })
  //         .match({id: userDetails?.id})

  //       if (error) toastAlert({message: error.message, type: 'error'})
  //       else {
  //         toastAlert({
  //           message: 'Profile picture updated!',
  //           type: 'success',
  //         })
  //         // try to delete the old image (still doesnt works)
  //         if (oldImageURL) {
  //           const {error} = await supabase.storage.from('storage').remove([oldImageURL])
  //           console.log(error)
  //         }

  //         // establece la URL de la imagen cargada
  //         setUploadedUrl(data?.path || '')
  //       }
  //     }
  //   } finally {
  //     supabase.auth.refreshSession()
  //     router.refresh()
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   handleImageUrl()
  // }, [uploadedUrl])

  useEffect(() => {
    if (userDetails) {
      reset({
        full_name: userDetails?.full_name ?? '',
        address: userDetails?.address ?? '',
        location: userDetails?.location ?? '',
        zip_code: userDetails?.zip_code ?? '',
        city: userDetails?.city ?? '',
        primary_contact: userDetails?.primary_contact ?? '',
        ap_primary_contact: userDetails?.ap_primary_contact ?? '',
        ap_primary_contact_email: userDetails?.ap_primary_contact_email ?? '',
        mk_primary_contact: userDetails?.mk_primary_contact ?? '',
        mk_primary_contact_email: userDetails?.mk_primary_contact_email ?? '',
        aditional_contact: userDetails?.aditional_contact ?? '',
        aditional_email: userDetails?.aditional_email ?? '',
        phone: userDetails?.phone ?? '',
        mobile: userDetails?.mobile ?? '',
        job_title: userDetails?.job_title ?? '',
        department: userDetails?.department ?? '',
        manager_address: userDetails?.manager_address ?? '',
        manager_city: userDetails?.manager_city ?? '',
        manager_zip_code: userDetails?.manager_zip_code ?? '',
      })
    }

    // const getImageURL = async () => {
    //   const {data: avatarData} = await supabase.storage
    //     .from('storage')
    //     .getPublicUrl(userDetails?.avatar_url)
    //   if (
    //     !!avatarData &&
    //     !avatarData.publicUrl.endsWith('undefined') &&
    //     !avatarData.publicUrl.endsWith('/storage/')
    //   )
    //     setFullUrl(avatarData.publicUrl)
    // }
    // getImageURL()
  }, [userDetails])

  const updateProfile = handleSubmit(async formData => {
    const {data, error} = await supabase
      .from('users')
      .update(formData)
      .eq('id', userDetails?.id)

    if (error) toastAlert({message: error.message, type: 'error'})
    else {
      // axios.post('/api/user-update', {data: {...formData, id: userDetails.id}})
      toastAlert({message: 'Profile updated!', type: 'success'})
      saveUserDetails({...userDetails, ...formData})
      // router.refresh()
    }
  })

  const fileInputRef = createRef()

  const handleIconClick = () => {
    // Simula un clic en el input de tipo file al hacer clic en el icono
    // @ts-ignore
    fileInputRef.current.click()
  }

  // Referencia al input de tipo file
  return (
    <div className="grow">
      {/* Panel body */}
      <div className="space-y-6">
        {/* Picture */}
        {/* <section>
          <div className="flex items-center gap-4 max-[300px]:flex-col">
            {
              <div>
                {fullUrl.length > 0 && !fullUrl.endsWith('undefined') ? (
                  <Image
                    className="h-20 w-20 rounded-full border border-border shadow-sm"
                    src={fullUrl}
                    width={80}
                    height={80}
                    alt="User upload"
                  />
                ) : (
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-slate-200 text-3xl">
                    <FaUser />
                  </div>
                )}
              </div>
            }

            {fileInputRef && (
              <input
                type="file"
                // @ts-ignore
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileUpload}
              />
            )}
            
            <label htmlFor="fileInput">
              <Button
                variant="outlined"
                role="img"
                aria-label="Subir archivo"
                onClick={handleIconClick}
              >
                {t('change')}
              </Button>
            </label>
          </div>
        </section> */}
        {/* Business Profile */}
        <section>
          <h2 className="mb-1 flex items-center text-base font-bold leading-snug dark:text-slate-100">
            <UserCircleIcon className="h-5 w-5" /> <span className="ml-2">{t('profile')}</span>
          </h2>
          <p className="text-primary-300 text-sm">{t('profileDesc')}</p>
          <h3 className="mt-3 mb-5 text-primary-500 text-lg font-degular tracking-normal font-semibold leading-6">
            Company Info
          </h3>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="full_name"
              label={extraFieldsT('col-company')}
              variant="outlined"
              required
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="address"
              label={extraFieldsT('col-address')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="zip_code"
              label={extraFieldsT('col-zip')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="city"
              label={extraFieldsT('col-city')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
          </div>
          <h3 className="mt-3 mb-5 text-primary-500 text-lg font-degular tracking-normal font-semibold leading-6">
            Manager info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="primary_contact"
              label={extraFieldsT('col-manager-contact')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
              required
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="phone"
              label={extraFieldsT('col-phone')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="mobile"
              label={extraFieldsT('col-mobile')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="job_title"
              label={extraFieldsT('col-job-title')?.replace('Manager ', '')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="department"
              label={extraFieldsT('col-department')?.replace('Manager ', '')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />

            <FormFieldControl
              control={control}
              Component={InputField}
              name="manager_address"
              label={extraFieldsT('col-manager-address')?.replace('Manager ', '')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="manager_city"
              label={extraFieldsT('col-manager-city')?.replace('Manager ', '')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="manager_zip_code"
              label={extraFieldsT('col-manager-zip')?.replace('Manager ', '')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={SelectField}
              name="location"
              label={extraFieldsT('col-country')?.replace('Manager ', '')}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="ap_primary_contact"
              label={extraFieldsT('col-ap-contact-name')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="ap_primary_contact_email"
              label={extraFieldsT('col-ap-contact-email')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="mk_primary_contact"
              label={extraFieldsT('col-mk-contact-name')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="mk_primary_contact_email"
              label={extraFieldsT('col-mk-contact-email')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="aditional_contact"
              label={extraFieldsT('col-aditional-contact')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            <FormFieldControl
              control={control}
              Component={InputField}
              name="aditional_email"
              label={extraFieldsT('col-aditional-email')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
          </div>
          <div className="mt-4">
            <Button disabled={!isDirty} onClick={updateProfile} loading={isSubmitting || isLoading}>
              {commonT('saveChanges')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
