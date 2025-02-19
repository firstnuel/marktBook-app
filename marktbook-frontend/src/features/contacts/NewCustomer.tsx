import { useContacts } from '@hooks/useContacts'
import { useBusiness } from '@hooks/useBusiness'
import { useField } from '@hooks/useField'
import { useState, ChangeEvent, useEffect } from 'react'
import { Button, Modal, Form, Container } from 'react-bootstrap'
import { Customer } from '@typess/contacts'



interface NewCustomerProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewCustomer = ({ show, setShow }: NewCustomerProps) => {
  const [err, setErr] = useState('')
  const { createCustomer, success, loading } = useContacts()
  const { business } = useBusiness()
  const { reset: nameReset, ...name } = useField('name', 'text')
  const { reset: emailReset, ...email } = useField('email', 'email')
  const { reset: phoneReset, ...phone } = useField('phone', 'text')
  const { reset: addressReset, ...address } = useField('address', 'text')
  const { reset: businessNameReset, ...businessName } = useField('businessName', 'text')
  const [customerType, setCustomerType] = useState<'Individual' | 'Business'>('Individual')
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  const handleCustomerTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCustomerType(e.target.value as 'Individual' | 'Business')
  }

  const handleMarketingOptInChange = () => {
    setMarketingOptIn(!marketingOptIn)
  }

  const resetForm = () => {
    nameReset()
    emailReset()
    phoneReset()
    addressReset()
    businessNameReset()
  }

  const handleClose = () => {
    resetForm()
    setShow(!show)
  }

  const formData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    businessId: business?._id,
    customerType,
    marketingOptIn,
  } as Partial<Customer>

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
    if (businessName.value) {
      formData.businessName = businessName.value as string
    }
    createCustomer(formData)
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
        <Modal.Title>Create New Customer {err && <span className="err">-{err}</span>}</Modal.Title>
      </Modal.Header>
      <Modal.Body id="mod-body">
        <Container>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="user-name-div">
              <Form.Label>Name:</Form.Label>
              <Form.Control {...name} />
            </div>
            <div className="email-div">
              <Form.Label>Email:</Form.Label>
              <Form.Control {...email} />
            </div>
            <div className="username-phone">
              <div className="phone-div">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control {...phone} />
              </div>
              <div className="role-div">
                <Form.Label>Customer Type:</Form.Label>
                <Form.Select name="customerType" value={customerType} onChange={handleCustomerTypeChange}>
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                </Form.Select>
              </div>
            </div>
            {customerType === 'Business' && (
              <div className="address-div">
                <Form.Label>Business Name:</Form.Label>
                <Form.Control {...businessName} />
              </div>
            )}
            <div className="role-status">
              <div className="status-div">
                <Form.Check
                  type="checkbox"
                  label="Opt-in for Marketing"
                  checked={marketingOptIn}
                  onChange={handleMarketingOptInChange}
                />
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
        <Button variant="success" onClick={handleCreate}>
          {loading ? 'Loading...' : 'Create Customer'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewCustomer
