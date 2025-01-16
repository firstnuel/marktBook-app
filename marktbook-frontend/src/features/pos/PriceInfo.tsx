import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { usePos } from '@hooks/usePos'
import '@styles/price-info.scss'
import { useState } from 'react'

const PriceInfo = () => {
  const { clearCart, priceInfo, updateDiscount } = usePos()
  const [discount, setDiscount] = useState(priceInfo.discount.toFixed(2))


  return(
    <>
      <div className="subtotal-info">
        <div className="subtotal">Subtotal</div>
        <div className="amount-info">
          <div className="currency">$</div>
          <div className="sb-price">{`${priceInfo.subtotal.toFixed(2)}`}</div>
        </div>
      </div>
      <div className="tax-info">
        <div className="tax-percent">Tax (10%)</div>
        <div className="amount-info">
          <div className="tx-currency">$</div>
          <div className="tx-price">{`${priceInfo.tax.toFixed(2)}`}</div>
        </div>
      </div>
      <div className="discount-info">
        <div className="discount">Discount</div>
        <div className="amount-info">
          <div className="dc-currency">-</div>
          <Form.Control
            value={discount}
            type='text'
            onChange={(e) => setDiscount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateDiscount(parseFloat(discount))}
            }}
          />
        </div>
      </div>
      <div className="total-info">
        <div className="total">Total</div>
        <div className="amount-info">
          <div className="currency">$</div>
          <div className="tt-price">{`${priceInfo.total.toFixed(2)}`}</div>

        </div>
      </div>
      <div className="payment-option">
        <Form.Select>
          <option>Payment method</option>
        </Form.Select>
        <Button variant="danger" onClick={() => clearCart()}>Cancel</Button>
      </div>
      <div className="pay-btn">
        <Button variant="success">
          {priceInfo.total? `Payment - ${priceInfo.total.toFixed(2)}`: 'Payment'}
        </Button>
      </div>
    </>
  )
}


export default PriceInfo