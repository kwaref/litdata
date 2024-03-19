import {useSupabase} from '@/app/supabase-provider'
import Button from '@/components/ui/ButtonCVA'
import Drawer from '@/components/ui/Drawer'
import {CheckboxField} from '@/components/ui/Form'
import {useDrawer} from '@/components/utils/use-drawer'
import {type Question} from '@/types_db'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslations} from 'next-intl'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {type SubmitHandler, useFieldArray, useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import z from 'zod'

// interface QuestionsDrawerProps {}

export const QUESTIONS_DRAWER = 'questions-drawer'

const QuestionsSchema = z.object({
  questions: z.array(
    z.object({
      questionId: z.string(),
    }),
  ),
})

function QuestionsDrawer() {
  const {isOpen, payload, closeDrawer} = useDrawer(QUESTIONS_DRAWER)
  const [selectedAll, setSelectedAll] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>()
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([])
  const {supabase} = useSupabase()
  const commonT = useTranslations('Common')
  const t = useTranslations('Companies')
  const router = useRouter()
  const snapTable = process.env.NEXT_PUBLIC_SNAP_TABLE

  const {control, handleSubmit, watch, setValue} = useForm<z.infer<typeof QuestionsSchema>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      questions: [],
    },
  })

  useEffect(() => {
    // @ts-ignore
    const newPermissions = payload?.allowed_questions.map(el => ({
      questionId: el,
    }))
    if (payload?.allowed_questions) {
      setValue('questions', [...newPermissions])
    }
  }, [payload?.allowed_questions])

  const questions: any[] = watch('questions')

  useEffect(() => {
    if (!selectedAll && questions.length === surveyQuestions.length && surveyQuestions.length > 0) {
      setSelectedAll(true)
    }
  }, [questions, selectedAll, surveyQuestions])

  useEffect(() => {
    async function fetchSurveyData() {
      try {
        const {data, error} = await supabase
          .from(snapTable || 'survey_data_snap')
          .select('data')
          .single()

        const activeSurvey = data?.data?.surveys.filter(
          (el: any) => el.id === data?.data?.active_survey_id,
        )[0]

        if (error) {
          console.error('Error fetching survey data:', error.message)
        } else {
          setSurveyQuestions(
            activeSurvey?.questions.map((q: Question) => {
              if (q.description.includes('<strong>')) {
                return {
                  ...q,
                  description: q.description.split('<strong>')[0].trim(),
                }
              }
              return q
            }),
          )
        }
      } catch (error) {
        console.error('Error in the request:', error)
      }
    }

    fetchSurveyData()
  }, [supabase])

  const {append, remove, replace} = useFieldArray({
    name: 'questions',
    control,
  })

  useEffect(() => {
    if (selectedAll) {
      setValue(
        'questions',
        surveyQuestions.map(q => ({questionId: q.id})),
      )
    } else {
      setValue('questions', [])
    }
  }, [selectedAll])

  useEffect(() => {
    if (selected) {
      const id = questions.findIndex((item: any) => item.questionId === selected)
      if (id > -1) {
        remove(id)
      }
      setSelected('')
    }
  }, [selected, questions.length])

  const handleSelectAll = (e: any) => {
    if (!e.target.checked || (questions.length < surveyQuestions.length && questions.length > 0)) {
      replace([])
    } else {
      replace(surveyQuestions.map(({id}) => ({questionId: id})))
    }
    setSelectedAll(e.target.checked)
  }

  const handleOnChangeQuestion = (e: any, value: string) => {
    if (e.target.checked) {
      append({questionId: value})
    } else {
      setSelected(value)
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof QuestionsSchema>> = async data => {
    const newQuestions = data.questions.map(el => el.questionId)
    const {error} = await supabase
      .from('users')
      // @ts-ignore
      .update({allowed_questions: newQuestions})
      .eq('id', payload.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Permissions updated!')
      setSelectedAll(false)
      setSelected('')
      closeDrawer()
      router.refresh()
    }
  }

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      onBackdropClose={closeDrawer}
      header={payload?.header}
      classNames={{container: 'px-0', header: 'px-5'}}
    >
      <form>
        <div className="pb-5 mb-5 border-b border-border px-5">
          <CheckboxField
            id={'all'}
            label={t('select-all')}
            onChange={handleSelectAll}
            checked={selectedAll}
            indeterminate={
              // @ts-ignore
              questions.length < surveyQuestions.length && questions.length > 0
            }
          />
        </div>
        <article className="flex flex-col gap-5 overflow-hidden overflow-y-auto min-h-[calc(100dvh-16.5rem)] max-h-[calc(100dvh-16.5rem)] px-5">
          {surveyQuestions?.map((q, idx) => (
            <div key={q.id} className="flex items-center gap-2">
              <CheckboxField
                id={q.description}
                label={`Q${idx + 1}`}
                labelClass="rounded-full py-1 px-2 bg-primary-25 text-primary-400"
                checked={questions?.some((item: any) => item.questionId === q.id)}
                onChange={e => handleOnChangeQuestion(e, q.id)}
              />
              <div className="w-full p-2 border border-primary-200 rounded max-h-[66px] overflow-hidden overflow-y-auto">
                <span className="text-sm">{q.description}</span>
              </div>
            </div>
          ))}
        </article>
        <footer className="h-28 flex flex-col justify-end px-5">
          <div className="flex justify-start items-center gap-4">
            <Button onClick={handleSubmit(onSubmit)}>
              <span>{commonT('saveChanges')}</span>
            </Button>
            <Button variant="outlined" color="inherit" onClick={closeDrawer}>
              <span>{commonT('cancel')}</span>
            </Button>
          </div>
        </footer>
      </form>
    </Drawer>
  )
}

export default QuestionsDrawer
