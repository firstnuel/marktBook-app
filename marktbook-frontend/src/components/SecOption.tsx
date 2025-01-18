import '@styles/sec-option.scss'


interface SecOptionProps {
    name: string;
    onClick?: () => void;
}

const SecOption = ({ name, onClick }: SecOptionProps) => {


  return(
    <div className="section-opt" onClick={onClick}>
      <span className="sec-opt-name">{name}</span>
    </div>
  )
}

export default SecOption