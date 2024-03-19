'use client'

import useGetAllUsers from '@/utils/useGetAllUsers'
import {memo, useEffect, useState} from 'react'
import {useUsersTable} from './use-users-table'
import Table from '@/components/ui/Table'
import UsersCreateForm, {ADD_USER_DIALOG} from './users-create-form'
import Button from '@/components/ui/ButtonCVA'
import {InputField} from '@/components/ui/Form'
import useDebounceFn from '@/components/utils/use-debounceFn'
import {useDialog} from '@/components/utils/use-dialog'
import UsersDeleteConfirm from './users-delete-confirm'
import {useTranslations} from 'next-intl'
import {PlusIcon} from '@heroicons/react/20/solid'
import {cn} from '@/components/utils/tailwindMerge'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import OldUsersCreateForm, {OLD_ADD_USER_DIALOG} from './old-users-create-form'

// interface UsersProps {}

function Users() {
  const {users} = useGetAllUsers()
  const {columns} = useUsersTable()
  const [search, setSearch] = useState()
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  // const {openDialog} = useDialog(OLD_ADD_USER_DIALOG)
  const {openDialog} = useDialog(ADD_USER_DIALOG)
  const t = useTranslations('Users')

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  const {run} = useDebounceFn((value: string) => {
    if (!value) {
      setFilteredUsers(users)
      return
    }
    setFilteredUsers(
      users.filter(
        (user: any) =>
          user?.full_name?.toLowerCase().includes(value.toLowerCase()) ||
          user?.company?.full_name?.toLowerCase().includes(value.toLowerCase()),
      ),
    )
  })

  const onChange = ({target: {value}}: any) => {
    setSearch(value)
    run(value)
  }

  return (
    <>
      <UsersCreateForm />
      <UsersDeleteConfirm />
      {/* <OldUsersCreateForm /> */}
      <div className="text-primary-500 h-full w-full px-4 md:px-6">
        <div className="py-5 flex w-full justify-between gap-2 items-center">
          <h1 className="text-2xl font-degular tracking-normal font-bold max-sm:truncate max-sm:text-xl">
            {t('h1-title')}
          </h1>

          <Button startIcon={<PlusIcon className="h-5 w-5" />} onClick={() => openDialog()}>
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
          rows={filteredUsers}
          columns={columns}
          containerClass="max-h-[calc(100dvh-14rem)] overflow-auto"
        />
      </div>
    </>
  )
}

export default memo(Users)
