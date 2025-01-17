import { usePos } from '@hooks/usePos'
import styles from '@styles/confirm-action.module.scss'

interface ActionProps {
  handleClose: () => void;
  show: boolean;
  message?: string;
  payment?: boolean;
  amount?: number;
  salesId?: number;
  method?: string;
  clearPay?: () => void;
}

const ConfirmAction = ({ show, handleClose, clearPay, message, payment, amount, salesId, method }: ActionProps) => {
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
            <p>
              {`You are about to process a payment of $${amount} for salesID #${salesId}.`}<br />
              {`Payment method: ${method}.`}<br />
              {method === 'Cash' && <p>Ensure you have collected the cash before confirming.</p>}
            </p>
          ) : (
            <p>{message}</p>
          )}
        </div>
        <div className={styles.footer}>
          <button className={styles.secondaryButton} onClick={payment ? clearPay : handleClose}>
            Close
          </button>
          <button className={styles.primaryButton} onClick={handleCart}>
            {!payment
              ? 'Confirm'
              : method === 'Cash'
                ? 'Cash Collected'
                : `Process Payment - $${amount}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmAction
