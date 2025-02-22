import { useStocks } from '@hooks/useStocks'
import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'
import Loading from '@components/Spinner'
import { formatDate } from '@utils/helpers'

const StockMovements = () => {
  const { movements, error, success, clearError, loading } = useStocks()

  return (
    <Container className="whole">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="head-name">📦 Stock Movements</div>
      </div>
      <div className="cat-content">
        <div className="product-info">
          {loading && <Loading />}
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Destination</th>
                <th>By</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {movements && movements.length > 0 ? (
                movements.map((movement, idx) => (
                  <tr key={idx}>
                    <td className="prdname">{movement.product}</td>
                    <td>{movement.movementType}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.destination}</td>
                    <td>{movement.initiatedBy}</td>
                    <td>{movement.reason}</td>
                    <td>{formatDate(movement.timestamp.toString())}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-user">No stock movements found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  )
}

export default StockMovements
