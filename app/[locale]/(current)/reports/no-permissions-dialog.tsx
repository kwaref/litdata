'use client'

import {useSupabase} from '@/app/supabase-provider'
// interface ConfirmDeleteDialog {}

import Button, {buttonVariants} from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {ChartBarSquareIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'

export const NO_PERMISSIONS_DIALOG = 'no-permissions-dialog'

function NoPermissionsDialog() {
  const {isOpen, closeDialog, payload} = useDialog(NO_PERMISSIONS_DIALOG)
  const t = useTranslations('Report.CreateReportDialog')

  return (
    <Dialog isOpen={isOpen} closeDialog={closeDialog} classNames={{panel: 'rounded-md'}}>
      <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-4 py-6 px-8 text-center m-auto">
        <XMarkIcon
          onClick={closeDialog}
          className="absolute top-6 right-8 w-6 h-6 text-primary-300 cursor-pointer"
        />
        <div className="bg-primary-25 rounded-full p-4">
          <ChartBarSquareIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="mb-3 text-xl font-semibold">{t('header')}</h1>
          <p>{t('subheader')}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outlined" color="inherit" onClick={closeDialog}>
            <span>{t('no')}</span>
          </Button>
          <a
            className={buttonVariants()}
            onClick={closeDialog}
            href={'mailto:support@litdata.org'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t('yes')}</span>
          </a>
        </div>
      </div>
    </Dialog>
  )
}

export default NoPermissionsDialog
