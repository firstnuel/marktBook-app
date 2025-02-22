import { useState, ChangeEvent, useEffect } from 'react'
import { Button, Modal, Form, Container } from 'react-bootstrap'
import { useStocks } from '@hooks/useStocks'
import { useField } from '@hooks/useField'
import { LocationTypes, Status } from '@typess/inv'
import { useBusiness } from '@hooks/useBusiness'
import { useAuth } from '@hooks/useAuth'
import { Location } from '@typess/stocks'

interface NewLocationProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewLocation = ({ show, setShow }: NewLocationProps) => {
  const [err, setErr] = useState('')
  const { loading, createLocation, success } = useStocks()
  const { business, users } = useBusiness()
  const { user } = useAuth()
  const [selectedLocationType, setSelectedLocationType] = useState<LocationTypes>(LocationTypes.WAREHOUSE)
  const [selectedStatus, setSelectedStatus] = useState<Status>(Status.ACTIVE)
  const [selectedUsers, setSelectedUsers] = useState(user?._id)
  const { reset: nameReset, ...locationName } = useField('locationName', 'text')
  const { reset: addressReset, ...address } = useField('address', 'text')
  const { reset: capacityReset, ...capacity } = useField('capacity', 'number')
  const { reset: currentLoadReset, ...currentLoad } = useField('currentLoad', 'number')

  const handleLocationType = (e: ChangeEvent<HTMLSelectElement>) => setSelectedLocationType(e.target.value as LocationTypes)
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value as Status)
  const handleUser = (e: ChangeEvent<HTMLSelectElement>) => setSelectedUsers(e.target.value)

  const resetForm = () => {
    nameReset()
    addressReset()
    capacityReset()
    currentLoadReset()
  }

  const handleClose = () => {
    resetForm()
    setShow(false)
  }

  const formData: Partial<Location> = {
    locationName: String(locationName.value),
    address: String(address.value),
    locationType: selectedLocationType,
    locationStatus: selectedStatus,
    manager:  selectedUsers,
    businessId: business?._id,
  }

  const handleCreate = () => {
    for (const val of Object.values(formData)) {
      if (val === '' || val === undefined) {
        setErr('No mandatory(*) field can be empty')
        const timer = setTimeout(() => {
          setErr('')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
    if (currentLoad.value) {
      formData.currentLoad = Number(currentLoad.value)
    }
    if (capacity.value) {
      formData.capacity = Number(capacity.value)
    }
    console.log(formData)
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
        <Modal.Title>Create New Location {err && <span className='err'>-{err}</span>}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={() => {}}>
            <div className="user-name-div">
              <Form.Label>Location Name: *</Form.Label>
              <Form.Control {...locationName} />
            </div>
            <div className="username-phone">
              <div className="username-div">
                <Form.Label>Address: *</Form.Label>
                <Form.Control {...address} />
              </div>
            </div>
            <div className="email-div">
              <Form.Label>Manager: *</Form.Label>
              <Form.Select
                name="manager"
                value={selectedUsers}
                onChange={handleUser}
              >
                <option value={user?._id}>{user?.name}</option>
                {users.map((user, idx) => (
                  <option key={idx} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="role-s">
              <div className="role-div">
                <Form.Label>Location Type: *</Form.Label>
                <Form.Select
                  name="locationType"
                  value={selectedLocationType}
                  onChange={handleLocationType}
                >
                  {['Warehouse', 'Storefront', 'Office'].map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="status-div">
                <Form.Label>Status: *</Form.Label>
                <Form.Select
                  name="locationStatus"
                  value={selectedStatus}
                  onChange={handleStatus}
                >
                  {['Active', 'Inactive'].map((status, idx) => (
                    <option key={idx} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div className="n-div">
              <div className="c-div">
                <Form.Label>Capacity:</Form.Label>
                <Form.Control {...capacity} />
              </div>
              <div className="l-div">
                <Form.Label>Current Load:</Form.Label>
                <Form.Control {...currentLoad} />
              </div>
            </div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer id='cat-footer'>
        <Button className='c-btn' variant="success" onClick={handleCreate}>
          {loading ? 'Loading...' : 'Create Location'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewLocation
