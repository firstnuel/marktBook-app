/* eslint-disable @typescript-eslint/no-unused-vars */
import Container from 'react-bootstrap/Container'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { Business, IBusinessBankAccount } from '@typess/bizness'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'
import { useBusiness } from '@hooks/useBusiness'


interface VBNKProps {
    disableEdit: boolean
    setDisableEdit: Dispatch<SetStateAction<boolean>>
    business: Business
    err: string | null
}


const ViewOrEditBank = ({ disableEdit, setDisableEdit, business, err }: VBNKProps) => {
  const [hideEdit, setHideEdit] = useState(true)
  const { update, loading } = useBusiness()
  const { reset: acctNameReset, ...accountName } = useField('accountName', 'text', business.businessAccount?.accountName?? '')
  const { reset: acctNumberReset, ...accountNumber } = useField('accountNumber', 'text', business.businessAccount?.accountNumber?? '')
  const { reset: bnkNameReset, ...bankName } = useField('bankName', 'text', business.businessAccount?.bankName?? '')
  const { reset: acctTypeReset, ...accountType } = useField('accountType', 'text', business.businessAccount?.accountType?? '')


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      accountName: accountName.value,
      accountNumber: accountNumber.value,
      bankName: bankName.value,
    } as IBusinessBankAccount
    if (accountType.value) data.accountType = accountType.value as string

    update(business._id, { businessAccount: data })

  }

  const handleCancel = () => {
    accountName.onChange(business.businessAccount?.accountName?? '')
    accountNumber.onChange(business.businessAccount?.accountNumber?? '')
    bankName.onChange(business.businessAccount?.bankName?? '')
    accountType.onChange(business.businessAccount?.accountType?? '')
    setHideEdit(true)
    setDisableEdit(false)
  }

  const handleEdit = () => {
    setHideEdit(!hideEdit)
    setDisableEdit(true)
  }

  return(
    <Container className='ve-container fe'>
      <div className="field-div">
        <div className="field-name-value">
          <div className="field-name"> Bank Payments</div>
          <div className="field-value">
            {hideEdit?
              <div className="view-field">{business.businessAccount?.accountName ? 'Configured' : 'Not Configured'}</div>
              :
              <div className="edit-field">
                <span className="info" style={{ color: 'darkgray' }}>This will be used on generated invoices.</span>
                {err && <span>-{err}</span>}
                <Form className='bnk-form' onSubmit={handleSubmit}>
                  <div className="edit-form">
                    <Form.Label htmlFor='Account Name'>Account Name</Form.Label>
                    <Form.Control {...accountName} />
                  </div>
                  <div className="edit-form">
                    <Form.Label htmlFor='Acount Number'>Account Number (IBAN)</Form.Label>
                    <Form.Control {...accountNumber} />
                  </div>
                  <div className="edit-form">
                    <Form.Label htmlFor='Bank Name'>Bank Name</Form.Label>
                    <Form.Control {...bankName} />
                  </div>
                  <div className="edit-form">
                    <Form.Label htmlFor='Account Type'>Account Type
                      <span className="info" style={{ color: 'darkgray' }}>optional</span>
                    </Form.Label>
                    <Form.Control {...accountType} required={false} />
                  </div>
                  <div className="edit-form sub-btn-div">
                    <Button type='submit'>{loading? 'Saving...' : 'Submit'}</Button>
                  </div>
                </Form>
              </div>
            }
          </div>
        </div>
        <div className="action-btns">
          {hideEdit?
            <button className={disableEdit? 'disable' : 'edit-or-cancel'}
              onClick={disableEdit? () => {} : handleEdit} disabled={disableEdit}>Edit</button>
            : <button className="edit-or-cancel" onClick={handleCancel}>Close</button>
          }
        </div>
      </div>

    </Container>
  )
}

export default ViewOrEditBank