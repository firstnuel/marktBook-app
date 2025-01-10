import Container from 'react-bootstrap/Container'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import { LoginFormSchema } from '@auth/auth.schema'
import { useState } from 'react'
import { LoginData } from '@typess/auth'
import { useAuth } from '@hooks/useAuth'
import { FormEvent } from 'react'
import icons from '@assets/icons'
import './LoginForm.scss'


const LoginForm = () => {

  const { reset: emailReset, ...email } = useField('email', 'email')
  const { reset: nameReset, ...username } = useField('username', 'text')
  const { reset: passwordReset, ...password } = useField('password', 'password')
  const [validationError, setValidationError] = useState<string | null>(null)
  const { login, user, loading, error } = useAuth()

  const  validationErrorFn = (msg: string): void => {
    setValidationError(msg)
    setTimeout(() => {
      setValidationError(null)
    }, 3000)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const formData: LoginData = {
      email: email.value,
      username: username.value,
      password: password.value
    }

    try {
      const userData = await LoginFormSchema.validate(formData)
      await login(userData)

      if (user) {
        emailReset()
        nameReset()
        passwordReset()
      }
    } catch (err) {
      if (err instanceof Error) {
        validationErrorFn(err.message)
      }
      console.error('Login error:', err)
    }
  }

  const IError = error || validationError || null

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
      <Container className='form-container'>
        <div className='app-name'>
          <p>MarktBook</p>
        </div>
        <div className='summary'>
          <p className="catch-phrase">Manage your business, smarter and simpler.</p>
        </div>
        <Form onSubmit={handleSubmit} className="d-grid gap-2">
          <div className={IError? 'error': 'info'}>
            {IError? IError : 'Log in to your account'}
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.email} alt="email icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...email} placeholder="Business email" />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.user} alt="username icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg"  {...username} placeholder="Username" />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.password} alt="password icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...password} placeholder="Password" />
          </InputGroup>


          <Button variant="primary" type="submit" disabled={loading} size="lg" className='formButton'>
            {loading? 'Loading...' : 'Login'}
          </Button >
        </Form>
        <div className='forgot-password'>
          <a href='' className='register-link'>Forgot Password ?</a>
        </div>
        <div className='register'>
          <p>No Account Yet? <a href='' className='register-link'>Register</a></p>
        </div>
      </Container>
    </div>
  )
}

export default LoginForm

