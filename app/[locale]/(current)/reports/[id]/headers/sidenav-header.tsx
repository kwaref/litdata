'use client'

import Button from '@/components/ui/ButtonCVA'
import {cn} from '@/components/utils/tailwindMerge'
import {useReportFilters} from '@/components/utils/use-filters'
import {useTranslations} from 'next-intl'
import {ArrowLeftIcon, PlusIcon} from '@heroicons/react/20/solid'
import {useSurveyDataContext} from '../survey-data-context'
import {useEffect} from 'react'

interface SideNavHeaderProps {
  params: any
  reportData: any
  userDetails: any
}

function SideNavHeader({params, reportData, userDetails}: SideNavHeaderProps) {
  const {path, setPath} = useReportFilters()
  const t = useTranslations('Report.Headers.Sidenav')
  const {editMode, crosses} = useSurveyDataContext()

  return path === 'list' ? (
    <div className={cn('w-full p-4 md:px-8')}>
      {(params?.id === 'filter' || (editMode?.isEdit && editMode?.mode === 'filter')) && (
        <div className="flex items-center justify-between gap-2">
          <span>{t('span-filters')}</span>
          {(params?.id === 'filter' ||
            (editMode?.isEdit &&
              editMode?.mode === 'filter' &&
              reportData?.user_id === userDetails?.id)) && (
            <Button
              startIcon={<PlusIcon className="h-5 w-5" />}
              className={cn('px-2 py-1', {})}
              onClick={() => setPath('add')}
            >
              <span className="ml-1">{t('span-newFilter')}</span>
            </Button>
          )}
        </div>
      )}
      {(params?.id === 'crosstab' || (editMode?.isEdit && editMode?.mode === 'crosstab')) && (
        <div className="flex items-center justify-between gap-2">
          <span>{t('span-listCrosstab')}</span>
          {(params?.id === 'crosstab' ||
            (editMode?.isEdit &&
              editMode?.mode === 'crosstab' &&
              reportData?.user_id === userDetails?.id)) && (
            <Button
              startIcon={crosses?.length === 0 && <PlusIcon className="h-5 w-5" />}
              className={cn('px-2 py-1', {})}
              onClick={() => setPath(crosses?.length > 0 ? 'edit' : 'create')}
            >
              <span className="ml-1">
                {crosses?.length > 0 ? t('span-editCrossTab') : t('span-newCrosstab')}
              </span>
            </Button>
          )}
        </div>
      )}
    </div>
  ) : path?.includes('add') ? (
    <div className="p-4 md:px-8 flex items-center md:gap-12 text-primary-500">
      <Button
        className="p-0"
        variant={'link'}
        color="inherit"
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => setPath('list')}
        isIconOnly
      />
      <span className="text-sm max-md:w-full max-md:text-center">{t('span-selectFilter')}</span>
    </div>
  ) : null
}

export default SideNavHeader
