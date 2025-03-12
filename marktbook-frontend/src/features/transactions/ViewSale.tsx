import Button from 'react-bootstrap/Button'
import { useTrans } from '@hooks/useTrans'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'
import Container from 'react-bootstrap/Container'
import FieldDisplay from './FieldDisplay'
import Notify from '@components/Notify'
import ConfirmOperation from './ConfirmOperation'
import { useState } from 'react'

const ViewSale = () => {
  const { sale, rmSale, clearError, success, error } = useTrans()
  const [showCancel, setShowCancel] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  return (
    <div>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="head-info top">
        <div className="name-desc">
          <div className="name">Sale Details</div>
          <div className="desc">
            {`Manage sale with ID ${sale?.id?.toUpperCase() || ''}`}
          </div>
        </div>
        <div className="new-user">
          <div className="actn-btns">
            <div className="back" onClick={() => rmSale()}>
              <IconBox src={icons.arrowback} clName='img-div'/>
              <span className="text">Back</span>
            </div>
            {sale?.status !== 'COMPLETED' &&
             <><Button variant="primary" onClick={() => setShowComplete(true)}>Mark as Completed</Button>
               <Button variant="danger" onClick={() => setShowCancel(true)}>Cancel Sale</Button></>}
          </div>
        </div>
      </div>

      <Container className='edit-con'>
        <FieldDisplay fieldName='Customer Name' value={sale?.customer?.name?? '-'}  />
        <FieldDisplay fieldName="Initiated By" value={sale?.initiatedBy?.name ?? '-'} />
        {sale?.completedBy &&
        <FieldDisplay fieldName="Initiated By" value={sale?.completedBy?.name ?? '-'} />}
        <FieldDisplay fieldName="Subtotal Amount" value={`${sale?.subtotalAmount ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Tax Amount" value={`${sale?.taxAmount ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Tax Rate" value={`${sale?.taxRate ?? 0}%`} />
        <FieldDisplay fieldName="Discount" value={`${sale?.discount?.value ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Sold Items" items={sale?.saleItems || []} />
        <FieldDisplay fieldName="Payment Method" value={sale?.paymentMethod ?? '-'} />
        <FieldDisplay fieldName="Sale Status" value={sale?.status ?? '-'} />
        <FieldDisplay fieldName="Refund Status" value={sale?.refundStatus ?? '-'} />
        <FieldDisplay fieldName="Total Price" value={`${sale?.totalPrice ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Created At" value={new Date(sale?.createdAt ?? '').toLocaleString() || '-'} />
        {sale?.updatedAt &&
        <FieldDisplay fieldName="Updated At" value={new Date(sale?.updatedAt ?? '').toLocaleString() || '-'} />}
      </Container>
      <ConfirmOperation id={sale?.id ?? ''} setShow={setShowComplete} show={showComplete} complete />
      <ConfirmOperation id={sale?.id ?? ''} setShow={setShowCancel} show={showCancel} />
    </div>
  )
}

export default ViewSale
