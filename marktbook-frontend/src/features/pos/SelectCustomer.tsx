import IconBox from '@components/IconBox'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import icons from '@assets/icons'
import Dropdown from 'react-bootstrap/Dropdown'
import { CSSProperties, useState } from 'react'
import { useField } from '@hooks/useField'
import { Customer } from '@typess/contacts'
import NewCustomer from '@features/contacts/NewCustomer'

interface SelectCustomerProps {
  customers: Customer[]
  selectCustomer: (customer: Customer) => void
}

const SelectCustomer = ({ customers, selectCustomer }: SelectCustomerProps) => {
  const { reset, ...customer } = useField('customer', 'text')
  const [show, setShow] = useState(false)

  // Filter customers based on input value
  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes((customer.value as string).toLowerCase())
  )

  return (
    <div className="customer-add-select">
      <Form.Control
        className='select-customer'
        {...customer}
        placeholder='Search Customer'
      />
      {customer.value && (
        <span style={resetStyle} onClick={() => reset()}>&times;</span>
      )}
      {(customer.value as string).length > 2 && (
        <Container className='dropdown-menu show' id='dd-div' style={style}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <Dropdown.Item
                onClick={() => {
                  selectCustomer(customer)
                  reset()
                }}
                key={customer._id}
              >
                {customer.name}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>Name not found</Dropdown.Item>
          )}
        </Container>
      )}
      <IconBox
        clName='new-customer'
        onClick={() => setShow(true)}
        src={icons.addPerson}
        title='Add'
        tt
      />
      <NewCustomer show={show} setShow={setShow} />
    </div>
  )
}

export default SelectCustomer

const resetStyle: CSSProperties = {
  position: 'absolute',
  right: '6%',
  top: '8.9%',
  fontSize: '1.2em',
  color: 'darkgray',
  cursor: 'pointer'
}

const style: CSSProperties = {
  width: '27%',
  position: 'absolute',
  top: '13.3%'
}