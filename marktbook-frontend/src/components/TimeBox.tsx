import { format } from 'date-fns'
import IconBox from '@components/IconBox'
import { useState, useEffect } from 'react'
import icons from '@assets/icons'
import '@styles/time-box.scss'


const TimeBox = () => {
  const [date, setDate] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(Date.now())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const time = format(date, 'hh:mm a').split(' ')

  return (
    <div className="time-box" >
      <IconBox src={icons.time} clName="time-bar "/>
      <div className='time-text'>
        <div className="time"> {time[0]}</div>
        <div className="time-prefix">{time[1]}</div>
      </div>
    </div>
  )
}

export default TimeBox