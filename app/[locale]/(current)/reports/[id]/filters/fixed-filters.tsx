'use client'

import {useReportFilters} from '@/components/utils/use-filters'
import {useState, useEffect} from 'react'
import CheckboxField from '@/components/ui/Form/CheckboxField'
import {useTranslations} from 'next-intl'
import {fixedFilters} from '@/utils/fixed-filters'
import {useSurveyDataContext} from '../survey-data-context'
import FiltersHeader from './filters-header'
import {zodResolver} from '@hookform/resolvers/zod'
import {type SubmitHandler, useFieldArray, useForm} from 'react-hook-form'
import z from 'zod'

const FixedSchema = z.object({
  question: z.string(),
  filters: z.array(z.object({filter: z.string()})).min(0),
})

// interface AgesFilterProps {}

function FixedFilters({header, type}: {header: string; type: string}) {
  const {path, setPath} = useReportFilters()
  const t = useTranslations('Common')
  const [choices, setChoices] = useState<Array<{label: string; value: string}>>([])
  const {filterOptions, handleFilters, filters: filtersCtx} = useSurveyDataContext()
  const [selected, setSelected] = useState<string>()

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
    resolver: zodResolver(FixedSchema),
    defaultValues: {
      question: '',
      filters: [],
    },
  })

  const filters: any = watch('filters')

  useEffect(() => {
    let initChoices: any[] = []
    // @ts-ignore
    const {questionId} = fixedFilters.find(el => el.by === type) || ''

    if (filtersCtx?.length && questionId && path?.split('/')?.[0] === 'edit') {
      initChoices = filtersCtx?.find(f => f.question_id === questionId)?.choice_ids
    }

    if (questionId) {
      const opts = filterOptions.find(el => el.value === questionId)?.choices || []
      setChoices(opts)
    }

    reset({
      question: questionId || '',
      // @ts-ignore
      filters: initChoices?.map((item: string) => ({filter: item})) || [],
    })
  }, [filtersCtx, filterOptions, type, path])

  const {append, remove} = useFieldArray({
    // @ts-ignore
    name: 'filters',
    control,
  })

  useEffect(() => {
    const id = filters.findIndex((item: any) => item.filter === selected)
    if (id > -1) {
      remove(id)
      setSelected('')
    }
  }, [selected, filters.length])

  const handleOnChange = (e: any, value: string) => {
    if (e.target.checked) {
      append({filter: value})
    } else {
      setSelected(value)
    }
  }

  const handleCreate: SubmitHandler<z.infer<typeof FixedSchema>> = data => {
    if (!data?.filters.length) return
    handleFilters({question_id: data?.question, choice_ids: data?.filters.map(item => item.filter)})
    setPath('list')
    setSelected('')
    setChoices([])
  }

  return (
    <>
      <FiltersHeader
        routeBack="add"
        onCreate={handleSubmit(handleCreate)}
        header={header}
        disabled={!isDirty || filters?.length === 0}
        loading={isSubmitting || isLoading || isValidating}
      />
      <form className="flex flex-col gap-3 pt-3 px-4 md:px-8">
        {choices?.map(({label, value}: {label: string; value: string}) => (
          <CheckboxField
            key={label}
            id={label}
            label={label}
            checked={filters?.some((item: any) => item.filter === value)}
            onChange={e => handleOnChange(e, value)}
          />
        ))}
      </form>
    </>
  )
}

export default FixedFilters
