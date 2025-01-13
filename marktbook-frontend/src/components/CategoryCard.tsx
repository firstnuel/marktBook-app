import IconBox from './IconBox'
import '@styles/cat-card.scss'


interface CatCardProps {
    catName: string;
    catItems: number;
    cardIcon: string;
}


const CategoryCard = ({ catItems, cardIcon, catName }: CatCardProps) => (


  <div className="cat-card">
    <IconBox src={cardIcon} clName="cat-card-img"  imgClName="cat-card-icon" alt="Categories"/>
    <div className="cat-card-texts">
      <div className="cat-card-title">{catName}</div>
      <div className="cat-card-count">{`${catItems} ${catItems > 1? 'items' : 'item'}`}</div>
    </div>
  </div>
)

export default CategoryCard