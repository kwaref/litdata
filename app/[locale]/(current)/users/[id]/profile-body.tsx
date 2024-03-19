'use client'

import {useActiveUserContext} from '@/app/active-user-context'
import {useFlyoutContext} from '@/app/flyout-context'
import {useSupabase} from '@/app/supabase-provider'
import {ChevronDoubleRightIcon} from '@heroicons/react/20/solid'
import {LinkIcon, MapPinIcon} from '@heroicons/react/24/outline'
import {countries} from 'countries-list'
import {useTranslations} from 'next-intl'

export default function ProfileBody() {
  const {setFlyoutOpen} = useFlyoutContext()
  const t = useTranslations('Users.user-details')
  // const [avatarUrl, setAvatarUrl] = useState('')
  // const {supabase} = useSupabase()
  const {activeUser} = useActiveUserContext()

  // useEffect(() => {
  //   const getImageURL = async () => {
  //     const {data: avatarData} = await supabase.storage
  //       .from('storage')
  //       .getPublicUrl(activeUser?.avatar_url)
  //     if (avatarData) setAvatarUrl(avatarData.publicUrl)
  //   }
  //   if (activeUser?.avatar_url) getImageURL()
  // }, [activeUser])

  return (
    <div className="flex grow flex-col bg-background">
      {/* Profile background */}
      <div className="bg-primary-25 relative h-24">
        <ChevronDoubleRightIcon
          className="absolute left-4 top-3 h-6 w-6 cursor-pointer sm:hidden"
          onClick={() => setFlyoutOpen(true)}
        />
      </div>

      {/* Content */}
      <div className="relative px-4 pb-8 sm:px-6">
        {/* Pre-header */}
        <div className="-mt-16 mb-6 sm:mb-3">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}
            <div className="-ml-1 -mt-1 mb-4 inline-flex sm:mb-0">
              {/* {avatarUrl ? ( */}
              {/* <Image */}
              {/* className="rounded-full border-4 border-white dark:border-slate-900" */}
              {/* src={avatarUrl} */}
              {/* width={128} */}
              {/* height={128} */}
              {/* alt="Avatar" */}
              {/* /> */}
              {/* ) : ( */}
              <span className="text-secondary-700 bg-secondary-50 flex h-[128px] w-[128px] items-center justify-center rounded-full text-center text-6xl font-semibold uppercase">
                {activeUser?.full_name?.split(' ')?.[0]?.charAt(0)}
                {activeUser?.full_name?.split(' ')?.[1]?.charAt(0)}
              </span>
              {/* )} */}
            </div>

            {/* Actions */}
            {/* <div className="flex space-x-2 sm:mb-2">
              <button className="shrink-0 rounded border border-slate-200 bg-white p-1.5 shadow-sm hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
                <svg className="h-4 w-4 fill-current text-indigo-500" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7Zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8Z" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>

        {/* Header */}
        <header className="mb-6 text-center sm:text-left">
          {/* Name */}
          <div className="mb-2 inline-flex items-start">
            <h1 className="text-primary-500 text-2xl font-bold">
              {activeUser?.full_name || activeUser?.email || ''}
            </h1>
          </div>
          {/* Bio */}
          <div className="mb-3 text-sm">{activeUser?.description}</div>
          {/* Meta */}
          <div className="flex flex-wrap justify-center space-x-4 sm:justify-start">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5" />
              <span className="text-primary-500 ml-2 whitespace-nowrap text-sm font-medium">
                {activeUser?.location
                  ? /* @ts-ignore */
                    countries[activeUser?.location].native
                  : t('not-shared')}
              </span>
            </div>

            {activeUser?.website && (
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5" />
                <a
                  className="text-primary-500 ml-2 whitespace-nowrap text-sm font-medium"
                  href="#0"
                >
                  {activeUser?.website ?? t('not-shared')}
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="relative mb-6">
          <div
            className="absolute bottom-0 h-px w-full bg-slate-200 dark:bg-slate-700"
            aria-hidden="true"
          ></div>
        </div>

        {/* Profile content */}
        <div className="flex flex-col pt-6 xl:flex-row xl:space-x-16">
          {/* Main content */}
          <div className="mb-8 flex-1 space-y-5 xl:mb-0">
            {/* About Me */}

            <div>
              <h2 className="text-primary-500 mb-2 font-bold">{t('about')}</h2>
              <div className="space-y-2 text-sm">
                <>
                  {activeUser?.about || (
                    <span className="text-primary-500 text-sm">{t('no-info')}</span>
                  )}
                </>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-3 xl:w-[14rem] xl:min-w-[14rem]">
            <div className="text-sm">
              <h3 className="text-primary-500 font-medium">{t('username')}</h3>
              <div>{activeUser?.username ? `@${activeUser?.username}` : t('not-shared')}</div>
            </div>
            <div className="text-sm">
              <h3 className="text-primary-500 font-medium">Location</h3>
              <div>
                {activeUser?.location
                  ? // @ts-ignore
                    countries[activeUser?.location].native
                  : t('not-shared')}
              </div>
            </div>
            <div className="text-sm">
              <h3 className="text-primary-500 font-medium">Email</h3>
              <div>{activeUser?.email}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
