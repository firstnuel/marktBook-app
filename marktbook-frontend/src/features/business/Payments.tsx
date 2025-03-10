import Container from 'react-bootstrap/Container'
import { useBusiness } from '@hooks/useBusiness'
import { useState } from 'react'
import ViewOrEditBank from './ViewOrEditBnkAccount'
import Notify from '@components/Notify'

const ManagePayments = () => {
  const { business, error, success, clearError } = useBusiness()
  const [hideEdit, setHideEdit] = useState(false)


  return (
    <Container className="edit-business">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Payments</div>
          <div className="desc">Configure payment terminals, integrate with services, and save bank account details.</div>
        </div>
      </div>
      <Container className='edit-con'>
        {business && (
          <ViewOrEditBank
            business={business}
            disableEdit={hideEdit}
            setDisableEdit={setHideEdit}
            err={error}
          />
        )}

        <Container className='ve-container'>
          <div className="field-div">
            <div className="field-name-value">
              <div className="field-name">Pos Terminals</div>
              <div className="view-field">Not Configured</div>
            </div>
            <div className="action-btns">
              <button className='disable' disabled>Feature Unavailable</button>
            </div>
          </div>
        </Container>
      </Container>
    </Container>
  )
}

export default ManagePayments