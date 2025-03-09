/* eslint-disable indent */
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import '@styles/view-edit.scss'
import { EditStockData, IStockData, LocationTypes, Status } from '@typess/inv'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { useInv } from '@hooks/useInv'
import { useState } from 'react'
import { useField } from '@hooks/useField'
import { usePos } from '@hooks/usePos'
import Loading from '@components/Spinner'
import Notify from '@components/Notify'
import { useStocks } from '@hooks/useStocks'
import { useContacts } from '@hooks/useContacts'

const StockForm = () => {
  const { clearError, successMsg,
    error, loading, addStock,
    product, updateStock, stock,
    setMainOpt, fetchProduct,
    rmPrdStck } = useInv()
  const { products } = usePos()
  const [showLForm, setShowLForm] = useState(true)
  const [isChecked, setIsChecked] = useState(stock?.thresholdAlert?? false)
  const [selectedPId, setSelectedPId] = useState('')
  const { locations } = useStocks()
  const { suppliers } = useContacts()
  const [selectedLtype, setSelectedLtyped] = useState(stock?.locationData?.locationType?? '')
  const [selectedStatus, setSelectedStatus] = useState('Active')
  const [selectedLocationId, setSelectedLocationId] = useState(stock?.locationData?.locationName?? '')
  const [selectedSupplierId, setSelectedSupplierId] = useState(stock?.supplierId?? '')
  const { reset: unitsReset, ...unitsAvailable } = useField('unitsAvailable', 'number', stock?.unitsAvailable?? '')
  const { reset: maxReset, ...maxQuantity } = useField('maxQuantity', 'number', stock?.maxQuantity?? '')
  const { reset: minReset, ...minQuantity } = useField('minQuantity', 'number', stock?.minQuantity?? '')
  const { reset: costReset, ...costPerUnit } = useField('costPerUnit', 'number', stock?.costPerUnit?? '')
  const { reset: totalReset, ...totalValue } = useField('totalValue', 'number', stock?.totalValue?? '')
  const { reset: compReset, ...compartment } = useField('compartment', 'text', stock?.compartment?? '')
  const { reset: notesReset, ...notes } = useField('notes', 'text', stock?.notes?? '')
  const { reset: locationReset, ...locationName } = useField('locationName', 'text', stock?.locationData?.locationName?? '')
  const { reset: addressReset, ...address } = useField('address', 'text', stock?.locationData?.address?? '')
  const { reset: capacityReset, ...capacity } = useField('capacity', 'number',  stock?.locationData?.capacity?? '')

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value
    setSelectedPId(productId)
    fetchProduct(productId)
  }

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

  const stockData =  product?  {
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
    locationStatus: selectedStatus as Status,
  } as IStockData : {} as IStockData

  if (selectedSupplierId) stockData.supplierId = selectedSupplierId
  if (selectedLocationId) stockData.locationId = selectedLocationId

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const editData: EditStockData = {
      businessId: product!.businessId,
      unitsAvailable: parseInt(unitsAvailable.value as string),
      maxQuantity: parseInt(maxQuantity.value as string),
      minQuantity: parseInt(minQuantity.value as string),
      thresholdAlert: isChecked,
      compartment: compartment.value as string,
      totalValue: parseInt(totalValue.value as string),
      costPerUnit: parseInt(costPerUnit.value as string),
      notes: notes.value as string?? '',
    }
    if(product) updateStock(product?._id, editData)
  }

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (stockData)
      addStock(stockData as IStockData)
  }

  return (
    <Container className="whole">
      <Notify error={error} success={successMsg} clearErrFn={clearError} />
      <div className="head-info">
        <div className="head-name">
          {stock ? 'Edit Stock Data' : 'Add Stock Data'}
        </div>
        <div className="action-btns">
        {product &&  <div className="back">
            <IconBox src={icons.arrowback} clName="img-div" />
           <span className="text" onClick={() => rmPrdStck()}>Back</span>
          </div>}
          {stock && <Button onClick={() => setMainOpt('Products')} variant="secondary">Product Data</Button>}
        </div>
      </div>
      <Container className="form-content">
        {loading && <Loading/>}
      {!stock && !product?._id ? (
        <Form.Select size="lg"
        value={selectedPId}
        onChange={handleSelectProduct}
        >
          <option>Select Product</option>
          {products
          .filter(product => product.stock === null)
          .map((product, idx) => (
            <option key={idx} value={product._id}>{product.productName}</option>
          ))}
        </Form.Select>
      ) : (
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
          <div className="supplier">
          <div>
              Supplier: <span className="optional">optional</span>
            </div>
          <Form.Select className="select-location"
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
          required={false}
          >
              <option>{
              stock?.supplierId ?
              suppliers.find(supplier => supplier._id === stock.supplierId)?.name :
              'Select Supplier'
                }</option>
                {suppliers.map((supplier, idx) => (
                  <option key={idx} value={supplier._id}>{supplier.name}</option>
                ))}
              </Form.Select>
          </div>
          <div className="section-two">
            <div className="sec-text">Location Info
            {stock && <span className="optional">location data cannot be edited here.</span>}
            </div>
            {!stock && <Button
              variant="secondary"
              onClick={() => setShowLForm(!showLForm)}
            >
              {!showLForm ? 'New Location' : 'Select Location'}
            </Button>}
          </div>
          <div className="location">
            {showLForm ? (
              <div className="location-form">
                <div className="name-type">
                  <div className="lname">
                    <div>Location Name:</div>
                    <Form.Control {...locationName} readOnly={stock? true : false}/>
                  </div>
                  <div className="ltype">
                    <div>Location Type:</div>
                    <Form.Select
                    value={selectedLtype}
                    onChange={stock? () => {} : (e) => setSelectedLtyped(e.target.value)}
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
                  <Form.Control {...address} readOnly={stock? true : false}/>
                </div>
                <div className="status-capac">
                  <div className="status">
                    <div>Location Status:</div>
                    <Form.Select
                    value={selectedStatus}
                    onChange={stock? () => {} : (e) => setSelectedStatus(e.target.value)}
                     className="select-location">
                      <option value={'Active'}>Active</option>
                      <option value={'Inactive'}>Inactive</option>
                    </Form.Select>
                  </div>
                  <div className="capacity">
                    <div>
                      Location Capacity:<span className="optional">optional</span>
                    </div>
                    <Form.Control {...capacity} readOnly={stock? true : false}/>
                  </div>
                </div>
              </div>
            ) : (
              <Form.Select className="select-location"
              value={selectedLocationId}
              onChange={stock? () => {} : (e) => setSelectedLocationId(e.target.value)}
              >
                <option>{stock?.locationData?.locationName?? 'Choose Location'}</option>
                {locations.map((location, idx) => (
                  <option key={idx} value={location.id}>{location.locationName}</option>
                ))}
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
          </div>
        </Form>
        )}
      </Container>
    </Container>
  )
}

export default StockForm