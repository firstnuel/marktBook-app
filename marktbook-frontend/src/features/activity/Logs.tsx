import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useLogs } from '@hooks/useLogs'
import InventoryLogs from './InventoryLogs'
import StocksLogs from './StocksLog'
import UsersLogs from './UsersLog'
import SalesLogs from './SalesLogs'
import ContactsLogs from './ContactsLogs'
import BusinessLogs from './BusinessLogs'
import './index.scss'



const Activity = () => {
  const { mainOpt, setMainOpt } = useLogs()

  return (
    <div className="main-container-inv">
      <HeaderInfo secName="Logs" subSecName={mainOpt} />
      <div className="main-con">
        <Container className="sec">
          <SecOption name="Inventory" mainOpt={mainOpt} setMainOpt={setMainOpt} />
          <SecOption name="Stock" mainOpt={mainOpt} setMainOpt={setMainOpt} />
          <SecOption name="Users" mainOpt={mainOpt} setMainOpt={setMainOpt} />
          <SecOption name="Transactions" mainOpt={mainOpt} setMainOpt={setMainOpt} />
          <SecOption name="Contacts" mainOpt={mainOpt} setMainOpt={setMainOpt} />
          <SecOption name="Business" mainOpt={mainOpt} setMainOpt={setMainOpt} />
        </Container>

        <Container className="sec-show">
          {mainOpt === 'Inventory' && <InventoryLogs />}
          {mainOpt === 'Stock' && <StocksLogs />}
          {mainOpt === 'Users' && <UsersLogs />}
          {mainOpt === 'Transactions' && <SalesLogs />}
          {mainOpt === 'Contacts' && <ContactsLogs />}
          {mainOpt === 'Business' && <BusinessLogs />}
        </Container>
      </div>
    </div>
  )
}

export default Activity
