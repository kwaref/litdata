'use client'

import AutocompleteInputField from '@/components/ui/Form/AutocompleteInputField'
import {useReportFilters} from '@/components/utils/use-filters'
import {useState, useEffect, useCallback} from 'react'
import CheckboxField from '@/components/ui/Form/CheckboxField'
import {useSurveyDataContext} from '../survey-data-context'
import {useTranslations} from 'next-intl'
import {fixedFilters} from '@/utils/fixed-filters'
import FiltersHeader from './filters-header'
import {type SubmitHandler, useFieldArray, useForm} from 'react-hook-form'
import z from 'zod'
import {FormFieldControl} from '@/components/ui/Form'
import {zodResolver} from '@hookform/resolvers/zod'

const QuestionsSchema = z.object({
  question: z.string().min(0, 'You must select a question'),
  answers: z.array(z.object({answer: z.string()})).min(0),
})

// interface QuestionsFilterProps {}

function QuestionsFilter({header}: {header: string}) {
  const {path, setPath, questionID, setHasUnsavedChanges} = useReportFilters()
  const [questionsList, setQuestionsList] = useState<any>([])
  const [choicesList, setChoicesList] = useState<any>([])
  const [selected, setSelected] = useState<string>()
  const t = useTranslations('Report.Filters')
  const commonT = useTranslations('Common')

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {isDirty, isSubmitting, isLoading, isValidating},
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // @ts-ignore
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      question: '',
      answers: [],
    },
  })

  const question: string = watch('question')
  const answers: any = watch('answers')

  const {filterOptions, handleFilters, filters} = useSurveyDataContext()

  useEffect(() => {
    setHasUnsavedChanges(isDirty)
  }, [isDirty])

  useEffect(() => {
    if (filterOptions?.length > 0) {
      const questions = filterOptions?.map(q => {
        const {choices, ...question} = q
        return question
      })
      const exceptions = fixedFilters.map((el: any) => el?.questionId)
      setQuestionsList(questions.filter(el => !exceptions.includes(el.value)))
    }
  }, [filterOptions])

  useEffect(() => {
    let initAnswers = []

    if (filters?.length && questionID && path?.split('/')?.[0] === 'edit') {
      initAnswers = filters?.filter(f => f.question_id === questionID)[0]?.choice_ids
    }

    reset({
      question: questionID ?? '',
      answers: initAnswers.map((item: string) => ({answer: item})),
    })
  }, [questionID, filters, path])

  useEffect(() => {
    if (question || questionID) {
      const choices = filterOptions.find(el => el.value === (question ?? questionID))?.choices
      setChoicesList(choices)
    }
  }, [question, filterOptions, questionID])

  const {append, remove} = useFieldArray({
    // @ts-ignore
    name: 'answers',
    control,
  })

  useEffect(() => {
    const id = answers.findIndex((item: any) => item.answer === selected)
    if (id > -1) {
      remove(id)
      setSelected('')
    }
  }, [selected, answers.length])

  const handleOnChange = (e: any, value: string) => {
    if (e.target.checked) {
      append({answer: value})
    } else {
      setSelected(value)
    }
  }

  const handleCreate: SubmitHandler<z.infer<typeof QuestionsSchema>> = data => {
    if (!data?.answers.length) return
    handleFilters({
      question_id: data?.question,
      choice_ids: data?.answers.map(item => item.answer),
    })
    setPath('list')
    setSelected('')
    setChoicesList([])
  }

  return (
    <>
      <FiltersHeader
        routeBack="add"
        onCreate={handleSubmit(handleCreate)}
        header={header}
        disabled={!isDirty || answers?.length === 0}
        loading={isSubmitting || isLoading || isValidating}
      />
      <form className="pt-3 px-4 md:px-8">
        <div className="flex flex-col gap-3">
          <FormFieldControl
            control={control}
            Component={AutocompleteInputField}
            name="question"
            items={questionsList}
            label={!path?.includes('edit') ? t(`label-select`) : ''}
            placeholder={commonT('search-select')}
            disabled={path?.includes('edit') || questionsList?.length === 0}
          />
          {choicesList?.map(({label, value}: {label: string; value: string}) => (
            <CheckboxField
              key={label}
              id={label}
              label={label}
              checked={answers?.some((item: any) => item.answer === value)}
              onChange={(e: any) => handleOnChange(e, value)}
            />
          ))}
        </div>
      </form>
    </>
  )
}

export default QuestionsFilter
