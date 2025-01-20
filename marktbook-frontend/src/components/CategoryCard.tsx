import IconBox from './IconBox'
import '@styles/cat-card.scss'
import { usePos } from '@hooks/usePos'
import { ProductCategory } from '@typess/pos'
import { cutName } from '@utils/helpers'


interface CatCardProps {
    catName: ProductCategory | 'ALL';
    catItems: number;
    cardIcon: string;
}

const CategoryCard = ({ catItems, cardIcon, catName }: CatCardProps) => {
  const { searchByCategory, category } = usePos()

  return (
    <div className={catName === category? 'cat-card clicked' : 'cat-card'} onClick={() => searchByCategory(catName)}>
      <IconBox src={cardIcon} clName="cat-card-img"  imgClName="cat-card-icon" alt="Categories"/>
      <div className="cat-card-texts">
        <div className="cat-card-title">{catName === 'ALL'? 'All Categories' : cutName(catName, 11)}</div>
        <div className="cat-card-count">{`${catItems} ${catItems > 1? 'items' : 'item'}`}</div>
      </div>
    </div>
  )}

export default CategoryCard