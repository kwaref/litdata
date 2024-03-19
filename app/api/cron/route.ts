import {NextResponse} from 'next/server'
import axios from 'axios'
import mergeSurveyData from '../../../utils/mergeSurveyData'
import {createServerSupabaseClient} from '@/app/supabase-server'
import {randomUUID} from 'crypto'
import {format} from 'date-fns'

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_SM_SECRET
  const supabase = createServerSupabaseClient()
  const surveyId = '411909544' // Reemplaza esto con el ID de tu encuesta

  let page = 1
  const per_page = 50
  let allAnswers: any[] = []

  const getAnswers = async () => {
    const url = `https://api.surveymonkey.com/v3/surveys/${surveyId}/responses/bulk?page=${page}&per_page=${per_page}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      allAnswers = allAnswers.concat(
        response.data.data.filter((el: any) => el.response_status === 'completed'),
      )

      if (response.data.page * response.data.per_page < response.data.total) {
        page++
        await getAnswers()
      }
    } catch (error) {
      console.error('Error al traer las respuestas')
    }
  }

  await getAnswers()
  const parsedAnswers = allAnswers.map(el => ({answer_id: el.id, data: el}))
  console.log(parsedAnswers)

  // Definir las URL de las API de SurveyMonkey
  const rollupsUrl = 'https://api.surveymonkey.com/v3/surveys/411909544/rollups'
  const detailsUrl = 'https://api.surveymonkey.com/v3/surveys/411909544/details'

  try {
    // Realizar las solicitudes a las API de SurveyMonkey
    const [rollupsResponse, detailsResponse] = await Promise.all([
      axios.get(rollupsUrl, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }),
      axios.get(detailsUrl, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }),
    ])

    if (rollupsResponse.status === 200 && detailsResponse.status === 200) {
      // Obtener los datos de las respuestas
      const surveyRollUps = rollupsResponse.data
      const surveyDetails = detailsResponse.data

      // Llamar a la función mergeSurveyData para combinar los datos
      const updatedSurveyData = mergeSurveyData(surveyDetails, surveyRollUps)

      const uuid = randomUUID()

      // upload survey to supabase
      const {error} = await supabase
        .from('survey_data_snap')
        .update({
          data: {
            active_survey_id: uuid,
            surveys: [
              {
                id: uuid,
                ...updatedSurveyData,
                date: format(new Date(), 'Pp'),
              },
            ],
          },
        })
        .match({id: 1})

      if (error) {
        return NextResponse.json({
          error: 'Error al guardar los datos en supabase',
        })
      }

      // upload answers
      const batchSize = 500 // Define el tamaño del lote
      const batches = Math.ceil(parsedAnswers.length / batchSize)
      const upsertError = null

      for (let i = 0; i < batches; i++) {
        const batch = parsedAnswers.slice(i * batchSize, (i + 1) * batchSize)
        const {error} = await supabase.from('answers_temp').upsert(batch, {onConflict: 'answer_id'})

        if (error) {
          console.error('Error inserting records:', error)
        }
      }
      if (upsertError)
        return NextResponse.json({error: 'Error al guardar las respuestas en supabase'})

      // Enviar la respuesta como JSON
      return NextResponse.json({message: 'Data updated'}, {status: 200})
    } else {
      return NextResponse.json({error: 'Error al obtener datos de SurveyMonkey'}, {status: 500})
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
