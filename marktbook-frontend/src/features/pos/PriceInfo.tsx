import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { usePos } from '@hooks/usePos'
import ConfirmAction from '@components/ConfimAction'
import '@styles/price-info.scss'


const PriceInfo = () => {
  const { cartItems, priceInfo, updateDiscount } = usePos()
  const [show, setShow] = useState(false)
  const [payInfo, setpayInfo] = useState({})

  const clearPay = () => {
    setShow(false)
    setpayInfo({})
  }

  const payinfo = {
    amount: priceInfo.total,
    method: 'Cash',
    payment: true,
    salesId: 1234567,
    clearPay
  }

  const handlePay = () => {
    setpayInfo(payinfo)
    setShow(true)
  }

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
            value={priceInfo.discount.toFixed(2)}
            type='text'
            onChange={(e) =>  updateDiscount(parseFloat(e.target.value))}
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
          <option value="Card">Card</option>
          <option value="BankTransfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
        </Form.Select>
        <Button variant="secondary"
          disabled={cartItems.length===0}
          onClick={() => setShow(true)}>Clear</Button>
      </div>
      <div className="pay-btn">
        <Button variant="primary"
          disabled={cartItems.length===0}
          onClick={handlePay}>
          {priceInfo.total? `Payment - ${priceInfo.total.toFixed(2)}`: 'Payment'}
        </Button>
      </div>
      <ConfirmAction
        handleClose={() => setShow(false)}
        show={show}
        message='This action will clear the cart'
        {...payInfo}
      />
    </>
  )
}

export default PriceInfo