import { Product } from '@typess/pos'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'
import Caret from '@components/Caret'
import { usePos } from '@hooks/usePos'
import { useInv } from '@hooks/useInv'
import Loading from '@components/Spinner'
import Notify from '@components/Notify'

const ProductTable = () => {
  const { products, fetchProducts, loading: pLoading, error, clearError, successMsg } = usePos()
  const { setSubOpt, fetchProduct, product } = useInv()
  const [sort, setSort] = useState({ key: 'Name', dir: 'asc' })
  const [search, setSearch] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const handleProduct = (productId: string) => {
    fetchProduct(productId)
  }

  useEffect(() => {
    if (product)  setSubOpt('Edit Product')
  }, [product, setSubOpt])

  const handleSearch = (e: React.ChangeEvent) => {
    e.preventDefault()
    setSearch((e.target as HTMLInputElement).value)
  }
  useEffect(() => {
    if (search.length > 2) {
      setFilteredProducts(products.filter(product =>
        product.productName.toLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredProducts(products)
    }
  }, [search, products])

  const hFields = {
    Name: 'productName',
    SKU: 'sku',
    Category: 'productCategory',
    'Base Price': 'basePrice',
    'Sale Price': 'salePrice',
    Quantity: 'stock.unitsAvailable', // Handle nested field
    Discount: 'discount',
    Type: 'productType',
    Unit: 'unit',
  }

  const header = Object.keys(hFields)

  const handleHeaderClick = (header: string) => {
    setSort({
      key: header,
      dir: header === sort.key ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'desc',
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
  }

  const sortTable = (products: Product[]) => {
    const field = hFields[sort.key as keyof typeof hFields]
    const direction = sort.dir === 'asc' ? 1 : -1

    return [...products].sort((a, b) => {
      const aValue = getNestedValue(a, field)
      const bValue = getNestedValue(b, field)

      if (aValue > bValue) return direction
      if (aValue < bValue) return -direction
      return 0
    })
  }

  const sortedProducts = sortTable(filteredProducts)

  const exportToPDF = (print = false) => {
    const doc = new jsPDF('landscape')
    doc.text('Product List', 20, 10)
    autoTable(doc, {
      head: [header],
      body: products.map((product) => [
        product.productName,
        product.sku,
        product.productCategory,
        product.basePrice.toFixed(2),
        product.salePrice.toFixed(2),
        product.stock?.unitsAvailable ?? 0,
        product.discount,
        product.productType,
        product.unit,
      ]),
    })

    if (print) {
      window.open(doc.output('bloburl'), '_blank')
    } else {
      doc.save('product-list.pdf')
    }
  }

  const csvHeaders = [
    { label: 'Product', key: 'productName' },
    { label: 'SKU', key: 'sku' },
    { label: 'Category', key: 'productCategory' },
    { label: 'Base Price', key: 'basePrice' },
    { label: 'Sale Price', key: 'salePrice' },
    { label: 'Quantity', key: 'stock.unitsAvailable' },
    { label: 'Discount', key: 'discount' },
    { label: 'Type', key: 'productType' },
    { label: 'Unit', key: 'unit' },
  ]

  return (
    <>
      <Notify clearErrFn={clearError} success={successMsg} error={error} />
      <div className="topper">
        <div className="top-menu">
          <div className="title-box">Product List</div>
          <div className="options">
            <IconBox clName="pdf" src={icons.pdf} onClick={() => exportToPDF(false)} />
            <CSVLink data={products} headers={csvHeaders} filename="product-list.csv">
              <IconBox clName="excel" src={icons.excel} />
            </CSVLink>
            <IconBox clName="print" src={icons.print} onClick={() => exportToPDF(true)} />
            <IconBox clName="refresh" src={icons.refresh} onClick={() => fetchProducts()} />
            <Form.Control
              placeholder="search product"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <div className="main-content">
        {pLoading && <Loading />}
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((headerItem, index) => (
                <th key={index} onClick={() => handleHeaderClick(headerItem)}>
                  <div className="th-con">
                    <span>{headerItem}</span>
                    {sort.key === headerItem && <Caret dir={sort.dir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} onClick={() => handleProduct(product.id)}>
                <td className='prod-name'>{product.productName}</td>
                <td>{product.sku}</td>
                <td>{product.productCategory}</td>
                <td>{`$ ${product.basePrice.toFixed(2)}`}</td>
                <td>{`$ ${product.salePrice.toFixed(2)}`}</td>
                <td>{product.stock?.unitsAvailable ?? 0}</td>
                <td>{product.discount}</td>
                <td>{product.productType}</td>
                <td>{product.unit}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default ProductTable
