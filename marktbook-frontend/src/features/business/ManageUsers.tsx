import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useBusiness } from '@hooks/useBusiness'
import icons from '@assets/icons'


const ManageUsers = () => {
  const { users } = useBusiness()


  return(
    <Container>
      <div className="head-info">
        <div className="name-desc">
          <div className="name">User Accounts</div>
          <div className="desc">Manage user accounts associated with this business</div>
        </div>
        <div className="new-user">
          <Button variant='primary'>Add New User</Button>
        </div>
      </div>

      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length ?
              users.map((user, idx) => (
                <tr key={idx}>
                  <td className='body-row'>
                    <img src={user?.profilePicture ? user.profilePicture : icons.user} alt="" className="userr-img" />
                    <span className="prdname">{user?.name}</span>
                  </td>
                  <td>{user?.username}</td>
                  <td>{user?.role}</td>
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