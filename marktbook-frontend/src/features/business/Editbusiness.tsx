import Container from 'react-bootstrap/Container'
import ViewOrEdit from './ ViewOrEditField'
import './index.scss'
import { BusinessCategory, BusinessType } from '@typess/auth'
import { useState } from 'react'
import icons from '@assets/icons'
import { useBusiness } from '@hooks/useBusiness'
import Notify from '@components/Notify'
import ChangeImage from './ChangeImage'

const EditBusiness = () => {
  const { business, update, loading, clearError, error, success } = useBusiness()
  const [hideEdit, setHideEdit] = useState(false)
  const [show, setShow] = useState(false)

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
          fieldData={{ fieldValue: business?.phoneNumber === '' ? '-'
            : business?.phoneNumber?? '-', fieldKey: 'phoneNumber' }}
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

      <ChangeImage show={show}
        loading={loading}
        updateBLogo={update}
        imageSrc={business?.businessLogo ?? ''}
        id={business!._id}
        setShow={setShow}
      />
    </Container>
  )
}

export default EditBusiness

