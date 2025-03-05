import '@styles/fav-prd.scss'
import testImage from '@assets/images/file.png'
import { Product } from '@typess/pos'

interface PdProps {
  pddata: { product: Product; amountSold: number; }[] | null;
}

const FavProductSection = ({ pddata }: PdProps) => (


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
        {pddata ?
          pddata.map(({ product, amountSold }, idx) =>
            (<tr key={idx}>
              <td>
                <div className="pd-img">
                  <img src={product.productImage ?? testImage} alt="" />
                </div>
              </td>
              <td>
                <div className="name-av">{product.productName}</div>
              </td>
              <td>
                <div className='amt'>{amountSold}</div>
                <div className='suffix'>Sales</div>
              </td>
            </tr>))
          : <tr><td colSpan={3}>No data available</td></tr>}
      </tbody>
    </table>
  </div>
)


export default FavProductSection