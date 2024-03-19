'use client'

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {TrashIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'
import {useState} from 'react'
import toastAlert from '@/utils/toastAlert'
import {useRouter} from 'next/navigation'
import {useSupabase} from '@/app/supabase-provider'
import axios from 'axios'
import {toast} from 'react-toastify'

// interface ConfirmDeleteCompanyDialog {}

export const COMPANIES_DELETE_CONFIRM = 'companies-delete-confir-dialog'

function CompaniesDeleteConfirm() {
  const {isOpen, closeDialog, payload} = useDialog(COMPANIES_DELETE_CONFIRM)
  const t = useTranslations('Companies.dialog-delete')
  const [isDeleting, setIsDeleting] = useState(false)
  const {supabase} = useSupabase()
  const router = useRouter()

  const handleOnDelete = async () => {
    setIsDeleting(true)
    try {
      const {error} = await supabase
        .from('users')
        .delete()
        .eq('id', payload?.company?.id)

      if (error) {
        toastAlert({message: error.message, type: 'error'})
        closeDialog()
        setIsDeleting(false)
        return
      }
      await axios.post('/api/user-delete', {
        params: {
          user_id: payload?.company?.id,
        },
      })
      toast.success('Company deleted')
      closeDialog()
      setIsDeleting(false)
      router.refresh()
    } catch (error) {
      console.log(error)
      setIsDeleting(false)
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
          <h1 className="mb-3 text-xl font-semibold">{t('title')}</h1>
          <p>{t('description')}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outlined" color="inherit" onClick={closeDialog}>
            <span>{t('btn-cancel')}</span>
          </Button>
          <Button onClick={handleOnDelete} loading={isDeleting} disabled={isDeleting}>
            <span>{t('btn-yes')}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default CompaniesDeleteConfirm
