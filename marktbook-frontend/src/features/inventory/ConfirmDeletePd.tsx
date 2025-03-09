import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './index.scss'
import { useInv } from '@hooks/useInv'
import { usePos } from '@hooks/usePos'



interface ConfirmDeleteProps {
    id: string
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

const ConfirmDeletePd = ({ id, show, setShow }: ConfirmDeleteProps) => {
  const [success, setSuccess] = useState(false)
  const { deleteProduct, successMsg, rmPrdStck } = useInv()
  const { fetchProducts } = usePos()


  useEffect(() => {
    if(successMsg && successMsg === 'Product deleted successfully') {
      setSuccess(true)
    }
  }, [successMsg])

  const handleDelete = () => {
    deleteProduct(id)
  }

  const handleClose = () => {
    rmPrdStck()
    fetchProducts()
    setSuccess(false)
    setShow(false)
  }

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false)
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!success} >
          <Modal.Title id="contained-modal-title-vcenter">
                      Confirm delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{success ?
            'Product successfully deleted'
            : 'This action will permanently delete this product and its associated stock information. Once deleted, this data cannot be recovered. Are you sure you want to proceed?'}</p>
        </Modal.Body>
        <Modal.Footer id='cat-footer'>
          {
            success ?
              <Button onClick={handleClose}>Close</Button> :
              <Button variant='danger'onClick={handleDelete}>Delete Product</Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}


export default ConfirmDeletePd