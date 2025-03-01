import MenuBar from '@components/MenuBar'
import TimeBox from '@components/TimeBox'
import DateBox from '@components/DateBox'
import PeriodBox from '@components/PeriodBox'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import ShowBox from '@components/ShowBox'
import FavProductSection from './FavProductSec'
import './index.scss'
import Charts from './Charts'
import Summary from './Summary'
import LowStock from './LowStock'
import ActiveUsers from './ActiveUsers'
import RecentSale from './RecentSales'
import TopCategories from './TopCategories'

const Dashboard = () => {

  return(
    <div className='main-con-db'>
      <div className='head'>
        <div className="menu-name">
          <MenuBar />
          <div className='name'> LoveTech Inc </div>
        </div>
        <div className="date-time">
          <DateBox />
          <span className="seperator">-</span>
          <TimeBox />
        </div>
      </div>
      <div className="sub-head">
        <div className="greet">
          <strong>👋 Hello Emmanuel,</strong>
          <span> here’s what’s happening in your store today.</span>
        </div>
        <div className="actns">
          <PeriodBox />
          <IconBox src={icons.refresh} clName='refresh'/>
        </div>
      </div>
      <div className="show-box-div">
        <ShowBox
          tittleIcon={icons.user}
          title='Total Sales Amount'
          amount='12,650.00'
          currency='USD'
          trendAmt='1,543.30'
          trendPct={10}
          up
        />
        <ShowBox
          tittleIcon={icons.user}
          title='Total Product Sales'
          amount='1,250'
          unit='Items'
          trendAmt='1,543.30'
          trendPct={10}
          up
        />
        <ShowBox
          tittleIcon={icons.user}
          title='Total Customers'
          amount='400'
          unit='Persons'
          trendAmt='5'
          trendPct={0.02}
        />
        <ShowBox
          tittleIcon={icons.user}
          title='Total Sales Amount'
          amount='12,650.00'
          currency='USD'
          trendAmt='3,792'
          trendPct={0.3}
          up
        />
      </div>
      <div className="mid-body">
        <Charts />
        <FavProductSection />
      </div>
      <div className="summaries">
        <LowStock />
        <Summary />
        <ActiveUsers />
      </div>
      <div className="recent-activity">
        <RecentSale />
        <TopCategories />
      </div>
    </div>
  )
}

export default Dashboard