import MenuBar from '@components/MenuBar'
import TimeBox from '@components/TimeBox'
import DateBox from '@components/DateBox'
import '@styles/header-info.scss'

interface HeaderInfoProps {
    secName: string;
    subSecName: string;
}

const HeaderInfo = ({ secName, subSecName }: HeaderInfoProps) => {


  return (
    <div className="header-info">
      <div className="menu-section">
        <MenuBar />
        <div className="sec-name-div">
          <span className='sec-name'>{secName}/</span>
          <span className='sub-sec-name'>{subSecName}</span>
        </div>
      </div>
      <div className="date-time">
        <DateBox />
        <span className="seperator">-</span>
        <TimeBox />
      </div>
    </div>
  )
}

export default HeaderInfo