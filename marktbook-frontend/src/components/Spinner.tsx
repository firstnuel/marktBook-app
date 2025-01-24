import Spinner from 'react-bootstrap/Spinner'
import '@styles/spinner.scss'

function Loading() {
  return (
    <div className="spinner-overlay">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

export default Loading
