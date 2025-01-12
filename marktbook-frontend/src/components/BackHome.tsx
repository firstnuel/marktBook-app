import { NavLink } from 'react-router'
import icons from '@assets/icons'



const BackHome = () => (

  <div className="back-home">
    <NavLink to='/' className="home-link">
      <img src={icons.arrowback} alt="Back to homepage arrow icon" />
    </NavLink>
    <NavLink to='/' className="home-link">
      <p>Back to home</p>
    </NavLink>
  </div>
)

export default BackHome