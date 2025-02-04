import { usePos } from '@hooks/usePos'
import styles from '@styles/confirm-action.module.scss'
import Button from 'react-bootstrap/Button'

interface ActionProps {
  handleClose: () => void;
  show: boolean;
  message?: string;
  payment?: boolean;
  amount?: number;
  salesId?: number;
  method?: string;
  clearPay?: () => void;
  productId?: string;
  handleDelete?: (productID: string) => void;
}

const ConfirmAction = ({
  show,
  handleClose,
  clearPay,
  productId,
  handleDelete,
  message,
  payment,
  amount,
  salesId,
  method,
}: ActionProps) => {
  const { clearCart } = usePos()

  const handleCart = () => {
    clearCart()
    handleClose()
  }

  if (!show) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{payment ? `Confirm Payment of $${amount}?` : 'Confirm Action?'}</h2>
          <button className={styles.closeButton} onClick={payment ? clearPay : handleClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>
          {payment ? (
            <>
              <p>
                {`You are about to process a payment of $${amount} for salesID #${salesId}.`}<br />
                {`Payment method: ${method}.`}<br />
              </p>
              {method === 'Cash' && <p>Ensure you have collected the cash before confirming.</p>}
            </>
          ) : (
            <p>{message}</p>
          )}
        </div>
        <div className={styles.footer}>
          <Button variant="secondary" onClick={payment ? clearPay : handleClose}>
            Close
          </Button>
          {productId ? (
            <Button variant="danger" onClick={() => handleDelete?.(productId)}>
              Delete Product
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCart}>
              {!payment
                ? 'Confirm'
                : method === 'Cash'
                  ? 'Cash Collected'
                  : `Process Payment - $${amount}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfirmAction