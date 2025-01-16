import Container from 'react-bootstrap/Container'
import DateBox from '@components/DateBox'
import TimeBox from '@components/TimeBox'
import CloseShop from '@components/CloseShop'
import MenuBar from '@components/MenuBar'
import CategoryCard from '@components/CategoryCard'
import CustomerInfo from '@features/pos/CustomerInfo'
import SelectCustomer from '@features/pos/SelectCustomer'
import { SearchKeys } from '@typess/pos'
import icons from '@assets/icons'
import { categoryData } from './seed'
import SearchBar from '@components/SearchBar'
import { useField } from '@hooks/useField'
import ProductCard from '@components/ProductCard'
import PriceInfo from '@features/pos/PriceInfo'
import './index.scss'
import { useState } from 'react'
import { usePos } from '@hooks/usePos'
import CartItem from '@components/CartItem'



const PointOfSale = () => {
  const [selectValue, setSelectValue] = useState('SKU')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reset,  ...searchProduct } = useField('searchProduct', 'text')
  const eventKeys = Object.values(SearchKeys)
  const { products, cartItems } = usePos()

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
          {products.map(product => (
            <ProductCard product={product} key={product.id}/>
          ))}
        </Container>
      </Container>
      <Container className='checkout'>
        <CustomerInfo name='Emmanuel Ikwunna' salesId={1234567890}/>
        <SelectCustomer />
        <div className="cart-div">
          {cartItems.map(item => (
            <CartItem product={item.product} quantity={item.quantity} key={item.product.id} />
          ))}
        </div>
        <div className="price-breakdown">
          <PriceInfo />
        </div>
      </Container>
    </div>
  )
}


export default PointOfSale