import { useStocks } from '@hooks/useStocks'
import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'


const LowStockList = () => {
  const { lowStocks, error, success, clearError } = useStocks()

  return (
    <Container className="whole">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="head-name">⚠️ Low Stock List</div>
      </div>
      <div className="cat-content">
        <div className="product-info">
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
                      <td className="prdname">{stock.product}</td>
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
