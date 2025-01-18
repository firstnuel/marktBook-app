import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import ProductTable from './ProductTable'
import './index.scss'


const Inventory = () => {


  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Inventory' subSecName='Something'/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Products'/>
          <SecOption name='Create Products'/>
          <SecOption name='Add Stock Data'/>
          <SecOption name='Products Variants'/>
          <SecOption name='Categories'/>
          <SecOption name='Print QR codes'/>
        </Container>
        <Container className='sec-show'>
          <ProductTable/>
        </Container>
      </div>
    </div>
  )
}






export default Inventory