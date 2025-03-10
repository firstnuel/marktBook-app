import Button from 'react-bootstrap/Button'
import { useTrans } from '@hooks/useTrans'
import icons from '@assets/icons'
import IconBox from '@components/IconBox'
import Container from 'react-bootstrap/Container'
import FieldDisplay from './FieldDisplay'

const ViewSale = () => {
  const { sale, rmSale } = useTrans()

  return (
    <div>
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
             <><Button variant="primary">Mark as Completed</Button>
               <Button variant="danger">Cancel Sale</Button></>}
          </div>
        </div>
      </div>

      <Container className='edit-con'>
        <FieldDisplay fieldName='Customer Name' value={sale?.customer?.name?? '-'}  />
        <FieldDisplay fieldName="Initiated By" value={sale?.initiatedBy?.name ?? '-'} />
        <FieldDisplay fieldName="Subtotal Amount" value={`${sale?.subtotalAmount ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Tax Amount" value={`${sale?.taxAmount ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Tax Rate" value={`${sale?.taxRate ?? 0}%`} />
        <FieldDisplay fieldName="Sold Items" items={sale?.saleItems || []} />
        <FieldDisplay fieldName="Payment Method" value={sale?.paymentMethod ?? '-'} />
        <FieldDisplay fieldName="Sale Status" value={sale?.status ?? '-'} />
        <FieldDisplay fieldName="Refund Status" value={sale?.refundStatus ?? '-'} />
        <FieldDisplay fieldName="Total Price" value={`${sale?.totalPrice ?? 0} ${sale?.currency ?? '-'}`} />
        <FieldDisplay fieldName="Created At" value={new Date(sale?.createdAt ?? '').toLocaleString() || '-'} />
      </Container>
    </div>
  )
}

export default ViewSale
