import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { cutName } from '@utils/helpers'


interface MBUProps {
    name: string;
    role: string;
    closeFn: ()=> void;
    dropDownFn?: ()=> void;
    userImg: string

}


export const MenuBarUser = ({ name, role, closeFn, dropDownFn, userImg }: MBUProps) => (

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
      <IconBox src={icons.arrowDropDown} clName="user-menu" onClick={dropDownFn}
        imgClName='usr-icon'/>
    </div>
    <IconBox src={icons.close} clName="close-bar" title='Close Bar' onClick={closeFn} />
  </div>
)


export default MenuBarUser