import { LineChart, Line, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import '@styles/charts.scss'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'


const data = [
  { name: 'Page A', uv: 1000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 278, pv: 3908, amt: 2000 },
]

const SalesChart = () => {
  return (
    <div className="graph">

      <div className="g-head">
        <div className="g-ttl-point">
          <div className='point'></div>
          <div className="g-ttl">Report Graph</div>
        </div>
        <div className="select-gh">
          <div className="select-name">Total Amount Sales</div>
          <IconBox src={icons.arrowUp} clName='icon'/>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart width={730} height={250} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#2D71F8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <div className="bottom">
        <div className='b-childs'>
          <div className="tttl">Amount</div>
          <div className="amt-cur">
            <div className="amt">12,6500.00</div>
            <div className="cur">USD</div>
          </div>
        </div>
        <div className='b-childs'>
          <div className="tttl">Growth</div>
          <div className="amt-cur">
            <div className="amt"><span>&#43;</span>1,543.30</div>
            <div className="cur">USD</div>
          </div>
        </div>
        <div className='b-childs'>
          <div className="tttl">Growth</div>
          <div className="amt-cur">
            <div className="amt"><span>&#8593;</span>12.2</div>  {/* &#8595; */}
            <div className="cur">Percent(%)</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SalesChart