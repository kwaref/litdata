/* eslint-disable tailwindcss/enforces-shorthand */
'use client'

import {memo, useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {ArrowRightIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import {cn} from '@/components/utils/tailwindMerge'
import {buttonVariants} from '@/components/ui/ButtonCVA'
import ReportsList from '@/components/ui/ReportsList'
import {useFetchReports} from '@/components/utils/use-fetch-reports'
import {useFetchWidgets} from '@/components/utils/use-fetch-widgets'
import ConfirmDeleteDialog from '../reports/no-permissions-dialog'
import isAfter from 'date-fns/isAfter'
import WidgetList from '@/components/widgets/widget-list'
import ConfirmRemoveDialog from './ConfirmRemoveDialog'

// interface DashboardProps {}

const quickActions = [
  {
    title: 'quick-actions.user-action.title',
    description: 'quick-actions.user-action.description',
    action: 'quick-actions.user-action.action',
    actionRef: '/users',
  },
  {
    title: 'quick-actions.company-action.title',
    description: 'quick-actions.company-action.description',
    action: 'quick-actions.company-action.action',
    actionRef: '/companies',
  },
  {
    title: 'quick-actions.filter-action.title',
    description: 'quick-actions.filter-action.description',
    action: 'quick-actions.filter-action.action',
    actionRef: '/reports/filter',
  },
  {
    title: 'quick-actions.crosstab-action.title',
    description: 'quick-actions.crosstab-action.description',
    action: 'quick-actions.crosstab-action.action',
    actionRef: '/reports/crosstab',
  },
]

function Dashboard() {
  const date = new Date()
  const hours = date.getHours()
  const t = useTranslations('Dashboard')
  const {data, fetchReports, userDetails, isLoading} = useFetchReports()
  const {data: retrievedWidgets} = useFetchWidgets()
  const [widgets, setWidgets] = useState([])

  // useEffect(() => {
  //   const execCron = async () => {
  //     try {
  //       const {status, data} = await axios.get('/api/cron')
  //       console.log(status, data)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   execCron()
  // }, [])

  useEffect(() => {
    setWidgets(retrievedWidgets)
  }, [retrievedWidgets])

  const handleRemove = (id: string | number) => {
    const widgetsLeft = widgets.filter((widget: {id: string | number}) => widget?.id !== id)
    setWidgets(widgetsLeft)
  }

  const status =
    hours < 12 ? t('morning') : hours <= 18 && hours >= 12 ? t('afternoon') : t('evening')

  if (!userDetails) {
    return null
  }

  return userDetails?.licence_expiry_date &&
    isAfter(new Date(), new Date(userDetails?.licence_expiry_date)) ? (
    <div className="w-full px-4 p-6 md:px-6 2xl:px-0">
      <div className="bg-[#F43F5E] w-full rounded-md p-5 md:px-6">
        <h1 className="text-3xl font-bold text-white font-degular tracking-normal">
          {t('licence-expiry')}
        </h1>
        <p className="text-sm text-white">{t('licence-expiry-description')}</p>
        <p className="text-sm text-white">{t('licence-expiry-salute')}</p>
      </div>
    </div>
  ) : (
    <>
      <ConfirmDeleteDialog />
      <ConfirmRemoveDialog />
      <div className="w-full px-4 p-6 md:px-6 2xl:px-0">
        <div className="bg-primary-300 w-full rounded-md p-5 md:px-6">
          <h1 className="text-3xl font-bold text-white font-degular tracking-normal">
            {t('h1-name', {status, fullname: userDetails?.full_name})}
          </h1>
          <p className="text-sm text-white">{t('p-description')}</p>
        </div>
        {widgets?.length > 0 && (
          <WidgetList remove={handleRemove} questions={widgets} header={t('widget-list-header')} />
        )}
        <>
          {(userDetails?.role === 'admin' ||
            (userDetails?.role !== 'admin' && userDetails?.permissions?.length > 0)) && (
            <>
              <h2 className="w-full py-5 font-degular text-2xl font-semibold">
                {t('quick-actions.header')}
              </h2>
              <div className="w-full pb-5 flex overflow-hidden overflow-x-auto rounded no-scrollbar gap-4">
                {(userDetails?.role === 'admin' ? quickActions : quickActions.slice(2, 4))?.map(
                  action => (
                    <div key={action?.title} className="bg-background p-4 min-w-[220px] w-[220px]">
                      <p className="mb-1 font-degular text-xl font-semibold">
                        {
                          // @ts-ignore
                          t(action?.title)
                        }
                      </p>
                      <p className="mb-3 text-sm">
                        {
                          // @ts-ignore
                          t(action?.description)
                        }
                      </p>
                      <div className="flex justify-end">
                        <Link
                          href={action.actionRef}
                          className={cn('p-0', buttonVariants({variant: 'link'}))}
                        >
                          <span className="mr-2">
                            {
                              // @ts-ignore
                              t(action?.action)
                            }
                          </span>
                          <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
          {userDetails?.role === 'client' ? (
            <>
              <h2 className="py-5 w-full font-degular text-2xl font-semibold">
                {t('last-2-reports.header')}
              </h2>
              <div className="pb-5 ">
                <ReportsList
                  reports={data?.filter((el: any) => el?.user_id !== userDetails?.id)?.slice(0, 2)}
                  fetchReports={fetchReports}
                  user={userDetails}
                  emptyMessage={t('last-2-reports.empty')}
                  isLoading={isLoading}
                />
              </div>
              <h2 className="w-full py-5 font-degular text-2xl font-semibold">
                {t('last-5-reports.header')}
              </h2>
              <div className="pb-5">
                <ReportsList
                  reports={data?.filter((el: any) => el?.user_id === userDetails?.id)?.slice(0, 5)}
                  fetchReports={fetchReports}
                  user={userDetails}
                  emptyMessage={t('last-5-reports.empty')}
                  isLoading={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="w-full py-5 font-degular text-2xl font-semibold">
                {t('last-report-generated.header')}
              </h2>
              <div className="pb-5">
                <ReportsList
                  reports={data?.filter((el: any) => el?.user_id === userDetails?.id)?.slice(0, 5)}
                  fetchReports={fetchReports}
                  user={userDetails}
                  emptyMessage={t.rich('last-report-generated.empty', {
                    header: chunks => (
                      <p className="text-2xl font-semibold text-primary-500 mb-2">{chunks}</p>
                    ),
                    description: chunks => <p className="text-sm">{chunks}</p>,
                  })}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
          <Link
            href="/reports"
            className={cn('px-0', buttonVariants({variant: 'link', color: 'inherit'}))}
          >
            <span className="mr-2">{t('all-reports')}</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </>
      </div>
    </>
  )
}

export default memo(Dashboard)
