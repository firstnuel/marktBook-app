import { useInv } from '@hooks/useInv'
import Container from 'react-bootstrap/Container'
import ProductList from './ProductList'
import './index.scss'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'


const ProductByCategory = () => {
  const { productsByCat, setSubOpt } = useInv()


  return(

    <Container className="whole">
      <div className="head-info">
        <div className="head-name"> Products Under {productsByCat[0].productCategory}</div>
        <div className="back">
          <IconBox src={icons.arrowback} clName="img-div" />
          <span className="text" onClick={() => setSubOpt('Product List')}>Back</span>
        </div>
      </div>
      <div className="cat-content">
        <ProductList products={productsByCat} />
      </div>

    </Container>
  )
}

export default ProductByCategory