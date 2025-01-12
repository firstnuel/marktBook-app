
interface IconBoxProps {
    src: string;
    clName?: string;
    imgClName?: string;
    alt?: string;
    onClick?: ()=> void;
}

const IconBox = ({ clName, onClick, src, imgClName, alt }: IconBoxProps) => (
  <div className={clName} onClick={onClick}>
    <img src={src} alt={alt} className={imgClName} />
  </div>
)

export default IconBox