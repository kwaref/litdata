'use client'

import {useActiveUserContext} from '@/app/active-user-context'
import {useFlyoutContext} from '@/app/flyout-context'
import {useSupabase} from '@/app/supabase-provider'
import {InputField} from '@/components/ui/Form'
import Menu from '@/components/ui/Menu'
import {cn} from '@/components/utils/tailwindMerge'
import useCompanies from '@/utils/useCompanies'
import useGetAllCompanies from '@/utils/useGetAllCompanies'
import useGetAllUsers from '@/utils/useGetAllUsers'
import {ChevronDoubleLeftIcon} from '@heroicons/react/20/solid'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'
import Image from 'next/image'
import {useEffect, useState} from 'react'

export default function ProfileSidebar({id}: {id: string}) {
  const {flyoutOpen, setFlyoutOpen} = useFlyoutContext()
  const [activeCompany, setActiveCompany] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')

  const {users} = useGetAllUsers()
  const {setActiveUser} = useActiveUserContext()

  useEffect(() => {
    if (users) {
      setFilteredUsers(users)
      setActiveUser(users.find(user => user.id === id) || users[0])
    }
  }, [users, id])

  useEffect(() => {
    const newFilteredUsers = users.filter(
      el =>
        (activeCompany === '' || el.associated_company?.full_name === activeCompany) &&
        (searchValue === '' || el.full_name.toLowerCase().includes(searchValue.toLowerCase())),
    )
    setFilteredUsers(newFilteredUsers)
  }, [activeCompany, searchValue])

  return (
    <div
      id="profile-sidebar"
      className={cn(
        'delay-400 absolute z-30 h-full w-screen transform bg-background transition-all duration-500 ease-in-out sm:static sm:w-auto sm:-translate-x-0',
        {
          '-translate-x-0': flyoutOpen,
          '-translate-x-full': !flyoutOpen,
        },
      )}
    >
      <div className="relative h-[calc(100dvh-64px)]">
        <ChevronDoubleLeftIcon
          className="absolute bottom-3 right-4 h-6 w-6 cursor-pointer sm:hidden"
          onClick={() => setFlyoutOpen(false)}
        />
        <div className="no-scrollbar sticky top-16 h-[calc(100dvh-110px)] shrink-0 overflow-y-auto overflow-x-hidden border-r border-border bg-background md:w-[18rem] xl:w-[20rem]">
          {/* Profile group */}
          <div>
            {/* Group header */}
            <div className="sticky top-0 z-10">
              <CompanySelect activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
            </div>
            {/* Group body */}
            <div className="px-5 py-4">
              {/* Search form */}
              <SearchUser searchValue={searchValue} setSearchValue={setSearchValue} />
              {/* Filtered Users */}
              <FilteredUsers filteredUsers={filteredUsers} />
            </div>
          </div>
          I
        </div>
      </div>
    </div>
  )
}

const CompanySelect = ({
  activeCompany,
  setActiveCompany,
}: {
  activeCompany: string
  setActiveCompany: any
}) => {
  const {companies} = useCompanies()

  return (
    <div className="flex h-16 items-center border-b border-slate-200 bg-white px-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex w-full items-center justify-between">
        {/* Select Company to filter */}

        <Menu
          options={[{label: 'All companies', value: ''}].concat(
            companies.map(el => ({label: el.full_name, value: el.full_name})),
          )}
          value={activeCompany}
          onSelect={setActiveCompany}
        />
      </div>
    </div>
  )
}
const SearchUser = ({searchValue, setSearchValue}: {searchValue: string; setSearchValue: any}) => {
  const t = useTranslations('Users.user-details')
  return (
    <form className="relative">
      <InputField
        id="profile-search"
        type="search"
        placeholder={t('search')}
        value={searchValue}
        onChange={ev => setSearchValue(ev.target.value)}
        variant="outlined"
        startIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
      />
    </form>
  )
}

const FilteredUsers = ({filteredUsers}: {filteredUsers: any}) => {
  const {activeUser, setActiveUser} = useActiveUserContext()
  const t = useTranslations('Users.user-details')

  return (
    <div className="mt-4">
      <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
        {t('users')}
      </div>
      <ul className="mb-6 space-y-2 ">
        {filteredUsers.map((user: any) => {
          return (
            <UserElement
              user={user}
              key={user.id}
              isActive={activeUser?.id === user?.id}
              handleClick={setActiveUser}
            />
          )
        })}
      </ul>
    </div>
  )
}
const UserElement = ({user, isActive, handleClick}: any) => {
  // const [avatarUrl, setAvatarUrl] = useState('')
  // const {supabase} = useSupabase()

  // useEffect(() => {
  //   const getImageURL = async () => {
  //     const {data: avatarData} = await supabase.storage
  //       .from('storage')
  //       .getPublicUrl(user?.avatar_url)
  //     if (avatarData) setAvatarUrl(avatarData.publicUrl)
  //   }
  //   if (user?.avatar_url) getImageURL()
  // }, [user])

  return (
    <li className="-mx-2" onClick={() => handleClick(user)}>
      <button
        className={cn('hover:bg-primary-25 w-full rounded-md p-2', {'bg-primary-25': isActive})}
        // onClick={() => setFlyoutOpen(false)}
      >
        <div className="flex items-center">
          <div className="relative mr-2">
            {/* {avatarUrl !== '' ? ( */}
            {/* <Image */}
            {/* className="h-8 w-8 rounded-full" */}
            {/* src={avatarUrl || ''} */}
            {/* width={32} */}
            {/* height={32} */}
            {/* alt="User 08" */}
            {/* /> */}
            {/* ) : ( */}
            <span className="bg-secondary-50 text-secondary-700 flex h-9 w-9 items-center justify-center rounded-full text-center text-base font-semibold uppercase">
              {user?.full_name?.split(' ')?.[0]?.charAt(0)}
              {user?.full_name?.split(' ')?.[1]?.charAt(0)}
            </span>
            {/* )} */}
          </div>
          {user?.full_name ? (
            <div className="flex flex-col">
              <span className="text-primary-500 truncate text-start text-sm font-medium">
                {user?.full_name}
              </span>
              <span className="text-primary-200 truncate text-xs">{user?.email}</span>
            </div>
          ) : (
            <span className="text-primary-500 truncate text-start text-sm font-medium">
              {user?.email}
            </span>
          )}
        </div>
      </button>
    </li>
  )
}
