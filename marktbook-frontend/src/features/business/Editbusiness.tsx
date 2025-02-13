import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ViewOrEdit from './ ViewOrEditField'
import './index.scss'
import { BusinessCategory, BusinessType } from '@typess/auth'
import { useState } from 'react'
import icons from '@assets/icons'
import { useBusiness } from '@hooks/useBusiness'
import Notify from '@components/Notify'

const EditBusiness = () => {
  const { business, update, loading, clearError, error, success } = useBusiness()
  const [hideEdit, setHideEdit] = useState(false)
  const [stageImage, setStageImage] = useState(business?.businessLogo?? '')
  const [show, setShow] = useState(false)

  const onHide = () => {
    setStageImage(business?.businessLogo?? '')
    setShow(false)
  }

  const handleSave = () => {
    update(business!._id, {
      businessLogo: stageImage
    })
  }

  const handleImgChange = (e: React.ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files![0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStageImage(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return(
    <Container className="edit-business">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Business Details</div>
          <div className="desc">Manage your business information</div>
        </div>
        <div className="business-logo"
          style={{ backgroundImage: `url(${business?.businessLogo !== ''? business?.businessLogo : icons.logoPlaceholder})` }}>
          <img src={icons.cameraIcon} alt="Upload" onClick={() => setShow(true)} className="upload-img" />
        </div>
      </div>
      <Container className='edit-con'>
        <ViewOrEdit fieldName='Business name'
          fieldData={{ fieldValue: business?.businessName ?? '',
            fieldKey: 'businessName' }} fe={true}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
        <ViewOrEdit fieldName='Email address'
          fieldData={{ fieldValue: business?.email ?? '',
            fieldKey: 'email' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
        <ViewOrEdit fieldName='Phone number'
          fieldData={{ fieldValue: business?.phoneNumber?? '-', fieldKey: 'phoneNumber' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
        <ViewOrEdit fieldName='Currency'
          fieldData={{ fieldValue: business?.currency ?? '', fieldKey: 'currency' }}
          dropDownFields={['USD', 'NGN', 'EUR',]}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
        <ViewOrEdit fieldName='Address'
          fieldData={{ fieldValue: business?.businessAddress ?? '-', fieldKey: 'address' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
        <ViewOrEdit fieldName='Business Type' fieldData={{ fieldValue: business?.businessType ?? '', fieldKey: 'businessType' }}
          dropDownFields={Object.values(BusinessType)}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
        <ViewOrEdit fieldName='Business Category' fieldData={{ fieldValue: business?.businessCategory ?? '', fieldKey: 'businessCategory' }}
          dropDownFields={Object.values(BusinessCategory)}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
        />
      </Container>

      <Modal show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered >
        <Modal.Header closeButton>
          <Modal.Title>Update Business Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mod-body'>
          <div className="logo-img">
            <img src={stageImage !== ''? stageImage : icons.imagePlaceholder} alt="" className="logo-img" />
          </div>
          <div className="info-input">
            <div className="info">This would be used on generated documents (example. invoices) </div>
            <Form.Control type="file" accept="image/*" onChange={handleImgChange}/>
          </div>
        </Modal.Body>
        <Modal.Footer id='cat-footer'>
          <Button variant="Success" onClick={handleSave}>
            {loading? 'Saving...' :'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default EditBusiness

