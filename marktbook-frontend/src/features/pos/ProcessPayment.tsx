import styles from '@styles/confirm-action.module.scss'
import Button from 'react-bootstrap/Button'
import { usePos } from '@hooks/usePos'
import { useBusiness } from '@hooks/useBusiness'
import { getCurrencySymbol } from '@utils/helpers'
import { useTrans } from '@hooks/useTrans'
import Loading from '@components/Spinner'
import { Sale } from '@typess/trans'
import { useStocks } from '@hooks/useStocks'

interface ActionProps {
  handleClose: () => void
  show: boolean
}

const ProcessPayment = ({ show, handleClose }: ActionProps) => {
  const { cartItems, priceInfo, taxRate, customer, clearCart, clearError, fetchProducts } = usePos()
  const { fetchStocks } = useStocks()
  const { loading, success, processSale, rmSale, sale, error, fetchSales } = useTrans()
  const { business } = useBusiness()

  if (!show) return null

  const data = {
    customer: customer?._id || undefined,
    subtotalAmount: priceInfo.subtotal,
    taxAmount: priceInfo.tax,
    taxRate,
    currency: business?.currency || 'USD',
    paymentMethod: priceInfo.paymentMethod,
    discount:
      priceInfo.discount > 0
        ? {
          value: priceInfo.discount,
          type: 'FIXED'
        }
        : undefined,
    saleItems: cartItems.map(({ product, quantity }) => ({
      productId: product._id,
      productName: product.productName,
      productSKU: product.sku,
      unitSalePrice: product.basePrice,
      quantity,
      subtotal: product.basePrice * quantity
    })),
    totalPrice: priceInfo.total,
    businessId: business?._id
  }

  const handlePayment = () => {
    processSale(data as Partial<Sale>)
  }

  const handleRmSale = () => {
    rmSale()
    if (sale) {
      clearCart()
      handleClose()
      fetchStocks()
      fetchProducts()
      clearError()
      fetchSales()}
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{`Confirm Payment of ${priceInfo.total} ${business?.currency}?`}</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className={styles.body}>
          {!loading && !success && !error && (
            <p>
              {priceInfo.paymentMethod === 'CASH' ? (
                `Ensure you have received a cash payment of ${getCurrencySymbol(business?.currency ?? 'USD')}${priceInfo.total} before proceeding.`
              ) : priceInfo.paymentMethod === 'BANK_TRANSFER' ? (
                `An invoice will be generated with account details for a bank transfer of ${priceInfo.total} ${getCurrencySymbol(business?.currency ?? 'USD')}.`
              ) : (
                'No payment terminal is configured for card payments at this time.'
              )}
            </p>
          )}

          {sale && <p className="success">✅ Sale successfully processed.</p>}
          {!customer && !loading && !sale && (
            <p className={styles.warn}>⚠️ No customer information is linked to this sale.</p>
          )}
          {loading && !sale && <Loading />}
          {error && <p className={styles.warn}>❌ {error}</p>}
        </div>

        <div className={styles.footer}>
          {!loading && !sale &&!error && (
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          )}

          {!sale && priceInfo.paymentMethod !== 'CARD' && (
            <Button variant="primary" disabled={loading} onClick={handlePayment}>
              Proceed
            </Button>
          )}

          {(!!sale || !!error) && (
            <Button variant="secondary" onClick={handleRmSale}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProcessPayment
