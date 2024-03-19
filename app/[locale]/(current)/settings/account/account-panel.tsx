'use client'

import {useSupabase} from '@/app/supabase-provider'
import Button from '@/components/ui/ButtonCVA'
import {FormFieldControl, InputField, SelectField} from '@/components/ui/Form'
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

const accountSchemea = z
  .object({
    // username: z.string().min(1, 'Please provide a full name'),
    full_name: z.string().min(1, 'Please provide a username'),
    location: z.string().nullable(),
  })
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

export default function AccountPanel() {
  const router = useRouter()
  // @ts-ignore
  const {supabase} = useSupabase()
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [fullUrl, setFullUrl] = useState('')
  const [isLoading, setLoading] = useState(false)
  const {userDetails, saveUserDetails} = useUser()
  const t = useTranslations('Settings.MyAccount.AccountPanel')
  const commonT = useTranslations('Common')

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
        // username: userDetails?.username,
        full_name: userDetails?.full_name,
        location: userDetails?.location,
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
          <div className="mt-5 grid grid-cols-2 gap-3">
            <FormFieldControl
              control={control}
              Component={InputField}
              name="full_name"
              label={t('fullName')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            />
            {/* <FormFieldControl
              control={control}
              Component={InputField}
              name="username"
              label={t('username')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
            /> */}
            <FormFieldControl
              control={control}
              Component={SelectField}
              name="location"
              label={t('country')}
              variant="outlined"
              className="col-span-full sm:col-span-1"
              startIcon={<FlagIcon className="w-4 h-4" />}
              items={Object.keys(countries).map((code: string) => ({
                // @ts-ignore
                label: countries[code].name,
                value: code,
              }))}
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
