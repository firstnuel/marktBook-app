import '@styles/sec-option.scss'


interface SecOptionProps {
    name: string;
    mainOpt?: string;
    onClick?: () => void;
}

const SecOption = ({ name, onClick, mainOpt }: SecOptionProps) => {


  return(
    <div className={name === mainOpt ? 'section-opt active' : 'section-opt'} onClick={onClick}>
      <span className="sec-opt-name">{name}</span>
    </div>
  )
}

export default SecOption

