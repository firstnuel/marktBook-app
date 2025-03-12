import { useBusiness } from '@hooks/useBusiness'
import { useField } from '@hooks/useField'
import { User } from '@typess/auth'
import { useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from 'react'
import { Button, Modal, Form, Container } from 'react-bootstrap'

interface NewUserProps {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}


const NewUser = ({ show, setShow }: NewUserProps) => {
  const [err, setErr] = useState('')
  const { business, loading, createUser, success } = useBusiness()
  const [selectedUserRole, setSelectedUserRole] = useState('Staff')
  const [selectedStatus, setSelectedStatus] = useState('Active')
  const { reset: nameReset, ...name } = useField('name', 'text')
  const { reset: addressReset, ...address } = useField('address', 'text')
  const { reset: emailReset, ...email } = useField('name', 'email')
  const { reset: phoneReset, ...phone } = useField('phone', 'text')
  const { reset: usernameReset, ...username } = useField('username', 'text')

  const handleUserRole = (e: ChangeEvent<HTMLSelectElement>) => setSelectedUserRole(e.target.value)
  const handeleStatus = (e: ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)

  const resetForm = () => {
    nameReset()
    emailReset()
    addressReset()
    phoneReset()
    usernameReset()
  }

  const handleClose = () => {
    resetForm()
    setShow(!show)
  }
  const formData = {
    username: username.value,
    email: email.value,
    mobileNumber: phone.value,
    name: name.value,
    status: (selectedStatus as string).toLowerCase(),
    role: selectedUserRole,
    businessId: business?._id,
    address: address.value
  } as Partial<User>

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
    createUser(formData)
  }

  useEffect(() => {
    if (success) {
      resetForm()
      setShow(false)
    }
  })

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New User
          {err && <span className='err'>-{err}</span>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body id='mod-body'>
        <Container>
          <Form>
            <div className="user-name-div">
              <Form.Label>Name:</Form.Label>
              <Form.Control {...name}
              />
            </div>
            <div className="username-phone">
              <div className="username-div">
                <Form.Label>Username:</Form.Label>
                <Form.Control {...username}
                />
              </div>
              <div className="phone-div">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control {...phone}
                />
              </div>
            </div>
            <div className="email-div">
              <Form.Label>Email:</Form.Label>
              <Form.Control {...email}
              />
            </div>
            <div className="role-status">
              <div className="role-div">
                <Form.Label>User Role:</Form.Label>
                <Form.Select
                  name="userRole"
                  value={selectedUserRole}
                  onChange={handleUserRole}
                >
                  {['Staff', 'Manager', 'Owner'].map((role, idx) => (
                    <option key={idx} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="status-div">
                <Form.Label>Status:
                  <span className="info">-Setting to inactive will prevent the user from logging in.</span>
                </Form.Label>
                <Form.Select
                  name="userStatus"
                  value={selectedStatus}
                  onChange={handeleStatus}
                >
                  {['Active', 'Inactive'].map((status, idx) => (
                    <option key={idx} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div className="address-div">
              <Form.Label>Address:</Form.Label>
              <Form.Control {...address}
              />
            </div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer id='cat-footer'>
        <Button id='save-btn' onClick={handleCreate}>
          {loading? 'Loading...' :'Create User'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewUser
