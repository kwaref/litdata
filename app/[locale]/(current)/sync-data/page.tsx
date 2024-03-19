'use client'

import Button from '@/components/ui/ButtonCVA'
import {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {ArrowPathIcon, ArrowUturnLeftIcon} from '@heroicons/react/20/solid'
import axios from 'axios'
import {format} from 'date-fns'
import {SurveyDataProvider, useSurveyDataContext} from '../reports/[id]/survey-data-context'
import {useSupabase} from '@/app/supabase-provider'
import {useRouter} from 'next/navigation'
import {InformationCircleIcon, SignalIcon} from '@heroicons/react/24/outline'
import SelectSurvey from './select-survey'
import ConfirmSyncDialog, {CONFIRM_SYNC_DIALOG} from './confirm-sync-dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {useDrawer} from '@/components/utils/use-drawer'
import ImportSurveyDrawer, {IMPORT_SURVEY_DRAWER} from './import-survey-drawer'

// interface DashboardProps {}

function SyncData() {
  const t = useTranslations('syncData')
  const [snapsData, setSnapsData] = useState([])
  const [surveys, setSurveys] = useState([])
  const {supabase} = useSupabase()
  const {openDialog} = useDialog(CONFIRM_SYNC_DIALOG)
  const {openDrawer} = useDrawer(IMPORT_SURVEY_DRAWER)
  const snapTable = process.env.NEXT_PUBLIC_SNAP_TABLE

  useEffect(() => {
    async function fetchSurveyData() {
      try {
        const {data, error} = await supabase
          .from(snapTable || 'survey_data_snap')
          .select('data')
          .single()

        if (error) {
          console.error('Error fetching survey data:', error.message)
        } else {
          const inactiveSurveys = data?.data?.surveys.filter(
            (el: any) => el.id !== data?.data?.active_survey_id,
          )
          setSnapsData(data?.data)
          setSurveys(inactiveSurveys)
        }
      } catch (error) {
        console.error('Error in the request:', error)
      }
    }

    fetchSurveyData()
  }, [])

  const syncData = async () => {
    const {data} = await axios.get('/api/cron')
  }

  const onCreateCopy = async () => {}

  const onAssign = async () => {}

  const onRename = async () => {}

  // const createUser = async () => {
  //   const {data} = await axios.get('/api/user-create')
  //   console.log(data)
  // }

  return (
    <>
      <ConfirmSyncDialog />
      <ImportSurveyDrawer />
      <div className="w-full px-4 py-6 md:px-6 2xl:px-0">
        <div className="w-full flex items-center justify-between gap-3">
          <h1 className="py-5 font-degular font-semibold text-2xl">{t('active-survey')}</h1>
          <Button className="text-xs py-2 px-3" onClick={openDrawer}>
            {t('import')}
          </Button>
        </div>
        <div className="mb-5 inline-flex flex-wrap gap-4">
          <div className="bg-white p-4 w-80 flex flex-col">
            {/* <div className="mb-4 text-white bg-[#10B981] relative inline-flex rounded-full px-3 py-1 text-center text-xs font-medium gap-2 items-center">
              <SignalIcon className="w-[14px] h-[14px]" /> <span>{t('synced')}</span>
            </div> */}
            <p className="font-semibold mb-1.5">Survey Lit Data</p>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="text-[#9A690A] bg-[#E9D30A1F] bg-opacity-[12] relative inline-flex rounded-full px-3 py-1 text-center text-xs font-medium">
                {format(
                  new Date('Sat Feb 03 2024 14:43:04 GMT-0500 (Eastern Standard Time)'),
                  'PPpp',
                )}
              </div>
              <InformationCircleIcon className="w-[14px] h-[14px]" />
            </div>

            <div className="inline-flex justify-start items-center gap-3">
              <Button
                className="text-xs py-2 px-3"
                endIcon={<ArrowPathIcon className="w-4 h-4 ml-2" />}
                onClick={syncData}
              >
                {t('sync')}
              </Button>
              {/* <Button
                variant="outlined"
                color="inherit"
                className="text-xs py-2 px-3"
                endIcon={<ArrowPathIcon className="w-4 h-4 ml-2" />}
                onClick={onCreateCopy}
              >
                {t('copy')}
              </Button> */}
            </div>
            <hr className="mt-6 mb-4" />
            <div className="flex flex-col gap-3">
              {surveys?.map((el: any) => (
                <div key={el.id} className="inline-flex gap-2 items-center justify-between">
                  <span className="text-sm text-primary-200">
                    <span>{t('log-created')}</span>
                    {format(new Date(el.date), 'Pp').replace(',', ' @')}
                  </span>
                  <ArrowPathIcon
                    className="h-5 w-5 text-primary-500 cursor-pointer"
                    onClick={() => openDialog({surveyId: el.id, snapsData})}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <h2 className="py-5 font-degular font-semibold text-2xl">{t('legacy')}</h2>
        <div className="mb-5 inline-flex flex-wrap gap-4">
          <div className="bg-white p-4 w-80">
            <p className="font-semibold mb-4">Survey Lit Data</p>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-xs">{t('from')}</span>
              <div className="text-[#9A690A] bg-[#E9D30A1F] bg-opacity-[12] relative inline-flex rounded-full px-3 py-1 text-center text-xs font-medium">
                {format(new Date(), 'PPpp')}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs">{t('to')}</span>
              <div className="text-[#9A690A] bg-[#E9D30A1F] bg-opacity-[12] relative inline-flex rounded-full px-3 py-1 text-center text-xs font-medium">
                {format(new Date(), 'PPpp')}
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-3">
              <Button
                variant="outlined"
                color="inherit"
                className="text-xs py-2 px-3"
                onClick={onAssign}
              >
                {t('assign')}
              </Button>{' '}
              <Button
                variant="outlined"
                color="inherit"
                className="text-xs py-2 px-3"
                onClick={onRename}
              >
                {t('rename')}
              </Button>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

const Container = () => (
  <SurveyDataProvider>
    <SyncData />
  </SurveyDataProvider>
)

export default Container
