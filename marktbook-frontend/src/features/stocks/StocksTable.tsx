import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'
import Caret from '@components/Caret'
import Loading from '@components/Spinner'
import Notify from '@components/Notify'
import { useInv } from '@hooks/useInv'

const StocksTable = () => {
  const { lowStockData, fetchLowStockData, loading, error, clearError, successMsg } = useInv()
  const [search, setSearch] = useState('')
  const [filteredData, setFilteredData] = useState(lowStockData)
  const [sort, setSort] = useState({ key: 'product', dir: 'asc' })

  useEffect(() => {
    if (search.length > 2) {
      setFilteredData(
        lowStockData.filter((item) =>
          item.product.toLowerCase().includes(search.toLowerCase())
        )
      )
    } else {
      setFilteredData(lowStockData)
    }
  }, [search, lowStockData])

  const hFields = {
    Product: 'product',
    Location: 'location',
    Compartment: 'compartment',
    'Units Available': 'unitsAvailable',
    'Min Qty': 'minQuantity',
    'Max Qty': 'maxQuantity',
    'Cost/Unit (€)': 'costPerUnit',
    'Total Value (€)': 'computedTotalValue',
    'Last Restocked': 'lastRestocked',
    'Updated By': 'updatedBy.name',
    Notes: 'notes',
  }

  const header = Object.keys(hFields)

  const handleHeaderClick = (header) => {
    setSort({
      key: header,
      dir: header === sort.key ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'desc',
    })
  }

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
  }

  const sortTable = (data) => {
    const field = hFields[sort.key]
    const direction = sort.dir === 'asc' ? 1 : -1

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, field)
      const bValue = getNestedValue(b, field)

      if (aValue > bValue) return direction
      if (aValue < bValue) return -direction
      return 0
    })
  }

  const sortedData = sortTable(filteredData)

  const exportToPDF = (print = false) => {
    const doc = new jsPDF('landscape')
    doc.text('Low Stock Report', 20, 10)
    autoTable(doc, {
      head: [header],
      body: lowStockData.map((item) => header.map((key) => getNestedValue(item, hFields[key]) || '')),
    })

    if (print) {
      window.open(doc.output('bloburl'), '_blank')
    } else {
      doc.save('low-stock-report.pdf')
    }
  }

  const csvHeaders = header.map((key) => ({ label: key, key: hFields[key] }))

  return (
    <>
      <Notify clearErrFn={clearError} success={successMsg} error={error} />
      <div className="topper">
        <div className="top-menu">
          <div className="title-box">Low Stock Report</div>
          <div className="options">
            <IconBox clName="pdf" src={icons.pdf} onClick={() => exportToPDF(false)} />
            <CSVLink data={lowStockData} headers={csvHeaders} filename="low-stock-report.csv">
              <IconBox clName="excel" src={icons.excel} />
            </CSVLink>
            <IconBox clName="print" src={icons.print} onClick={() => exportToPDF(true)} />
            <IconBox clName="refresh" src={icons.refresh} onClick={fetchLowStockData} />
            <Form.Control placeholder="Search product" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr key={item.id}>
                  <td>{item.product}</td>
                  <td>{item.location}</td>
                  <td>{item.compartment}</td>
                  <td>{item.unitsAvailable}</td>
                  <td>{item.minQuantity}</td>
                  <td>{item.maxQuantity}</td>
                  <td>{item.costPerUnit}</td>
                  <td>{item.computedTotalValue}</td>
                  <td>{new Date(item.lastRestocked).toLocaleString()}</td>
                  <td>{item.updatedBy?.name}</td>
                  <td>{item.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={header.length} className="no-user">No low stock data found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default StocksTable
