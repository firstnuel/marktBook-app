import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'
import { useTrans } from '@hooks/useTrans'
import { formatDate } from '@utils/helpers'
import { getCurrencySymbol } from '@utils/helpers'
import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'


const InvoiceTable = () => {
  const { invoices, clearError, success, error, setInvoice, mainOpt, invoice: inv, setSubOpt } = useTrans()
  const [filteredInvoices, setFilteredInvoices] = useState(invoices)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if( mainOpt === 'Invoices' && inv) {
      setSubOpt('View Invoice')
    }
  }, [mainOpt, setSubOpt, inv])

  useEffect(() => {
    if (search.length > 2) {
      setFilteredInvoices(
        invoices.filter((invoice) =>
          invoice.customer?.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    } else {
      setFilteredInvoices(invoices)
    }
  }, [search, invoices])


  return (
    <Container>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc inc">
          <div className="name">All Invoices</div>
        </div>
        <Form.Control
          type="text"
          placeholder="Search customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length ?
              filteredInvoices.map((invoice, idx) => (
                <tr key={idx} style={{ height: '2em' }}>
                  <td className='body-row'>{invoice.customer?.name ?? '-'}</td>
                  <td>{formatDate(invoice.createdAt)}</td>
                  <td>{invoice.status}</td>
                  <td>{`${getCurrencySymbol(invoice.currency)} ${invoice.subtotalAmount.toFixed(2)}`}</td>
                  <td>{`${getCurrencySymbol(invoice.currency)} ${invoice.totalPrice.toFixed(2)}`}</td>
                  <td><div className={invoice.status === 'COMPLETED' ? 'av up' : 'av down'}>
                    {invoice.status === 'COMPLETED' ? 'Paid' : 'Unpaid'}
                  </div></td>
                  <td className='actions' onClick={() => setInvoice(invoice)}>view invoice</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={7} className="no-user">No invoices found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </Container>
    </Container>
  )
}

export default InvoiceTable
