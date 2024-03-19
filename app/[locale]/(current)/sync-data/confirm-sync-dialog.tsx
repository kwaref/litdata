'use client'

import {useSupabase} from '@/app/supabase-provider'
// interface ConfirmSyncDialog {}

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {HandRaisedIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {toast} from 'react-toastify'

export const CONFIRM_SYNC_DIALOG = 'confirm-sync-dialog'

function ConfirmSyncDialog() {
  const {isOpen, closeDialog, payload} = useDialog(CONFIRM_SYNC_DIALOG)
  const t = useTranslations('syncData.ConfirmDialog')
  const commonT = useTranslations('Common')
  const [isSyncing, setIsSyncing] = useState(false)
  const {supabase} = useSupabase()
  const router = useRouter()
  const snapTable = process.env.NEXT_PUBLIC_SNAP_TABLE

  const handleOnSync = async () => {
    setIsSyncing(true)
    const {error} = await supabase
      .from(snapTable || 'survey_data_snap')
      .update({
        data: {
          ...payload?.snapsData,
          active_survey_id: payload?.surveyId,
        },
      })
      .match({id: 1})

    if (error) {
      setIsSyncing(false)
      toast.error(error.message)
    } else {
      setIsSyncing(false)
      closeDialog()
      toast.success(t(`toast-sync`))
      router.refresh()
    }
  }

  return (
    <Dialog isOpen={isOpen} closeDialog={closeDialog} classNames={{panel: 'rounded-md'}}>
      <div className="relative flex w-full max-w-[425px] flex-col items-center justify-center gap-4 py-5 px-6 text-center m-auto">
        <XMarkIcon
          onClick={closeDialog}
          className="absolute top-6 right-8 w-6 h-6 text-primary-300 cursor-pointer"
        />
        <div className="bg-primary-25 rounded-full p-4">
          <HandRaisedIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="mb-3 text-xl font-semibold">{t('alert')}</h1>
          <p>{t('alert-desc')}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outlined" color="inherit" onClick={closeDialog}>
            <span>{commonT('cancel')}</span>
          </Button>
          <Button onClick={handleOnSync} loading={isSyncing} disabled={isSyncing}>
            <span>{commonT('proceed')}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmSyncDialog
