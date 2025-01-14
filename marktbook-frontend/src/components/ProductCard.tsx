import testImage from '@assets/images/file.png'
import { cutName } from '@utils/helpers'
import '@styles/product-card.scss'

const ProductCard = () => {


  return(
    <>
      <div className="card-container">
        <div className="card-img">
          <img src={testImage} alt="" />
        </div>
        <div className="card-name">{cutName('Macbook Laptop', 20)}</div>
        <div className="card-data">
          <div className="available unavailable"><span>out of stock</span></div>
          <div className="price">$10</div>
        </div>
      </div>
    </>
  )
}


export default ProductCard