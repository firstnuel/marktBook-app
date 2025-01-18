import IconBox from '@components/IconBox'
import { useNavigate } from 'react-router'

interface MenuOptionProps {
    icon: string;
    option: string;
    className?: string;
    to: string;
    handleClose: () => void
}

const MenuOption = ({ className, icon, option, to, handleClose }: MenuOptionProps) => {

  const navigate = useNavigate()
  const handleNavigate = () => {
    handleClose()
    navigate(to)
  }


  return (
    <div className={`${className} menu-option`} onClick={handleNavigate}>
      <IconBox src={icon} clName="opt-img" imgClName='opt-icons'/>
      <div className='option-text'> {option} </div>
    </div>

  )
}


export default MenuOption

