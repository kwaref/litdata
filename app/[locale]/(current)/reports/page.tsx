'use client'

import {useEffect, useState} from 'react'
import Dropdown from '@/components/ui/Dropdown'
import {useRouter} from 'next/navigation'
import {reportListStore} from '@/components/utils/use-reports'
import {useTranslations} from 'next-intl'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import {PlusIcon} from '@heroicons/react/20/solid'
import dynamic from 'next/dynamic'
import {type Step} from 'react-joyride'
import {stepOptions} from '@/components/ui/Onboarding/onboarding-reports'
import ReportsList from '@/components/ui/ReportsList'
import {useFetchReports} from '@/components/utils/use-fetch-reports'
import SelectSurveyDialog, {SELECT_SURVEY_DIALOG} from './select-survey-dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {useUser} from '@/components/utils/use-user'
import {userHelp} from '@/components/ui/Header'
import NoPermissionsDialog, {NO_PERMISSIONS_DIALOG} from './no-permissions-dialog'
import {usePagination} from '@/components/utils/use-pagination'
import Button, {LoadingIcon} from '@/components/ui/ButtonCVA'

const Onboarding = dynamic(
  async () => await import('@/components/ui/Onboarding/onboarding-reports'),
  {ssr: false},
)

const reportMocked = [
  {
    id: 69,
    created_at: '2023-12-01T15:37:17.348676+00:00',
    user_id: '7f5ba5f9-0f78-41ff-afbb-b2079ba246d3',
    title: 'Report created on 12/01/2023, 10:37 AM',
    isFilter: true,
  },
]

// interface ReportsProps {}

function Reports() {
  const {push} = useRouter()
  const {data, fetchReports, userDetails, isLoading} = useFetchReports()
  const surveyData = reportListStore(state => state.surveyData)
  const setSurveyData = reportListStore(state => state.setSurveyData)
  const t = useTranslations('Report')
  const {openDialog} = useDialog(SELECT_SURVEY_DIALOG)
  const {openDialog: openPermDialog} = useDialog(NO_PERMISSIONS_DIALOG)
  const {limit, offset, onNext, onPrev} = usePagination()
  const setHelp = userHelp(state => state.setHelp)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

  const onboardingSteps: Step[] = [
    {
      ...stepOptions,
      target: '.onboarding-step-0',
      title: t('Onboarding.step-0.title'),
      content: t.rich('Onboarding.step-0.content', {
        support: (chunks: any) => <b>{chunks}</b>,
      }),
      spotlightPadding: 0,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'bottom-end',
        styles: {floaterOpening: {left: '10px'}},
      },
    },
    {
      target: 'body',
      title: t('Onboarding.step-1.title'),
      content: t('Onboarding.step-1.content'),
      placement: 'center',
    },
    {
      ...stepOptions,
      target: '.onboarding-step-2',
      title: t('Onboarding.step-2.title'),
      content: t.rich('Onboarding.step-2.content', {
        title: (chunks: any) => <b>{chunks}</b>,
        date: (chunks: any) => <b>{chunks}</b>,
      }),
      spotlightPadding: 18,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'bottom-start',
        styles: {floaterOpening: {left: '-20px', top: '10px'}},
      },
    },
    {
      ...stepOptions,
      target: '.onboarding-step-3',
      title: t('Onboarding.step-3.title'),
      content: t.rich('Onboarding.step-3.content', {
        type: (chunks: any) => <b>{chunks}</b>,
      }),
      spotlightPadding: 22,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'bottom-end',
        styles: {floaterOpening: {left: '25px', top: '10px'}},
      },
    },
    {
      ...stepOptions,
      target: '.onboarding-step-4',
      title: t('Onboarding.step-4.title'),
      content: t.rich('Onboarding.step-4.content', {
        duplicate: (chunks: any) => <b>{chunks}</b>,
        delete: (chunks: any) => <b>{chunks}</b>,
      }),
      spotlightPadding: 22,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'bottom-end',
        styles: {floaterOpening: {left: '25px', top: '10px'}},
      },
    },
    {
      ...stepOptions,
      target: '.onboarding-step-5',
      title: t('Onboarding.step-5.title'),
      content: t.rich('Onboarding.step-5.content', {
        new: (chunks: any) => <b>{chunks}</b>,
      }),
      spotlightPadding: 0,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'bottom-end',
        styles: {floaterOpening: {left: '10px'}},
      },
    },
  ]

  const onCreateFilter = () => {
    openDialog({href: '/reports/filter'})
  }
  const onCreateCrosstab = () => {
    openDialog({href: '/reports/crosstab'})
  }

  const createMenu = [
    {
      label: t(`menu-1`),
      // onClick: onCreateFilter
      onClick: () => {
        push('/reports/filter')
        setIsLoadingRoute(true)
      },
    },
    {
      label: t(`menu-2`),
      // onClick: onCreateCrosstab,
      onClick: () => {
        push('/reports/crosstab')
        setIsLoadingRoute(true)
      },
    },
  ]

  useEffect(() => {
    // sincronizar los reportes (asociados al usuario) al cargar la pagina
    setSurveyData(data)
    setHelp('onboarding')
  }, [data])

  useEffect(() => {
    userDetails &&
      userDetails?.role !== 'admin' &&
      userDetails?.permissions?.length === 0 &&
      openPermDialog()
  }, [userDetails])

  return (
    <>
      {userDetails &&
        !userDetails?.onboarding &&
        (userDetails?.role === 'admin' ||
          (userDetails?.role !== 'admin' && userDetails?.permissions?.length > 0)) && (
          <Onboarding start={true} steps={onboardingSteps} id="onboarding" showHelp={true} />
        )}
      <ConfirmDeleteDialog />
      <NoPermissionsDialog />
      <SelectSurveyDialog />
      <div className="h-full w-full px-4 md:px-6 pb-4">
        <header className="flex w-full flex-wrap items-center justify-between gap-2 py-5">
          <h1 className="text-primary-500 text-2xl font-degular tracking-normal font-bold">
            {t('title')}
          </h1>

          <Dropdown
            menu={createMenu}
            classNames={{
              panel: 'right-0 left-auto !w-[160px]',
              trigger: 'onboarding-step-5',
            }}
            disabled={
              (userDetails?.role !== 'admin' && userDetails?.permissions?.length === 0) ||
              isLoadingRoute ||
              !userDetails?.onboarding
            }
          >
            {isLoadingRoute ? <LoadingIcon /> : <PlusIcon className="h-5 w-5" />}
            <span className="ml-2">{t('btn-create')}</span>
          </Dropdown>
        </header>
        <div className="w-full flex flex-col gap-8 justify-center items-center">
          <ReportsList
            reports={
              userDetails &&
              !userDetails?.onboarding &&
              (userDetails?.role === 'admin' ||
                (userDetails?.role !== 'admin' && userDetails?.permissions?.length > 0))
                ? reportMocked
                : surveyData
            }
            user={userDetails}
            fetchReports={fetchReports}
            isLoading={isLoading}
          />
          {surveyData?.length > 0 && userDetails && (
            <div className="flex flex-col gap-4 items-center pb-4">
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{limit}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {surveyData?.length}
                </span>{' '}
                Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0 gap-2">
                <Button disabled={offset === 0} onClick={onPrev} variant="outlined" color="inherit">
                  Prev
                </Button>
                <Button
                  disabled={limit * (offset + 1) >= surveyData?.length}
                  onClick={onNext}
                  variant="outlined"
                  color="inherit"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Reports
