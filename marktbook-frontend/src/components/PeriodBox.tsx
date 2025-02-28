import { useState } from 'react'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import '@styles/date-box.scss'



const PeriodBox = () => {
  const [show, setShow] = useState(false)
  const [period, setPeriod] = useState('Daily')
  const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly']

  return (
    <>
      <div className="date-box" >
        <div className='date-text' onClick={() => setShow(!show)}>{period}</div>
        <IconBox src={icons.date} onClick={() => setShow(!show)} clName="date-bar "/>
      </div>
      {show &&
      <div className="select-div">
        {periods.map(prd => (
          <div key={prd}
            onClick={() => {
              setPeriod(prd)
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