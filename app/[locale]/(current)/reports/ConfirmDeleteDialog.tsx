'use client'

import {useSupabase} from '@/app/supabase-provider'
// interface ConfirmDeleteDialog {}

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {TrashIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'
import {useState} from 'react'
import {toast} from 'react-toastify'

export const CONFIRM_DELETE_DIALOG = 'confirm-delete-dialog'

function ConfirmDeleteDialog() {
  const {isOpen, closeDialog, payload} = useDialog(CONFIRM_DELETE_DIALOG)
  const t = useTranslations('Report')
  const [isDeleting, setIsDeleting] = useState(false)
  const {supabase} = useSupabase()

  const handleOnDelete = async () => {
    setIsDeleting(true)
    // eliminar un reporte
    const {error} = await supabase
      .from('reports')
      .delete()
      .eq('id', payload?.id)
    if (error) {
      setIsDeleting(false)
      toast.error(error.message)
    } else {
      closeDialog()
      setIsDeleting(false)
      toast.success(t(`toast-delete`))
      payload?.fetchReports()
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
          <TrashIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="mb-3 text-xl font-semibold">{t('DeleteDialog.header')}</h1>
          <p>{t('DeleteDialog.subheader')}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outlined" color="inherit" onClick={closeDialog}>
            <span>{t('DeleteDialog.no')}</span>
          </Button>
          <Button onClick={handleOnDelete} loading={isDeleting} disabled={isDeleting}>
            <span>{t('DeleteDialog.yes')}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
