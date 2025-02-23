import { useStocks } from '@hooks/useStocks'
import Container from 'react-bootstrap/Container'
import './index.scss'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'
import Notify from '@components/Notify'
import Loading from '@components/Spinner'


const StocksBySupplier = () => {
  const { bySupplier, success, clearError, loading, resetSupplier } = useStocks()

  const handleClose = () => {
    resetSupplier()
  }

  return(

    <Container className="whole">
      <Notify clearErrFn={clearError} success={success}  />
      <div className="head-info">
        <div className="head-name"> Stocks supplied by {bySupplier[0].supplier}</div>
        <div className="back"  onClick={handleClose}>
          <IconBox src={icons.arrowback} clName="img-div" />
          <span className="text">Back</span>
        </div>
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
                <th>Max Qty</th>
              </tr>
            </thead>
            <tbody>
              {bySupplier ?
                bySupplier.map((stock, idx) => {

                  return (
                    <tr key={idx}>
                      <td className="prdname">{stock.product}</td>
                      <td>{stock.location}</td>
                      <td>{stock.compartment}</td>
                      <td> {stock.unitsAvailable}</td>
                      <td>{stock.minQuantity}</td>
                      <td>{stock.maxQuantity}</td>
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

export default StocksBySupplier