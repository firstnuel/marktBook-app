import testImage from '@assets/images/file.png'
import { cutName, getCurrencySymbol } from '@utils/helpers'
import ProductBox from '@components/ProductBox'
import { Product } from '@typess/pos'
import { useState } from 'react'
import { useBusiness } from '@hooks/useBusiness'
import '@styles/product-card.scss'

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [modalShow, setModalShow] = useState(false)
  const { business } = useBusiness()

  return(
    <>
      <div className="card-container" onClick={() => setModalShow(true)}>
        <div className="card-img">
          <img src={product.productImage || testImage} alt="" />
        </div>
        <div className="card-name">{cutName(`${product.productName}`, 20)}</div>
        <div className="card-data">
          <div className={product.stock?.unitsAvailable? 'available' : 'unavailable'}>
            <span>{product.stock?.unitsAvailable? 'In Stock' : 'Out of Atock'}</span></div>
          <div className="price">{`${getCurrencySymbol(business?.currency?? 'USD')}${product.salePrice.toFixed(2)}`}</div>
        </div>
      </div>
      <ProductBox
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
      />
    </>
  )
}


export default ProductCard