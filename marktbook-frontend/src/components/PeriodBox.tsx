import { useState } from 'react'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import '@styles/date-box.scss'
import { useDashboard } from '@hooks/useDashboard'
import { QueryPeriod } from '@typess/dashboard'


const PeriodBox = () => {
  const [show, setShow] = useState(false)
  const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly']
  const { setPeriod, period } = useDashboard()

  return (
    <>
      <div className="date-box" >
        <div className='date-text' onClick={() => setShow(!show)}>
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </div>
        <IconBox src={icons.date} onClick={() => setShow(!show)} clName="date-bar "/>
      </div>
      {show &&
      <div className="select-div">
        {periods.map(prd => (
          <div key={prd}
            onClick={() => {
              setPeriod(prd.toLowerCase() as QueryPeriod)
              setShow(false)
            }}
            className="opt">{prd}</div>
        ) )}

      </div>
      }
    </>

  )
}

export default PeriodBox