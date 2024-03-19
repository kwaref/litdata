/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/enforces-shorthand */
'use client'

import {useState, useEffect} from 'react'
import {format} from 'date-fns'
import Button, {buttonVariants} from '@/components/ui/ButtonCVA'
import {useDialog} from '@/components/utils/use-dialog'
import {NAME_DIALOG} from '../name-dialog'
import {EXPORT_FORMAT_DIALOG} from '../export-format-dialog'
import {useSupabase} from '@/app/supabase-provider'
import {useUser} from '@/components/utils/use-user'
import toastAlert from '@/utils/toastAlert'
import {usePathname, useRouter} from 'next/navigation'
import ExportCruceToCsv from '../csv/export-cruce-to-csv'
import {useSurveyDataContext} from '../survey-data-context'
import {useTranslations} from 'next-intl'
import {
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  PencilSquareIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import {pdfStore} from '@/components/ui/PrintPDF'
import useToggle from '@/components/utils/useToggle'
import {filtersStore} from '@/components/utils/use-filters'
import {remove, retrieve, set} from '@/components/utils/storage'
import LinkMenu from '@/components/ui/LinkMenu'
import {reportStore} from '@/components/utils/use-reports'

interface HeaderProps {
  id: string
  reportData: any
  fetchReport: (id: string) => any
}

function Header({id, reportData, fetchReport}: HeaderProps) {
  const {openDialog: openNameDialog} = useDialog(NAME_DIALOG)
  const {openDialog: openExportDialog} = useDialog(EXPORT_FORMAT_DIALOG)
  const {supabase} = useSupabase()
  const {surveyData, filters, crossesData, editMode, trend, dateFilter} = useSurveyDataContext()
  const [dialogTitle, setDialogTitle] = useState('')
  // const isDetails = editMode.mode !== 'filter' && editMode.mode !== 'crosstab'
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const setDocumentTitle = pdfStore(state => state.setDocumentTitle)
  const isOpen = filtersStore(state => state.isOpen)
  const toogleFilters = filtersStore(state => state.toogleOpen)
  const setIsDirty = reportStore(state => state.setIsDirty)
  const isDirty = reportStore(state => state.isDirty)

  const {userDetails} = useUser()
  const router = useRouter()
  const t = useTranslations('Report.Headers')

  // useEffect(() => {
  //   if (!isDetails && ['filter', 'crosstab']?.includes(id)) {
  //     /* setDialogTitle(`Reporte creado el ${format(new Date(), 'Pp')}`) */
  //     setDialogTitle(t(`title-dialog`, {date: format(new Date(), 'Pp')}))
  //   }
  // }, [])

  useEffect(() => {
    if (['filter', 'crosstab']?.includes(id)) {
      setDialogTitle(t(`title-dialog`, {date: format(new Date(), 'Pp')}))
      return
    }

    reportData?.title && setDialogTitle(reportData.title)
  }, [reportData])

  useEffect(() => {
    if (dialogTitle) setDocumentTitle(dialogTitle)
  }, [dialogTitle])

  const onSave = async () => {
    const reportIdStored = retrieve('reportId')
    setIsSaving(true)
    let error = null

    const answers = surveyData?.answers?.map(({id}: any) => id)

    if (editMode?.isEdit || reportIdStored) {
      const {error: errorResponse} = await supabase
        .from('reports')
        .update({
          title: dialogTitle,
          user_id: userDetails?.id,
          isFilter: editMode.mode === 'filter',
          trend,
          data: {
            ...surveyData,
            answers,
            filters,
            crosses: crossesData,
            ...(editMode.mode === 'filter' && {dateFilter}),
          },
        })
        .eq('id', reportIdStored ?? id)
      error = errorResponse
    } else {
      const {error: errorResponse, data} = await supabase
        .from('reports')
        .insert({
          title: dialogTitle,
          user_id: userDetails?.id,
          isFilter: id === 'filter',
          trend,
          data: {
            ...surveyData,
            answers,
            filters,
            crosses: crossesData,
            ...(editMode.mode === 'filter' && {dateFilter}),
          },
        })
        .select('*')
        .single()
      error = errorResponse

      if (!errorResponse && !reportIdStored && !editMode?.isEdit) {
        set('reportId', data?.id)
      }
    }
    if (error) {
      setIsSaving(false)
      toastAlert({message: error.message, type: 'error'})
    } else {
      setIsSaving(false)
      setIsDirty(false)
      toastAlert({
        message:
          reportIdStored ?? editMode?.isEdit ? t('toast-success-update') : t(`toast-success`),
        type: 'success',
      })
      // setFilters([])
    }
  }

  return (
    <header className="w-full bg-background relative z-20 border-b border-border p-4">
      <div className="onboarding-setp-1 flex w-full items-center justify-between gap-2 max-md:flex-col lg:flex-row">
        <div className="text-primary-500 flex items-center gap-4 md:gap-2 max-md:w-full">
          <LinkMenu className="md:hidden text-base " href={'/reports'}>
            Exit
          </LinkMenu>
          <h1 className="text-lg text-center font-degular tracking-normal font-bold max-lg:w-80 max-lg:overflow-hidden max-lg:truncate max-md:w-[45rem] md:text-xl">
            {dialogTitle || reportData?.title || ''}
          </h1>
          {((editMode?.isEdit && reportData?.user_id === userDetails?.id) ||
            ['filter', 'crosstab'].includes(id)) && (
            <button
              onClick={() =>
                openNameDialog({
                  title: dialogTitle,
                  setTitle: setDialogTitle,
                  id,
                })
              }
            >
              {<PencilSquareIcon className="h-5 w-5" />}
            </button>
          )}
        </div>
        <div className="flex justify-between items-center gap-2 max-md:w-full">
          <Button
            className="py-2 px-4 gap-2 md:hidden w-full max-w-[100.5px]"
            variant={isOpen ? 'contained' : 'outlined'}
            color="inherit"
            onClick={toogleFilters}
            startIcon={
              isOpen ? <XMarkIcon className="h-5 w-5" /> : <FunnelIcon className="h-5 w-5" />
            }
          >
            <span>{t('Sidenav.span-filter')}</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              className="py-2 gap-2 px-4 truncate max-w-[126px] md:max-w-md"
              variant="outlined"
              color="inherit"
              onClick={() =>
                openExportDialog({
                  isFilter: reportData?.isFilter || id === 'filter',
                })
              }
              startIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            >
              <span className="hidden md:inline-block">{t('span-download-report')}</span>
              <span className="md:hidden">{t('span-download')}</span>
            </Button>

            {((editMode?.isEdit && reportData?.user_id === userDetails?.id) ||
              ['filter', 'crosstab'].includes(id)) && (
              <Button
                className="py-2 px-4 gap-2 w-[100.5px] md:w-md"
                startIcon={<CloudArrowUpIcon className="h-5 w-5" />}
                onClick={onSave}
                loading={isSaving}
                disabled={
                  !isDirty &&
                  ((editMode?.isEdit && reportData?.user_id === userDetails?.id) ||
                    !!retrieve('reportId'))
                }
              >
                <span>{t('span-save')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
