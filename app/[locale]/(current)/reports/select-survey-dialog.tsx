import Button from '@/components/ui/ButtonCVA'
import Dialog from '@/components/ui/Dialog'
import {useDialog} from '@/components/utils/use-dialog'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import zod from 'zod'
import {useSupabase} from '@/app/supabase-provider'
import {toast} from 'react-toastify'
import {useTranslations} from 'next-intl'
import {InputField} from '@/components/ui/Form'
import {cn} from '@/components/utils/tailwindMerge'
import {useUser} from '@/components/utils/use-user'

const surveys = ['Survey 1', 'Survey 2']

export const SELECT_SURVEY_DIALOG = 'select-survey-dialog'

function SelectSurveyDialog() {
  const {isOpen, closeDialog, payload} = useDialog(SELECT_SURVEY_DIALOG)
  const {supabase} = useSupabase()
  const commonT = useTranslations('Common')
  const t = useTranslations('Report.SelectSurvey')
  const {push} = useRouter()
  const [survey, setSurvey] = useState('')
  const {userDetails} = useUser()

  const onContinue = async (e: any) => {
    e.preventDefault()
    push(payload?.href)
    closeDialog()
  }

  const onChange = (e: any) => {
    setSurvey(e.target.value)
  }

  return (
    <Dialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={
        userDetails?.role === 'admin' || userDetails?.permissions?.length > 0
          ? t('header')
          : t('forbiden-header')
      }
      classNames={{panel: 'py-6 px-8', title: 'mb-6'}}
    >
      {userDetails?.role === 'admin' || userDetails?.permissions?.length > 0 ? (
        <form
          className="flex w-full flex-col gap-4 md:min-w-[400px] md:max-w-[400px]"
          onSubmit={onContinue}
        >
          {surveys?.map((item, id) => (
            <label
              key={id}
              className={cn(
                'flex w-full items-center gap-1.5 rounded border border-border px-2.5 py-4 cursor-pointer',
                {
                  'border-primary-500': item === survey,
                },
              )}
            >
              {/* <label htmlFor="pdf" /> */}
              <input
                id={item}
                value={item}
                type="radio"
                name="survey"
                // style={{backgroundImage: 'none !important'}}
                className={cn(
                  '!border-primary-500 checked:!bg-transparent focus:ring-secondary-600 checked:focus:border-secondary-600 checked:focus:bg-secondary-600 form-radio bg-transparent checked:[background-image:none] cursor-pointer disabled:cursor-default',
                  {
                    'border-none checked:[background-image:url(/svg/radio-checked.svg)]':
                      item === survey,
                  },
                )}
                checked={item === survey}
                onChange={onChange}
              />
              <div className="ml-2 flex flex-col text-sm">
                <span className="font-semibold">Survay name</span>
              </div>
            </label>
          ))}

          <div className="w-full flex items-center justify-between gap-2.5 pt-4">
            <Button variant="outlined" color="inherit" onClick={closeDialog}>
              {commonT('cancel')}
            </Button>
            <Button onClick={onContinue}>{commonT('continue')}</Button>
          </div>
        </form>
      ) : (
        <div className="min-h-[100px] flex items-center justify-center">
          <span className="max-w-[500px]">{t('missing-permissions')}</span>
        </div>
      )}
    </Dialog>
  )
}

export default SelectSurveyDialog
