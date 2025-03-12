import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTrans } from '@hooks/useTrans'
import { useBusiness } from '@hooks/useBusiness'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'

interface ConfirmOpsProps {
    id: string
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    complete?: boolean
}


const ConfirmOperation = ({ id, show, setShow, complete }:ConfirmOpsProps ) => {
  const { success, cancelSale, updateSale } = useTrans()
  const { business } = useBusiness()
  const { reset, ...reason } = useField('reason', 'text')
  const [err, setErr] = useState('')

  const handleCancel = () => {
    if (!reason.value) {
      setErr('Please provide a reason')
      return
    }
    cancelSale(id, {
      reason: reason.value as string,
      businessId: business?._id?? ''
    })

  }
  const handleMarkAsComp = () => {
    updateSale(id, {
      status: 'COMPLETED',
      businessId: business?._id?? ''
    })
  }

  const handleClose = () => {
    reset()
    setErr('')
    setShow(false)
  }

  return(
    <>
      <Modal
        show={show}
        onHide={() => {setShow(false)}}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!success} >
          <Modal.Title id="contained-modal-title-vcenter">
            {`Confirm ${complete? 'Mark Sale As Completed' : 'Cancel Sale'}`}
            {err && <span className='err'>-{err}</span>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {success
              ? (complete
                ? 'Sale marked as completed successfully'
                : 'Sale cancelled successfully'
              )
              : `This action will permanently ${complete ? 'mark this sale as completed, ensure that payments have been received'
                : 'cancel this sale'}. This action cannot be undone.`
            }
          </p>
          {!complete &&
            <div>
              <Form.Label>Reason:</Form.Label>
              <Form.Control as="textarea" rows={3} {...reason} />
            </div>
          }
        </Modal.Body>
        <Modal.Footer id='cat-footer'>
          {
            success ?
              <Button id='save-btn' onClick={handleClose}>Close</Button> :
              <Button id={complete? 'save-btn' : ''} variant='danger'onClick={complete? handleMarkAsComp : handleCancel}>
                Proceed
              </Button>
          }
        </Modal.Footer>

      </Modal>
    </>
  )
}

export default ConfirmOperation