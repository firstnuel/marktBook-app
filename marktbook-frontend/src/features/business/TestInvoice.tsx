import Invoice from '@components/Invoice'
import { Sale } from '@typess/sale'


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



  return (

      <Invoice  sale={mockInvoiceData}/>





  )
}

export default InvoiceDemo


