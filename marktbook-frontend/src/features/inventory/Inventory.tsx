import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import ProductTable from './ProductTable'
import { useInv } from '@hooks/useInv'
import ProductForm from './ProductForm'
import './index.scss'
import StockForm from './StockForm'


const Inventory = () => {
  const { mainOpt, subOpt, product, error } = useInv()


  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Inventory' subSecName={mainOpt}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Products' mainOpt={mainOpt}/>
          <SecOption name='Create Products' mainOpt={mainOpt}/>
          <SecOption name='Stock Data' mainOpt={mainOpt}/>
          <SecOption name='Products Variants'/>
          <SecOption name='Categories'/>
          <SecOption name='Print QR codes'/>
        </Container>
        <Container className='sec-show'>
          { mainOpt === 'Products' &&  subOpt === 'Product List' &&
          <ProductTable />
          }
          {mainOpt === 'Products' &&  subOpt === 'Edit Product' &&
          <ProductForm product={product!} error={error!}/>
          }
          { mainOpt === 'Create Products' &&
          <ProductForm error={error!} />
          }
          {
            mainOpt === 'Stock Data' && <StockForm />
          }
        </Container>
      </div>
    </div>
  )
}






export default Inventory