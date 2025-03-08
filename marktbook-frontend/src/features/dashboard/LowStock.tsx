import '@styles/fav-prd.scss'
import testImage from '@assets/images/file.png'
import { useStocks } from '@hooks/useStocks'


const LowStock = () => {
  const { lowStocks } = useStocks()

  return (


    <div className="fav-prd s-div">
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Low Stock</div>
      </div>
      <table>
        <thead>
          <tr>
            <th><span>Img</span></th>
            <th><span>Product Name</span></th>
            <th><span>Quantity</span></th>
          </tr>
        </thead>
        <tbody>
          {(lowStocks || []).map((stock, idx) =>
            (<tr key={idx}>
              <td>
                <div className="pd-img">
                  <img src={testImage} alt="" />
                </div>
              </td>
              <td>
                <div className="pd-name-av">
                  <div className="pd-name">{stock.product?.name}</div>
                  <div className="av down">low stock</div>
                </div>
              </td>
              <td>
                <div className='amt' style={{ color: 'red' }}>{stock.unitsAvailable}</div>
                <div className='suffix'>{stock.unitsAvailable > 1 ? 'Units' : 'Unit'}</div>
              </td>
            </tr>))}
        </tbody>
      </table>
    </div>
  )
}

export default LowStock