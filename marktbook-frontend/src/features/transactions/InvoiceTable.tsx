import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'
import { useTrans } from '@hooks/useTrans'
import { Link } from 'react-router-dom'
import { getCurrencySymbol } from '@utils/helpers'


const InvoiceTable = () => {
  const { invoices, clearError, success, error } = useTrans()


  return (
    <Container>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">All Invoices</div>
        </div>
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
            {invoices.length ?
              invoices.map((invoice, idx) => (
                <tr key={idx}>
                  <td className='body-row'>{invoice.customer?.name ?? '-'}</td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>{invoice.status}</td>
                  <td>{`${getCurrencySymbol(invoice.currency)} ${invoice.subtotalAmount}`}</td>
                  <td>{`${getCurrencySymbol(invoice.currency)} ${invoice.subtotalAmount}`}</td>
                  <td className={invoice.status === 'COMPLETED' ? 'paid' : 'unpaid'}>
                    {invoice.status === 'COMPLETED' ? 'paid' : 'unpaid'}</td>
                  <td className='actions'>
                    <Link to={`/invoices/${invoice.id}`} className='view-invoice'>View Invoice</Link>
                  </td>
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
