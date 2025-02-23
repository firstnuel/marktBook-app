/* eslint-disable @typescript-eslint/no-unused-vars */
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Notify from '@components/Notify'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { LocationTypes, Status } from '@typess/inv'
import Button from 'react-bootstrap/Button'
import { useStocks } from '@hooks/useStocks'
import { FormEvent, useState } from 'react'
import { useField } from '@hooks/useField'
import { useBusiness } from '@hooks/useBusiness'
import { useAuth } from '@hooks/useAuth'
import { Location } from '@typess/stocks'
import ConfirmDelete from '@features/business/ConfimDelete'


const EditLocation = () => {

  const { error, clearError, success, setLocation, rmLocation, loading, editLocation, deleteLocation } = useStocks()
  const { users } = useBusiness()
  const { user } = useAuth()
  const [selectedLtype, setSelectedLtyped] = useState(setLocation?.locationType ?? '')
  const [selectedStatus, setSelectedStatus] = useState(setLocation?.locationStatus ?? '')
  const [selectedManagerId, setSelectedManagerId] = useState(setLocation?.manager ?? '')
  const { reset: locationReset, ...locationName } = useField('locationName', 'text', setLocation?.locationName ?? '')
  const { reset: addressReset, ...address } = useField('address', 'text', setLocation?.address ?? '')
  const { reset: capacityReset, ...capacity } = useField('capacity', 'number', setLocation?.capacity ?? '')
  const { reset: loadReset, ...load } = useField('load', 'number', setLocation?.currentLoad ?? '')


  const data: Partial<Location> = {
    locationName: locationName.value as string,
    locationType: selectedLtype as LocationTypes,
    locationStatus: selectedStatus as Status,
    address: address.value as string,
    manager: selectedManagerId === setLocation?.manager ?
      [...users, user].find(user => user?.name === setLocation?.manager)?._id : selectedManagerId,
    currentLoad: Number(load.value),
    capacity: Number(capacity.value),
    businessId: user?.associatedBusinessesId
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    editLocation(setLocation!.id, data)
  }

  return(
    <Container className="whole">
      <Notify error={error} success={success} clearErrFn={clearError} />
      <div className="head-info">
        <div className="head-name">Edit Location Data</div>
        <div className="action-btns">
          <div className="back">
            <IconBox src={icons.arrowback} clName="img-div" />
            <span className="text" onClick={() => rmLocation()}>Back</span>
          </div>
        </div>
      </div>

      <Container className="form-content">
        <Form id='l-form' onSubmit={handleSubmit}>
          <div className="location-form">
            <div className="name">
              <div className="lname">
                <div>Location Name:</div>
                <Form.Control {...locationName}/>
              </div>
              <div className="type">
                <div>Location Type:</div>
                <Form.Select
                  value={selectedLtype}
                  onChange={(e) => setSelectedLtyped(e.target.value as LocationTypes)}
                  className="select-location">
                  <option>Choose Location Type</option>
                  {Object.values(LocationTypes).map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="ltype">
                <div>Manager:</div>
                <Form.Select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="select-location">
                  {[...users, user].map((user, idx) => (
                    <option key={idx} value={user?._id}>{user?.name}</option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div className="address">
              <div>Location Address:</div>
              <Form.Control {...address}/>
            </div>
            <div className="status-capac">
              <div className="status">
                <div>Location Status:</div>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Status)}
                  className="select-location">
                  <option value={'Active'}>Active</option>
                  <option value={'Inactive'}>Inactive</option>
                </Form.Select>
              </div>
              <div className="capacity">
                <div> Location Capacity:</div>
                <Form.Control {...capacity} required={false}/>
              </div>
              <div className="Current Load">
                <div> Current Load:</div>
                <Form.Control {...load} required={false}/>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', color: 'darkgray' }}>You can only delete an empty location. If the location is not empty, you must move the stock to another location first.</p>
            <div className="form-btns-div">
              <ConfirmDelete id={setLocation!.id} location deleteFn={deleteLocation} loading={loading} successMsg={success} disable={setLocation!.stocksLength > 0} />
              <Button variant="primary" className='save-btn' type="submit" disabled={loading}> {loading? 'Saving' : 'Save'} </Button>
            </div>
          </div>
        </Form>
      </Container>
    </Container>
  )
}

export default EditLocation