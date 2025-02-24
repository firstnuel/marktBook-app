import { useState, ChangeEvent, useEffect } from 'react'
import { Button, Modal, Form, Container } from 'react-bootstrap'
import { useStocks } from '@hooks/useStocks'
import { useBusiness } from '@hooks/useBusiness'
import { useField } from '@hooks/useField'
import { MovementType } from '@typess/inv'

interface NewMovementProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewMovements = ({ show, setShow }: NewMovementProps) => {
  const [err, setErr] = useState('')
  const { loading, createMovement, success, stocks, locations } = useStocks()
  const { business } = useBusiness()
  const [movementType, setMovementType] = useState<MovementType>(MovementType.OUT)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const { reset: quantityReset, ...quantity } = useField('quantity', 'number')
  const { reset: reasonReset, ...reason } = useField('reason', 'text')

  const handleMovementType = (e: ChangeEvent<HTMLSelectElement>) => setMovementType(e.target.value as MovementType)

  const resetForm = () => {
    quantityReset()
    reasonReset()
  }

  const handleClose = () => {
    resetForm()
    setShow(false)
  }

  const formData = {
    productId: selectedProductId,
    movementType,
    quantity: Number(quantity.value),
    destination: selectedLocation,
    reason: reason.value as string,
    businessId: business?._id,
  }

  const handleCreate = () => {
    for (const val of Object.values(formData)) {
      if (val === '' || val === undefined) {
        setErr('All fields are required')
        setTimeout(() => setErr(''), 3000)
        return
      }
    }
    createMovement(formData)
  }

  useEffect(() => {
    if (success) {
      resetForm()
      setShow(false)
    }
  },)

  return (
    <Modal backdrop="static" keyboard={false} size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Movement {err && <span className='err'>-{err}</span>}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <Form.Label>Product: *</Form.Label>
              <Form.Select value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)} >
                <option>Select Product</option>
                {stocks.map(stock => (
                  <option key={stock.product?.id} value={stock.product?.id}>{stock.product?.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="movement-quantity">
              <div className="form-group movement">
                <Form.Label>Movement Type: *</Form.Label>
                <Form.Select value={movementType} onChange={handleMovementType}>
                  {Object.values(MovementType).map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="form-group quantity">
                <Form.Label>Quantity: *</Form.Label>
                <Form.Control {...quantity} />
              </div>
            </div>
            <div className="form-group">
              <Form.Label>Destination: *</Form.Label>
              <Form.Select value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.locationName}</option>
                ))}
              </Form.Select>
            </div>

            <div className="form-group">
              <Form.Label>Reason: *</Form.Label>
              <Form.Control as="textarea"  {...reason} />
            </div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer id='cat-footer'>
        <Button className='c-btn' variant="success" onClick={handleCreate}>
          {loading ? 'Loading...' : 'Create Movement'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewMovements
