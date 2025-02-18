import Form from 'react-bootstrap/Form'
import { User } from '@typess/auth'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { useBusiness } from '@hooks/useBusiness'
import { Business } from '@typess/bizness'

interface ViewToggleProps {
    user?: User
    fieldName: string
    msg?: string
    fieldData : {
        fieldValue: boolean
        fieldKey: string
      }
    disableEdit: boolean
    setDisableEdit: React.Dispatch<React.SetStateAction<boolean>>
    fe?: boolean
}


const ViewOrToggle = ({
  fieldName,
  fieldData,
  fe, msg,
  disableEdit,
  setDisableEdit,
  user,
}: ViewToggleProps) => {
  const { fieldKey, fieldValue } = fieldData
  const [hideEdit, setHideEdit] = useState(true)
  const [checked, setChecked] = useState<boolean>(fieldValue)
  const { business, update, loading, updateUser } = useBusiness()

  const handleSave = () => {
    const formData: Partial<Business> = {
      notifications: {
        ...business!.notifications,
        [fieldKey as keyof Business['notifications'] ]: checked
      }
    }
    update(business!._id, formData)
    setHideEdit(!hideEdit)
    setDisableEdit(false)
  }

  const handleUserSave = () => {
    const formData = {
      notificationPreferences: {
        ...user?.notificationPreferences,
        [fieldKey as keyof User['notificationPreferences'] ]: checked
      }
    }
    updateUser(user!._id, formData)
    setHideEdit(!hideEdit)
    setDisableEdit(false)
  }

  const handleEdit = () => {
    setHideEdit(!hideEdit)
    setDisableEdit(true)
  }
  const handleCancel = () => {
    setChecked(fieldValue)
    setHideEdit(!hideEdit)
    setDisableEdit(false)
  }

  return(
    <Container className={fe? 've-container fe' : 've-container'}>
      <div className="field-div">
        <div className="field-name-value">
          <div className="field-name"> {fieldName}</div>
          <div className="field-value">
            { hideEdit ?
              <div className="view-field">{fieldValue? 'On' : 'Off'}</div>
              : <div className="edit-field">
                <Form.Label htmlFor={fieldName}>{msg? msg : fieldName} </Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
              </div>
            }
          </div>
        </div>
        <div className="action-btns">
          {hideEdit?
            <button className={disableEdit? 'disable' : 'edit-or-cancel'}
              onClick={disableEdit? () => {} : handleEdit} disabled={disableEdit}>Edit</button>
            : <button className="edit-or-cancel" onClick={handleCancel}>Cancel</button>
          }
          {!hideEdit && <Button variant='primary' disabled={loading}
            onClick={user ? handleUserSave : handleSave}>{loading? 'Saving...' : 'Save'}</Button> }
        </div>
      </div>
    </Container>
  )
}






export default ViewOrToggle