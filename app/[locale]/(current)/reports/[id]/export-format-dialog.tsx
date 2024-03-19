import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import usePrintPDF, {pdfStore} from '@/components/ui/PrintPDF'
import {cn} from '@/components/utils/tailwindMerge'
import {useDialog} from '@/components/utils/use-dialog'
import {memo, useEffect, useState} from 'react'
import ExportToExcelJs from './excel/export-to-excel-js'
import ExportToCsv from './csv/export-to-csv'
import {reportStore} from '@/components/utils/use-reports'
import {useTranslations} from 'next-intl'
import ExportCruceToCsv from './csv/export-cruce-to-csv'

// interface ExportFormatDialogProps {};

export const EXPORT_FORMAT_DIALOG = 'exoprt-format-dialog'

function ExportFormatDialog() {
  const {isOpen, closeDialog, payload} = useDialog(EXPORT_FORMAT_DIALOG)
  const {handlePrint, loading} = usePrintPDF({})
  const [exportType, setExportType] = useState<'pdf' | 'excel' | 'csv'>()
  const data = reportStore(state => state.exportData)
  const t = useTranslations('Report.Exports')

  useEffect(() => {
    setExportType(payload?.isFilter ? 'pdf' : 'csv')
  }, [payload?.isFilter])

  const onExport = () => {
    if (exportType === 'pdf') {
      handlePrint()
      closeDialog()
    }
  }

  const onChange = (e: any) => {
    setExportType(e.target.value)
  }

  return (
    <Dialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('title')}
      classNames={{panel: 'py-5 px-6', title: 'mb-5'}}
    >
      <form className="flex w-full flex-col gap-4 md:min-w-[300px] md:max-w-[300px]">
        <label
          className={cn(
            'border-primary-50 flex w-full items-center gap-1.5 rounded-md border p-2 cursor-pointer',
            {
              'bg-primary-50 border-primary-50': !payload?.isFilter,
              'border-primary-300': exportType === 'pdf',
            },
          )}
        >
          {/* <label htmlFor="pdf" /> */}
          <input
            id="pdf"
            value="pdf"
            type="radio"
            name="exportType"
            // style={{backgroundImage: 'none !important'}}
            className={cn(
              '!border-primary-500 checked:!bg-transparent focus:ring-secondary-600 checked:focus:border-secondary-600 checked:focus:bg-secondary-600 form-radio bg-transparent checked:[background-image:none] hover:cursor-pointer disabled:cursor-default',
              {
                '!border-[#B0B0C4] focus:ring-primary-50': !payload?.isFilter,
                'border-none checked:[background-image:url(/svg/radio-checked.svg)]':
                  exportType === 'pdf',
              },
            )}
            checked={exportType === 'pdf'}
            onChange={onChange}
            disabled={!payload?.isFilter}
          />
          <div className="ml-2 flex flex-col text-sm">
            <span className={cn('font-bold', {'text-[#B0B0C4]': !payload?.isFilter})}>
              {t('pdf')}
            </span>
            <span className={cn('text-primary-200', {'text-[#B0B0C4]': !payload?.isFilter})}>
              {t('graphs')}
            </span>
          </div>
        </label>

        <label
          className={cn(
            'border-primary-50 flex w-full items-center gap-1.5 rounded-md border p-2 cursor-pointer',
            {
              'bg-primary-50 border-primary-50 !text-[#B0B0C4]': !payload?.isFilter,
              'border-primary-300': exportType === 'excel',
            },
          )}
        >
          {/* <label htmlFor="excel" /> */}
          <input
            id="excel"
            value="excel"
            type="radio"
            name="exportType"
            // style={{backgroundImage: 'none !important'}}
            className={cn(
              '!border-primary-500 checked:!bg-transparent focus:ring-secondary-600 checked:focus:border-secondary-600 checked:focus:bg-secondary-600 form-radio bg-transparent checked:[background-image:none] hover:cursor-pointer disabled:cursor-default',
              {
                '!border-[#B0B0C4] focus:ring-primary-50': !payload?.isFilter,
                'border-none checked:[background-image:url(/svg/radio-checked.svg)]':
                  exportType === 'excel',
              },
            )}
            checked={exportType === 'excel'}
            onChange={onChange}
            disabled={!payload?.isFilter}
          />
          <div className="ml-2 flex flex-col text-sm">
            <span className={cn('font-bold', {'text-[#B0B0C4]': !payload?.isFilter})}>
              {t('excel')}
            </span>
            <span className={cn('text-primary-200', {'text-[#B0B0C4]': !payload?.isFilter})}>
              {t('not-graphs')}
            </span>
          </div>
        </label>
        <label
          className={cn(
            'border-primary-50 flex w-full items-center gap-1.5 rounded-md border p-2 mb-4 cursor-pointer',
            {
              'border-primary-500': exportType === 'csv',
            },
          )}
        >
          {/* <label htmlFor="csv" /> */}
          <input
            id="csv"
            value="csv"
            type="radio"
            name="exportType"
            // style={{backgroundImage: 'none !important'}}
            className={cn(
              '!border-primary-500 checked:!bg-transparent focus:ring-secondary-600 checked:focus:border-secondary-600 checked:focus:bg-secondary-600 form-radio bg-transparent checked:[background-image:none] hover:cursor-pointer disabled:cursor-default',
              {
                'border-none checked:[background-image:url(/svg/radio-checked.svg)]':
                  exportType === 'csv',
              },
            )}
            checked={exportType === 'csv'}
            onChange={onChange}
          />
          <div className="ml-2 flex flex-col text-sm">
            <span className="font-bold">{t('csv')}</span>
            <span className="text-primary-200">{t('not-graphs')}</span>
          </div>
        </label>
      </form>
      <div className="flex items-center justify-end gap-2.5 pt-4">
        <Button variant="outlined" color="inherit" className="bg-transparent" onClick={closeDialog}>
          {t('cancel')}
        </Button>
        {exportType === 'excel' ? (
          <ExportToExcelJs data={data ?? []}>
            {handleExport => (
              <Button
                loading={loading}
                onClick={() => {
                  handleExport()
                  closeDialog()
                }}
              >
                {t('exportar')}
              </Button>
            )}
          </ExportToExcelJs>
        ) : exportType === 'csv' ? (
          payload?.isFilter ? (
            <ExportToCsv data={data ?? []}>
              {handleExport => (
                <Button
                  loading={loading}
                  onClick={() => {
                    handleExport()
                    closeDialog()
                  }}
                >
                  {t('exportar')}
                </Button>
              )}
            </ExportToCsv>
          ) : (
            <ExportCruceToCsv>
              {handleExport => (
                <Button
                  loading={loading}
                  onClick={() => {
                    handleExport()
                    closeDialog()
                  }}
                >
                  {t('exportar')}
                </Button>
              )}
            </ExportCruceToCsv>
          )
        ) : (
          <Button onClick={onExport}>{t('exportar')}</Button>
        )}
      </div>
    </Dialog>
  )
}

export default ExportFormatDialog
