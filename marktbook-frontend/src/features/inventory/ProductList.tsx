import { Product } from '@typess/pos'
import noImg from '@assets/images/file.png'

interface PLProps {
    product?: Product
    products?:  Product[]
}

const ProductList = ({ product, products }: PLProps) => {

  return(
    <div className="product-info">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {product &&
        <tr>
          <td className='body-row'>
            <img src={product?.productImage ? product.productImage : noImg} alt="" className="prd-img" />
            <span className="prdname">{product?.productName}</span>
          </td>
          <td>{product?.sku?? '-'}</td>
          <td>{product?.stock? product.stock.unitsAvailable?? '0' : '-'}</td>
        </tr>}
          {products &&
         products.map((product, idx) => (
           <tr key={idx}>
             <td className='body-row'>
               <img src={product?.productImage ? product.productImage : noImg} alt="" className="prd-img" />
               <span className="prdname">{product?.productName}</span>
             </td>
             <td>{product?.sku?? '-'}</td>
             <td>{product?.stock? product.stock.unitsAvailable?? '0' : '-'}</td>
           </tr>
         ))}
        </tbody>
      </table>
    </div>
  )}


export default ProductList