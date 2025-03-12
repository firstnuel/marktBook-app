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
import { useTrans } from '@hooks/useTrans'
import { formatDate, getCurrencySymbol } from '@utils/helpers'
import { Sale } from '@typess/trans'
import { Button } from 'react-bootstrap'


const SalesReturn = () => {
  const { sales, fetchSales, loading, error,
    clearError, success, setSale, sale, mainOpt, setSubOpt, } = useTrans()
  const [sort, setSort] = useState({ key: 'Customer Name', dir: 'asc' })
  const [search, setSearch] = useState('')
  const [filteredSales, setFilteredSales] = useState(sales)

  useEffect(() => {
    if (search.length > 2) {
      setFilteredSales(
        sales.filter((sale) => sale.customer?.name.toLowerCase().includes(search.toLowerCase()))
      )
    } else {
      setFilteredSales(sales)
    }
  }, [search, sales])

  useEffect(() => {
    if( mainOpt === 'Sales' && sale) {
      setSubOpt('View Sale')
    }
  }, [mainOpt, setSubOpt, sale])

  const hFields = {
    'Customer Name': 'customer.name',
    'Date & Time': 'date & time',
    Status: 'status',
    Subtotal: 'subtotal',
    Total: 'total',
    'Payment Status': 'paymentStatus',
    Biller: 'initiatedBy.name',
    '': 'details',
  }

  const header = Object.keys(hFields) as (keyof typeof hFields)[]

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

  const sortTable = (sales: Sale[]) => {
    const field = hFields[sort.key as keyof typeof hFields]
    const direction = sort.dir === 'asc' ? 1 : -1

    return [...sales].sort((a, b) => {
      const aValue = getNestedValue(a, field)
      const bValue = getNestedValue(b, field)

      if (aValue > bValue) return direction
      if (aValue < bValue) return -direction
      return 0
    })
  }

  const sortedSales = sortTable(filteredSales)

  const exportToPDF = (print = false) => {
    const doc = new jsPDF('landscape')
    doc.text('Sales List', 20, 10)
    autoTable(doc, {
      head: [header],
      body: sales.map((sale) => [
        sale.customer?.name || '-',
        formatDate(sale.createdAt),
        sale.status,
        getCurrencySymbol(sale.currency) + sale.subtotalAmount.toFixed(2),
        getCurrencySymbol(sale.currency) + sale.totalPrice.toFixed(2),
        sale.status === 'COMPLETED' ? 'paid' : 'unpaid',
        sale.initiatedBy.name,
        '',
      ]),
    })

    if (print) {
      window.open(doc.output('bloburl'), '_blank')
    } else {
      doc.save('sales-list.pdf')
    }
  }

  const csvHeaders = header.map((h) => ({ label: h, key: hFields[h] }))

  return (
    <>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="topper">
        <div className="top-menu">
          <div className="title-box">Sales Return</div>
          <div className="options">
            <IconBox clName="pdf" src={icons.pdf} onClick={() => exportToPDF(false)} />
            <CSVLink data={sales} headers={csvHeaders} filename="sales-list.csv">
              <IconBox clName="excel" src={icons.excel} />
            </CSVLink>
            <IconBox clName="print" src={icons.print} onClick={() => exportToPDF(true)} />
            <IconBox clName="refresh" src={icons.refresh} onClick={() => fetchSales()} />
            <Form.Control
              placeholder="Search customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '50%' }}
            />
            <Button>New Sales Return</Button>
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
            {sortedSales.length > 0 ? (
              sortedSales.map((sale) => (
                <tr key={sale.id} style={{ cursor: 'default' }}>
                  <td>{sale.customer?.name || '-'}</td>
                  <td>{formatDate(sale.createdAt)}</td>
                  <td>{sale.status}</td>
                  <td>{`${getCurrencySymbol(sale.currency)} ${sale.subtotalAmount}`}</td>
                  <td>{`${getCurrencySymbol(sale.currency)} ${sale.totalPrice}`}</td>
                  <td className={sale.status === 'COMPLETED' ? 'paid' : 'unpaid'}>
                    {sale.status === 'COMPLETED' ? 'paid' : 'unpaid'}</td>
                  <td>{sale.initiatedBy.name}</td>
                  <td className='actions' onClick={() => setSale(sale)}>Details</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-user">No sales found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default SalesReturn
