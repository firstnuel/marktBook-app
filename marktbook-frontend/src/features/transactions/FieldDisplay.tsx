import Container from 'react-bootstrap/Container'
import { useState } from 'react'
import { SaleItem } from '@typess/trans'
import { Table } from 'react-bootstrap'

interface FieldDisplayProps {
  fieldName: string;
  value?: string | number;
  items?:  SaleItem[];
}

const FieldDisplay = ({ fieldName, value, items }: FieldDisplayProps) => {
  const [show, setShow] = useState(false)


  return (
    <Container className="ve-container">
      <div className="field-div">
        <div className="field-name-value">
          <div className="field-name">{fieldName}</div>
          {!show ?
            <div className="view-field">{items? `Total of ${items.length} item${items.length < 2 ? '' : 's'} sold` : value}</div>
            : <div className="edit-field">
              <Table bordered>
                <thead>
                  <tr>
                    <th className="qty">Qty</th>
                    <th className="desc">Item</th>
                    <th className="unit">Unit Price</th>
                    <th className="total">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.map(item => (
                    <tr key={item.productId}>
                      <td>{item.quantity}</td>
                      <td>{item.productName}</td>
                      <td>{item.unitSalePrice}</td>
                      <td>{item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))
                  }
                </tbody>
              </Table>
            </div>
          }
        </div>
        {items?.length &&
        <div className="action-btns">
          <button className="edit-or-cancel" onClick={() => setShow(!show)}>
            {show? 'Close' : 'View Items'}
          </button>
        </div>
        }
      </div>
    </Container>
  )
}

export default FieldDisplay
