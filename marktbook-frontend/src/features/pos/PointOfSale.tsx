import Container from 'react-bootstrap/Container'
import DateBox from '@components/DateBox'
import TimeBox from '@components/TimeBox'
import CloseShop from '@components/CloseShop'
import MenuBar from '@components/MenuBar'
import CategoryCard from '@components/CategoryCard'
import icons from '@assets/icons'
import { categoryData } from './seed'
// import Form from 'react-bootstrap/Form'
import './index.scss'



const PointOfSale = () => {


  return (
    <div className='main-container'>
      <Container className='main'>
        <Container className='header-info'>
          <div className="date-time">
            <MenuBar />
            <DateBox />
            <span className="seperator">-</span>
            <TimeBox />
          </div>
          <CloseShop />
        </Container>
        <Container className='categories'>
          <CategoryCard cardIcon={icons.allCategories} catItems={45} catName='All Categories'/>
          {categoryData.map(data => (
            <CategoryCard cardIcon={icons.categories} catItems={data.quantity} catName={data.category} />
          ))}
        </Container>
        <Container className='search-bar'></Container>
        <Container className='products'></Container>
        <Container className='recents'></Container>
      </Container>
      <Container className='sales'></Container>
    </div>
  )
}


export default PointOfSale