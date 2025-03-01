import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import '@styles/top-cat.scss'

ChartJS.register(ArcElement, Tooltip, Legend)

const categorySales = [
  { category: 'Electronics', sales: 5000 },
  { category: 'Wearable', sales: 3200 },
  { category: 'Accessories', sales: 2400 },
  { category: 'Photography', sales: 2900 },
  { category: 'Gaming', sales: 4100 },
  { category: 'Home Appliances', sales: 3500 }
]

const data = {
  labels: categorySales.map(item => item.category),
  datasets: [
    {
      label: 'Product Sales',
      data: categorySales.map(item => item.sales),
      backgroundColor: [
        '#2D71F8',
        '#FC4A4A',
        '#1C8370',
        '#94b3ef',
        '#FEF6F3',
        '#F3FCFB'
      ],
      borderColor: [
        '#2D71F8',
        '#FC4A4A',
        '#1C8370',
        '#94b3ef',
        '#FEF6F3',
        '#F3FCFB'
      ],
      borderWidth: 1
    }
  ]
}

const TopCategories = () => {
  return (
    <div id="s-div">
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Top Categories</div>
      </div>
      <div className="body">
        <Doughnut data={data}/>
        <div className="sales">
          <div className="sale-amt">
            <div className="name">Electronics</div>
            <div className="amt">10 Sales</div>
          </div>
          <div className="sale-amt">
            <div className="name">Clothing</div>
            <div className="amt">9 Sales</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopCategories
