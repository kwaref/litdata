'use client'

import {useSupabase} from '@/app/supabase-provider'
// interface ConfirmDeleteDialog {}

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {XMarkIcon, PresentationChartBarIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'
import {useState} from 'react'
import {toast} from 'react-toastify'

export const CONFIRM_REMOVE_DIALOG = 'confirm-remove-dialog'

function ConfirmRemoveDialog() {
  const {isOpen, closeDialog, payload} = useDialog(CONFIRM_REMOVE_DIALOG)
  const t = useTranslations('Dashboard.widgets.dialog')
  const [isDeleting, setIsDeleting] = useState(false)
  const {supabase} = useSupabase()

  const handleOnDelete = async () => {
    setIsDeleting(true)
    // eliminar un widget
    const {error} = await supabase
      .from('widgets')
      .delete()
      .eq('id', payload?.id)
    if (error) {
      setIsDeleting(false)
      toast.error(error.message)
    } else {
      closeDialog()
      setIsDeleting(false)
      toast.success(t('success-message'))
      payload?.remove(payload.id)
    }
  }

  return (
    <Dialog isOpen={isOpen} closeDialog={closeDialog} classNames={{panel: 'rounded-md'}}>
      <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-4 py-6 px-8 text-center m-auto">
        <XMarkIcon
          onClick={closeDialog}
          className="absolute top-6 right-8 w-6 h-6 text-primary-300 cursor-pointer"
        />
        <div className="bg-primary-25 rounded-full p-4">
          <PresentationChartBarIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="mb-3 text-xl font-semibold">{t('title')}</h1>
          <p>{t('text')}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outlined" color="inherit" onClick={closeDialog}>
            <span>{t('cancel')}</span>
          </Button>
          <Button onClick={handleOnDelete} loading={isDeleting} disabled={isDeleting}>
            <span>{t('delete')}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmRemoveDialog
