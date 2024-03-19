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
import {Bar} from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  maintainAspectRatio: false,
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
          borderColor: ctx.dataset.backgroundColor,
          backgroundColor: '#00002D',
          borderWidth: 3,
          borderRadius: 3,
          width: 2,
          height: 2,
        }),
        labelTextColor: () => '#fff',
        label: (ctx: any) => {
          return Array.from(
            {length: percentages?.length},
            (_, i) => `${percentages[i]?.[ctx?.dataIndex]}%`,
          )[ctx?.datasetIndex]
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      border: {
        display: false,
        dash: [5, 5],
      },
      ticks: {
        autoSkip: false,
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      stacked: true,
      ticks: {
        display: false,
      },
      grid: {
        rawTicks: false,
      },
    },
  },
}

const options2 = {
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 45,
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
    x: {
      ticks: {
        display: false,
      },
      grid: {
        rawTicks: false,
      },
    },
    y: {
      stacked: true,
      ticks: {
        padding: 12,
        callback: (value: any) => value + '%',
      },
      border: {
        display: false,
        dash: [5, 5],
      },
    },
  },
}

export const labels = Array.from({length: 30}, (_, i) => `week-${i}`)

export const percentages = [
  [
    12, 32, 45, 45, 67, 11, 67, 4, 34, 67, 45, 80, 12, 32, 45, 45, 67, 11, 67, 4, 34, 67, 45, 80,
    67, 4, 34, 67, 45, 80,
  ],
  [
    23, 24, 15, 27, 23, 45, 16, 67, 12, 23, 34, 12, 23, 24, 15, 27, 23, 45, 16, 67, 12, 23, 34, 12,
    16, 67, 12, 23, 34, 12,
  ],
]

interface TrendingBarsProps {
  chartData: any
  matrixMap: any
  type: string
}

function TrendingBars({chartData, matrixMap, type}: TrendingBarsProps) {
  const data = {
    labels,
    datasets: percentages?.map((pArr, idx) => ({
      label: `Label ${idx}`,
      data: pArr,
      backgroundColor: ['#D4A8EE', '#6EEDBF'][idx],
      borderSkipped: false,
      borderRadius: {
        topLeft: 2,
        topRight: 2,
        bottomRight: 2,
        bottomLeft: 2,
      },
    })),
  }

  const data2 = {
    labels,
    datasets: percentages?.map((pArr, idx) => ({
      label: `Label ${idx}`,
      data: pArr,
    })),
  }

  return (
    <div className="w-full flex">
      <div className="w-[60px] overflow-hidden">
        <div
          style={{
            minHeight: 320,
            height: 320,
            width: labels?.length * 24,
          }}
        >
          {/* @ts-expect-error */}
          <Bar options={options2} data={data2} />
        </div>
      </div>
      <div className="w-full overflow-x-auto bg-white">
        <div
          style={{
            minHeight: 320,
            height: 320,
            width: `calc(${labels?.length * 24}px - 60px)`,
          }}
        >
          {/* @ts-expect-error */}
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  )
}

TrendingBars.displayName = 'TrendingBars'

export default TrendingBars
