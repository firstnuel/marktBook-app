import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import EditBusiness from './Editbusiness'
import { useBusiness } from '@hooks/useBusiness'
import ManageUsers from './ManageUsers'


const Settings = () => {
  const { mainOpt, setMainOpt } = useBusiness()

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Settings' subSecName={mainOpt}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Business' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Payments' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Manage Accounts' mainOpt={mainOpt} setMainOpt={setMainOpt}/>
          <SecOption name='Notifications'mainOpt={mainOpt} setMainOpt={setMainOpt}/>
        </Container>
        <Container className='sec-show'>
          {mainOpt === 'Business' && <EditBusiness />}
          {mainOpt === 'Manage Accounts' && <ManageUsers />}

        </Container>
      </div>
    </div>
  )
}



export default Settings