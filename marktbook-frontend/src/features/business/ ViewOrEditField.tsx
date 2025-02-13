import Container from 'react-bootstrap/Container'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import '@styles/view-or-edit.scss'

interface ViewOrEditProps {
    fieldName: string
    fieldValue: string
    disableEdit: boolean
    setDisableEdit: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit?: () => void
    fe?: boolean
    dropDownFields?: string[]
}


const ViewOrEdit = ({ fieldName, fieldValue, onSubmit, fe, dropDownFields, disableEdit, setDisableEdit }: ViewOrEditProps) => {
  const [hideEdit, setHideEdit] = useState(true)
  const { reset, ...field } = useField(fieldName, 'text', fieldValue)
  const [selectedDdvalue, setSelectedDdvalue] = useState<string>(fieldValue?? '')
  const handleDd = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedDdvalue(event.target.value)

  const handleSave = () => {
    if(onSubmit) onSubmit()
    reset()
  }

  const handleEdit = () => {
    setHideEdit(!hideEdit)
    setDisableEdit(true)
  }
  const handleCancel = () => {
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
                <Form.Label htmlFor={fieldName}>{fieldName}</Form.Label>
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
          {!hideEdit && <Button variant='primary' onClick={handleSave}>Save</Button> }
        </div>
      </div>
    </Container>

  )
}

export default ViewOrEdit