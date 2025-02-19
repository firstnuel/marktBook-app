import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { cutName } from '@utils/helpers'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import { useState, CSSProperties } from 'react'
import { useBusiness } from '@hooks/useBusiness'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from 'react-router'


interface MBUProps {
    name: string;
    role: string;
    closeFn: ()=> void;
    userImg: string
}


export const MenuBarUser = ({ name, role, closeFn, userImg }: MBUProps) => {
  const [show, setShow] = useState(false)
  const { setUser } = useBusiness()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleEdit = () => {
    if (user) {
      setUser(user)
      navigate('/settings')
      closeFn()
      setShow(false)
    }
  }

  const handleLogout = () => {
    logout()
    closeFn()
    navigate('/login')
    setShow(false)
  }

  return (
    <div className="user-info-div">
      <div className="user-info">
        <div className="user-details">
          {userImg ?
            <img src={userImg} alt="User profile pic" className='useprofile-img' />
            :
            <IconBox src={icons.user} clName="user-img" />
          }
          <div className="user-name-role">
            <div className="user-name">{cutName(name)}</div>
            <div className="user-role">{role}</div>
          </div>
        </div>
        <IconBox src={icons.arrowDropDown} clName="user-menu" onClick={() => setShow(!show)}
          imgClName='usr-icon'/>
      </div>
      {show &&
      <Container className='dropdown-menu show' id='dd-div' style={style}>
        <Dropdown.Item onClick={handleEdit}>Edit Account</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
      </Container>}
      <IconBox src={icons.close} clName="close-bar" title='Close Bar' onClick={closeFn} />
    </div>
  )
}


export default MenuBarUser


const style: CSSProperties = {
  width: '55%',
  height: '5em',
  fontSize: '.8em',
  position: 'absolute',
  top: '7%',
  left: '15%',
  borderRadius: '.3em'
}