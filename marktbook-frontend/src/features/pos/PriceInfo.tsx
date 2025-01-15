import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import '@styles/price-info.scss'

const PriceInfo = () => {



  return(
    <>
      <div className="subtotal-info">
        <div className="subtotal">Subtotal</div>
        <div className="amount-info">
          <div className="currency">$</div>
          <div className="sb-price">5.00</div>
        </div>
      </div>
      <div className="tax-info">
        <div className="tax-percent">Tax (10%)</div>
        <div className="amount-info">
          <div className="tx-currency">$</div>
          <div className="tx-price">2.00</div>
        </div>
      </div>
      <div className="discount-info">
        <div className="discount">Discount</div>
        <div className="amount-info">
          <div className="dc-currency">-</div>
          <Form.Control type="text" value={'2.00'} />
        </div>
      </div>
      <div className="total-info">
        <div className="total">Total</div>
        <div className="amount-info">
          <div className="currency">$</div>
          <div className="tt-price">5.00</div>

        </div>
      </div>
      <div className="payment-option">
        <Form.Select>
          <option>Payment method</option>
        </Form.Select>
        <Button variant="danger">Cancel</Button>
      </div>
      <div className="pay-btn">
        <Button variant="success">Payment</Button>
      </div>
    </>
  )
}


export default PriceInfo