import Container from 'react-bootstrap/Container'
// import Form from 'react-bootstrap/Form'
import ViewOrEdit from './ ViewOrEditField'
import './index.scss'
import { BusinessCategory, BusinessType } from '@typess/auth'
import { useState } from 'react'
import icons from '@assets/icons'

const EditBusiness = () => {
  const [hideEdit, setHideEdit] = useState(false)
  //   const handleImgChange = () => {}

  return(
    <Container className="edit-business">
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Business Details</div>
          <div className="desc">Manage your business information</div>
        </div>
        <div className="business-logo" style={{ backgroundImage: `url(${icons.logoPlaceholder})` }}>
          <img src={icons.cameraIcon} alt="Upload" className="upload-img" />
        </div>
      </div>
      <Container className='edit-con'>
        <ViewOrEdit fieldName='Business name' fieldValue='Namaste Business Nigga inc' fe={true} setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
        <ViewOrEdit fieldName='Email address' fieldValue='esso@gmail.com' setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
        <ViewOrEdit fieldName='Phone number' fieldValue='+35712345678' setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
        <ViewOrEdit fieldName='Currency' fieldValue='USD' dropDownFields={['USD', 'NGN', 'EUR',]} setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
        <ViewOrEdit fieldName='Address' fieldValue='Tullimienhentie 3 C23, 90560 Oulu, Finland' setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
        <ViewOrEdit fieldName='Business Type' fieldValue='Technology' dropDownFields={Object.values(BusinessType)} setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
        <ViewOrEdit fieldName='Business Category' fieldValue='Retail' dropDownFields={Object.values(BusinessCategory)} setDisableEdit={setHideEdit} disableEdit={hideEdit}/>
      </Container>

    </Container>
  )
}

export default EditBusiness


//          <Form.Control type="file" accept="image/*" onChange={handleImgChange}/>