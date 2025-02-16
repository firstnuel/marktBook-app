import Container from 'react-bootstrap/Container'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useField } from '@hooks/useField'
import Form from 'react-bootstrap/Form'
import { RegisterDataSchema } from '@auth/auth.schema'
import { NavLink, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { BusinessCategory, BusinessType, RegisterData } from '@typess/auth'
import { parseZError, validationErrorFn } from '@utils/helpers'
import icons from '@assets/icons'
import './index.scss'
import { ZodError } from 'zod'
import BackHome from '@components/BackHome'
import AppNameTag from '@components/AppNameTag'


const RegisterForm = () => {

  const { reset: businessNameReset, ...businessName } = useField('businessName', 'text')
  const { reset: nameReset, ...name } = useField('adminName', 'text')
  const { reset: emailReset, ...email } = useField('email', 'email')
  const { reset: usernameReset, ...username } = useField('username', 'text')
  const { reset: passwordReset, ...password } = useField('password', 'password')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const { register, registered, loading, error } = useAuth()
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()


  const handleCatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value)
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value)
  }

  useEffect(() => {
    if (registered) {
      setSuccess('Account registered successfully')
      businessNameReset()
      emailReset()
      nameReset()
      passwordReset()
      usernameReset()
      navigate('/login')
    }
  }, [registered, passwordReset, businessNameReset, emailReset, usernameReset, nameReset, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      email: email.value,
      adminFullName: name.value,
      username: username.value,
      password: password.value,
      businessName: businessName.value,
      businessType: selectedType,
      businessCategory: selectedCategory
    }

    try {
      const registerData: RegisterData = RegisterDataSchema.parse(formData)
      await register(registerData)

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
      <Container className='registerform-container'>
        <AppNameTag />
        <Form onSubmit={handleSubmit} className="d-grid gap-2">
          <div className={IError? 'error': success ?'info success' : 'info'}>
            {IError? IError : success ? success :'Let\'s get you started'}
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text> <img src={icons.email} alt="email icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...email} placeholder="Business Email" autoComplete='current-email'/>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.business} alt="businessName icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg"  {...businessName} placeholder="Business Name"  autoComplete='current-businessName'/>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.user} alt="name icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg"  {...name} placeholder="Full Name" autoComplete='current-name' />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.user} alt="username icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg"  {...username} placeholder="Username" autoComplete='current-username' />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <img src={icons.password} alt="password icon" className="icon" />
            </InputGroup.Text>
            <Form.Control size="lg" {...password} placeholder="Password" autoComplete='current-password'/>
          </InputGroup>

          <Form.Select size="lg" className="mb-3" onChange={handleCatChange} value={selectedCategory}>
            <option value="">Select business category</option>
            {Object.values(BusinessCategory).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Select>

          <Form.Select size="lg" className="mb-3" onChange={handleTypeChange} value={selectedType}>
            <option>Select business type</option>
            {Object.values(BusinessType).map(types =>
              (<option key={types} value={types}>{types}</option>))}
          </Form.Select>

          <Button variant="primary" type="submit" disabled={loading} size="lg" className='formButton'>
            {loading? 'Loading...' : 'Register'}
          </Button >
        </Form>

        <div className='login'>
          <p>Have An Account? <NavLink to='/login' className='register-link'>Login</NavLink></p>
        </div>
      </Container>
    </div>
  )
}



export default RegisterForm
