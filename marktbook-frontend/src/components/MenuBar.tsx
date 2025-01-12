import { useState } from 'react'
import IconBox from '@components/IconBox'
import MenuOption from '@components/MenuOption'
import MenuBarUser from '@components/MenuBarUser'
import icons from '@assets/icons'
import '@styles/menu-bar.scss'



const MenuBar = () => {
  const[showBar, setShowBar] = useState(false)
  const[logout, setLogout] = useState(false)

  const handleClose = () => setShowBar(false)
  const handleShow = () => setShowBar(true)
  const handleLogout = () => setLogout(!logout)

  return(
    <>
      {!showBar &&
        <IconBox src={icons.menu} clName="menu-icon-div"
          imgClName="menu-icon" onClick={handleShow} />
      }

      <div className={`menu-bar ${showBar ? 'open' : ''}`}>
        <MenuBarUser name='Emmanuel Okechukwu' role='Owner' closeFn={handleClose} />
        <div className="menu-options">
          <MenuOption option='Point of Sales' icon={icons.pos} />
          <MenuOption option='Inventory' icon={icons.inventory} />
          <MenuOption option='Transactions' icon={icons.transactions} />
          <MenuOption option='Reports' icon={icons.reports} />
          <MenuOption option='Stock' icon={icons.stock} />
          <MenuOption option='Contacts' icon={icons.contacts} />
          <MenuOption option='Manage Accounts' icon={icons.accounts} />
          <MenuOption option='Settings' icon={icons.settings} />

        </div>
        <div className="log-out-div">
          <div className="log-out" onClick={handleLogout} >
            <IconBox src={icons.logout} clName="logout-bar " onClick={handleLogout} />
            <div className='logout-text'>Log Out</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuBar