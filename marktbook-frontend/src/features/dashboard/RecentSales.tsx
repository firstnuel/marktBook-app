import '@styles/recent-sales.scss'



const RecentSale = () => (


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
        <tr>
          <td><div className="number">001</div></td>
          <td><div className="date">24/05/2024 - 08:00<span>AM</span></div></td>
          <td><div className='cs-name'>Emmanuel</div></td>
          <td><div className='cs-name'>Completed</div></td>
          <td><div className='cs-name'>USD 35.00</div></td>
          <td><div className='av up'>Paid</div></td>
          <td><div className='cs-name'>Esso</div></td>
        </tr>
      </tbody>
    </table>
  </div>
)


export default RecentSale