import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import '@styles/top-cat.scss'
import { ProductCategory } from '@typess/pos'

ChartJS.register(ArcElement, Tooltip, Legend)

interface TcProps {
  catData: {
    category: ProductCategory
    amountOfSales: number
  }[]
}


const TopCategories = ({ catData }: TcProps) => {



  const data = {
    labels: catData.map(item => item.category),
    datasets: [
      {
        label: 'Product Sales',
        data: catData.map(item => item.amountOfSales),
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
  return (
    <div id="s-div">
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Top Categories</div>
      </div>
      <div className="body">
        <Doughnut data={data}/>
        <div className="sales">
          {(catData.slice(0, 4)).map((data, idx) =>
            (<div className="sale-amt" key={idx}>
              <div className="name">{data.category}</div>
              <div className="amt">{data.amountOfSales} Sales</div>
            </div>)
          )}
        </div>
      </div>
    </div>
  )
}

export default TopCategories
