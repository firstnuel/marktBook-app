import IconBox from '@components/IconBox'
import Form from 'react-bootstrap/Form'
import icons from '@assets/icons'

const SelectCustomer = () => {

  return(
    <div className="customer-add-select">
      <Form.Select className='select-customer'>
        <option>Select Customer</option>
      </Form.Select>
      <IconBox clName='new-customer' src={icons.addPerson} title='Add' tt/>
    </div>
  )
}


export default SelectCustomer