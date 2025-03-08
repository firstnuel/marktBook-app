import { PieChart, Pie,  ResponsiveContainer, } from 'recharts'
import '@styles/summary.scss'
import { usePos } from '@hooks/usePos'
import { useStocks } from '@hooks/useStocks'


const Summary = () => {
  const { products } = usePos()
  const { stocks } = useStocks()

  return(
    <div className="s-div">
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Inventory</div>
      </div>
      <div className="body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={730} height={250}>
            <Pie data={products} dataKey="stock[unitsAvailable]" nameKey="productName" cx="50%" cy="50%" outerRadius={50} fill="#2D71F8" />
            <Pie data={stocks} dataKey="unitsAvailable" nameKey="product[name]" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="summaries">
        <div className="totls">
          <div className='name'>Total Products</div>
          <div className='amt'>{products.length}</div>
        </div>
        <div className="totls">
          <div className='name s'>Total Products in Stock</div>
          <div className='amt'>{stocks.length}</div>
        </div>
      </div>
    </div>
  )
}


export default Summary

