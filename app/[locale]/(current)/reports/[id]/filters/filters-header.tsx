'use client'

import {memo, useEffect} from 'react'
import Button from '@/components/ui/ButtonCVA'
import {type FiltersPath, useReportFilters} from '@/components/utils/use-filters'
import {cn} from '@/components/utils/tailwindMerge'
import {useTranslations} from 'next-intl'
import {ArrowLeftIcon} from '@heroicons/react/20/solid'
import {reportStore} from '@/components/utils/use-reports'

interface ComponentProps {
  onBack?: () => void
  onCreate?: () => void
  routeBack: FiltersPath
  header: string
  disabled?: boolean
  loading?: boolean
}

function FiltersHeader({
  onBack,
  onCreate,
  routeBack,
  header,
  disabled = false,
  loading = false,
}: ComponentProps) {
  const {path, setPath} = useReportFilters()
  const setIsDirty = reportStore(state => state.setIsDirty)
  const t = useTranslations('Report.Filters')

  const handleBack = () => {
    setPath(!path?.includes('edit') ? routeBack : 'list')
    onBack?.()
  }

  const handleCreate = (e: any) => {
    onCreate?.()
    setIsDirty(true)
  }

  if (!path?.includes('create') && !path?.includes('edit')) return null

  return (
    <div className="w-full bg-background sticky h-[80px] top-[-16px] [-webkit-backface-visibility:hidden] z-[1] before:[content:''] before:block before:sticky before:h-[16px] before:top-[48px] before:shadow-sm after:[content:''] after:sticky after:block after:h-[16px] after:top-0 after:[background:linear-gradient(white_10%,_rgba(255,255,255,0.8)_50%,_rgba(255,255,255,0.4)_70%,_transparent)] after:z-[2]">
      <div className="p-4 md:px-8 flex items-center justify-between w-full gap-3 text-primary-500 bg-background h-[64px] sticky top-0 mt-[-16px] z-[3]">
        <Button
          className="p-0"
          variant={'link'}
          color="inherit"
          startIcon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={handleBack}
          isIconOnly
        />
        <span className="truncate text-sm">{header}</span>
        <Button onClick={handleCreate} className="py-1" disabled={disabled} loading={loading}>
          <span>{t('btn-apply')}</span>
        </Button>
      </div>
    </div>
  )
}

export default FiltersHeader
