import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'
import { useTrans } from '@hooks/useTrans'
import { getCurrencySymbol } from '@utils/helpers'
import { useEffect } from 'react'


const InvoiceTable = () => {
  const { invoices, clearError, success, error, setSale, mainOpt, sale, setSubOpt } = useTrans()

  useEffect(() => {
    if( mainOpt === 'Invoices' && sale) {
      setSubOpt('View Invoice')
    }
  }, [mainOpt, setSubOpt, sale])


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
                <tr key={idx} style={{ height: '2em' }}>
                  <td className='body-row'>{invoice.customer?.name ?? '-'}</td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>{invoice.status}</td>
                  <td>{`${getCurrencySymbol(invoice.currency)} ${invoice.subtotalAmount}`}</td>
                  <td>{`${getCurrencySymbol(invoice.currency)} ${invoice.subtotalAmount}`}</td>
                  <td className={invoice.status === 'COMPLETED' ? 'paid' : 'unpaid'}>
                    {invoice.status === 'COMPLETED' ? 'paid' : 'unpaid'}</td>
                  <td className='actions' onClick={() => setSale(invoice)}>view invoice</td>
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
