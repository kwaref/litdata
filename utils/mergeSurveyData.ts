export default function mergeSurveyData(surveyDetails: {pages: any}, surveyRollUps: {data: any[]}) {
  const surveyData = {
    questions: [],
  }

  // Crear un mapa de resumen de opciones para facilitar la búsqueda
  const summaryMap = {}
  surveyRollUps.data.forEach(question => {
    // @ts-ignore
    summaryMap[question.id] = question.summary[0]
  })

  // Obtener las páginas de la encuesta
  const pages = surveyDetails.pages

  // Iterar a través de las páginas
  // @ts-ignore
  pages?.forEach(page => {
    // Obtener las preguntas de la página
    const questions = page.questions

    // Iterar a través de las preguntas
    // @ts-ignore
    questions.forEach(question => {
      // Crear un objeto para la pregunta
      const questionObject = {
        id: question.id,
        description: question.headings[0].heading,
        type: question.family,
        subtype: question.subtype,
        answers: {
          choices: [],
          rows: [],
        },
      }

      // Obtener las opciones de respuesta de la pregunta
      const options = question.answers?.choices

      // Obtener el resumen de esta pregunta
      // @ts-ignore
      const summary = summaryMap[question.id]

      // @ts-ignore
      // Iterar a través de las opciones de respuesta
      options?.forEach(option => {
        // Crear un objeto para la opción de respuesta
        const choiceObject = {
          id: option.id,
          description: option.text,
          count: 0, // Inicialmente, el recuento es 0
        }

        // Si el resumen contiene estadísticas y recuento para esta opción
        if (summary?.choices) {
          // @ts-ignore
          const choiceSummary = summary.choices.find(choice => choice.id === option.id)
          if (choiceSummary) {
            choiceObject.count = choiceSummary.count
          }
        }

        if (questionObject.type === 'matrix') {
          questionObject.answers.rows = question.answers.rows.map((row: any) => ({
            id: row.id,
            description: row.text,
          }))
        }

        // Agregar la opción de respuesta al objeto de la pregunta
        // @ts-ignore
        questionObject.answers.choices.push(choiceObject)
      })

      // Agregar las estadísticas del resumen a la pregunta
      // @ts-ignore
      questionObject.stats = summary ? summary.stats : null

      // Agregar la pregunta al objeto principal
      // @ts-ignore
      surveyData.questions.push(questionObject)
    })
  })

  return surveyData
}
