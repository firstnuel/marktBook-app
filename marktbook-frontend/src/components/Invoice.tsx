import '@styles/invoice.scss'
import { useBusiness } from '@hooks/useBusiness'
import { Table } from 'react-bootstrap'
import { Sale } from '@typess/sale'
import { formatDate, getCurrencySymbol } from '@utils/helpers'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'

interface InvoiceProp {
    sale: Sale
}

const Invoice = ({ sale }: InvoiceProp) => {
  const { business } = useBusiness()
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
  })

  return (
    <div>
      <button onClick={() => handlePrint()}>
        Print
      </button>

      {/* Hidden invoice that's always in the DOM but not visible */}
      <div style={{ display: 'none' }}>
        <div className="page invoice" ref={contentRef}>
          <div className="head">
            <div className="bizname">{business?.businessName}</div>
            <div className="document-type">INVOICE</div>
          </div>
          <div className="contact-logo">
            <div className="contact">
              <div className="address">{business?.businessAddress}</div>
              <div className="phone">{business?.phoneNumber}</div>
              <div className="email">{business?.email}</div>
            </div>
            <div className="logo">
              <img src={business?.businessLogo} alt="" />
            </div>
          </div>
          <div className="customer-invinfo">
            <div className="customer">
              <div className="bill-to">Bill To</div>
              <div className="name">{sale.customer.name}</div>
              {sale.customer.businessName &&
                <div className="Business">{sale.customer.businessName}</div>}
              <div className="address">{sale.customer.address}</div>
            </div>
            <div className="invinfo">
              <div className="inv-ref">
                <span className='field'>Invoice Ref:</span>
                <span>004</span>
              </div>
              <div className="inv-date">
                <span className='field'>Invoice Date:</span>
                <span>{formatDate(sale.createdAt)}</span>
              </div>
            </div>
          </div>
          <Table bordered>
            <thead>
              <tr>
                <th className='qty'>Qty</th>
                <th className='desc'>Item</th>
                <th className='unit'>{`Unit Price (${getCurrencySymbol(sale.currency)})`}</th>
                <th className='total'>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.saleItems.map(item => (
                <tr key={item.productId}>
                  <td>{item.quantity}</td>
                  <td>{item.productName}</td>
                  <td>{item.unitSalePrice}</td>
                  <td>{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="calculations">
            <div className='cal subtotal'>
              <div>Subtotal:</div>
              <div>{sale.subtotalAmount.toFixed(2)}</div>
            </div>
            <div className='cal tax'>
              <div>{`Tax(${sale.taxRate}%:)`}</div>
              <div>{sale.taxAmount.toFixed(2)}</div>
            </div>
            {sale.discount &&
              <div className='cal discount'>
                <div>Discount:</div>
                <div>{sale.discount?.value.toFixed(2)}</div>
              </div>}
            <div className='cal total'>
              <div className='totals'>Total:</div>
              <div className='totals'>{getCurrencySymbol(sale.currency)}{sale.totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice