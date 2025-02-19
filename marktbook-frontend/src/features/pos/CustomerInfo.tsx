import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { usePos } from '@hooks/usePos'
import { cutName } from '@utils/helpers'


interface InfoProps {

    salesId: number | string
}

const CustomerInfo = ({ salesId }: InfoProps) => {
  const { customer, rmCustomer } = usePos()

  return(

    <div className="customer-info">
      <IconBox clName='receipt-img'  src={icons.receipt} title='Generate Invoice'/>
      <div className='name-trans-id'>
        <div className="customer-name">{customer?.name ?  cutName(customer.name) : 'Unnamed Customer'}</div>
        <div className="trans-id">{`Sales Id #${salesId}`}</div>
      </div>
      {<IconBox clName='edit-customer' onClick={rmCustomer} src={icons.edit} title='Remove' />}
    </div>
  )
}

export default CustomerInfo