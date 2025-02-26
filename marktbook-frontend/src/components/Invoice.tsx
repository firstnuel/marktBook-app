import '@styles/invoice.scss'
import { useBusiness } from '@hooks/useBusiness'
import { Table, Button } from 'react-bootstrap'
import { Sale } from '@typess/trans'
import { formatDate, getCurrencySymbol } from '@utils/helpers'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { useReactToPrint } from 'react-to-print'
import jsPDF from 'jspdf'

interface InvoiceProp {
  sale: Sale;
}

const Invoice = ({ sale }: InvoiceProp) => {
  const { business } = useBusiness()
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  })

  const handleGeneratePdf = () => {
    if (invoiceRef.current  && isLogoLoaded) {
      // Capture the invoice content as an image
      html2canvas(invoiceRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')

        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

        // Save the PDF
        pdf.save('invoice.pdf')
      })
    }
  }

  return (
    <div>
      <Button onClick={handleGeneratePdf}>Generate PDF</Button>
      <Button variant='secondary' onClick={() => handlePrint()}>Print</Button >


      {/* Invoice content */}
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
            <img src={business?.businessLogo} alt=""
              onLoad={() => setIsLogoLoaded(true)}/>
          </div>
        </div>
        <div className="customer-invinfo">
          <div className="customer">
            <div className="bill-to">Bill To</div>
            <div className="name">{sale.customer.name}</div>
            {sale.customer.businessName && (
              <div className="Business">{sale.customer.businessName}</div>
            )}
            <div className="address">{sale.customer.address}</div>
          </div>
          <div className="invinfo">
            <div className="inv-ref">
              <span className="field">Invoice Ref:</span>
              <span>004</span>
            </div>
            <div className="inv-date">
              <span className="field">Invoice Date:</span>
              <span>{formatDate(sale.createdAt)}</span>
            </div>
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
        </div>
      </div>
    </div>
  )
}

export default Invoice