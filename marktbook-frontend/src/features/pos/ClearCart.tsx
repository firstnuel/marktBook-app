import { usePos } from '@hooks/usePos'
import styles from '@styles/confirm-action.module.scss'
import Button from 'react-bootstrap/Button'

interface ActionProps {
  handleClose: () => void;
  show: boolean;
}

const ClearCart = ({ show, handleClose }: ActionProps) => {
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
          <h2>Confirm Clear Cart?</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>
          <p>Are you sure you want to clear the cart?</p>
        </div>
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCart}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ClearCart
