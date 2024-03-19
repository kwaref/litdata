import RegularGraph from './regular-graph'
import TrendingGraph from './trending-graph'
import {extractData} from './chart-options'
interface WidgetBarsProps {
  chartData: any
  matrixMap: any
  type: string
  colors?: string[]
}

const WidgetBars = ({chartData, type}: WidgetBarsProps) => {
  const isRegular = type === 'No trends'
  let data: any
  if (isRegular) {
    const colors = chartData.map((item: {color: string}) => item?.color)
    data = {
      labels: chartData?.map(({description}: any) => description),
      datasets: [
        {
          label: '',
          data: chartData?.map(({percent}: any) => percent),
          counts: chartData?.map(({count}: any) => count),
          // borderColor: chartData?.map(({color}:{color:string}, i: number) => colors[i]),
          borderColor: colors,
          // backgroundColor: chartData?.map(({color}:{color:string}, i: number) => colors[i]),
          backgroundColor: colors,
          borderRadius: {
            bottomLeft: 2,
            bottomRight: 2,
            topLeft: 2,
            topRight: 2,
          },
        },
      ],
    }
  } else {
    const {results, colors: trendColors, categories} = extractData(chartData)
    data = {
      labels: chartData.map((item: any) => item.label),
      datasets: categories.map((category: any, index: any) => ({
        label: category,
        data: results[index].map((choice: {percent: any}) => parseFloat(choice.percent)),
        counts: results[index].map((choice: {count: any}) => parseFloat(choice.count)),
        backgroundColor: trendColors[index],
        borderColor: trendColors[index],
        borderSkipped: false,
        borderRadius: {
          topLeft: 2,
          topRight: 2,
          bottomRight: 2,
          bottomLeft: 2,
        },
      })),
    }
  }
  return isRegular ? <RegularGraph data={data} /> : <TrendingGraph data={data} />
}

export default WidgetBars
