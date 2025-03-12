import { useTrans } from '@hooks/useTrans'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Modal, Form, Container, InputGroup, Table } from 'react-bootstrap'
import '@styles/sales-return.scss'
import { useField } from '@hooks/useField'

interface NewSRProps {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

// Extended interface for sale items with a temporary quantity field for returns
interface SaleItem {
    productId: string
    productName: string
    quantity: number
    returnQuantity: number
    unitSalePrice: number
    subtotal: number
}

const NewSaleReturn = ({ show, setShow }: NewSRProps ) => {

  const { saleReturn, error: err, loading, fetchSale } = useTrans()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reset, ...search } = useField('search', 'text')
  const [all, setAll] = useState(true)
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])


  useEffect(() => {
    if (saleReturn && saleReturn.saleItems) {
      const initializedItems = saleReturn.saleItems.map(item => ({
        ...item,
        returnQuantity: 0
      }))
      setSaleItems(initializedItems)
    }
  }, [saleReturn])

  // Function to increment item quantity
  const incrementQuantity = (productId: string) => {
    setSaleItems(prevItems =>
      prevItems.map(item => {
        if (item.productId === productId && item.returnQuantity < item.quantity) {
          return { ...item, returnQuantity: item.returnQuantity + 1 }
        }
        return item
      })
    )
  }

  // Function to decrement item quantity
  const decrementQuantity = (productId: string) => {
    setSaleItems(prevItems =>
      prevItems.map(item => {
        if (item.productId === productId && item.returnQuantity > 0) {
          return { ...item, returnQuantity: item.returnQuantity - 1 }
        }
        return item
      })
    )
  }

  // Function to remove item from return list
  const removeItem = (productId: string) => {
    setSaleItems(prevItems =>
      prevItems.filter(item => item.productId !== productId)
    )
  }

  // Calculate the total amount for the return
  const calculateTotal = () => {
    return saleItems
      .reduce((total, item) => total + (item.unitSalePrice * item.returnQuantity), 0)
      .toFixed(2)
  }

  return(
    <Modal
      className="sale-return-modal"
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={() => setShow(!show)}>

      <Modal.Header closeButton>
        <Modal.Title>New Sale Return
          {err && <span className='err'>-{err}</span>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body id='mod-body'>
        <Container>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter Invoice Ref"
              { ...search }
            />
            <Button variant="outline-primary"
              onClick={() => fetchSale(search.value as string)}
              disabled={loading} id="button-addon2">
              {loading? 'Searching' : 'Search Sale'}
            </Button>
          </InputGroup>
          {saleReturn &&
            <>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="All Items"
                onChange={() => setAll(!all)}
              />
              {all && <Table bordered>
                <thead>
                  <tr>
                    <th className="qty-col">Return Qty</th>
                    <th className="desc">Item</th>
                    <th className="unit">Unit Price</th>
                    <th className="total">Total</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems && saleItems.map(item => (
                    <tr key={item.productId}>
                      <td>
                        <div className="qty-control">
                          <Button
                            className="btn-qty"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decrementQuantity(item.productId)}
                            disabled={item.returnQuantity <= 0}
                          >
                            -
                          </Button>
                          <span className="qty-display mx-2">{item.returnQuantity}</span>
                          <Button
                            className="btn-qty"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => incrementQuantity(item.productId)}
                            disabled={item.returnQuantity >= item.quantity}
                          >
                            +
                          </Button>
                        </div>
                        <div className="available-qty">
                          Available: {item.quantity}
                        </div>
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.unitSalePrice}</td>
                      <td>{(item.unitSalePrice * item.returnQuantity).toFixed(2)}</td>
                      <td>
                        <Button
                          className="btn-remove"
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="total-row table-secondary">
                    <td colSpan={3} className="text-end fw-bold">Total Return Amount:</td>
                    <td>{calculateTotal()}</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>}
              {saleReturn  && saleItems.length > 0 && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                  <Button className="process-return-btn" variant="primary">
                    Process Return
                  </Button>
                </div>
              )}
            </>
          }
        </Container>
      </Modal.Body>
    </Modal>
  )
}

export default NewSaleReturn