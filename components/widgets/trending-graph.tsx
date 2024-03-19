/* eslint-disable tailwindcss/no-custom-classname */
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
import {type RegularGraphProps} from './types'
import {
  trendingGraphFixedYAxisYOptions,
  trendingGraphFixedYBarsOptions,
  trendingGraphOptions,
} from './chart-options'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TrendingGraph: React.FC<RegularGraphProps> = ({data}) => {
  const numOfLabels = data.labels.length
  const toFix = numOfLabels > 12
  return (
    <div id="chartBox" className="flex h-[323px] w-full">
      {toFix && (
        <div id="axisBox" className="h-[323px] w-24">
          <Bar options={trendingGraphFixedYAxisYOptions} data={data} />
        </div>
      )}
      <div
        id="colLarge"
        className={`h-screen overflow-y-hidden w-full max-w-[677.5px] ${
          toFix && 'overflow-x-scroll'
        } max-h-[323px]`}
      >
        {toFix ? (
          <div
            id="box"
            style={{width: 677.5 + 18 * data.labels.length}}
            className="h-[323px] overflow-y-hidden"
          >
            <Bar options={trendingGraphFixedYBarsOptions} data={data} />
          </div>
        ) : (
          <div id="box" className="h-[323px] w-full overflow-y-hidden">
            <Bar options={trendingGraphOptions} data={data} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendingGraph
