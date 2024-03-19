'use client'
import toastAlert from '@/utils/toastAlert'
import {useSupabase} from '../../supabase-provider'
import LoadingDots from '@/components/ui/LoadingDots/LoadingDots'
import useGetAllCompanies from '@/utils/useGetAllCompanies'
import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'

export const SignUpForm = () => {
  const {supabase} = useSupabase()
  const {companies} = useGetAllCompanies()
  const router = useRouter()
  const [requestStatus, setRequestStatus] = useState({
    isError: false,
    message: '',
  })
  const [suggestions, setSuggestions] = useState([])
  const [inputFocus, setInputFocus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    username: '',
    is_testing: false,
    company: '',
  })
  const t = useTranslations('SignUpForm')

  useEffect(() => {
    // @ts-ignore
    if (companies) setSuggestions(companies.map((e: any) => e.company_name))
  }, [companies])

  const handleSendRequest = async () => {
    setLoading(true)
    const {email, full_name, username, company} = formData

    if (email && full_name && username && company) {
      const {data, error} = await supabase.from('signup_requests').insert({...formData})

      if (!error) {
        setRequestStatus({
          isError: false,
          message: t(`toast-success`),
        })
        toastAlert({
          message: t(`toast-success`),
          type: 'success',
        })
      } else {
        toastAlert({
          message: error.message,
          type: 'error',
        })
        setRequestStatus({
          isError: true,
          message: 'An error has ocurred, try again.',
        })
      }

      setTimeout(() => setRequestStatus({isError: false, message: ''}), 5000)
    }

    setLoading(false)
  }

  // @ts-ignore
  const handleCompanyNameChange = ev => {
    const inputValue = ev.target.value
    setFormData({...formData, company: inputValue})

    // Filtra las sugerencias basadas en el texto ingresado
    const filteredSuggestions = companies
      .filter(company =>
        // @ts-ignore
        company.company_name.toLowerCase().includes(inputValue.toLowerCase()),
      )
      .map((e: any) => e.company_name)
    // @ts-ignore
    setSuggestions(filteredSuggestions)
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Full Name */}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          {t('label-name')}
        </label>
        <input
          id="name"
          className="form-input w-full"
          type="name"
          placeholder="John Doe"
          value={formData.full_name}
          required={true}
          onChange={ev => setFormData({...formData, full_name: ev.target.value})}
        />
      </div>
      {/* Username */}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          {t('label-username')}
        </label>
        <input
          id="username"
          className="form-input w-full"
          type="username"
          placeholder="johndoe1990"
          value={formData.username}
          required={true}
          onChange={ev => setFormData({...formData, username: ev.target.value})}
        />
      </div>
      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          {t('label-email')}
        </label>
        <input
          id="email"
          className="form-input w-full"
          type="email"
          placeholder="example@company.com"
          value={formData.email}
          required={true}
          onChange={ev => setFormData({...formData, email: ev.target.value})}
        />
      </div>

      {/* Company */}
      <div className="relative">
        <label htmlFor="company" className="mb-1 block text-sm font-medium">
          {t('label-company')}
        </label>

        <input
          id="company"
          className="form-input w-full"
          type="text"
          placeholder="Meta"
          value={formData.company}
          required={true}
          onChange={handleCompanyNameChange}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setTimeout(() => setInputFocus(false), 100)}
        />
        {inputFocus && suggestions.length > 0 && (
          <div className="max-h-90 absolute z-50 mt-2 flex w-full flex-col space-y-2 overflow-scroll rounded border border-slate-600 px-2 py-3 dark:bg-slate-900">
            {suggestions.map(suggestion => (
              <div
                className={`hover:text-primary-500 text-primary-400 cursor-pointer text-sm ${
                  formData.company === suggestion && 'text-primary-200'
                }`}
                key={suggestion}
                onClick={() => {
                  setFormData({...formData, company: suggestion})
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        {/* Start */}
        <label className="flex items-center">
          <input
            type="checkbox"
            name="is_testing"
            className="form-checkbox"
            checked={formData.is_testing}
            onChange={ev => setFormData({...formData, is_testing: ev.target.checked})}
          />
          <span className="ml-2 text-xs">{t('span-test')}</span>
        </label>
        {/* End */}
      </div>

      <div className="pt-4">
        {/* Start */}
        <button
          onClick={handleSendRequest}
          className="btn w-full border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
        >
          {loading ? <LoadingDots /> : t(`button-send`)}
        </button>
        {/* End */}
      </div>

      <div
        className={`text-sm ease-in-out ${
          requestStatus.isError ? 'text-red-700' : 'text-green-700'
        }`}
      >
        {requestStatus.message}
      </div>
      <div className="flex flex-col items-center space-y-1 text-xs text-[#a9a9a9bf]">
        <button onClick={() => router.push('/signin')} className="underline hover:text-[lightgray]">
          {t('button-account')}
        </button>
      </div>
    </div>
  )
}
