import Container from 'react-bootstrap/Container'
import DateBox from '@components/DateBox'
import TimeBox from '@components/TimeBox'
import CloseShop from '@components/CloseShop'
import MenuBar from '@components/MenuBar'
import CategoryCard from '@components/CategoryCard'
import icons from '@assets/icons'
import { categoryData } from './seed'
import SearchBar from '@components/SearchBar'
import { useField } from '@hooks/useField'
import ProductCard from '@components/ProductCard'
import './index.scss'
import { useState } from 'react'



const PointOfSale = () => {
  const [selectValue, setSelectValue] = useState('SKU')
  const { reset, ...searchProduct } = useField('searchProduct', 'text')
  const eventKeys = ['SKU', 'Product Name', 'Product Tag', 'Category', 'Barcode']

  const handleSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      setSelectValue(eventKey)
    }
  }

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
          {categoryData.map((data, index) => (
            <CategoryCard cardIcon={icons.categories} key={index}
              catItems={data.quantity} catName={data.category} />
          ))}
        </Container>
        <Container className='search-bar'>
          <SearchBar value={selectValue} onSelect={handleSelect} eventKeys={eventKeys} useField={searchProduct}/>
        </Container>
        <Container className='products'>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />

          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />

          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />

          <ProductCard />
          
        </Container>
        {/* <Container className='recents'></Container> */}
      </Container>
      <Container className='sales'></Container>
    </div>
  )
}


export default PointOfSale