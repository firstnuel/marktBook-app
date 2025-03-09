import '@styles/invoice.scss'
import { useBusiness } from '@hooks/useBusiness'
import { Table, Button } from 'react-bootstrap'
import { Sale } from '@typess/trans'
import { formatDate, getCurrencySymbol } from '@utils/helpers'
import { useRef  } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useTrans } from '@hooks/useTrans'


interface InvoiceProp {
  sale: Sale;
  hide?: boolean
}

const Invoice = ({ sale, hide }: InvoiceProp) => {
  const { business } = useBusiness()
  const { rmSale } = useTrans()
  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  })


  return (
    <div>
      <Button style={{ margin: '.5em' }}
        onClick={() => handlePrint()}>print invoice</Button >
      {!hide && <Button variant='secondary' style={{ margin: '.5em' }}
        onClick={() => rmSale()}
      >Back</Button>}

      {/* Invoice content */}
      <div className={hide ? 'hide' : ''}>
        <div className="page invoice" ref={invoiceRef}>
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
            <div className="logo" >
              {business?.businessLogo && <img src={business?.businessLogo} alt="" />}
            </div>
          </div>
          <div className="customer-invinfo">
            <div className="customer">
              <div className="bill-to">Bill To</div>
              <div className="name">{sale.customer?.name?? '-'}</div>
              {sale.customer?.businessName && (
                <div className="Business">{sale.customer.businessName}</div>
              )}
              <div className="address">{sale.customer?.address ?? '-'}</div>
            </div>
            <div className="invinfo">
              <div className="inv-ref">
                <span className="field">Invoice Ref:</span>
                <span>{sale.id.toUpperCase()}</span>
              </div>
              <div className="inv-date">
                <span className="field">Invoice Date:</span>
                <span>{formatDate(sale.createdAt)}</span>
              </div>
              {sale.status === 'COMPLETED' && <div className="inv-date paid">
                <span className="field">Invoice Staus:</span>
                <span>PAID</span>
              </div>}
            </div>
          </div>
          <Table bordered>
            <thead>
              <tr>
                <th className="qty">Qty</th>
                <th className="desc">Item</th>
                <th className="unit">{`Unit Price (${getCurrencySymbol(sale.currency)})`}</th>
                <th className="total">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.saleItems.map((item) => (
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
            <div className="cal subtotal">
              <div>Subtotal:</div>
              <div>{sale.subtotalAmount.toFixed(2)}</div>
            </div>
            <div className="cal tax">
              <div>{`Tax(${sale.taxRate}%:)`}</div>
              <div>{sale.taxAmount.toFixed(2)}</div>
            </div>
            {sale.discount && (
              <div className="cal discount">
                <div>Discount:</div>
                <div>{sale.discount?.value.toFixed(2)}</div>
              </div>
            )}
            <div className="cal total">
              <div className="totals">Total:</div>
              <div className="totals">
                {getCurrencySymbol(sale.currency)}{sale.totalPrice.toFixed(2)}
              </div>
            </div>
            {sale.status === 'COMPLETED' ?
              <div className="status">
                    The above amount has been <strong>paid</strong> in full and received by <strong>{sale.updateBy?.name ?? sale.initiatedBy.name}</strong>.
              </div>

              :
              <div className="account">
                <h6>Terms and Conditions</h6>
                <p>Please pay within 15 days from the date of invoice to the account details below, overdue interest @ 14% will be charged on delayed payments.
                Also remember to use invoice reference when remitting funds.</p>
                <ul>
                  <li>{`Account Name: ${business?.businessAccount?.accountName ?? ''}`}</li>
                  <li>{`Account Number: ${business?.businessAccount?.accountNumber ?? ''}`}</li>
                  <li>{`Bank Name: ${business?.businessAccount?.bankName ?? ''}`}</li>
                </ul>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice