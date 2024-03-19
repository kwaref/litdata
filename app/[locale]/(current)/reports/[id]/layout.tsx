'use client'
import {type ReactNode, memo, useEffect, useState} from 'react'
import {SurveyDataProvider, useSurveyDataContext} from './survey-data-context'
import SidenavHeader from './headers/sidenav-header'
import Header from './headers/header'
import Filters from './filters'
import EditView from './edit-view'
import Corsstabs from './crosstabs'
import {cn} from '@/components/utils/tailwindMerge'
import {useBeforeUnload} from '@/components/utils/use-before-unload'
import {navMenuStore} from '@/components/utils/use-nav-menus'
import {useTranslations} from 'next-intl'
import {type Step} from 'react-joyride'
import {stepOptions} from '@/components/ui/Onboarding/onboarding-reports'
import dynamic from 'next/dynamic'
import ConfirmDeleteFilterDialog from './ConfirmDeleteFilterDialog'
import {useUser} from '@/components/utils/use-user'
import {pdfStore} from '@/components/ui/PrintPDF'
import {useSupabase} from '@/app/supabase-provider'
import toastAlert from '@/utils/toastAlert'
import {filtersStore, useReportFilters} from '@/components/utils/use-filters'
import {useMediaQuery} from 'react-responsive'
import {retrieve} from '@/components/utils/storage'
import {reportStore} from '@/components/utils/use-reports'

const Onboarding = dynamic(
  async () => await import('@/components/ui/Onboarding/onboarding-reports'),
  {ssr: false},
)

interface ReportViewLayoutProps {
  children: ReactNode
  params: {id: string}
}

function ReportViewLayout({children, params}: ReportViewLayoutProps) {
  const isDetails = params.id !== 'filter' && params.id !== 'crosstab'
  const isFilter = params.id === 'filter'
  const isCrosstab = params.id === 'crosstab'
  const {userDetails} = useUser()
  const setDocumentTitle = pdfStore(state => state.setDocumentTitle)
  const {supabase} = useSupabase()
  const [reportData, setReportData] = useState<any>(null)
  const [loadingReports, setLoadingReports] = useState<boolean>(false)
  const isOpen = filtersStore(state => state.isOpen)
  const {path} = useReportFilters()
  const toogleFilters = filtersStore(state => state.toogleOpen)
  const toggleOpen = navMenuStore(state => state.toggleHidden)
  const t = useTranslations('Report.Filters.Onboarding')
  const isMd = useMediaQuery({
    query: '(max-width: 768px)',
  })
  const isDirty = reportStore(state => state.isDirty)
  const setIsDirty = reportStore(state => state.setIsDirty)

  // const hasUnsavedChanges = filtersStore(state => state.hasUnsavedChanges)
  // useBeforeUnload(hasUnsavedChanges)
  useBeforeUnload(isDirty)

  const fetchReport = async (id: string) => {
    setLoadingReports(true)
    try {
      const {data} = await supabase.from('reports').select('*').eq('id', id).single()
      setDocumentTitle(data?.title)
      setReportData(data)
    } catch (error: any) {
      toastAlert({message: error?.message, type: 'error'})
    } finally {
      setLoadingReports(false)
    }
  }

  useEffect(() => {
    const reportIdStored = retrieve('reportId')
    if (isDetails || reportIdStored) {
      fetchReport(reportIdStored ?? params.id)
    }
    return () => setIsDirty(false)
  }, [])

  useEffect(() => {
    isMd && toggleOpen()
    return () => {
      isMd && toggleOpen()
    }
  }, [isMd])

  const onboardingSteps: Step[] = [
    {
      target: 'body',
      title: t('step-0.title'),
      content: t('step-0.content'),
      placement: 'center',
    },
    {
      ...stepOptions,
      target: '.onboarding-setp-1',
      title: t('step-1.title'),
      content: t.rich('step-1.content', {
        generate: chunks => <b>{chunks}</b>,
      }),
      spotlightPadding: 16,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'bottom-end',
        styles: {floaterOpening: {top: '15px'}},
      },
    },
    {
      ...stepOptions,
      target: '.onboarding-setp-2',
      title: t('step-2.title'),
      content: t.rich('step-2.content', {
        add: chunks => <b>{chunks}</b>,
      }),
      spotlightPadding: 0,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'right-start',
        styles: {floaterOpening: {top: '15px'}},
      },
    },
    {
      ...stepOptions,
      target: '.onboarding-setp-3',
      title: t('step-3.title'),
      content: t('step-3.content'),
      spotlightPadding: 0,
      floaterProps: {
        ...stepOptions.floaterProps,
        placement: 'left-start',
        styles: {
          floaterOpening: {top: '140px', width: '258px', height: '220px'},
        },
      },
    },
  ]

  return (
    <SurveyDataProvider>
      <ConfirmDeleteFilterDialog />
      {!loadingReports && userDetails && (
        <Onboarding
          start={
            ((isFilter || reportData?.isFilter) && !userDetails?.filters_tutorial) ||
            ((isCrosstab || (reportData && !reportData?.isFilter)) &&
              !userDetails?.crosstabs_tutorial)
          }
          steps={onboardingSteps}
          id={
            isFilter || reportData?.isFilter
              ? 'filters_tutorial'
              : isCrosstab || !reportData?.isFilter
              ? 'crosstabs_tutorial'
              : ''
          }
        />
      )}
      <div className="h-full w-full">
        <Header id={params?.id} fetchReport={fetchReport} reportData={reportData} />
        <div className="relative flex w-full">
          <div
            onClick={toogleFilters}
            className={cn(
              'absolute z-[9] bg-primary-900/50 w-screen transform h-full md:hidden duration-150 transition-all ease-in-out',
              {
                '-translate-x-0': isOpen,
                'z-0 -translate-x-full': !isOpen,
              },
            )}
          />
          <div
            className={cn(
              'onboarding-setp-2 absolute z-[10] h-full  transform bg-background transition-all duration-300 ease-in-out md:static max-xs:w-screen xs:min-w-[300px] xs:max-w-[300px] md:-translate-x-0',
              {
                '-translate-x-0': isOpen,
                'z-0 -translate-x-full': !isOpen,
              },
            )}
          >
            {/* <div className="flex w-full justify-end md:hidden">
              <ChevronDoubleLeftIcon
                className="w-6 h-6 mr-3 mt-4 cursor-pointer"
                onClick={onToggle}
              />
            </div> */}
            {<SidenavHeader params={params} reportData={reportData} userDetails={userDetails} />}

            {/* FILTERS INPUTS HERE */}

            <div
              className={cn(
                'w-full overflow-hidden overflow-y-auto md:max-h-[calc(100dvh-12.5rem)] md:min-h-[calc(100dvh-12.5rem)]',
                {'max-h-[calc(100dvh-10.75rem)] min-h-[calc(100dvh-10.75rem)]': isOpen},
                {
                  'md:max-h-[calc(100dvh-12rem)] md:min-h-[calc(100dvh-12rem)]':
                    path?.includes('add'),
                },
                {
                  'md:max-h-[calc(100dvh-8.5rem)] md:min-h-[calc(100dvh-8.5rem)]':
                    path?.includes('create') || path?.includes('edit'),
                },
              )}
            >
              {isDetails ? (
                <EditView reportId={params?.id} reportData={reportData} />
              ) : (
                <>
                  {isFilter && <Filters canEdit={isFilter} />}
                  {isCrosstab && (
                    <Corsstabs canEdit={isCrosstab} editMode={!!retrieve('reportId')} />
                  )}
                </>
              )}
            </div>
          </div>
          <section
            className={cn(
              'onboarding-setp-3 w-full bg-primary-25 2xl:flex 2xl:justify-center overflow-hidden overflow-y-auto px-4 md:px-8 py-6 max-h-[calc(100dvh-7rem)] min-h-[calc(100dvh-7rem)] md:max-h-[calc(100dvh-8.5rem)] md:min-h-[calc(100dvh-8.5rem)]',
              {'max-h-[calc(100dvh-7rem)] min-h-[calc(100dvh-7rem)]': isOpen},
              // {'!p-0': reportData?.isFilter || isFilter},
            )}
          >
            <div className={cn('2xl:min-w-[1171px] 2xl:max-w-[1171px]')}>{children}</div>
          </section>
        </div>
      </div>
    </SurveyDataProvider>
  )
}

export default ReportViewLayout
