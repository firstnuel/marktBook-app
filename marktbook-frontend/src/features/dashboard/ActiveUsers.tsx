import '@styles/fav-prd.scss'
import testImage from '@assets/images/file.png'
import { useBusiness } from '@hooks/useBusiness'


const ActiveUsers = () => {
  const { users } = useBusiness()
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  return (


    <div className="fav-prd s-div">
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Users</div>
      </div>
      <table>
        <thead>
          <tr>
            <th><span>Img</span></th>
            <th><span>Name</span></th>
            <th><span>Active</span></th>
          </tr>
        </thead>
        <tbody>
          {(users || []).map((user, idx) =>
            (<tr key={idx}>
              <td>
                <div className="pd-img">
                  <img src={user.profilePicture ?? testImage} alt="" />
                </div>
              </td>
              <td>
                <div className="name-av">{user.name}</div>
              </td>
              <td>
                <div className={new Date(user.lastLogin) > oneHourAgo ? 'uactive' : 'uinactive'}></div>
              </td>
            </tr>)
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ActiveUsers