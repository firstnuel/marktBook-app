import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useContacts } from '@hooks/useContacts'
import ManageCustomers from './ManageCustomers'
import EditCustomer from './EditCustomer'
import ManageSuppliers from './ManageSuppliers'
import EditSupplier from './EditSupplier'

const Contacts = () => {
  const { mainOpt, setMainOpt, subOpt } = useContacts()

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Contacts' subSecName={mainOpt}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Customers' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Suppliers' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
        </Container>
        <Container className='sec-show'>
          {mainOpt === 'Customers' && subOpt === 'None' && <ManageCustomers />}
          {mainOpt === 'Customers' && subOpt === 'Edit Customer' && <EditCustomer />}
          {mainOpt === 'Suppliers' && subOpt === 'None' && <ManageSuppliers />}
          {mainOpt === 'Suppliers' && subOpt === 'Edit Supplier' && <EditSupplier />}
        </Container>
      </div>
    </div>
  )
}


export default Contacts