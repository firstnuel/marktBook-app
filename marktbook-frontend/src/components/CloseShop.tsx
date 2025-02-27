import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import '@styles/close-shop.scss'

const CloseShop = () => {


  return (
    <>
      <div className="power-box" >
        <div className='power-text'>
          <div className='power-dot'></div>
          <div className="power-word">Network Up</div>
        </div>
        <IconBox src={icons.power} clName="power-bar"/>
      </div>
    </>
  )

}


export default CloseShop
