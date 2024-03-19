import {useSupabase} from '@/app/supabase-provider'
import Button from '@/components/ui/ButtonCVA'
import Drawer from '@/components/ui/Drawer'
import {CheckboxField} from '@/components/ui/Form'
import {cn} from '@/components/utils/tailwindMerge'
import {useDrawer} from '@/components/utils/use-drawer'
import {type Question} from '@/types_db'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslations} from 'next-intl'
import {useEffect, useState} from 'react'
import {type SubmitHandler, useFieldArray, useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import z from 'zod'

// interface ImportSurveyDrawerProps {}
const surveys = [
  {name: 'Survey 1', id: 1},
  {name: 'Survey 2', id: 2},
]
export const IMPORT_SURVEY_DRAWER = 'import-survey-drawer'

function ImportSurveyDrawer() {
  const {isOpen, payload, closeDrawer} = useDrawer(IMPORT_SURVEY_DRAWER)
  const [survey, setSurvey] = useState('')
  const commonT = useTranslations('Common')
  const t = useTranslations('syncData')

  const onChange = (e: any) => {
    setSurvey(e.target.value.toString())
  }

  const onSubmit = () => {}

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      onBackdropClose={closeDrawer}
      header={t('select-survey')}
    >
      <form>
        <article className="flex flex-col gap-5 overflow-hidden overflow-y-auto min-h-[calc(100dvh-11.5rem)] max-h-[calc(100dvh-11.5rem)]">
          {surveys?.map(({name, id}) => (
            <label
              key={id}
              className={cn(
                'flex w-full items-center gap-1.5 rounded border border-border px-2.5 py-4 cursor-pointer',
                {
                  'border-primary-500': id.toString() === survey,
                },
              )}
            >
              {/* <label htmlFor="pdf" /> */}
              <input
                id={id.toString()}
                value={id.toString()}
                type="radio"
                name="survey"
                style={{backgroundImage: 'none !important'}}
                className={cn(
                  '!border-secondary-600 checked:!bg-secondary-600 focus:ring-secondary-600 checked:focus:border-secondary-600 checked:focus:bg-secondary-600 form-radio border-4 bg-transparent checked:[background-image:none] cursor-pointer disabled:cursor-default',
                )}
                checked={id.toString() === survey}
                onChange={onChange}
              />
              <div className="ml-2 flex flex-col text-sm">
                <span className="font-semibold">{name}</span>
              </div>
            </label>
          ))}
        </article>
        <footer className="h-24 flex flex-col justify-end border-t border-border">
          <div className="flex justify-end items-center gap-4">
            <Button variant="outlined" color="inherit" onClick={closeDrawer}>
              <span>{commonT('cancel')}</span>
            </Button>
            <Button onClick={onSubmit}>
              <span>{commonT('saveChanges')}</span>
            </Button>
          </div>
        </footer>
      </form>
    </Drawer>
  )
}

export default ImportSurveyDrawer
