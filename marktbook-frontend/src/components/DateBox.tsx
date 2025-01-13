import { format } from 'date-fns'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import '@styles/date-box.scss'


const date =  Date.now()
const formatDate = format(date, 'EEE, dd MMM yyyy')


const DateBox = () => (
  <div className="date-box" >
    <IconBox src={icons.date} clName="date-bar "/>
    <div className='date-text'>{formatDate}</div>
  </div>
)

export default DateBox