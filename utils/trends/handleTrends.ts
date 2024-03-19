import {colors} from '@/app/[locale]/(current)/reports/[id]/component-to-show'
import {updateFilteredData} from '../filterSurveyAnswers'
import {agruparPorDosSemanas} from './bi-weekly'
import {agruparPorDia} from './daily'
import {agruparPorMes} from './monthly'
import {agruparPorTrimestre} from './quarterly'
import {agruparPorSemanas} from './weekly'
import {agruparPorAño} from './yearly'
import {faker} from '@faker-js/faker'
import {getTotal} from '@/components/utils/use-reports'

export function handleTrend(trend: number, data: any[], originalData: any, questioId?: string) {
  // si es necesario modificar la data para que sea acorde a lo que vamos a procesar
  const newData = JSON.parse(JSON.stringify(data))

  if (trend === 2) return calculateCounts(agruparPorDia(newData), originalData, questioId)
  else if (trend === 3) return calculateCounts(agruparPorSemanas(newData), originalData, questioId)
  else if (trend === 4)
    return calculateCounts(agruparPorDosSemanas(newData), originalData, questioId)
  else if (trend === 5) return calculateCounts(agruparPorMes(newData), originalData, questioId)
  else if (trend === 6)
    return calculateCounts(agruparPorTrimestre(newData), originalData, questioId)
  else if (trend === 7) return calculateCounts(agruparPorAño(newData), originalData, questioId)
}

function calculateCounts(answers: any[], originalData: any, questioId?: string) {
  return answers.map((el: any) => {
    const filteredData = updateFilteredData(originalData, el.entries)

    return {...el, questions: filteredData?.questions}
  })
}
