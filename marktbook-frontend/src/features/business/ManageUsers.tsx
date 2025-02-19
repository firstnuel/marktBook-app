import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useBusiness } from '@hooks/useBusiness'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'
import { useEffect, useState } from 'react'
import NewUser from './NewUser'
import { getLastSeen } from '@utils/helpers'
import Notify from '@components/Notify'
import './index.scss'


const ManageUsers = () => {
  const { users, clearError, success, user, error, setSubOpt, fetchUser, mainOpt } = useBusiness()
  const [show, setShow] = useState(false)

  const handleNewUser = () => {
    clearError()
    setShow(true)
  }

  useEffect(() => {
    if( mainOpt === 'Manage Accounts' && user) {
      setSubOpt('Edit User')
    }
  }, [mainOpt, setSubOpt, user])


  return(
    <Container>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <NewUser show={show} setShow={setShow} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">User Accounts</div>
          <div className="desc">Manage user accounts associated with this business</div>
        </div>
        <div className="new-user">
          <Button variant='primary'onClick={handleNewUser} >Add New User</Button>
        </div>
      </div>

      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Last Seen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length ?
              users.map((user, idx) => (
                <tr key={idx} onClick={() => fetchUser(user._id)}>
                  <td className='body-row'>
                    <img src={user?.profilePicture ? user.profilePicture : icons.user}
                      alt="User profile pic" style={style}
                    />
                    <span className="prdname">{user?.name}</span>
                  </td>
                  <td>{user?.username}</td>
                  <td>{user?.role}</td>
                  <td>{getLastSeen(user.lastLogin)}</td>
                  <td className='actions'>
                    <div className="cta">
                      <IconBox src={icons.openField}  onClick={() => fetchUser(user._id)} clName='view'/>
                    </div>
                  </td>
                </tr>
              ))
              :
              (
                <tr>
                  <td colSpan={3} className="no-user">No user found</td>
                </tr>
              )
            }
          </tbody>
        </table>

      </Container>
    </Container>
  )
}

export default ManageUsers


const style ={
  marginRight: '1em',
  border: '2px solid #898989',
  borderRadius: '50%',
  height: '2.5em',
  width: '2.5em',
}