import {NextResponse} from 'next/server'
// pages/api/survey.js
import axios from 'axios'
import mergeSurveyData from '../../../utils/mergeSurveyData'
import {createServerSupabaseClient} from '@/app/supabase-server'
import {randomUUID} from 'crypto'
import {format} from 'date-fns'

export async function GET() {
  // Definir las URL de las API de SurveyMonkey
  const rollupsUrl = 'https://api.surveymonkey.com/v3/surveys/411909544/rollups'
  const detailsUrl = 'https://api.surveymonkey.com/v3/surveys/411909544/details'
  const answersUrl = 'https://api.surveymonkey.com/v3/surveys/411909544/responses/bulk'
  const API_KEY = process.env.NEXT_PUBLIC_SM_SECRET

  const supabase = createServerSupabaseClient()

  try {
    // Realizar las solicitudes a las API de SurveyMonkey
    const [rollupsResponse, detailsResponse, answersResponse] = await Promise.all([
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
      axios.get(answersUrl, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }),
    ])

    if (rollupsResponse.status === 200 && detailsResponse.status === 200) {
      // Obtener los datos de las respuestas
      const surveyRollUps = rollupsResponse.data
      const surveyDetails = detailsResponse.data
      const surveyAnswers = answersResponse.data.data

      // Llamar a la función mergeSurveyData para combinar los datos
      const updatedSurveyData = mergeSurveyData(surveyDetails, surveyRollUps)

      const uuid = randomUUID()

      // upload data to supabase
      const {error} = await supabase
        .from('survey_data_snap_dev')
        .update({
          data: {
            active_survey_id: uuid,
            surveys: [
              {
                id: uuid,
                ...updatedSurveyData,
                answers: surveyAnswers,
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

      // Enviar la respuesta como JSON
      return NextResponse.json({data: updatedSurveyData}, {status: 200})
    } else {
      return NextResponse.json({error: 'Error al obtener datos de SurveyMonkey'}, {status: 500})
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({error: 'Error al procesar la solicitud'}, {status: 500})
  }
}
