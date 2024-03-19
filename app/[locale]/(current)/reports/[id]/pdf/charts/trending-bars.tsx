import {cn} from '@/components/utils/tailwindMerge'
import {faker} from '@faker-js/faker'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import {useMemo} from 'react'
import {Bar} from 'react-chartjs-2'
import {useMediaQuery} from 'react-responsive'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options2 = {
  maintainAspectRatio: false,
  barThickness: 20,
  layout: {
    padding: {
      bottom: 10.3,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    stacked: true,
    x: {
      stacked: true,
      barPercentage: 0.4,
      grid: {
        display: false,
      },
      border: {
        display: false,
        dash: [5, 5],
      },
      ticks: {
        autoSkip: false,
        maxRotation: 45, // 45
        minRotation: 45, // 45
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: 100,
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        count: 11,
        padding: 20,
        callback: (value: any) => value + '%',
      },
      afterFit: (context: any) => {
        context.width += 30
      },
    },
  },
}

// export const labels = Array.from({length: 30}, (_, i) => `week-${i}`)

// export const percentages = [
//   [
//     12, 32, 45, 45, 67, 11, 67, 4, 34, 67, 45, 80, 12, 32, 45, 45, 67, 11, 67, 4, 34, 67, 45, 80,
//     67, 4, 34, 67, 45, 80,
//   ],
//   [
//     23, 24, 15, 27, 23, 45, 16, 67, 12, 23, 34, 12, 23, 24, 15, 27, 23, 45, 16, 67, 12, 23, 34, 12,
//     16, 67, 12, 23, 34, 12,
//   ],
// ]

interface TrendingBarsProps {
  chartData: any
  trend: number
}

function TrendingBars({chartData, trend}: TrendingBarsProps) {
  const labels = chartData?.map((l: any) => l.label)
  const numOfLabels = labels?.length
  const toFix = numOfLabels > 12
  const isSm = useMediaQuery({
    query: '(max-width: 500px)',
  })

  const newChartData = useMemo(() => {
    let result: any[] = []
    let colors: string[] = []
    if (chartData) {
      result = chartData[0]?.questions?.[0]?.answers?.choices?.map(() => [])
      chartData?.forEach(({questions}: any, qIdx: number) => {
        colors = questions?.[0]?.answers?.choices?.map(({color}: any) => color)
        questions?.[0]?.answers?.choices?.forEach(
          (choice: any, cIdx: number) => (result[cIdx][qIdx] = choice),
        )
      })
      return {result, colors}
    }
  }, [chartData, trend])

  const options = {
    maintainAspectRatio: false,
    barThickness: 20,
    interaction: {
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: {
          top: 10,
          bottom: 10,
          left: 15,
          right: 15,
        },
        bodySpacing: 8,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 6,
        backgroundColor: function ({tooltip}: any) {
          return '#00002D'
        },
        callbacks: {
          labelColor: (ctx: any) => ({
            borderColor: ctx?.dataset?.backgroundColor,
            backgroundColor: '#00002D',
            borderWidth: 3,
            borderRadius: 3,
            width: 2,
            height: 2,
          }),
          labelTextColor: () => '#fff',
          label: (ctx: any) => {
            const values = chartData?.[ctx?.dataIndex]?.questions?.[0]?.answers?.choices?.map(
              ({percent, count}: any) => `${percent}%  |  ${count}`,
            )
            return values?.[ctx?.datasetIndex]
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        barPercentage: 0.4,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        categoryPercentage: 0.9,
      },
      y: {
        ...(toFix || isSm
          ? {
              stacked: true,
              border: {
                display: false,
              },
              grid: {
                display: false,
                drawTicks: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              },
            }
          : {
              stacked: true,
              ticks: {
                padding: 20,
                callback: (value: any) => value + '%',
              },
              border: {
                display: false,
              },
              grid: {
                display: false,
              },
            }),
      },
    },
  }

  const data = {
    labels,
    datasets:
      newChartData?.result?.map((choices: any, idx: number) => ({
        label: `Label ${idx}`,
        data: choices?.map(({percent}: any) => parseFloat(percent)),
        backgroundColor: newChartData?.colors[idx],
        borderSkipped: false,
        // barPercentage: 0.4,
        borderRadius: {
          topLeft: 2,
          topRight: 2,
          bottomRight: 2,
          bottomLeft: 2,
        },
      })) || [],
  }

  const data2 = {
    labels,
    datasets:
      newChartData?.result?.map((choices: any, idx: number) => ({
        label: `Label ${idx}`,
        data: choices?.map(({percent}: any) => parseFloat(percent)),
      })) || [],
  }

  return !chartData ? (
    <></>
  ) : (
    <div id="chartBox" className="flex justify-center h-[323px] w-full">
      {(toFix || isSm) && (
        <div className=" w-24 overflow-x-hidden">
          <div
            id="axisBox"
            className="h-[323px]  overflow-y-hidden"
            style={{width: 677.5 + 18 * labels?.length}}
          >
            {/* @ts-expect-error */}
            <Bar options={options2} data={data2} />
          </div>
        </div>
      )}
      <div
        id="colLarge"
        className={cn(`h-screen overflow-y-hidden w-full max-w-[677.5px]  max-h-[323px]`, {
          'overflow-x-scroll': toFix || isSm,
        })}
      >
        {toFix || isSm ? (
          <div
            id="box"
            style={{width: 677.5 + 18 * labels?.length}}
            className="h-[323px] overflow-y-hidden sm"
          >
            {/* @ts-expect-error */}
            <Bar options={options} data={data} />
          </div>
        ) : (
          <div id="box" className="h-[323px] w-full overflow-y-hidden">
            {/* @ts-expect-error */}
            <Bar options={options} data={data} />
          </div>
        )}
      </div>
    </div>
  )
}

TrendingBars.displayName = 'TrendingBars'

export default TrendingBars
