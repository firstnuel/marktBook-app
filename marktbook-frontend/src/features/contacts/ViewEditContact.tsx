import Container from 'react-bootstrap/Container'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { useContacts } from '@hooks/useContacts'
import '@styles/view-or-edit.scss'



interface ViewOrEditProps {
    contact: 'Customer' | 'Supplier'
    fieldName: string
    fieldData : {
      fieldValue: string
      fieldKey: string
    }
    disableEdit: boolean
    setDisableEdit: React.Dispatch<React.SetStateAction<boolean>>
    fe?: boolean
    dropDownFields?: string[]
    status?: boolean
}


const ViewOrEditContacts = ({ fieldName,
  fieldData,
  fe,
  dropDownFields,
  disableEdit,
  setDisableEdit,
  contact,
  status
}: ViewOrEditProps) => {

  const { fieldKey, fieldValue } = fieldData
  const [hideEdit, setHideEdit] = useState(true)
  const [err, setErr] = useState('')
  const { customer, supplier, updateSupplier, loading, updateCustomer } = useContacts()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reset, ...field } = useField(fieldName, 'text', fieldValue)
  const [selectedDdvalue, setSelectedDdvalue] = useState<string>(fieldValue?? '')
  const handleDd = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDdvalue(event.target.value)
  }


  const handleCustSave = () => {
    if (dropDownFields) {
      updateCustomer(customer!._id, { [fieldKey]: selectedDdvalue })
    } else {
      if (field.value !== '') {
        updateCustomer(customer!._id, { [fieldKey]: field.value as string })
      }
      else if (field.value.trim() === '') {
        setErr('This field can not be empty')
        const timer = setTimeout(() => {
          setErr('')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
    setHideEdit(!hideEdit)
    setDisableEdit(false)
  }

  const handleSupSave = () => {
    if (dropDownFields) {
      updateSupplier(supplier!._id, { [fieldKey]: selectedDdvalue })
    } else {
      if (field.value !== '') {
        updateSupplier(supplier!._id, { [fieldKey]: field.value as string })
      }
      else if (field.value.trim() === '') {
        setErr('This field can not be empty')
        const timer = setTimeout(() => {
          setErr('')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
    setHideEdit(!hideEdit)
    setDisableEdit(false)
  }

  const handleEdit = () => {
    setHideEdit(!hideEdit)
    setDisableEdit(true)
  }
  const handleCancel = () => {
    field.onChange(fieldValue)
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
              <div className="view-field">{fieldValue}</div>
              : <div className="edit-field">
                <Form.Label htmlFor={fieldName}>{fieldName}
                  {status && <span className="info" style={{ color: 'darkgray' }}>
                    -Setting to inactive will prevent the user from logging in.
                  </span>}</Form.Label>
                {err && <span>-{err}</span>}
                {dropDownFields ?
                  <Form.Select onChange={handleDd} value={selectedDdvalue}>
                    <option value="">{selectedDdvalue? selectedDdvalue :`Select ${fieldName}`}</option>
                    {dropDownFields.map((field, index) => {
                      if (field !== selectedDdvalue)
                        return <option value={field} key={index}>{field}</option>
                    })}
                  </Form.Select>
                  :<Form.Control {...field} />}
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
            onClick={contact === 'Customer' ? handleCustSave : handleSupSave}>{loading? 'Saving...' : 'Save'}</Button> }
        </div>
      </div>
    </Container>

  )
}

export default ViewOrEditContacts