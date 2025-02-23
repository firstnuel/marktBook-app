import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react'
import { useBusiness } from '@hooks/useBusiness'
import './index.scss'
import { useAuth } from '@hooks/useAuth'
import { useField } from '@hooks/useField'
import { useContacts } from '@hooks/useContacts'
import { useStocks } from '@hooks/useStocks'


interface ConfirmDeleteProps {
    id: string
    user?: boolean
    contacts?: boolean
    deleteFn: (id: string) => void
    successMsg: string | null
    loading: boolean
    location?: boolean
    disable?: boolean
}


const ConfirmDelete = ({ id='1234', user, deleteFn, loading, contacts, successMsg, location, disable }: ConfirmDeleteProps) => {
  const [modalShow, setModalShow] = useState(false)
  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState(false)
  const { reset, ...deleteBusiness } = useField('deleteBusiness', 'text')
  const { rmUser } = useBusiness()
  const { logout } = useAuth()
  const { rmContacts } = useContacts()
  const { rmLocation } = useStocks()

  useEffect(() => {
    if(successMsg && successMsg !== 'User fetched successfully' &&
        successMsg !== 'No user found' &&
        successMsg !== 'Customer data fetched successfully' &&
        successMsg !== 'Supplier data fetched successfully' &&
        successMsg !== 'Users data fetched successfully') {
      setSuccess(true)
    }
  }, [successMsg])

  const handleDelete = () => {
    if (user || contacts || location) {
      deleteFn(id)
    } else {
      if((deleteBusiness.value as string).trim() === 'Delete business') {
        deleteFn(id)
        reset()
      } else {
        setErr(true)
      }
    }
  }

  const handleClose = () => {
    if(user) {
      rmUser()
    } else if(contacts) {
      rmContacts()
    } else if (location) {
      rmLocation()
    } else {
      logout()
    }
    setSuccess(false)
  }

  return (
    <>
      <div className='confim-delete'>
        <Button id='cta-btn' disabled={disable}
          onClick={() => setModalShow(true)}>
          {user
            ? 'Delete User'
            : location
              ? 'Delete Location'
              : contacts
                ? 'Delete Account'
                : 'Delete Business'}
        </Button>
      </div>
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false)
          setErr(false)
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!success} >
          <Modal.Title id="contained-modal-title-vcenter">
                      Confirm delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {success ? 'Account has been successfully deleted.' :
              location? 'This action will permanently delete this location.' :
                contacts ? 'This action will permanently delete this contact account.' :
                  user ? 'This action will permanently delete this user account.' :
                    'This action will permanently delete this business account, along with all associated user accounts, inventory, and transactions.'
            }
          </p>
          {!user && !contacts && !success && !location &&
          <>
            <Form.Label>Enter '<strong>Delete business</strong>' to confirm</Form.Label>
            <Form.Control className={err? 'err' : ''} {...deleteBusiness} />
          </>}
        </Modal.Body>
        <Modal.Footer id='cat-footer'>
          {
            success ?
              <Button onClick={handleClose}>Close</Button> :
              <Button variant='danger'onClick={handleDelete}>{loading ? 'Deleting...' :
                user ? 'Delete User' : location ? 'Delete Location' : contacts ? 'Delete Account' : 'Delete Business'
              }</Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}


export default ConfirmDelete