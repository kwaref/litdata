import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {Bar} from 'react-chartjs-2'
import {faker} from '@faker-js/faker'
import {colors} from '../../component-to-show'
import {useMediaQuery} from 'react-responsive'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface HorizontalBarsProps {
  chartData: any
  matrixMap: any
  type: string
}

function HorizontalBars({chartData, matrixMap, type}: HorizontalBarsProps) {
  const isMd = useMediaQuery({
    query: '(max-width: 768px)',
  })

  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    ...(type === 'matrix' && {interaction: {mode: 'index'}}),
    // barThickness: 50,
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
          labelColor: (ctx: any) => {
            return {
              borderColor:
                type === 'matrix'
                  ? ctx.dataset.backgroundColor
                  : ctx.dataset.backgroundColor[ctx?.dataIndex],
              backgroundColor: '#00002D',
              borderWidth: 3,
              borderRadius: 3,
              width: 2,
              height: 2,
            }
          },
          labelTextColor: () => '#fff',
          label: (ctx: any) => {
            if (type === 'matrix') {
              return
            }
            return chartData?.map(({percent, count}: any) => `${percent}%  |  ${count}`)[
              ctx?.dataIndex
            ]
          },
        },
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
        beforeUpdate(axis: any) {
          const labels = axis.chart.data.labels
          for (let i = 0; i < labels.length; i++) {
            const lbl = labels[i]

            if (isMd) {
              labels[i] = ''
            } else if (typeof lbl === 'string' && lbl.length > 30) {
              labels[i] = `${lbl.substring(0, 30)}...` // cutting
            }
          }
        },
        ticks: {
          color: '#000',
          font: {
            size: 14,
          },
          // @ts-ignore
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  }

  const selectedColors = chartData?.map(({color}: {color: any}) => color)

  const data: any =
    type === 'matrix'
      ? {
          labels: chartData?.map(({description}: any) => description),
          datasets:
            matrixMap?.map(({rows, choice_description}: any, idx: number) => ({
              label: choice_description,
              data: rows.map(({percent}: any) => parseFloat(percent)),
              borderColor: colors[idx] ?? faker.color.rgb({format: 'css'}),
              backgroundColor: colors[idx] ?? faker.color.rgb({format: 'css'}),
            })) || [],
        }
      : {
          labels: chartData?.map(({description}: any) => description),
          datasets: [
            {
              label: 'Dataset 1',
              data: chartData?.map(({percent}: any) => percent),
              borderColor: selectedColors,
              // chartData.map(
              //   (_: any, i: number) => colors[i] ?? faker.color.rgb({format: 'css'}),
              // ),
              backgroundColor: selectedColors,
              // chartData.map(
              //   (_: any, i: number) => colors[i] ?? faker.color.rgb({format: 'css'}),
              // ),
            },
          ],
        }

  return (
    <div
      style={{
        height:
          type === 'matrix'
            ? matrixMap?.[0]?.rows?.length * matrixMap?.length * 40
            : chartData?.length * 40,
      }}
      className="w-11/12"
    >
      {/* @ts-ignore */}
      <Bar options={options} data={data} />
    </div>
  )
}

export default HorizontalBars
