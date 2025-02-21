import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useBusiness } from '@hooks/useBusiness'


const StocksMangement = () => {
  const { mainOpt, setMainOpt } = useBusiness()

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Stocks' subSecName={mainOpt}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Stocks' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Low Stocks' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Movements' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Adjustments' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Stocks By Supplier'mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Locations' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
        </Container>
        <Container className='sec-show'>
        </Container>
      </div>
    </div>
  )
}



export default StocksMangement