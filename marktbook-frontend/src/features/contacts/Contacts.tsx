import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import { useContacts } from '@hooks/useContacts'
import ManageCustomers from './ManageCustomers'


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
        </Container>
      </div>
    </div>
  )
}


export default Contacts