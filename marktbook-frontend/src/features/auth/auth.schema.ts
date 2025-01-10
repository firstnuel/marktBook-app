import * as Yup from 'yup'

export const LoginFormSchema: Yup.Schema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
  username: Yup.string().min(4, 'Username must be at least 4 characters').required('Username is required')

})

