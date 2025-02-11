import Container from 'react-bootstrap/Container'
import HeaderInfo from '@components/HeaderInfo'
import SecOption from '@components/SecOption'


const Settings = () => {

  return(
    <div className="main-container-inv">
      <HeaderInfo secName='Settings' subSecName={'test'}/>
      <div className='main-con'>
        <Container className='sec'>
          <SecOption name='Business' />
          <SecOption name='Payments' />
          <SecOption name='Manage Accounts' />
          <SecOption name='Notifications' />
        </Container>
        <Container className='sec-show'>

        </Container>
      </div>
    </div>
  )
}



export default Settings