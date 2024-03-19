import {faker} from '@faker-js/faker'
import Chart from 'chart.js/auto'
import {colors} from '../../component-to-show'

export const barChart = (question: Record<string, any>) => {
  let image = ''
  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    // barThickness: 50,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        barPercentage: 0.4,
        ticks: {
          callback: (value: any) => value + '%',
        },
      },
      y: {
        ticks: {
          color: '#000',
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 0,
      onComplete: function () {
        // @ts-ignore
        image = this.toBase64Image()
      },
    },
  }

  const data: any =
    question?.type === 'matrix'
      ? {
          labels: question?.answers?.map(({description}: any) => description),
          datasets:
            question?.matrixMap?.map(({rows, choice_description}: any, idx: number) => ({
              label: choice_description,
              data: rows.map(({percent}: any) => parseFloat(percent)),
              borderColor: colors[idx] ?? faker.color.rgb({format: 'css'}),
              backgroundColor: colors[idx] ?? faker.color.rgb({format: 'css'}),
            })) || [],
        }
      : {
          labels: question?.answers?.map(({description}: any) => description),
          datasets: [
            {
              label: 'Dataset 1',
              data: question?.answers?.map(({percent}: any) => percent),
              borderColor: question?.answers.map(
                (_: any, i: number) => colors[i] ?? faker.color.rgb({format: 'css'}),
              ),
              backgroundColor: question?.answers.map(
                (_: any, i: number) => colors[i] ?? faker.color.rgb({format: 'css'}),
              ),
            },
          ],
        }

  // @ts-ignore
  document.getElementById(`export-wraper`).style.height =
    question?.type === 'matrix'
      ? `${question?.matrixMap?.[0]?.rows?.length * question?.matrixMap?.length * 40}px`
      : `${question?.answers?.length * 40}px `

  // @ts-ignore
  const chart = new Chart(document.getElementById(`export-to-excel-js`), {
    type: 'bar',
    data,
    options,
  })

  // const image = chart?.toBase64Image('image/jpeg', 1)
  chart.destroy()

  return {image}
}
