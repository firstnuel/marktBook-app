import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { usePos } from '@hooks/usePos'
import ClearCart from '@features/pos/ClearCart'
import '@styles/price-info.scss'
import { getCurrencySymbol } from '@utils/helpers'
import { useBusiness } from '@hooks/useBusiness'
import { PaymentMethod } from '@typess/pos'
import ProcessPayment from './ProcessPayment'
import Notify from '@components/Notify'
import { useTrans } from '@hooks/useTrans'


const PriceInfo = () => {
  const { cartItems, priceInfo, updateDiscount, selectPaymentMethod } = usePos()
  const { clearError, success, error } = useTrans()
  const { business } = useBusiness()
  const [clearCart, setClearCart] = useState(false)
  const [processPayment, setProcessPayment] = useState(false)

  return(
    <>
      <Notify error={error} success={success} clearErrFn={clearError}/>
      <div className="subtotal-info">
        <div className="subtotal">Subtotal</div>
        <div className="amount-info">
          <div className="currency">{getCurrencySymbol(business!.currency?? 'USD')}</div>
          <div className="sb-price">{`${priceInfo.subtotal.toFixed(2)}`}</div>
        </div>
      </div>
      <div className="tax-info">
        <div className="tax-percent">{`Tax (${business?.taxRate ?? 10}%)`}</div>
        <div className="amount-info">
          <div className="tx-currency">{getCurrencySymbol(business!.currency?? 'USD')}</div>
          <div className="tx-price">{`${priceInfo.tax.toFixed(2)}`}</div>
        </div>
      </div>
      <div className="discount-info">
        <div className="discount">Discount</div>
        <div className="amount-info">
          <div className="dc-currency">{getCurrencySymbol(business!.currency?? 'USD')}</div>
          <Form.Control
            value={priceInfo.discount.toFixed(2)}
            type='text'
            onChange={(e) => updateDiscount(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="total-info">
        <div className="total">Total</div>
        <div className="amount-info">
          <div className="currency">{getCurrencySymbol(business!.currency?? 'USD')}</div>
          <div className="tt-price">{`${priceInfo.total.toFixed(2)}`}</div>
        </div>
      </div>
      <div className="payment-option">
        <Form.Select value={priceInfo.paymentMethod}
          onChange={(e) => selectPaymentMethod(e)}>
          {Object.values(PaymentMethod).map((method, idx) => (
            <option key={idx} value={method}>{method}</option>
          ))}
        </Form.Select>
        <Button variant="secondary"
          disabled={cartItems.length===0}
          onClick={() => setClearCart(true)}>Clear</Button>
      </div>
      <div className="pay-btn">
        <Button variant="primary"
          disabled={cartItems.length===0}
          onClick={() => setProcessPayment(true)}>
          {priceInfo.total? `Payment - ${getCurrencySymbol(business!.currency?? 'USD')}${priceInfo.total.toFixed(2)}`: 'Payment'}
        </Button>
      </div>
      <ClearCart
        handleClose={() => setClearCart(false)}
        show={clearCart} />
      <ProcessPayment
        handleClose={() => setProcessPayment(false)}
        show={processPayment} />
    </>
  )
}

export default PriceInfo