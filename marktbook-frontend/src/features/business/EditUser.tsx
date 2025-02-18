import Container from 'react-bootstrap/Container'
import ViewOrEdit from './ ViewOrEditField'
import './index.scss'
import { useState } from 'react'
import icons from '@assets/icons'
import { useBusiness } from '@hooks/useBusiness'
import Notify from '@components/Notify'
import ChangeImage from './ChangeImage'
import { User } from '@typess/auth'
import IconBox from '@components/IconBox'
import ConfirmDelete from './ConfimDelete'
import ViewOrToggle from './ViewOrToggle'

interface EditUserProps {
  currentUser?: User
}

const EditUser = ({ currentUser }: EditUserProps ) => {
  const { user, updateUser, loading, clearError, error, success, rmUser, deleteUser } = useBusiness()
  const [hideEdit, setHideEdit] = useState(false)
  const [show, setShow] = useState(false)

  const User = currentUser ?? user ?? undefined

  return(
    <Container className="edit-business">
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info">
        <div className="name-desc">
          <div className="name">User Details</div>
          <div className="desc">Manage user account information</div>
        </div>
        <div className="back" onClick={() => rmUser()}>
          <IconBox src={icons.arrowback} clName='img-div'/>
          <span className="text">Back</span>
        </div>
      </div>
      <Container className='edit-con'>
        <div className="user-pic" style={{ backgroundImage: `url(${User?.profilePicture === '' ?
          icons.imagePlaceholder : User?.profilePicture })` }}>
          <img src={icons.cameraIcon} alt="Upload" onClick={() => setShow(true)} className="upload-img" />
        </div>
        <ViewOrEdit fieldName='Name'
          fieldData={{ fieldValue: User?.name ?? '',
            fieldKey: 'name' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrEdit fieldName='Userame'
          fieldData={{ fieldValue: User?.username ?? '',
            fieldKey: 'username' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrEdit fieldName='Email address'
          fieldData={{ fieldValue: User?.email ?? '',
            fieldKey: 'email' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrEdit fieldName='Phone number'
          fieldData={{ fieldValue: user?.mobileNumber === '' ? '-'
            : User?.mobileNumber?? '-', fieldKey: 'mobileNumber' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrEdit fieldName='User role'
          fieldData={{ fieldValue: User?.role ?? '', fieldKey: 'role' }}
          dropDownFields={['Owner', 'Manager', 'Staff',]}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrEdit fieldName='Status'
          fieldData={{ fieldValue: User?.status ?? '', fieldKey: 'status' }}
          dropDownFields={['active', 'inactive',]}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
          status={true}
        />
        <ViewOrEdit fieldName='Address'
          fieldData={{ fieldValue: User?.address ?? '-', fieldKey: 'address' }}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrEdit fieldName='Language'
          fieldData={{ fieldValue: User?.languagePreference ?? '', fieldKey: 'languagePreference' }}
          dropDownFields={['english',]}
          setDisableEdit={setHideEdit}
          disableEdit={hideEdit}
          user={User}
        />
        <ViewOrToggle  fieldName='Email notifications'
          fieldData={{ fieldValue: User?.notificationPreferences.emailNotifications ??
        false, fieldKey: 'emailNotifications' }}
          user={User}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
          msg="If toggled off, the user will not receive business-related notifications by email."
        />
        <ViewOrToggle  fieldName='Phone notifications'
          fieldData={{ fieldValue: User?.notificationPreferences.smsNotifications ??
        false, fieldKey: 'smsNotifications' }}
          user={User}
          disableEdit={hideEdit}
          setDisableEdit={setHideEdit}
          msg="If toggled off, the user will not receive business-related notifications by text message."
        />


        <ConfirmDelete id={user!._id} deleteFn={deleteUser} user successMsg={success} loading={loading} />
      </Container>

      <ChangeImage show={show}
        loading={loading}
        updateUser={updateUser}
        imageSrc={user?.profilePicture ?? ''}
        id={User!._id}
        setShow={setShow}
        usr={true}
      />
    </Container>
  )
}

export default EditUser

