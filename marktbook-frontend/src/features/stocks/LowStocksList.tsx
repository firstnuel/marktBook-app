import { useStocks } from '@hooks/useStocks'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Notify from '@components/Notify'
import Loading from '@components/Spinner'


const LowStockList = () => {
  const { lowStocks, error, success, clearError, loading, fetchLowStock } = useStocks()

  return (
    <Container className="whole">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="head-name">⚠️ Low Stock List</div>
        <Button variant='secondary' onClick={() => fetchLowStock()}>Refresh</Button>
      </div>
      <div className="cat-content">
        <div className="product-info">
          {loading && <Loading />}
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Location</th>
                <th>Compartment</th>
                <th>Units Available</th>
                <th>Min Qty</th>
              </tr>
            </thead>
            <tbody>
              {lowStocks ?
                lowStocks.map((stock, idx) => {

                  return (
                    <tr key={idx}>
                      <td className="prdname">{stock.product?.name}</td>
                      <td>{stock.location}</td>
                      <td>{stock.compartment}</td>
                      <td style={{ color: 'red' }}> {stock.unitsAvailable}</td>
                      <td>{stock.minQuantity}</td>
                    </tr>
                  )
                })
                : (<tr>
                  <td colSpan={5} className="no-user">No stock found</td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>

    </Container>


  )
}

export default LowStockList
