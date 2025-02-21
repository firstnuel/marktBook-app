import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CSVLink } from 'react-csv'
import Caret from '@components/Caret'
import Loading from '@components/Spinner'
import Notify from '@components/Notify'
import { useStocks } from '@hooks/useStocks'
import { cutName, formatDate, getCurrencySymbol } from '@utils/helpers'
import { Stock } from '@typess/stocks'

const StocksTable = () => {
  const { stocks, fetchStocks, loading, error, clearError, success } = useStocks()
  const [sort, setSort] = useState({ key: 'Product', dir: 'asc' })
  const [search, setSearch] = useState('')
  const [filteredStocks, setFilteredStocks] = useState(stocks)

  useEffect(() => {
    if (search.length > 2) {
      setFilteredStocks(
        stocks.filter(stock => stock.product.toLowerCase().includes(search.toLowerCase()))
      )
    } else {
      setFilteredStocks(stocks)
    }
  }, [search, stocks])

  const hFields = {
    Product: 'product',
    Location: 'location',
    Compartment: 'compartment',
    'Units Available': 'unitsAvailable',
    'Min Quantity': 'minQuantity',
    'Max Quantity': 'maxQuantity',
    'Cost per Unit': 'costPerUnit',
    'Total Value': 'totalValue',
    'Updated By': 'updatedBy.name',
    'Last Restocked': 'lastRestocked',
    'Updated At': 'updatedAt',
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


  const sortTable = (stocks: Stock[]) => {
    const field = hFields[sort.key as keyof typeof hFields]
    const direction = sort.dir === 'asc' ? 1 : -1

    return [...stocks].sort((a, b) => {
      const aValue = getNestedValue(a, field)
      const bValue = getNestedValue(b, field)

      if (aValue > bValue) return direction
      if (aValue < bValue) return -direction
      return 0
    })
  }

  const sortedStocks = sortTable(filteredStocks)

  const exportToPDF = (print = false) => {
    const doc = new jsPDF('landscape')
    doc.text('Stock List', 20, 10)
    autoTable(doc, {
      head: [header],
      body: stocks.map(stock => [
        stock.product,
        stock.location,
        stock.compartment,
        stock.unitsAvailable,
        stock.minQuantity,
        stock.maxQuantity,
        stock.costPerUnit.toFixed(2),
        stock.totalValue.toFixed(2),
        stock.updatedBy.name,
        formatDate(stock.lastRestocked),
        formatDate(stock.updatedAt),
      ]),
    })

    if (print) {
      window.open(doc.output('bloburl'), '_blank')
    } else {
      doc.save('stock-list.pdf')
    }
  }

  const csvHeaders = [
    { label: 'Product', key: 'product' },
    { label: 'Location', key: 'location' },
    { label: 'Compartment', key: 'compartment' },
    { label: 'Units Available', key: 'unitsAvailable' },
    { label: 'Min Quantity', key: 'minQuantity' },
    { label: 'Max Quantity', key: 'maxQuantity' },
    { label: 'Cost per Unit', key: 'costPerUnit' },
    { label: 'Total Value', key: 'totalValue' },
    { label: 'Updated By', key: 'updatedBy.name' },
    { label: 'Last Restocked', key: 'lastRestocked' },
    { label: 'Updated At', key: 'updatedAt' },
  ]

  return (
    <>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="topper">
        <div className="top-menu">
          <div className="title-box">Stock List</div>
          <div className="options">
            <IconBox clName="pdf" src={icons.pdf} onClick={() => exportToPDF(false)} />
            <CSVLink data={stocks} headers={csvHeaders} filename="stock-list.csv">
              <IconBox clName="excel" src={icons.excel} />
            </CSVLink>
            <IconBox clName="print" src={icons.print} onClick={() => exportToPDF(true)} />
            <IconBox clName="refresh" src={icons.refresh} onClick={() => fetchStocks()} />
            <Form.Control
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="main-content">
        {loading && <Loading />}
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
            {sortedStocks.length > 0 ? (
              sortedStocks.map((stock) => (
                <tr key={stock.id} style={{ cursor: 'default' }}>
                  <td className="body-row">{cutName(stock.product, 25)}</td>
                  <td>{stock.location}</td>
                  <td>{stock.compartment}</td>
                  <td>{stock.unitsAvailable}</td>
                  <td>{stock.minQuantity}</td>
                  <td>{stock.maxQuantity}</td>
                  <td>{`${getCurrencySymbol('USD')} ${stock.costPerUnit}`}</td>
                  <td>{`${getCurrencySymbol('USD')} ${stock.totalValue}`}</td>
                  <td>{stock.updatedBy.name}</td>
                  <td>{formatDate(stock.lastRestocked)}</td>
                  <td>{formatDate(stock.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="no-user">No stock found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default StocksTable
