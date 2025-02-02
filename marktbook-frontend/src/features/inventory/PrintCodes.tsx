import noImg from '@assets/images/file.png'
import { usePos } from '@hooks/usePos'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import SearchBar from '@components/SearchBar'
import { useField } from '@hooks/useField'
import { useState } from 'react'
import '@styles/print-codes.scss'
import { Product } from '@typess/pos'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import Barcode from 'react-barcode'


const PrintCodes = () => {
  const { products } = usePos()
  const { reset, ...searchProduct } = useField('searchProduct', 'text')
  const [selectValue, setSelectValue] = useState('Product Name')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const searchKeys = ['Product Name', 'SKU', 'Product Tag']
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const handleSelectPrdouct = (product: Product) => {
    setSelectedProduct(product)
    reset()
  }


  const filteredProducts = () => {

    if((searchProduct.value as string).length)  {
      switch (selectValue) {
      case 'Product Name':
        return products.filter(product =>
          product.productName.toLowerCase().includes((searchProduct.value as string).toLowerCase()))
      case 'SKU' :
        return products.filter(product =>
          product.sku === searchProduct.value as string)
      case 'Product Tag' :
        return products.filter(product =>
          product.tags.includes((searchProduct.value as string).toLowerCase()))
      default:
        return products
      }
    }
  }


  const handleSelect = (eventKey: string | null) => {
    if (eventKey !== null)
      setSelectValue(eventKey)
  }

  const handleSearch = () => console.log('Pussy')


  return (
    <Container className="whole">
      <div className="head-info">
        <div className="head-name"> Print Codes </div>
      </div>

      <Container className="search-bar">
        <SearchBar
          value={selectValue}
          onSelect={handleSelect}
          eventKeys={searchKeys}
          useField={searchProduct}
          handleSearch={handleSearch}
          reset={reset}
        />
        {filteredProducts() &&
        <Container className='dropdown-menu show' id='dd-div'>
          { filteredProducts()?.map(product =>
            (<Dropdown.Item
              key={product._id}
              onClick={() => handleSelectPrdouct(product)}
              href="#/productName">{product.productName}
            </Dropdown.Item>))}
        </Container>}
      </Container>

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
            <tr>
              <td className='body-row'>
                <img src={selectedProduct?.productImage ? selectedProduct.productImage : noImg} alt="" className="prd-img" />
                <span className="prdname">{selectedProduct?.productName}</span>
              </td>
              <td>{selectedProduct?.sku?? '-'}</td>
              <td>{selectedProduct?.stock? selectedProduct.stock.unitsAvailable?? '0' : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {selectedProduct &&  <div className="barcode">
        <div className="label">Barcode <span className="optional">the code is generated based on SKU</span></div>
        <div ref={contentRef}>
          <Barcode value={selectedProduct.sku} />
        </div>
      </div>}
      {selectedProduct && <Button variant='primary' onClick={() => reactToPrintFn()}>Print Barcode</Button>}


    </Container>
  )
}

export default PrintCodes