import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import NewUser from '@features/business/NewUser'
import Notify from '@components/Notify'
import { useContacts } from '@hooks/useContacts'


const ManageCustomers = () => {
  const { clearError, mainOpt, setSubOpt, customers, success, error, fetchCustomer, customer } = useContacts()
  const [show, setShow] = useState(false)

  const handleNewUser = () => {
    clearError()
    setShow(true)
  }

  useEffect(() => {
    if( mainOpt === 'Customers' && customer) {
      setSubOpt('Edit Customer')
    }
  }, [mainOpt, setSubOpt, customer])


  return(
    <Container>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <NewUser show={show} setShow={setShow} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Customer Accounts</div>
          <div className="desc">Manage customer accounts associated with this business</div>
        </div>
        <div className="new-user">
          <Button variant='primary'onClick={handleNewUser} >Add New Customer</Button>
        </div>
      </div>

      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Business Name</th>
              <th>Customer Type</th>
            </tr>
          </thead>
          <tbody>
            {customers.length ?
              customers.map((customer, idx) => (
                <tr key={idx} onClick={() => fetchCustomer(customer._id)}>
                  <td className='body-row'>{customer?.name}</td>
                  <td>{customer?.businessName}</td>
                  <td>{customer?.customerType}</td>
                </tr>
              ))
              :
              (
                <tr>
                  <td colSpan={3} className="no-user">No customer found</td>
                </tr>
              )
            }
          </tbody>
        </table>

      </Container>
    </Container>
  )
}

export default ManageCustomers


