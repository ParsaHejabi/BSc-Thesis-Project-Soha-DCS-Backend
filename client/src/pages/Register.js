import { useMutation, gql } from '@apollo/client'
import { useContext } from 'react'
import { Form, Message } from 'semantic-ui-react'
// import { useHistory } from 'react-router-dom'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks'

const REGISTER = gql`
  mutation register($username: String!, $password: String!) {
    register(registerInput: { username: $username, password: $password }) {
      id
      username
      token
      points
      createdAt
      updatedAt
    }
  }
`

function Register() {
  const context = useContext(AuthContext)

  const { onChange, onSubmit, values, setValues, errors, setErrors } = useForm(
    registerHoistedFunction,
    {
      username: '',
      password: '',
    }
  )

  // let history = useHistory()

  const [
    register,
    { loading: registerLoading, data: registerData },
  ] = useMutation(REGISTER, {
    variables:
      values.username === ''
        ? {
            username: values.username,
            password: values.password,
          }
        : values,
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.exception.errors)
      setValues({
        username: '',
        password: '',
      })
    },
    ignoreResults: false,
    onCompleted: ({ register: userData }) => {
      setErrors({})
      setValues({
        username: '',
        password: '',
      })
      context.login(userData)
    },
  })

  // useEffect(() => {
  //   let interval = null
  //   if (registerData) {
  //     interval = setInterval(() => {
  //       history.push('/')
  //     }, 3000)
  //   }
  //   return () => (interval ? clearInterval(interval) : null)
  // }, [history, registerData])

  function registerHoistedFunction() {
    register()
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        loading={registerLoading}
        success={registerData && Object.keys(registerData).length !== 0}
      >
        <h1 className="page-title">ثبت‌نام</h1>
        <Form.Input
          name="username"
          label="نام کاربری"
          placeholder="Username"
          value={values.username}
          type="text"
          autoComplete="username"
          onChange={onChange}
          error={
            errors.hasOwnProperty('username') && {
              content: errors.username,
              pointing: 'above',
            }
          }
          className="form-field"
        />
        <Form.Input
          name="password"
          label="گذرواژه"
          placeholder="Password"
          value={values.password}
          type="password"
          autoComplete="current-password"
          onChange={onChange}
          error={
            errors.hasOwnProperty('password') && {
              content: errors.password,
              pointing: 'above',
            }
          }
          className="form-field"
        />
        {registerData && (
          <Message
            success
            header={`خوش آمدید!`}
            content={`کاربر با نام کاربری ${registerData.register.username} در سایت ثبت‌نام شد. تا چند ثانیه‌ی دیگر به خانه منتقل می‌شوید...`}
            className="form-field"
          />
        )}
        <Form.Button className="form-field" primary>
          ثبت‌نام
        </Form.Button>
      </Form>
    </div>
  )
}

export default Register
