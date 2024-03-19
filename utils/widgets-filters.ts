import {format} from 'date-fns'

export const getAppliedFilters = (filters: any[], fixedFilters: any[], filterOptions: any[], dateFilter: any) => {
  const ffff = filters?.map((filter: { question_id: any; choice_ids: string | any[]; }) => {
    const fixedData = fixedFilters.find((el: { questionId: any; }) => el.questionId === filter.question_id)
    const questionData = filterOptions.find((el: { value: any; }) => (fixedData?.questionId || filter.question_id) === el.value,)
    return fixedData
      ? questionData?.choices?.filter((choice: any) => filter?.choice_ids?.includes(choice?.value))?.map((c: any) => c.label)?.join(', ')
      : questionData?.label
  })
  if ((dateFilter?.startDate || dateFilter?.endDate)) {
    const dateF = `${format(new Date(dateFilter.startDate), 'P')} - ${dateFilter.endDate ? format(new Date(dateFilter.endDate), 'P') : format(new Date(), 'P')}`
    ffff.push(dateF)
  }

  return ffff
}