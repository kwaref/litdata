import {exportJson} from './exportJson'
export function filterSurveyAnswers(
  data: any[],
  filters: any[],
  startDate?: string,
  endDate?: string,
) {
  const newData = [...data]
  // Filtra los datos

  // @ts-ignore
  const filteredDataByDateRange = filtrarPorFecha(newData, startDate, endDate)

  if (filters.length === 0) return filteredDataByDateRange
  const datosFiltrados = filteredDataByDateRange.filter((answer: {pages: any[]}) => {
    return answer.pages.some((page: {questions: any[]}) => {
      return filters.every((filter: {question_id: any; choice_ids: any[]}) => {
        const question = page?.questions?.find((q: {id: any}) => q.id === filter.question_id)

        if (!question) {
          return false // No se encontró la pregunta
        }

        const answerIds = question?.answers?.map((answer: {choice_id: any}) => answer.choice_id)

        // Verifica si todos los choice_ids del filtro están presentes en las respuestas
        return filter?.choice_ids?.some((choiceId: any) => answerIds.includes(choiceId))
      })
    })
  })

  return datosFiltrados
}

export function updateFilteredData(currentData: any[], filteredAnswers: any[]) {
  const newSurvey = JSON.parse(JSON.stringify(currentData))

  const questionMap = new Map()
  // @ts-ignore
  if (newSurvey?.questions) {
    // @ts-ignore
    for (const pregunta of newSurvey?.questions) {
      for (const respuesta of pregunta?.answers?.choices) {
        respuesta.count = 0
      }
      pregunta.maxAnswers = filteredAnswers.length
      questionMap.set(pregunta.id, pregunta)
    }
  }

  for (const respuesta of filteredAnswers) {
    const questionsPerPage = respuesta?.pages?.map((el: any) => el.questions)
    const questions = [].concat(...questionsPerPage)

    for (const pregunta of questions) {
      // @ts-ignore
      for (const eleccion of pregunta?.answers) {
        // @ts-ignore
        const respuestaPregunta = questionMap.get(pregunta.id)
        if (respuestaPregunta) {
          const eleccionPregunta = respuestaPregunta?.answers?.choices.find(
            (a: {id: any}) => a.id === eleccion.choice_id,
          )
          if (eleccionPregunta) {
            eleccionPregunta.count++
          }
        }
      }
    }
  }

  // @ts-ignore
  return {answers: currentData.answers, questions: newSurvey?.questions}
}

export function filtrarPorFecha(answersList: [], fechaInicio: any, fechaFin: any) {
  const dateStart = new Date(fechaInicio)
  const dateEnd = new Date(fechaFin)

  const newAnswers = answersList.filter(answer => {
    // @ts-ignore
    const fechaObjeto = new Date(answer.date_created)
    if (fechaInicio && fechaFin) {
      return fechaObjeto >= dateStart && fechaObjeto <= dateEnd
    } else if (fechaInicio) {
      return fechaObjeto >= dateStart
    } else if (fechaFin) {
      return fechaObjeto <= dateEnd
    }
    return true // No se proporcionaron fechas de inicio ni fin, por lo que no se aplica ningún filtro.
  })
  return newAnswers
}

export function createBaseCrossTab(listaY: any[], listaX: any[]) {
  if (!listaY || !listaX || listaY.length === 0 || listaX.length === 0) return []

  return listaY.flatMap(objetoY =>
    objetoY.choices.map((eleccionY: {label: any; value: any}) => ({
      question: objetoY.label,
      choice: eleccionY.label,
      id: eleccionY.value,
      row: listaX.flatMap(objetoX =>
        objetoX.choices.map((eleccionX: {label: any; value: any}) => ({
          question: objetoX.label,
          choice: eleccionX.label,
          id: eleccionX.value,
          count: 0,
          rowPercent: 0,
          columnPercent: 0,
          rowColumnPercent: 0,
        })),
      ),
    })),
  )
}

export function fillCrossTabCounts(
  answers: [],
  baseCrossTab = [],
  questionY: string[],
  questionX: string[],
) {
  const newCrossTab = [...baseCrossTab]
  const relevantAnswers: any[] = []
  const questionSetY = new Set(questionY.flat())
  const questionSetX = new Set(questionX.flat())

  answers.forEach(answer => {
    relevantAnswers.push(
      // @ts-ignore
      answer.pages[0].questions.filter(
        (el: any) => questionSetY.has(el.id) || questionSetX.has(el.id),
      ),
    )
  })

  relevantAnswers
    .filter(el => el.length > 1)
    .forEach(answer => {
      const answerY = answer.filter((el: any) => questionSetY.has(el.id))
      const answerX = answer.filter((el: any) => questionSetX.has(el.id))
      if (answerY && answerX) {
        answerY.forEach((ansY: any) => {
          ansY.answers.forEach((ans: any) => {
            const col = newCrossTab.find((tab: any) => tab.id === ans.choice_id)
            // @ts-ignore
            if (col?.row && col.row.length > 0) {
              answerX.forEach((ansX: any) => {
                ansX.answers.forEach((ans: any) => {
                  // @ts-ignore
                  const row = col.row.find((el: any) => el.id === ans.choice_id)
                  if (row && row.count >= 0) {
                    row.count = row.count + 1
                  }
                })
              })
            }
          })
        })
      }
    })

  return calcularPorcentajes(newCrossTab)
}

function calcularPorcentajes(datos: any[]) {
  // Calcular el total global
  const totalGlobal = datos.reduce(
    (sum: any, dato: {row: any[]}) =>
      sum + dato.row.reduce((sum: any, row: {count: any}) => sum + row.count, 0),
    0,
  )

  datos.forEach((dato: {row: any[]}) => {
    // Calcular el total para cada pregunta
    const totalPregunta = dato.row.reduce((sum: any, row: {count: any}) => sum + row.count, 0)

    dato.row.forEach(
      (row: {
        id: any
        rowPercent: number
        count: number
        columnPercent: number
        rowColumnPercent: number
      }) => {
        // Calcular el total para cada opción de respuesta
        const totalOpcion = datos.reduce(
          (sum: any, d: {row: any[]}) => sum + d.row.find((r: {id: any}) => r.id === row.id).count,
          0,
        )

        // Calcular los porcentajes
        row.rowPercent = (row.count / totalPregunta) * 100
        row.columnPercent = (row.count / totalOpcion) * 100
        row.rowColumnPercent = (row.count / totalGlobal) * 100
      },
    )
  })

  return datos
}
