'use client'

import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {InformationCircleIcon} from '@heroicons/react/24/solid'
import {useTranslations} from 'next-intl'

export const WIDGET_LIMIT_DIALOG = 'widget-limit-dialog'

function WidgetLimitDialog() {
  const {isOpen, closeDialog} = useDialog(WIDGET_LIMIT_DIALOG)
  const t = useTranslations('Dashboard.widgets.dialog')

  return (
    <Dialog isOpen={isOpen} closeDialog={closeDialog} classNames={{panel: 'rounded-md'}}>
      <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-4 py-6 px-8 text-center m-auto">
        <div className="bg-primary-25 rounded-full p-4">
          <InformationCircleIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="mb-3 text-xl font-semibold">{t('limit-header')}</h1>
          <p>{t('limit-message')}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button color="secondary" onClick={closeDialog}>
            <span>{t('ok')}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default WidgetLimitDialog
