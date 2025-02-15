import { Button, Modal, Form, Container } from 'react-bootstrap'

interface NewUserProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}


const NewUser = ({ show, setShow }: NewUserProps) => {


  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={() => setShow(!show)}>
      <Modal.Header closeButton>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={() => {}}>
            <div className="user-name-div">
              <Form.Label>Name:</Form.Label>
              <Form.Control
              />
            </div>
            <div className="username-div">
              <Form.Label>Username:</Form.Label>
              <Form.Control
              />
            </div>
            <div className="phone-div">
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control
              />
            </div>
            <div className="role-status">
              <div className="role-div">
                <Form.Label>User Role:</Form.Label>
                <Form.Select
                  name="userRole"
                >
                  {['Staff', 'Manager', 'User'].map((role, idx) => (
                    <option key={idx} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="status-div">
                <Form.Label>User Status:</Form.Label>
                <Form.Select
                  name="userStatus"
                >
                  {['Active', 'Inactive'].map((status, idx) => (
                    <option key={idx} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div className="lang-div">
              <Form.Label>Preferred Language:</Form.Label>
              <Form.Select
                name="preferredLanguage"
              >
                {['English'].map((language, idx) => (
                  <option key={idx} value={language}>
                    {language}
                  </option>
                ))}
              </Form.Select>
            </div>
            <Button variant="primary" type="submit">
                Save User
            </Button>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
            Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewUser
