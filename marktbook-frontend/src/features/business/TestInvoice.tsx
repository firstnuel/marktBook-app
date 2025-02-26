import Invoice from '@components/Invoice'
import { Sale } from '@typess/trans'
import { useState } from 'react'



const mockInvoiceData: Sale = {
  customer: {
    _id: '67b4b1099539abfcb9a8c64d',
    name: 'Jane Smith',
    address: '456 Elm St, Metropolis, NY',
    businessName: 'Jane\'s Bakery',
  },
  initiatedBy: {
    _id: '6788191f8593d3b390631e6e',
    name: 'Esso Doe',
  },
  subtotalAmount: 270,
  taxAmount: 50,
  taxRate: 20,
  currency: 'USD',
  paymentMethod: 'CASH',
  status: 'COMPLETED',
  refundStatus: 'NONE',
  totalPrice: 300,
  discount: {
    type: 'FIXED',
    value: 20,
  },
  saleItems: [
    {
      productId: '67882f550d9f6b5ba3387e59',
      productName: 'Apple Wired Ear Phones',
      productSKU: 'PRD35890',
      unitSalePrice: 100,
      quantity: 1,
      subtotal: 100,
    },
    {
      productId: '6789359e884ad36596f42a64',
      productName: 'Airforce one',
      productSKU: 'PRD47281',
      unitSalePrice: 170,
      quantity: 1,
      subtotal: 170,
    },
  ],
  createdAt: '2025-02-25T10:27:27.834Z',
  id: '67bd9b0f2c1e305e71c9b97e',
}



const InvoiceDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)



  return (
    <>
      <button onClick={openModal} style={buttonStyle}>Open Invoice</button>

      {isOpen && (
        <div style={modalBackgroundStyle}>
          <div style={modalStyle}>
            <button onClick={closeModal} style={closeButtonStyle}>Close</button>
            <Invoice sale={mockInvoiceData} />
          </div>
        </div>
      )}
    </>
  )
}


// Inline styles
const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
}

const modalBackgroundStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const modalStyle = {
  backgroundColor: 'white',
  border: '2px solid black',
  padding: '20px',
  borderRadius: '10px',
  width: '50%',
  height: '70%',
  overflow: 'scroll',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
}

const closeButtonStyle = {
  marginTop: '10px',
  padding: '8px 15px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
}

export default InvoiceDemo