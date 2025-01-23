/* eslint-disable indent */
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import '@styles/view-edit.scss'
import { IStockData, IStock, LocationTypes, Status } from '@typess/inv'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { useInv } from '@hooks/useInv'
import { useState } from 'react'
import { useField } from '@hooks/useField'

interface StockForm {
  stock?: IStock
}

const StockForm = ({ stock }: StockForm) => {
  const [showLForm, setShowLForm] = useState(true)
  const [isChecked, setIsChecked] = useState(false)
  const [selectedLtype, setSelectedLtyped] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Active')
  const { success, error, loading, addStock, product } = useInv()
  const { reset: unitsReset, ...unitsAvailable } = useField('unitsAvailable', 'number', stock?.unitsAvailable?? '')
  const { reset: maxReset, ...maxQuantity } = useField('maxQuantity', 'number', stock?.maxQuantity?? '')
  const { reset: minReset, ...minQuantity } = useField('minQuantity', 'number', stock?.minQuantity?? '')
  const { reset: costReset, ...costPerUnit } = useField('costPerUnit', 'number', stock?.costPerUnit?? '')
  const { reset: totalReset, ...totalValue } = useField('totalValue', 'number', stock?.totalValue?? '')
  const { reset: compReset, ...compartment } = useField('compartment', 'text', stock?.compartment?? '')
  const { reset: notesReset, ...notes } = useField('notes', 'text', stock?.notes?? '')
  const { reset: locationReset, ...locationName } = useField('locationName', 'text', '')
  const { reset: addressReset, ...address } = useField('address', 'text', '')
  const { reset: capacityReset, ...capacity } = useField('capacity', 'number', '')

  const clearForm = () => {
    unitsReset()
    maxReset()
    minReset()
    costReset()
    totalReset()
    compReset()
    notesReset()
    locationReset()
    addressReset()
    capacityReset()
  }

  const stockData: IStockData = {
    productId: product!._id,
    businessId: product!.businessId,
    unitsAvailable: parseInt(unitsAvailable.value as string),
    maxQuantity: parseInt(maxQuantity.value as string),
    minQuantity: parseInt(minQuantity.value as string),
    thresholdAlert: isChecked,
    costPerUnit: parseInt(costPerUnit.value as string),
    notes: notes.value as string?? '',
    totalValue: parseInt(totalValue.value as string),
    locationName: locationName.value as string,
    locationType: selectedLtype as LocationTypes,
    address: address.value as string,
    compartment: compartment.value as string,
    locationStatus: selectedStatus as Status

  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addStock(stockData)
  }

  return (
    <Container className="whole">
      <div className="head-info">
        <div className="head-name">
          {stock ? 'Add Stock Data' : 'Create Stock Data'}
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Success</div>}
        <div className="action-btns">
          <div className="back">
            <IconBox src={icons.arrowback} clName="img-div" />
            <span className="text">Back</span>
          </div>
          {stock && <Button variant="secondary">Product Data</Button>}
        </div>
      </div>
      <Container className="form-content">
        <Form
          className="form"
          onSubmit={stock ? handleEditSubmit : handleCreateSubmit}
        >
          <div className="stock-info">
            <div className="unitsAv">
              <div>Units Available:</div>
              <Form.Control {...unitsAvailable} />
            </div>
            <div className="maxQ">
              <div>Max Quantity:</div>
              <Form.Control {...maxQuantity} />
            </div>
            <div className="minQ">
              <div>Min Quantity:</div>
              <Form.Control {...minQuantity} />
            </div>
          </div>
          <div className="cost-info">
            <div className="thresholdAlert">
              <Form.Check
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <div>Threshold Alert</div>
            </div>
            <div className="costPerUnit">
              <div>
                Cost Per Unit: <span className="optional">optional</span>
              </div>
              <Form.Control {...costPerUnit} required={false} />
            </div>
            <div className="totalValue">
              <div>
                Total Value: <span className="optional">optional</span>
              </div>
              <Form.Control {...totalValue} required={false} />
            </div>
          </div>
          <div className="compartment">
            <div>
              Compartment: <span className="optional">optional</span>
            </div>
            <Form.Control {...compartment} required={false} />
          </div>
          <div className="notes">
            <div>
              Notes: <span className="optional">optional</span>
            </div>
            <Form.Control
              as="textarea"
              {...notes}
              required={false}
              rows={2}
            />
          </div>
          <div className="section-two">
            <div className="sec-text">Location Info</div>
            <Button
              variant="secondary"
              onClick={() => setShowLForm(!showLForm)}
            >
              {!showLForm ? 'New Location' : 'Select Location'}
            </Button>
          </div>
          <div className="location">
            {showLForm ? (
              <div className="location-form">
                <div className="name-type">
                  <div className="lname">
                    <div>Location Name:</div>
                    <Form.Control {...locationName} />
                  </div>
                  <div className="ltype">
                    <div>Location Type:</div>
                    <Form.Select
                    value={selectedLtype}
                    onChange={(e) => setSelectedLtyped(e.target.value)}
                    className="select-location">
                      <option>Choose Location Type</option>
                      {Object.values(LocationTypes).map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <div className="address">
                  <div>Location Address:</div>
                  <Form.Control {...address} />
                </div>
                <div className="status-capac">
                  <div className="status">
                    <div>Location Status:</div>
                    <Form.Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                     className="select-location">
                      <option value={'Active'}>Active</option>
                      <option value={'Inactive'}>Inactive</option>
                    </Form.Select>
                  </div>
                  <div className="capacity">
                    <div>
                      Location Capacity:<span className="optional">optional</span>
                    </div>
                    <Form.Control {...capacity} />
                  </div>
                </div>
              </div>
            ) : (
              <Form.Select className="select-location">
                <option>Choose Location</option>
              </Form.Select>
            )}
          </div>
          <div className="form-btns-div">
            <Button variant="primary" type="submit" disabled={loading}>
              {stock
                ? loading
                  ? 'Saving'
                  : 'Save Changes'
                : loading
                ? 'Adding'
                : 'Add stock'}
            </Button>
            {!stock && (
              <Button variant="danger" onClick={clearForm}>Clear Form</Button>
            )}
            {stock && <Button variant="danger">Delete</Button>}
          </div>
        </Form>
      </Container>
    </Container>
  )
}

export default StockForm