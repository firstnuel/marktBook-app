import Container from 'react-bootstrap/Container'
import './index.scss'
import { useState } from 'react'
import { useBusiness } from '@hooks/useBusiness'
import Notify from '@components/Notify'
import ViewOrToggle from './ViewOrToggle'

const EditNotifications = () => {
  const { business, clearError, success, error } = useBusiness()
  const [hideEdit, setHideEdit] = useState(false)

  return(
    <Container className="edit-business">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Notifications</div>
          <div className="desc">Manage your business notifications</div>
        </div>
      </div>
      <Container className='edit-con'>
        <ViewOrToggle  fieldName='Sales'
          fieldData={{ fieldValue: business?.notifications?.sales ??
        false, fieldKey: 'sales' }}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
          fe
        />
        <ViewOrToggle  fieldName='Stock level'
          fieldData={{ fieldValue: business?.notifications?.stockLevel ??
        false, fieldKey: 'stockLevel' }}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
        />
        <ViewOrToggle  fieldName='Due sales payment'
          fieldData={{ fieldValue: business?.notifications?.dueCreditSales ??
        false, fieldKey: 'dueCreditSales' }}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
        />
        <ViewOrToggle  fieldName='User Data Change'
          fieldData={{ fieldValue: business?.notifications?.userDataChange ??
        false, fieldKey: 'userDataChange' }}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
        />
      </Container>
    </Container>
  )
}

export default EditNotifications

