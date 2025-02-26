import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useTrans } from '@hooks/useTrans'
import SalesTable from './SalesTable'
import InvoiceTable from './InvoiceTable'
import './index.scss'


const Transactions = () => {
  const { mainOpt, setMainOpt, } = useTrans()

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Transactions' subSecName={mainOpt}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Sales' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Invoices' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Sales Return' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Purchases'mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Purchase Return' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
        </Container>
        <Container className='sec-show'>
          {mainOpt === 'Sales' && <SalesTable />}
          {mainOpt === 'Invoices' && <InvoiceTable />}
        </Container>
      </div>
    </div>
  )
}



export default Transactions