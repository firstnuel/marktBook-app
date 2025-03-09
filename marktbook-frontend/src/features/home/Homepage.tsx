import { Container } from 'react-bootstrap'
import img from '@assets/images/homepage.jpg'
import './index.scss'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from 'react-router'

const Home = () => {
  const { user } = useAuth()
  const nav = useNavigate()

  return (
    <div className="home-page">
      <Container className="nav">
        <div className="logo">MarktBook</div>
        <div className="nav-btns">
          {user ?
            <button onClick={() => nav('/dashboard')}>Dashboard</button>
            : <button onClick={() => nav('/login')}>Login</button>
          }
        </div>
      </Container>
      <Container className="body">
        <div className="cta">
          <div className="actn-words">
            <h1>Manage your inventory and sales effortlessly with MarktBook.</h1>
          </div>
          <div className="summary">
            <p>
              MarktBook is designed for business owners to easily manange their business.
              Track your inventory, record sales, and stay on top of your business — all in an
              easy-to-use platform.
            </p>
          </div>
        </div>
        <div className="cta-img-div">
          <img src={img} alt="MarktBook in action" />
        </div>
      </Container>
    </div>
  )
}

export default Home
