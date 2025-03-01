import '@styles/fav-prd.scss'
import testImage from '@assets/images/file.png'


const LowStock = () => (


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
        <tr>
          <td>
            <div className="pd-img">
              <img src={testImage} alt="" />
            </div>
          </td>
          <td>
            <div className="pd-name-av">
              <div className="pd-name">Nike Air Max</div>
              <div className="av down">low stock</div>
            </div>
          </td>
          <td>
            <div className='amt' style={{ color: 'red' }}>3</div>
            <div className='suffix'>Pairs</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)


export default LowStock