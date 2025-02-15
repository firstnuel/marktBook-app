import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import ProductTable from './ProductTable'
import Categories from './Categories'
import { useInv } from '@hooks/useInv'
import ProductForm from './ProductForm'
import './index.scss'
import StockForm from './StockForm'
import PrintCodes from './PrintCodes'
import ProductByCategory from './ProductByCategory'


const Inventory = () => {
  const { mainOpt, subOpt, product, error, setMainOpt, setSubOpt } = useInv()

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Inventory' subSecName={mainOpt} />
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Products' mainOpt={mainOpt} setMainOpt={setMainOpt} setSubOpt={setSubOpt}/>
          <SecOption name='Create Products' mainOpt={mainOpt} setMainOpt={setMainOpt} setSubOpt={setSubOpt}/>
          <SecOption name='Stock Data' mainOpt={mainOpt} setMainOpt={setMainOpt} setSubOpt={setSubOpt}/>
          {/* <SecOption name='Products Variants'/> */}
          <SecOption name='Categories' mainOpt={mainOpt} setMainOpt={setMainOpt} setSubOpt={setSubOpt}/>
          <SecOption name='Print Codes'  mainOpt={mainOpt} setMainOpt={setMainOpt} setSubOpt={setSubOpt}/>
        </Container>
        <Container className='sec-show'>
          { mainOpt === 'Products' && subOpt === 'Product List' && <ProductTable /> }
          { mainOpt === 'Products' && subOpt === 'Edit Product' && <ProductForm product={product!} error={error!}/> }
          { mainOpt === 'Create Products' && <ProductForm error={error!} /> }
          { mainOpt === 'Stock Data' && <StockForm /> }
          { mainOpt === 'Print Codes' && <PrintCodes /> }
          { mainOpt === 'Categories' && subOpt !== 'Product By Cat' && <Categories /> }
          {mainOpt === 'Categories' && subOpt === 'Product By Cat' && <ProductByCategory />}
        </Container>
      </div>
    </div>
  )
}






export default Inventory