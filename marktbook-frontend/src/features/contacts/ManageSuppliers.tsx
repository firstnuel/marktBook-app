import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import NewSupplier from './NewSupplier'
import Notify from '@components/Notify'
import { useContacts } from '@hooks/useContacts'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'

const ManageSuppliers = () => {
  const {
    clearError,
    mainOpt,
    setSubOpt,
    suppliers,
    success,
    error,
    fetchSupplier,
    supplier } = useContacts()
  const [show, setShow] = useState(false)

  const handleNewUser = () => {
    clearError()
    setShow(true)
  }

  useEffect(() => {
    if( mainOpt === 'Suppliers' && supplier) {
      setSubOpt('Edit Supplier')
    }
  }, [mainOpt, setSubOpt, supplier])

  return(
    <Container>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <NewSupplier show={show} setShow={setShow} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Supplier Accounts</div>
          <div className="desc">Manage supplier accounts associated with this business</div>
        </div>
        <div className="new-user">
          <Button variant='primary' onClick={handleNewUser}>Add New Supplier</Button>
        </div>
      </div>

      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company Name</th>
              <th>Supplier Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length ?
              suppliers.map((supplier, idx) => (
                <tr key={idx}>
                  <td className='body-row'>{supplier?.name}</td>
                  <td>{supplier?.companyName ?? '-'}</td>
                  <td>{supplier?.supplierType}</td>
                  <td className='actions'>
                    <div className="cta">
                      <IconBox src={icons.openField} onClick={() => fetchSupplier(supplier._id)} clName='view'/>
                    </div>
                  </td>
                </tr>
              ))
              :
              (
                <tr>
                  <td colSpan={3} className="no-user">No supplier found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </Container>
    </Container>
  )
}

export default ManageSuppliers
