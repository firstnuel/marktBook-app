import { useState } from 'react'
import IconBox from '@components/IconBox'
import MenuOption from '@components/MenuOption'
import MenuBarUser from '@components/MenuBarUser'
import icons from '@assets/icons'
import '@styles/menu-bar.scss'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from 'react-router'

const MenuBar = () => {
  const [showBar, setShowBar] = useState(false)
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleClose = () => setShowBar(false)
  const handleShow = () => setShowBar(true)
  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/login')

  }

  return (
    <>
      {/* Menu Icon */}
      <IconBox
        src={icons.menu}
        clName="menu-icon-div"
        imgClName="menu-icon"
        onClick={handleShow}
      />

      {/* Overlay */}
      {showBar && <div className="overlay" onClick={handleClose}></div>}

      {/* Menu Bar */}
      <div className={`menu-bar ${showBar ? 'open' : ''}`}>
        <MenuBarUser name={user?.name || 'Unknown'} role={user?.role || 'Unknown'} closeFn={handleClose} />
        <div className="menu-options">
          <MenuOption handleClose={handleClose} option="Point of Sales" icon={icons.pos} to='/pos' />
          <MenuOption handleClose={handleClose} option="Inventory" icon={icons.inventory} to='/inventory'/>
          <MenuOption handleClose={handleClose} option="Transactions" icon={icons.transactions} to='/transactions' />
          <MenuOption handleClose={handleClose} option="Reports" icon={icons.reports} to='/reports' />
          <MenuOption handleClose={handleClose} option="Stock" icon={icons.stock} to='/stock' />
          <MenuOption handleClose={handleClose} option="Contacts" icon={icons.contacts} to='/contacts' />
          <MenuOption handleClose={handleClose} option="Manage Accounts" icon={icons.accounts} to='/accounts'/>
          <MenuOption handleClose={handleClose} option="Settings" icon={icons.settings} to='/settings' />
        </div>
        <div className="log-out-div">
          <div className="log-out" onClick={handleLogout}>
            <IconBox src={icons.logout} clName="logout-bar" onClick={handleLogout} />
            <div className="logout-text">Log Out</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuBar
