import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import '@styles/date-box.scss'



const DateBox = () => {
  const [date, setDate] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(Date.now())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = format(date, 'EEE, dd MMM yyyy')

  return (
    <div className="date-box" >
      <IconBox src={icons.date} clName="date-bar "/>
      <div className='date-text'>{formatDate}</div>
    </div>
  )
}

export default DateBox