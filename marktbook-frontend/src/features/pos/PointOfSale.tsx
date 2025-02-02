import Container from 'react-bootstrap/Container'
import DateBox from '@components/DateBox'
import TimeBox from '@components/TimeBox'
import CloseShop from '@components/CloseShop'
import MenuBar from '@components/MenuBar'
import CategoryCard from '@components/CategoryCard'
import CustomerInfo from '@features/pos/CustomerInfo'
import SelectCustomer from '@features/pos/SelectCustomer'
import { ProductCategory, SearchKeys } from '@typess/pos'
import icons from '@assets/icons'
import SearchBar from '@components/SearchBar'
import { useField } from '@hooks/useField'
import ProductCard from '@components/ProductCard'
import PriceInfo from '@features/pos/PriceInfo'
import './index.scss'
import { useState } from 'react'
import { usePos } from '@hooks/usePos'
import CartItem from '@components/CartItem'
import { countByCategoryList } from '@utils/helpers'

const PointOfSale = () => {
  const [selectValue, setSelectValue] = useState('SKU')
  const { reset, ...searchProduct } = useField('searchProduct', 'text')
  const eventKeys = Object.values(SearchKeys)
  const {
    products,
    cartItems,
    filteredProducts,
    searchByCategory,
    searchByKeyandPhrase,
    loading
  } = usePos()

  const categoryData = countByCategoryList(products)

  const handleSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      setSelectValue(eventKey)
    }
  }

  const handleSearch = (searchPhrase: string) => {
    if (selectValue === 'Category') {
      // Use searchByCategory when searching by category
      searchByCategory(searchPhrase as ProductCategory | 'ALL')
    } else {
      // Use searchByKeyandPhrase for other keys
      searchByKeyandPhrase(selectValue as keyof typeof SearchKeys, searchPhrase)
    }
  }

  return (
    <div className="main-container">
      <Container className="main">
        <Container className="header-info">
          <div className="date-time">
            <MenuBar />
            <DateBox />
            <span className="seperator">-</span>
            <TimeBox />
          </div>
          <CloseShop />
        </Container>
        <Container className="categories">
          <CategoryCard cardIcon={icons.allCategories} catItems={products.length} catName="ALL" />
          {categoryData.map(({ category, count }, index) => (
            <CategoryCard
              cardIcon={icons.categories}
              key={index}
              catItems={count}
              catName={category as ProductCategory}
            />
          ))}
        </Container>
        <Container className="search-bar">
          <SearchBar
            value={selectValue}
            onSelect={handleSelect}
            eventKeys={eventKeys}
            useField={searchProduct}
            handleSearch={handleSearch}
            reset={reset}
          />
        </Container>
        {filteredProducts.length ? (
          <Container className="products">
            {filteredProducts.map(product => (
              <ProductCard product={product} key={product.id} />
            ))}
          </Container>
        ) : (
          <p className="text-center">{loading ? 'Loading Products ...':'No products found.'}</p>
        )}
      </Container>
      <Container className="checkout">
        <CustomerInfo name="Emmanuel Ikwunna" salesId={1234567890} />
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
