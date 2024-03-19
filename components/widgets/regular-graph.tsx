import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip} from 'chart.js'
import {Bar} from 'react-chartjs-2'
import {type RegularGraphProps} from './types'
import {
  regularGraphFixedXAxisXOptions,
  regularGraphFixedXBarsOptions,
  regularGraphOptions,
} from './chart-options'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const RegularGraph: React.FC<RegularGraphProps> = ({data}) => {
  const toFix = data.labels.length > 12
  const options = toFix
    ? regularGraphFixedXBarsOptions
    : {...regularGraphOptions, barThickness: 'flex'}
  const barsHeight = toFix ? 293 : 323
  return (
    <div className="h-[323px] w-full">
      <div
        id="scrollBox"
        className={`w-[99%] h-screen overflow-y-auto ${toFix ? 'max-h-[293px]' : 'max-h-[323px]'}`}
      >
        <div
          id="scrollBoxBody"
          style={{
            height:
              data.labels.length > 12 ? barsHeight + (data.labels.length - 12) * 24.5 : barsHeight,
          }}
          className="w-full"
        >
          <Bar options={options} data={data} />
        </div>
      </div>
      {toFix && (
        <div id="box" className="h-[25px] w-[99%]">
          <Bar options={regularGraphFixedXAxisXOptions} data={{...data, labels: []}} />
        </div>
      )}
    </div>
  )
}

export default RegularGraph
