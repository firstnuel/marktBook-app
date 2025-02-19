import Container from 'react-bootstrap/Container'
import ViewOrEditContacts from './ViewEditContact'
import { useState } from 'react'
import icons from '@assets/icons'
import { useContacts } from '@hooks/useContacts'
import Notify from '@components/Notify'
import IconBox from '@components/IconBox'
import ViewOrToggleContacts from './ViewToggleContacts'
import ConfirmDelete from '@features/business/ConfimDelete'


const EditCustomer = () => {
  const { clearError, success, error, loading, customer, rmContacts, deleteCustomer } = useContacts()
  const [hideEdit, setHideEdit] = useState(false)


  return (
    <Container className="edit-business">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Customer Details</div>
          <div className="desc">Manage customer account information</div>
        </div>
        <div className="back" onClick={() => rmContacts()}>
          <IconBox src={icons.arrowback} clName='img-div'/>
          <span className="text">Back</span>
        </div>
      </div>
      <Container className='edit-con'>
        <ViewOrEditContacts fieldName='Name'
          fieldData={{ fieldValue: customer?.name ?? '',
            fieldKey: 'name' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Customer'
          fe
        />
        {customer?.customerType === 'Business' &&
       <ViewOrEditContacts fieldName='Business name'
         fieldData={{ fieldValue: customer?.businessName ?? '',
           fieldKey: 'businessName' }}
         setDisableEdit={setHideEdit}
         disableEdit={hideEdit}
         contact='Customer'
       />}
        <ViewOrEditContacts fieldName='Email address'
          fieldData={{ fieldValue: customer?.email ?? '',
            fieldKey: 'email' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Customer'
        />
        <ViewOrEditContacts fieldName='Phone number'
          fieldData={{ fieldValue: customer?.phone === '' ? '-'
            : customer?.phone?? '-', fieldKey: 'phone' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Customer'
        />
        <ViewOrEditContacts fieldName='Address'
          fieldData={{ fieldValue: customer?.address ?? '-', fieldKey: 'address' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Customer'
        />
        <ViewOrEditContacts fieldName='Customer type'
          fieldData={{ fieldValue: customer?.customerType ?? '-', fieldKey: 'customerType' }}
          setDisableEdit={setHideEdit}
          dropDownFields={['Individual', 'Business']}
          disableEdit={hideEdit}
          contact='Customer'
        />
        <ViewOrToggleContacts  fieldName='Marketing Option'
          fieldData={{ fieldValue: customer?.marketingOptIn ??
        false, fieldKey: 'marketingOptIn' }}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
          msg="Allow promotional messages and updates."
        />

        <ConfirmDelete id={customer!._id} deleteFn={deleteCustomer} contacts successMsg={success} loading={loading} />
      </Container>
    </Container>
  )
}

export default EditCustomer

