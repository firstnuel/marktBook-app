import IconBox from '@components/IconBox'
import icons from '@assets/icons'


interface InfoProps {
    name: string;
    salesId: number | string
}

const CustomerInfo = ({ name, salesId }: InfoProps) => {

  return(

    <div className="customer-info">
      <IconBox clName='receipt-img' src={icons.receipt} title='Generate Invoice'/>
      <div className='name-trans-id'>
        <div className="customer-name">{name}</div>
        <div className="trans-id">{`Sales Id #${salesId}`}</div>
      </div>
      <IconBox clName='edit-customer' src={icons.edit} title='Edit' />
    </div>


  )
}

export default CustomerInfo