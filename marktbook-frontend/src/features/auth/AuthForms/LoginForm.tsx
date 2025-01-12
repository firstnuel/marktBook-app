import Container from 'react-bootstrap/Container'
import BackHome from '@components/BackHome'
import AppNameTag from '@components/AppNameTag'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import { LoginFormSchema } from '@auth/auth.schema'
import { parseZError, validationErrorFn } from '@utils/helpers'
import { NavLink } from 'react-router'
import { useEffect, useState } from 'react'
import { LoginData } from '@typess/auth'
import { useAuth } from '@hooks/useAuth'
import { ZodError } from 'zod'
import icons from '@assets/icons'
import './index.scss'

const LoginForm = () => {

  const { reset: emailReset, ...email } = useField('email', 'email')
  const { reset: nameReset, ...username } = useField('username', 'text')
  const { reset: passwordReset, ...password } = useField('password', 'password')
  const [validationError, setValidationError] = useState<string | null>(null)
  const { login, user, loading, error } = useAuth()

  useEffect(() => {
    if (user) {
      emailReset()
      nameReset()
      passwordReset()
    }
  }, [emailReset, user, nameReset, passwordReset])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const formData = {
      email: email.value,
      username: username.value,
      password: password.value
    }

    try {
      const userData: LoginData = LoginFormSchema.parse(formData)
      await login(userData)
    } catch (err) {
      if (err instanceof ZodError) {
        validationErrorFn(parseZError(err), setValidationError)
      }
      console.error('Login error:', err)
    }
  }

  const IError = error || validationError || null

  return (
    <div className='container-fluid' >
      <BackHome />
      <Container className='form-container'>
        <AppNameTag />
        <Form onSubmit={handleSubmit} className="d-grid gap-2">
          <div className={IError? 'error': 'info'}>
            {IError? IError : 'Log in to your account'}
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text> <img src={icons.email} alt="email icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...email} placeholder="Business email" autoComplete='current-email'/>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.user} alt="username icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg"  {...username} placeholder="Username"  autoComplete='current-username'/>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.password} alt="password icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...password} placeholder="Password"  autoComplete='current-password'/>
          </InputGroup>

          <Button variant="primary" type="submit" disabled={loading} size="lg" className='formButton'>
            {loading? 'Loading...' : 'Login'}
          </Button >
        </Form>
        <div className='forgot-password'>
          <NavLink to='/forgot-password' className='register-link'>Forgot Password ?</NavLink>
        </div>
        <div className='register'>
          <p>No Account Yet? <NavLink to='/register' className='register-link'>Register</NavLink></p>
        </div>
      </Container>
    </div>
  )
}

export default LoginForm

