import Button from 'react-bootstrap/Button'
import { FormEvent, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import testImage from '@assets/images/file.png'
import { Product } from '@typess/pos'
import { usePos } from '@hooks/usePos'
import '@styles/product-box.scss'

interface ProductBoxPrpos {
    show: boolean;
    onHide: ()=> void;
    product: Product

}

const ProductBox = ({ show, onHide, product }: ProductBoxPrpos) => {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = usePos()
  const incrementQuantity = () => {
    if ((product.stock?.unitsAvailable ?? 0) > quantity) setQuantity(quantity + 1)}
  const decrementQuantity = () => {
    if (quantity > 0) setQuantity(quantity - 1)
  }

  const handleCart = (e: FormEvent) =>  {
    e.preventDefault()
    addToCart({ product, quantity })
    setQuantity(1)
    onHide()
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className='head.info'>
          {`#${product.sku}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="img-div">
          <img src={product.productImage || testImage} alt="" />
        </div>
        <div className={product.stock?.unitsAvailable? 'availability' : 'unavailability'}>
          <span className={product.stock?.unitsAvailable? 'availability-text' : 'unavailability-text'}>
            {product.stock?.unitsAvailable? 'In Stock' : 'Out of Stock'}
          </span>
          <span className="units units-red">
            {`${product.stock?.unitsAvailable ?? 0}${product.unit}${(product.stock?.unitsAvailable ?? 0) > 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="name">{product.productName}</div>
        <div className="short-description">{product.shortDescription}</div>
        <div className="price">{`$${product.salePrice.toFixed(2)}`}
          <span className='base-price'>{`$${product.basePrice.toFixed(2)}`}</span>
        </div>
        <div className="location">Location: {product.stock?.compartment ? product.stock?.compartment : 'Unknown'}</div>
        <div className="category">Category: {product.productCategory}</div>
        <div className="type">Type: {product.productType}</div>
        <ul className="attribute">
          { product.attributes.brand && (<li className="attr-item">Brand: {product.attributes.brand}</li>)}
          {product.attributes.color && (<li className="attr-item">Color: {product.attributes.color}</li>)}
          {product.attributes.manufacturer && (<li className="attr-item">Manufacturer: {product.attributes.manufacturer}</li>)}
          { product.attributes.dimensions &&
         <li className="attr-item">Dimensions:
           <ul className="dimensions">
             {product.attributes.dimensions?.weight && (
               <li className="di-item">Weight: {product.attributes.dimensions?.weight}kg</li>
             )}
             {product.attributes.dimensions?.height && (
               <li className="di-item">Height: {product.attributes.dimensions?.height}cm</li>
             )}
             {product.attributes.dimensions?.width && (
               <li className="di-item">Width: {product.attributes.dimensions?.width}cm</li>
             )}
             {product.attributes.dimensions?.length && (
               <li className="di-item">Length: {product.attributes.dimensions?.length}cm</li>
             )}
           </ul>
         </li>}
        </ul>
        <div className="long-des">Description: <br />{product.longDescription}</div>
      </Modal.Body>
      <Modal.Footer>
        <div className="item-quantity">
          <button
            disabled={(product.stock?.unitsAvailable ?? 0) < 1}
            className="quantity-btn" onClick={decrementQuantity}>
          -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button
            disabled={(product.stock?.unitsAvailable ?? 0) < 1}
            className="quantity-btn" onClick={incrementQuantity}>
          +
          </button>
        </div>
        <Button
          onClick={handleCart}
          disabled={(product.stock?.unitsAvailable ?? 0) < 1}
        >
          {`Add to cart $${product.salePrice.toFixed(2)}`}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProductBox