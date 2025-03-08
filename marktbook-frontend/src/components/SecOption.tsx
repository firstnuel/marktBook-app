/* eslint-disable @typescript-eslint/no-explicit-any */
import '@styles/sec-option.scss'


interface SecOptionProps {
    name: string;
    mainOpt?: string;
    setMainOpt: (option: string) => {
      payload: any
      type: string
    }
    setSubOpt?: (option: string) => {
      payload: any;
      type: string;
    }
}

const SecOption = ({ name, mainOpt, setMainOpt, setSubOpt }: SecOptionProps) => {
  const handleClick = () => {
    setMainOpt(name)
    if (name === 'Products' && setSubOpt) setSubOpt('Product List')
  }


  return(
    <div className={name === mainOpt ? 'section-opt active' : 'section-opt'} onClick={handleClick}>
      <span className="sec-opt-name">{name === 'Stock Data'? `Add ${name}` : name }</span>
    </div>
  )
}

export default SecOption

