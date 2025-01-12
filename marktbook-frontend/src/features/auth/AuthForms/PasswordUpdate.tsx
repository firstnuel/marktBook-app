import Container from 'react-bootstrap/Container'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useField } from '@hooks/useField'
import { NavLink, useSearchParams } from 'react-router-dom'
import { passwordSchema } from '@auth/auth.schema'
import Form from 'react-bootstrap/Form'
import { validationErrorFn, parseZError } from '@utils/helpers'
import { useEffect, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from 'react-router'
import icons from '@assets/icons'
import './index.scss'
import { ZodError } from 'zod'
import BackHome from '@components/BackHome'
import AppNameTag from '@components/AppNameTag'


const PasswordUpdateForm = () => {
  const { reset: passwordReset, ...password } = useField('password', 'password')
  const { reset: confirmPasswordReset, ...confirmPassword } = useField('confirmPassword', 'password')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const { updated, passwordUpdate, loading, error } = useAuth()

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (updated) {
      setSuccess(true)
      passwordReset()
      confirmPasswordReset()
      navigate('/login')
    }
  }, [updated, passwordReset, confirmPasswordReset, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      password: password.value,
      confirmPassword: confirmPassword.value
    }

    try {
      const password = passwordSchema.parse(formData)
      await passwordUpdate({ passwordData: password, token: token! })
    } catch (err) {
      if (err instanceof ZodError) {
        validationErrorFn(parseZError(err), setValidationError)
      }
      console.error('Password update error:', err)
    }
  }



  return (
    <div className='container-fluid' >
      <BackHome />
      <Container className='registerform-container'>
        <AppNameTag tagline='Password Update' />
        { error ?
          <>
            <h2 className="mb-3">Reset link has expired or is broken</h2>
            <div className='forgot-password'>
              <NavLink to='/forgot-password' className='register-link'>Request a new link</NavLink>
            </div>
          </>

          :
          <Form onSubmit={handleSubmit} className="d-grid gap-2">
            <div className={validationError? 'error': success? 'success' : 'info'}>
              {validationError? validationError : success? 'Password updated successfully!'
                : 'Please enter new password'}
            </div>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <img src={icons.password} alt="password icon" className="icon" />
              </InputGroup.Text>
              <Form.Control size="lg" {...password} placeholder="Password" />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>
                <img src={icons.password} alt="password icon" className="icon" />
              </InputGroup.Text>
              <Form.Control size="lg" {...confirmPassword} placeholder="Confirm Password" />
            </InputGroup>

            <Button variant="primary" type="submit" disabled={loading} size="lg" className='formButton'>
              {loading? 'Loading...' : 'Update Password'}
            </Button >
          </Form>
        }

      </Container>
    </div>
  )
}



export default PasswordUpdateForm
