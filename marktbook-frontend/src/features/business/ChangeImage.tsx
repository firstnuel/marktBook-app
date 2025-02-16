import { Dispatch, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import icons from '@assets/icons'

interface ChangeImageProps {
    imageSrc: string
    show: boolean
    setShow: Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    usr?: boolean
    id: string
    updateBLogo?: (businessId: string, data: { businessLogo: string }) => void
    updateUser?: (userId: string, data: {profilePicture: string }) => void
}

const ChangeImage = ({ imageSrc, loading, setShow, show, usr, updateBLogo, id, updateUser }: ChangeImageProps) => {
  const [stageImage, setStageImage] = useState(imageSrc?? '')

  const handleImgChange = (e: React.ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files![0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStageImage(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }
  const onHide = () => {
    setStageImage(imageSrc?? '')
    setShow(false)
  }

  const handleSave = () => {
    if (updateBLogo) {
      updateBLogo(id, { businessLogo: stageImage })
    } else if(updateUser) {
      updateUser(id, { profilePicture: stageImage })
    }
  }

  return(
    <Modal show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered >
      <Modal.Header closeButton>
        <Modal.Title>{usr ? 'User Profile Image' :'Update Business Logo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mod-body'>
        <div className="logo-img">
          <img src={stageImage !== ''? stageImage : icons.imagePlaceholder} alt="" className="logo-img" />
        </div>
        <div className="info-input">
          {usr ? <div className="info">Update user profile picture</div>
            : <div className="info">This would be used on generated documents (example. invoices) </div>
          }
          <Form.Control type="file" accept="image/*" onChange={handleImgChange}/>
        </div>
      </Modal.Body>
      <Modal.Footer id='cat-footer'>
        <Button variant="Success" onClick={handleSave}>
          {loading? 'Saving...' :'Save'}
        </Button>
      </Modal.Footer>
    </Modal>)
}

export default ChangeImage