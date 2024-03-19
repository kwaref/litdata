'use client'

import {
  DocumentDuplicateIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {format} from 'date-fns'
import Link from 'next/link'
import {useDialog} from '../utils/use-dialog'
import {CONFIRM_DELETE_DIALOG} from '@/app/[locale]/(current)/reports/ConfirmDeleteDialog'
import {useTranslations} from 'next-intl'
import {
  useState,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNodeArray,
  useEffect,
} from 'react'
import {useRouter} from 'next/navigation'
import Dropdown, {type MenuProps} from './Dropdown'
import {EllipsisHorizontalIcon, UserGroupIcon} from '@heroicons/react/20/solid'
import ShareReportsDrawer, {
  SHARE_REPORT_DRAWER,
} from '@/app/[locale]/(current)/reports/share/share-report-drawer'
import {useDrawer} from '../utils/use-drawer'
import Floater from 'react-floater'
import toastAlert from '@/utils/toastAlert'
import {useSupabase} from '@/app/supabase-provider'
import {cn} from '../utils/tailwindMerge'
import {useUser} from '../utils/use-user'
import useUserDetails from '@/utils/useUserDetails'
import useGetOneUser from '@/utils/useGetOneUser'
import ShareReportsMembersDrawer, {
  SHARE_REPORT_MEMEBER_DRAWER,
} from '@/app/[locale]/(current)/reports/share/share-report-members-drawer'
import {LoadingIcon} from './ButtonCVA'

interface ReportsListProps {
  reports: any[]
  user: any
  fetchReports: () => void
  emptyMessage?: string | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray
  isLoading?: boolean
}

function ReportsList({reports, user, emptyMessage, isLoading, ...rest}: ReportsListProps) {
  const t = useTranslations('Report')

  if (isLoading) {
    // return <LoadingIcon classNames={{icon: 'w-8 h-8'}} />
    return (
      <div className="w-full flex rounded border bg-background px-5 py-4 shadow-sm md:justify-center min-h-[75px]">
        <div className="w-full flex justify-between max-md:flex-col md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 min-w-[2rem] md:h-10 md:w-10 bg-gray-300 rounded-full" />
            <div>
              <div className="w-32 h-2.5 bg-gray-300 rounded-full mb-1.5" />
              <div className="w-24 h-2 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full w-12" />
        </div>
      </div>
    )
  }

  return (
    <>
      {user?.role === 'admin' && <ShareReportsDrawer />}
      {user?.role === 'client' && <ShareReportsMembersDrawer />}
      {reports?.length > 0 && user ? (
        <div className="w-full flex flex-col gap-4">
          {reports?.map((report: any) => (
            <ReportCard {...rest} report={report} key={report?.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="self-start sm:max-w-[35.19rem]">
          <h1 className="text-primary-400 text-sm">{emptyMessage ?? t('empty')}</h1>
        </div>
      )}
    </>
  )
}

const ReportCard = ({report, fetchReports, user}: any) => {
  const {supabase} = useSupabase()
  const router = useRouter()
  const {openDialog} = useDialog(CONFIRM_DELETE_DIALOG)
  const {openDrawer} = useDrawer(SHARE_REPORT_MEMEBER_DRAWER)
  const t = useTranslations('Report')
  const [isForbidden, setIsForbidden] = useState(false)

  useEffect(() => {
    // permissions logic
    if (user?.role === 'admin') {
      setIsForbidden(false)
      // setOwnerData(user)
    } else {
      const reportQuestions = report?.data?.questions?.map((el: any) => el.id)
      if (reportQuestions?.every((el: string) => user?.permissions?.includes(el))) {
        setIsForbidden(false)
      } else {
        setIsForbidden(true)
      }
    }
  }, [])

  const onClone = async (report: any) => {
    let error = null
    const {id, title, ...rest} = report
    delete rest.ownerData
    const {error: errorResponse} = await supabase.from('reports').insert({
      ...rest,
      title: `${title} copy`,
      user_id: user?.id,
      allowed_users: [],
      created_at: new Date(),
    })
    error = errorResponse
    if (error) {
      toastAlert({message: error.message, type: 'error'})
    } else {
      toastAlert({message: 'Report cloned successfully', type: 'success'})
      fetchReports()
      router.refresh()
    }
  }

  return (
    <div
      key={report?.id}
      className="relative flex gap-4 rounded border bg-background px-5 py-4 shadow-sm max-md:flex-col md:items-center md:justify-between"
    >
      <div className="onboarding-step-2 flex items-center gap-4">
        <span
          className={cn(
            'bg-primary-50 text-primary-500 flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full text-center text-sm uppercase md:h-10 md:w-10',
            {
              'bg-[#F8929E1F] text-[#F8929E]':
                report?.user_id !== user?.id && report?.ownerData?.role === 'client',
            },
            {
              'bg-secondary-50 text-secondary-700':
                report?.user_id === user?.id && report?.ownerData?.role === 'client',
            },
          )}
        >
          {report?.ownerData?.role === 'admin'
            ? 'LD'
            : `${user?.full_name?.split(' ')?.[0]?.charAt(0)?.toUpperCase() ?? ''}${
                user?.full_name?.split(' ')?.[1]?.charAt(0)?.toUpperCase() ?? ''
              }`}
        </span>
        <div className="flex flex-col flex-wrap">
          {!isForbidden ? (
            <Link
              className="before:absolute before:left-0 before:top-0 before:z-0 before:block before:h-full before:w-full before:content-['']"
              href={`/reports/${report?.id}`}
            >
              <h2 className="text-primary-300 text-base font-semibold">{report?.title}</h2>
            </Link>
          ) : (
            <h2 className="text-primary-200 text-base font-semibold">{report?.title}</h2>
          )}
          <div className="flex gap-2 flex-wrap">
            <small className="text-primary-200">{format(new Date(report.created_at), 'PPP')}</small>
            {isForbidden && (
              <>
                <div className="border-l border-slate-300" />
                <span className="inline-flex gap-1 items-center">
                  <NoSymbolIcon className="w-3 h-3 text-danger stroke-2" />
                  <small className="text-primary-200">{t('forbidden')}</small>
                </span>
              </>
            )}
            {report?.allowed_users?.length > 0 && (
              <>
                <div className="border-l border-slate-300" />
                {/* @ts-ignore */}
                <small className="text-primary-200">{`${t('by')} ${report?.ownerData
                  ?.full_name}`}</small>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-primary-500 flex items-center gap-4 ">
        <div className="onboarding-step-3 text-primary-400 bg-primary-25 relative inline-flex rounded-full px-2.5 py-1 text-center text-xs font-medium">
          {report?.isFilter ? 'Filters' : 'Crosstabs'}
        </div>
        {report?.allowed_users?.length > 0 && (
          <Floater
            disableHoverToClick
            event="hover"
            eventDelay={0}
            placement="top"
            offset={5}
            styles={{
              arrow: {length: 8, spread: 15, color: '#00002D'},
              container: {
                backgroundColor: '#00002D',
                color: '#fff',
                borderRadius: '4px',
                padding: '5px 12px 7px 12px',
                minHeight: 0,
                maxWidth: '170px',
              },
            }}
            content={report?.user_id !== user?.id ? t('share-tooltip-client') : t('share-tooltip')}
          >
            <div className="z-[1] bg-primary-25 rounded-full p-[5px]">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </Floater>
        )}
        {!isForbidden && (
          <div className="inline-flex h-7 px-1 justify-center items-center shrink-0">
            <div className="w-[1px] h-full self-stretch rounded-full bg-primary-50" />
          </div>
        )}
        {!isForbidden && user?.role === 'admin' ? (
          <Menu
            report={report}
            fetchReports={fetchReports}
            onClone={async () => await onClone(report)}
          />
        ) : (
          !isForbidden && (
            <div className="onboarding-step-4 flex items-center gap-4 z-10">
              <DocumentDuplicateIcon
                className="h-4 w-4 cursor-pointer"
                onClick={async () => await onClone(report)}
              />
              {report?.user_id === user?.id && (
                <>
                  <ShareIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() =>
                      openDrawer({
                        reportId: report?.id,
                        reportName: report?.title,
                        reportDate: report?.created_at,
                        reportQuestions: report?.data?.questions?.map((q: any) => q.id) ?? [],
                        initialAllowedUsers: report?.allowed_users,
                      })
                    }
                  />
                  <TrashIcon
                    className="h-4 w-4 cursor-pointer hover:text-danger"
                    onClick={() => openDialog({fetchReports, id: report?.id})}
                  />
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

function Menu({
  report,
  fetchReports,
  onClone,
}: {
  report?: any
  fetchReports: (() => void) | undefined
  onClone: ((report: any) => void) | undefined
}) {
  const {push} = useRouter()
  const {openDialog} = useDialog(CONFIRM_DELETE_DIALOG)
  const {openDrawer} = useDrawer(SHARE_REPORT_DRAWER)
  const t = useTranslations('Report.actions')
  const className = 'border-b border-border last:border-none'

  const menu: MenuProps[] = [
    {
      label: t('edit'),
      className,
      Icon: <PencilSquareIcon className="w-4 h-4" />,
      onClick: () => push(`/reports/${report?.id}`),
    },
    {
      label: t('clone'),
      className,
      Icon: <DocumentDuplicateIcon className="w-4 h-4" />,
      onClick: async () => onClone?.(report),
    },
    {
      label: t('send'),
      className,
      Icon: <ShareIcon className="w-4 h-4" />,
      onClick: () =>
        openDrawer({
          reportId: report?.id,
          reportName: report?.title,
          reportDate: report?.created_at,
          reportQuestions: report?.data?.questions?.map((q: any) => q.id) ?? [],
          initialAllowedUsers: report?.allowed_users,
        }),
    },
    {
      label: t('delete'),
      className,
      Icon: <TrashIcon className="w-4 h-4" />,
      onClick: () => openDialog({fetchReports, id: report?.id}),
    },
  ]

  return (
    <div className="menu-report-card">
      <Dropdown
        menu={menu}
        classNames={{
          trigger:
            'bg-transparent pl-0 hover:text-primary-500 text-primary-500 hover:bg-transparent shadow-none',
          panel: 'right-0 left-auto !w-[160px]',
        }}
      >
        <EllipsisHorizontalIcon className="h-4 w-4" />
      </Dropdown>
    </div>
  )
}

export default ReportsList
