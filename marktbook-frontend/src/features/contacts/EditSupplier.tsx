import Container from 'react-bootstrap/Container'
import ViewOrEditContacts from './ViewEditContact'
import { useState } from 'react'
import icons from '@assets/icons'
import { useContacts } from '@hooks/useContacts'
import Notify from '@components/Notify'
import IconBox from '@components/IconBox'
import ConfirmDelete from '@features/business/ConfimDelete'

const EditSupplier = () => {
  const { clearError, success, error, loading, supplier, rmContacts, deleteSupplier } = useContacts()
  const [hideEdit, setHideEdit] = useState(false)

  return (
    <Container className="edit-business">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">Supplier Details</div>
          <div className="desc">Manage supplier account information</div>
        </div>
        <div className="back" onClick={() => rmContacts()}>
          <IconBox src={icons.arrowback} clName='img-div'/>
          <span className="text">Back</span>
        </div>
      </div>
      <Container className='edit-con'>
        <ViewOrEditContacts fieldName='Name'
          fieldData={{ fieldValue: supplier?.name ?? '',
            fieldKey: 'name' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Contact Person'
          fieldData={{ fieldValue: supplier?.contactPerson ?? '',
            fieldKey: 'contactPerson' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Email address'
          fieldData={{ fieldValue: supplier?.email ?? '',
            fieldKey: 'email' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Phone number'
          fieldData={{ fieldValue: supplier?.phone === '' ? '-'
            : supplier?.phone ?? '-', fieldKey: 'phone' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Address'
          fieldData={{ fieldValue: supplier?.address ?? '-', fieldKey: 'address' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Supplier Type'
          fieldData={{ fieldValue: supplier?.supplierType ?? '-', fieldKey: 'supplierType' }}
          setDisableEdit={setHideEdit}
          dropDownFields={['Manufacturer', 'Distributor', 'Retailer', 'Wholesaler']}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Company Name'
          fieldData={{ fieldValue: supplier?.companyName ?? '-', fieldKey: 'companyName' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ViewOrEditContacts fieldName='Preferred Payment Method'
          fieldData={{ fieldValue: supplier?.preferredPaymentMethod ?? '-', fieldKey: 'preferredPaymentMethod' }}
          setDisableEdit={setHideEdit}
          dropDownFields={['Bank Transfer', 'Cash', 'Credit Card', 'Cheque']}
          disableEdit={hideEdit}
          contact='Supplier'
        />
        <ConfirmDelete id={supplier!._id} deleteFn={deleteSupplier} contacts successMsg={success} loading={loading} />
      </Container>
    </Container>
  )
}

export default EditSupplier
