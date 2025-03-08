import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'
import EditBusiness from './Editbusiness'
import { useBusiness } from '@hooks/useBusiness'
import ManageUsers from './ManageUsers'
import EditUser from './EditUser'
import EditNotifications from './EditNotifications'

const Settings = () => {
  const { mainOpt, setMainOpt, subOpt } = useBusiness()

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
          {mainOpt === 'Manage Accounts' && subOpt === 'None'  && <ManageUsers />}
          {mainOpt === 'Manage Accounts' && subOpt === 'Edit User'  && <EditUser />}
          {mainOpt === 'Notifications' && <EditNotifications />}
        </Container>
      </div>
    </div>
  )
}



export default Settings