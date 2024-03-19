'use client'

import {memo, useEffect, useState} from 'react'
import {useCompaniesTable} from './useCompaniesTable'
import Table from '@/components/ui/Table'
import useCompanies from '@/utils/useCompanies'
import {useDialog} from '@/components/utils/use-dialog'
import useDebounceFn from '@/components/utils/use-debounceFn'
import {InputField} from '@/components/ui/Form'
import Button from '@/components/ui/ButtonCVA'
import CompaniesCreateForm, {ADD_COMPANY_DIALOG} from './companies-create-form'
import {useTranslations} from 'next-intl'
import {PlusIcon} from '@heroicons/react/20/solid'
import QuestionsDrawer from './questions-drawer'
import {cn} from '@/components/utils/tailwindMerge'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import CompaniesDeleteConfirm from './companies-delete-confirm'

// interface CompaniesProps {}

function Companies() {
  const {companies} = useCompanies()
  const {columns} = useCompaniesTable()
  const [search, setSearch] = useState()
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([])
  // const {openDialog} = useDialog(OLD_ADD_COMPANY_DIALOG)
  const {openDialog} = useDialog(ADD_COMPANY_DIALOG)
  const t = useTranslations('Companies')

  useEffect(() => {
    setFilteredCompanies(companies)
  }, [companies])

  const {run} = useDebounceFn((value: string) => {
    if (!value) {
      setFilteredCompanies(companies)
      return
    }
    setFilteredCompanies(
      companies?.filter(
        (company: any) =>
          company?.full_name?.toLowerCase().includes(value.toLowerCase()) ||
          company?.group_id?.title?.toLowerCase().includes(value.toLowerCase()) ||
          company?.primary_contact?.toLowerCase().includes(value.toLowerCase()),
      ),
    )
  })

  const onChange = ({target: {value}}: any) => {
    setSearch(value)
    run(value)
  }
  return (
    <>
      <QuestionsDrawer />
      <CompaniesCreateForm />
      <CompaniesDeleteConfirm />
      <div className="text-primary-500 h-full w-full px-4 md:px-6">
        <div className="py-5 flex w-full justify-between gap-2 items-center">
          <h1 className="text-2xl font-degular tracking-normal font-bold max-sm:truncate max-sm:text-xl">
            {t('h1-title')}
          </h1>

          <Button
            startIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => openDialog({isCompany: true})}
          >
            <span className="ml-2">{t('btn-add')}</span>
          </Button>
        </div>
        <InputField
          value={search}
          onChange={onChange}
          placeholder={t(`placeholder-search`)}
          className="mb-5 sm:w-56"
          classNames={{input: '!bg-white border-none'}}
          startIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
        />
        <Table
          rows={filteredCompanies}
          columns={columns}
          containerClass="max-h-[calc(100dvh-14rem)] overflow-auto"
        />
      </div>
    </>
  )
}

export default memo(Companies)
