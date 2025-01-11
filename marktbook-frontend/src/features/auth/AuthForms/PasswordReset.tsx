import Container from 'react-bootstrap/Container'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import icons from '@assets/icons'
import './index.scss'


const PasswordResetForm = () => {


  const { reset: emailReset, ...email } = useField('email', 'email')
  const [success, setSuccess] = useState<boolean>(false)
  const { passwordReset, reset, loading, error } = useAuth()

  useEffect(() => {
    if (reset) {
      setSuccess(true)
      emailReset()
    }
  }, [reset, passwordReset,  emailReset, success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await passwordReset(email.value)

    } catch (err) {
      console.error('Password reset error:', err)
    }
  }

  return (
    <div className='container-fluid' >
      <div className="back-home">
        <a href="" className="home-link">
          <img src={icons.arrowback} alt="Back to homepage arrow icon" />
        </a>
        <a href="" className="home-link">
          <p>Back to home</p>
        </a>
      </div>
      <Container className='registerform-container'>
        <div className='app-name'>
          <p>MarktBook</p>
        </div>
        <div className='summary'>
          <p className="catch-phrase">Password Reset</p>
        </div>

        <Form onSubmit={handleSubmit} className="d-grid gap-2">
          <div className={error? 'error': success? 'success' : 'info'}>
            {error? error : success? 'Password reset email sent'
              : 'Please enter the email address associated with your account, or the business email if you are the owner.'}
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text> <img src={icons.email} alt="email icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...email} placeholder="Account email" autoComplete='current-email'/>
          </InputGroup>

          <Button variant="primary" type="submit" disabled={loading} size="lg" className='formButton'>
            {loading? 'Loading...' : 'Reset Password'}
          </Button >
        </Form>

      </Container>
    </div>
  )
}



export default PasswordResetForm
