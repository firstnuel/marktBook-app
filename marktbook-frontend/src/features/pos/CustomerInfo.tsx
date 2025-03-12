import { useState, useEffect } from 'react'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { usePos } from '@hooks/usePos'
import { cutName } from '@utils/helpers'

const CustomerInfo = () => {
  const { customer, rmCustomer } = usePos()
  const [salesId, setSalesId] = useState<number | string>('')

  useEffect(() => {
    setSalesId(Math.floor(100000 + Math.random() * 900000))
  }, [])

  return (
    <div className="customer-info">
      <IconBox clName='receipt-img' src={icons.user} />
      <div className='name-trans-id'>
        <div className="customer-name">{customer?.name ? cutName(customer.name) : 'Unnamed Customer'}</div>
        <div className="trans-id">{`Sales Id #${salesId}`}</div>
      </div>
      <IconBox clName='edit-customer' onClick={rmCustomer} src={icons.edit} title='Remove' />
    </div>
  )
}

export default CustomerInfo
