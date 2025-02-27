import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useTrans } from '@hooks/useTrans'
import SalesTable from './SalesTable'
import InvoiceTable from './InvoiceTable'
import Invoice from '@components/Invoice'
import './index.scss'


const Transactions = () => {
  const { mainOpt, setMainOpt, sale, subOpt } = useTrans()

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
          {mainOpt === 'Invoices' && subOpt === 'None' && <InvoiceTable />}
          {mainOpt === 'Invoices' && subOpt === 'View Invoice' && sale &&
          <Invoice sale={sale}/>}
        </Container>
      </div>
    </div>
  )
}



export default Transactions