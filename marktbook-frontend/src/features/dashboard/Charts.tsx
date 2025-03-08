import { LineChart, Line, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import '@styles/charts.scss'
import { percentageOf, sumNumber } from '@utils/helpers'


interface ChartProps {
  period: string;
  currentData: number[];
  lastData: number[];
  currency?: string
}

const SalesChart = ({ period, currentData, lastData, currency }: ChartProps) => {
  // Generating data for the chart with dynamic keys based on period
  const data = currentData.map((current, index) => ({
    name: `Period ${index + 1}`,
    [`current${period}`]: current,  // Dynamically create key based on the period
    [`last${period}`]: lastData[index] || 0,  // Dynamically create key for lastData
  }))

  return (
    <div className="graph">
      <div className="g-head">
        <div className="g-ttl-point">
          <div className="point"></div>
          <div className="g-ttl">Report Graph</div>
        </div>
        <div className="select-gh">
          <div className="select-name">Total Product Sales</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <Tooltip />
          <Legend />
          {/* Line for current period data */}
          <Line type="monotone" dataKey={`current${period}`} stroke="#2D71F8" />
          {/* Line for last period data */}
          <Line type="monotone" dataKey={`last${period}`} stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <div className="bottom">
        <div className="b-childs">
          <div className="tttl">Amount</div>
          <div className="amt-cur">
            <div className="amt">{sumNumber(currentData?? [])}</div>
            <div className="cur">{currency?? 'USD'}</div>
          </div>
        </div>
        <div className="b-childs">
          <div className="tttl">Growth</div>
          <div className="amt-cur">
            <div className="amt">
              <span>&#43;</span>{sumNumber(currentData?? [], lastData?? [])}
            </div>
            <div className="cur">{currency?? 'USD'}</div>
          </div>
        </div>
        <div className="b-childs">
          <div className="tttl">Growth</div>
          <div className="amt-cur">
            <div className="amt">
              <span>&#8593;</span>{percentageOf(currentData?? [], lastData?? [])}
            </div>{' '}
            {/* &#8595; */}
            <div className="cur">Percent(%)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesChart
