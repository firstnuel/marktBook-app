import '@styles/recent-sales.scss'
import { useTrans } from '@hooks/useTrans'
import { formatDate } from '@utils/helpers'


const RecentSale = () => {
  let { sales } = useTrans()
  sales = sales.slice(0,10)

  return (
    <div className="s-div" id='sales-dv'>
      <div className="pd-head">
        <div className='point'></div>
        <div className="ttl">Recent Sales</div>
      </div>
      <table>
        <thead>
          <tr>
            <th><span>#</span></th>
            <th><span>Date & Time</span></th>
            <th><span>Customer Name</span></th>
            <th><span>Status</span></th>
            <th><span>Total</span></th>
            <th><span>Payment</span></th>
            <th><span>Cahier</span></th>
          </tr>
        </thead>
        <tbody>
          {(sales || []).map((sale, idx) => (
            <tr key={idx}>
              <td><div className="number">{String(idx+1).padStart(3, '0')}</div></td>
              <td><div className="date">{formatDate(sale.createdAt)}</div></td>
              <td><div className='cs-name'>{sale.initiatedBy.name}</div></td>
              <td><div className='cs-name'>{sale.status}</div></td>
              <td><div className='cs-name'>{`${sale.currency} ${sale.totalPrice.toFixed(2)}`}</div></td>
              <td><div className={sale.status === 'COMPLETED' ? 'av up' : 'av down'}>
                {sale.status === 'COMPLETED' ? 'Paid' : 'Unpaid'}
              </div></td>
              <td><div className='cs-name'>Esso</div></td>
            </tr>)
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecentSale