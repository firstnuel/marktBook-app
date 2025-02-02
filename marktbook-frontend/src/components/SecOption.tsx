import '@styles/sec-option.scss'
import { useInv } from '@hooks/useInv'



interface SecOptionProps {
    name: string;
    mainOpt?: string;
}

const SecOption = ({ name, mainOpt }: SecOptionProps) => {
  const { setMainOpt } = useInv()
  const handleClick = () => setMainOpt(name)

  return(
    <div className={name === mainOpt ? 'section-opt active' : 'section-opt'} onClick={handleClick}>
      <span className="sec-opt-name">{name === 'Stock Data'? `Add ${name}` : name }</span>
    </div>
  )
}

export default SecOption

