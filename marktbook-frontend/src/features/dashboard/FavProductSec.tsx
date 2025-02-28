import '@styles/fav-prd.scss'
import testImage from '@assets/images/file.png'


const FavProductSection = () => (


  <div className="fav-prd">
    <div className="pd-head">
      <div className='point'></div>
      <div className="ttl">Top Selling Products</div>
    </div>
    <table>
      <thead>
        <tr>
          <th><span>Img</span></th>
          <th><span>Product Name</span></th>
          <th><span>Total Orders</span></th>
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
              <div className="av up">available</div>
            </div>
          </td>
          <td>
            <div className='amt'>183</div>
            <div className='suffix'>Sales</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)


export default FavProductSection