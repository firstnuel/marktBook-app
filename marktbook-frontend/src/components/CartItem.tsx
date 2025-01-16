import { usePos } from '@hooks/usePos'
import IconBox from '@components/IconBox'
import testImage from '@assets/images/file.png'
import { CartItemProps } from '@typess/pos'
import icons from '@assets/icons'
import '@styles/cart-item.scss'


const CartItem = ({ quantity, product }: CartItemProps) => {
  const { addQuantity, subQuantity } = usePos()

  return (
    <>
      { quantity>0 &&
        <div className="item-container">
          <div className="cart-item-details">
            <div className="img-div">
              <img src={product.productImage || testImage} alt="" />
            </div>
            <div className="item-details">
              <div className="item-name">{product.productName}</div>
              <div className="item-price">{`$${product.salePrice}`}</div>
              <IconBox clName="edit-item" src={icons.edit} />
            </div>
          </div>
          <div className="item-quantity">
            <button className="quantity-btn" onClick={() => subQuantity(product.id)}>
          -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-btn" onClick={() => addQuantity(product.id)}>
          +
            </button>
          </div>
        </div>
      }
    </>
  )
}

export default CartItem
