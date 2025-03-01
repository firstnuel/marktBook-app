import '@styles/fav-prd.scss'
import testImage from '@assets/images/file.png'


const ActiveUsers = () => (


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
        <tr>
          <td>
            <div className="pd-img">
              <img src={testImage} alt="" />
            </div>
          </td>
          <td>
            <div className="name-av">Emmanuel Ikwunna</div>
          </td>
          <td>
            <div className='apoint'></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)


export default ActiveUsers