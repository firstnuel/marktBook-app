import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useTrans } from '@hooks/useTrans'
import SalesTable from './SalesTable'
import InvoiceTable from './InvoiceTable'
import Invoice from '@components/Invoice'
import ViewSale from './ViewSale'
import SalesReturn from './SalesReturn'
import './index.scss'


const Transactions = () => {
  const { mainOpt, setMainOpt, sale, invoice, subOpt } = useTrans()

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Transactions' subSecName={mainOpt}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Sales' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Invoices' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Sales Return' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
        </Container>
        <Container className='sec-show'>
          {mainOpt === 'Sales'  && <SalesTable />}
          {mainOpt === 'Invoices'  && subOpt !== 'View Invoice' && <InvoiceTable />}
          {mainOpt === 'Invoices' && subOpt === 'View Invoice' && invoice && <Invoice sale={invoice}/>}
          {mainOpt === 'Sales' && subOpt === 'View Sale'  && sale && <ViewSale/>}
          {mainOpt === 'Sales Return' && <SalesReturn />}
        </Container>
      </div>
    </div>
  )
}



export default Transactions