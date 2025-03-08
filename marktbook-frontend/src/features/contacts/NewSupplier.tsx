import { useContacts } from '@hooks/useContacts'
import { useBusiness } from '@hooks/useBusiness'
import { useField } from '@hooks/useField'
import { useState, ChangeEvent, useEffect } from 'react'
import { Button, Modal, Form, Container } from 'react-bootstrap'
import { Supplier, SupplierType, PaymentMethod } from '@typess/contacts'


interface NewSupplierProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewSupplier = ({ show, setShow }: NewSupplierProps) => {
  const [err, setErr] = useState('')
  const { createSupplier, success, loading } = useContacts()
  const { business } = useBusiness()
  const { reset: nameReset, ...name } = useField('name', 'text')
  const { reset: emailReset, ...email } = useField('email', 'email')
  const { reset: phoneReset, ...phone } = useField('phone', 'text')
  const { reset: addressReset, ...address } = useField('address', 'text')
  const { reset: companyNameReset, ...companyName } = useField('companyName', 'text')
  const [supplierType, setSupplierType] = useState<SupplierType>('Manufacturer')
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod>('Bank Transfer')

  const handleSupplierTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSupplierType(e.target.value as SupplierType)
  }

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPreferredPaymentMethod(e.target.value as PaymentMethod)
  }

  const resetForm = () => {
    nameReset()
    emailReset()
    phoneReset()
    addressReset()
    companyNameReset()
  }

  const handleClose = () => {
    resetForm()
    setShow(!show)
  }

  const formData = {
    name: name.value,
    contactPerson: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    businessId: business?._id,
    supplierType,
    preferredPaymentMethod,
  } as Partial<Supplier>

  const handleCreate = () => {
    for (const val of Object.values(formData)) {
      if ((val as string) === '') {
        setErr('No field can be empty')
        const timer = setTimeout(() => {
          setErr('')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
    if (companyName.value) {
      formData.companyName = companyName.value as string
    }
    createSupplier(formData)
  }

  useEffect(() => {
    if (success) {
      resetForm()
      setShow(false)
    }
  }, )

  return (
    <Modal backdrop="static" keyboard={false} size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Supplier {err && <span className="err">-{err}</span>}</Modal.Title>
      </Modal.Header>
      <Modal.Body id="mod-body">
        <Container>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="user-name-div">
              <Form.Label>Name:</Form.Label>
              <Form.Control {...name} />
            </div>
            <div className="username-phone">
              <div className="email-div"  style={{ width: '50%' }}>
                <Form.Label>Email:</Form.Label>
                <Form.Control {...email} />
              </div>
              <div className="phone-div">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control {...phone} />
              </div>
            </div>
            <div className="address-div">
              <Form.Label>Company Name:</Form.Label>
              <Form.Control {...companyName} />
            </div>
            <div className="role-status">
              <div className="role-div">
                <Form.Label>Supplier Type:</Form.Label>
                <Form.Select name="supplierType" value={supplierType} onChange={handleSupplierTypeChange}>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                </Form.Select>
              </div>
              <div className="status-div">
                <Form.Label>Preferred Payment Method:</Form.Label>
                <Form.Select name="preferredPaymentMethod" value={preferredPaymentMethod} onChange={handlePaymentMethodChange}>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cheque">Cheque</option>
                </Form.Select>
              </div>
            </div>
            <div className="address-div">
              <Form.Label>Address:</Form.Label>
              <Form.Control {...address} />
            </div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer id="cat-footer">
        <Button id='save-btn' onClick={handleCreate}>
          {loading ? 'Loading...' : 'Create Supplier'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewSupplier
