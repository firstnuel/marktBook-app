import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'
import { useContacts } from '@hooks/useContacts'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'
import { useStocks } from '@hooks/useStocks'
import { useEffect } from 'react'

const ViewSuppliers = () => {
  const { suppliers, } = useContacts()
  const { clearError, success, error, fetchStockBySupplier, mainOpt, bySupplier, setSubOpt } = useStocks()

  useEffect(() => {
    if (mainOpt === 'Stocks By Supplier' && bySupplier.length) {
      setSubOpt('BySupplier List')
    }
  }, [bySupplier.length, mainOpt, setSubOpt])


  return(
    <Container>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">All Suppliers</div>
        </div>
      </div>

      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length ?
              suppliers.map((supplier, idx) => (
                <tr key={idx}>
                  <td className='body-row'>{supplier?.name}</td>
                  <td>{supplier?.companyName ?? '-'}</td>
                  <td className='actions'>
                    <div className="cta">
                      <IconBox src={icons.openField} onClick={() => fetchStockBySupplier(supplier._id)} clName='view'/>
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

export default ViewSuppliers
