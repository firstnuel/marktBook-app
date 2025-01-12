import IconBox from '@components/IconBox'

interface MenuOptionProps {
    icon: string;
    option: string;
    className?: string;
    onClick?: ()=> void;
}

const MenuOption = ({ className, icon, option, onClick }: MenuOptionProps) => (
  <div className={`${className} menu-option`} onClick={onClick}>
    <IconBox src={icon} clName="opt-img" imgClName='opt-icons'/>
    <div className='option-text'> {option} </div>
  </div>

)


export default MenuOption

