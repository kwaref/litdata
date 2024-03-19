'use client'

import {memo} from 'react'
import Button from '@/components/ui/ButtonCVA'
import {type FiltersPath, useReportFilters} from '@/components/utils/use-filters'
import {cn} from '@/components/utils/tailwindMerge'
import {useTranslations} from 'next-intl'
import {ArrowLeftIcon} from '@heroicons/react/20/solid'

interface ComponentProps {
  onBack?: () => void
  onCreate?: () => void
  routeBack: FiltersPath
}

function FiltersFooter({onBack, onCreate, routeBack}: ComponentProps) {
  const {path, setPath} = useReportFilters()
  const t = useTranslations('Report.Filters')

  const handleBack = () => {
    setPath(routeBack)
    onBack?.()
  }

  if (path === 'list') return null

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between border-t border-border bg-background py-4 max-md:absolute max-md:bottom-0 max-md:left-0 max-md:px-3 md:mt-8',
        {
          'justify-center': !path?.includes('create') && !path?.includes('edit'),
        },
      )}
    >
      {!path?.includes('edit') && (
        <Button
          className="px-0"
          variant={'link'}
          color="inherit"
          startIcon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={handleBack}
        >
          <span className="ml-2">{t('btn-back')}</span>
        </Button>
      )}
      {(path?.includes('create') || path?.includes('edit') || path?.includes('edit')) && (
        <Button onClick={onCreate} className="py-1">
          <span>{t('btn-apply')}</span>
        </Button>
      )}
    </div>
  )
}

export default FiltersFooter
