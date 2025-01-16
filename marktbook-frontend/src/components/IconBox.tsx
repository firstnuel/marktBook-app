import '@styles/icon-box.scss'
import { useState } from 'react'

interface IconBoxProps {
    src: string;
    clName?: string;
    imgClName?: string;
    alt?: string;
    title?: string;
    onClick?: ()=> void;
    tt?: boolean;
}

const IconBox = ({ clName, onClick, src, imgClName, alt, title, tt }: IconBoxProps) => {
  const[show, setShow] = useState(false)

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)


  return(
    <div className={ clName} onClick={onClick} onMouseEnter={handleShow} onMouseLeave={handleClose}>
      <img src={src} alt={alt} className={imgClName} />
      { title && show &&  <span className={tt? 'tt' : 'tooltip-text'}>{title}</span> }
    </div>

  )
}

export default IconBox

