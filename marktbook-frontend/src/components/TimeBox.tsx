import { format } from 'date-fns'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import '@styles/time-box.scss'


const date =  Date.now()
const time = format(date, 'hh:mm a').split(' ')


const TimeBox = () => (
  <div className="time-box" >
    <IconBox src={icons.time} clName="time-bar "/>
    <div className='time-text'>
      <div className="time"> {time[0]}</div>
      <div className="time-prefix">{time[1]}</div>
    </div>
  </div>
)

export default TimeBox