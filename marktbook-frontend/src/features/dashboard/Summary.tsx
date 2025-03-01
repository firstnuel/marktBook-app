import { PieChart, Pie,  ResponsiveContainer, } from 'recharts'
import '@styles/summary.scss'

const productStock01 = [
  { name: 'Laptop', stock: 400 },
  { name: 'Smartphone', stock: 300 },
  { name: 'Tablet', stock: 300 },
  { name: 'Smartwatch', stock: 200 },
  { name: 'Headphones', stock: 278 },
  { name: 'Camera', stock: 189 }
]

const productStock02 = [
  { name: 'Laptop', stock: 2400 },
  { name: 'Smartphone', stock: 4567 },
  { name: 'Tablet', stock: 1398 },
  { name: 'Smartwatch', stock: 9800 },
  { name: 'Headphones', stock: 3908 },
  { name: 'Camera', stock: 4800 }
]





const Summary = () => {

  return(
    <div className="s-div">
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Inventory</div>
      </div>
      <div className="body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={730} height={250}>
            <Pie data={productStock01} dataKey="stock" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#2D71F8" />
            <Pie data={productStock02} dataKey="stock" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="summaries">
        <div className="totls">
          <div className='name'>Total Products</div>
          <div className='amt'>90</div>
        </div>
        <div className="totls">
          <div className='name s'>Total Stock</div>
          <div className='amt'>80</div>
        </div>
        <div className="totls">
          <div className='name c'>Total Category</div>
          <div className='amt'>90</div>
        </div>
      </div>
    </div>
  )
}


export default Summary

