import Container from 'react-bootstrap/Container'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import BackHome from '@components/BackHome'
import AppNameTag from '@components/AppNameTag'
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
    await passwordReset(email.value as string)
  }

  return (
    <div className='container-fluid' >
      <BackHome />
      <Container className='registerform-container'>
        <AppNameTag tagline='Password Reset' />
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
