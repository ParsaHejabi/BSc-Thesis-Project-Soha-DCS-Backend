import { useQuery, useMutation, gql } from '@apollo/client'
import { Table, Grid, Placeholder, Form, Message } from 'semantic-ui-react'
import moment from 'moment'
import { useState } from 'react'

const GET_TOP_USERS = gql`
  {
    topUsers {
      username
      points
      updatedAt
    }
  }
`

const ADD_USER_REQUEST = gql`
  mutation addUserRequest(
    $username: String!
    $text: String!
    $possibleReference: String
    $type: RequestType
  ) {
    addUserRequest(
      userRequestInput: {
        username: $username
        text: $text
        place: WEBSITE
        type: $type
        possibleReference: $possibleReference
      }
    ) {
      user {
        username
        points
        createdAt
        updatedAt
      }
      text
      type
      possibleReference
      place
      createdAt
      updatedAt
    }
  }
`

function Home() {
  const [values, setValues] = useState({
    username: '',
    text: '',
    type: '',
    possibleReference: '',
  })
  const [errors, setErrors] = useState({})

  let { loading, error, data } = useQuery(GET_TOP_USERS)

  const [
    addUserRequest,
    { loading: mutationLoading, data: mutationData },
  ] = useMutation(ADD_USER_REQUEST, {
    variables:
      values.type === ''
        ? {
            username: values.username,
            text: values.text,
            possibleReference: values.possibleReference,
          }
        : values,
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.exception.errors.errors)
      setValues({
        username: '',
        text: '',
        type: '',
        possibleReference: '',
      })
    },
    refetchQueries: [{ query: GET_TOP_USERS }],
    ignoreResults: false,
    onCompleted: () => {
      setErrors({})
      setValues({
        username: '',
        text: '',
        type: '',
        possibleReference: '',
      })
    },
  })

  const mapArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const options = [
    { key: 'REQUEST', text: 'درخواست', value: 'REQUEST' },
    { key: 'QUESTION', text: 'سوال', value: 'QUESTION' },
    { key: 'INSULT', text: 'توهین', value: 'INSULT' },
    { key: 'EMPTY', text: 'نوع ورودی', value: '' },
  ]

  const onChange = (event) => {
    if (errors.hasOwnProperty(event.target.name)) {
      if (event.target.value.trim() !== '') {
        let newErrors = errors
        delete newErrors[event.target.name]
        setErrors(newErrors)
      }
    }
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onChangeSelect = (event, data) => {
    setValues({ ...values, [data.name]: data.value })
  }

  if (error)
    return (
      <div className="form-container">
        <h1 className="page-title">
          مشکلی در اتصال به سرور به وجود آمده.
          <br />
          در حال بررسی و رفع مشکل هستیم.
          <br />
          لطفا دوباره تلاش کنید.
        </h1>
      </div>
    )

  return (
    <Grid columns={2} divided>
      <Grid.Row className="page-title">
        <h1>به سیستم جمع‌آوری داده‌ی سامانه‌ی سها خوش آمدید!</h1>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <h2>Leaderbord</h2>
          <Table celled textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Points</Table.HeaderCell>
                <Table.HeaderCell>Latest request time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading
                ? mapArray.map((value, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.Cell>
                          <Placeholder>
                            <Placeholder.Paragraph>
                              <Placeholder.Line />
                              <Placeholder.Line />
                            </Placeholder.Paragraph>
                          </Placeholder>
                        </Table.Cell>
                        <Table.Cell>
                          <Placeholder>
                            <Placeholder.Paragraph>
                              <Placeholder.Line />
                              <Placeholder.Line />
                            </Placeholder.Paragraph>
                          </Placeholder>
                        </Table.Cell>
                        <Table.Cell>
                          <Placeholder>
                            <Placeholder.Paragraph>
                              <Placeholder.Line />
                              <Placeholder.Line />
                            </Placeholder.Paragraph>
                          </Placeholder>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })
                : data &&
                  data.topUsers.map((value, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{value.username}</Table.Cell>
                      <Table.Cell>{value.points}</Table.Cell>
                      <Table.Cell>
                        {moment(value.updatedAt).fromNow(true)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              addUserRequest()
            }}
            loading={mutationLoading}
            success={mutationData && Object.keys(mutationData).length !== 0}
          >
            <Form.Group widths="equal" className="rtl-form-field">
              <Form.Input
                fluid
                name="username"
                label="نام کاربری"
                placeholder="نام کاربری"
                value={values.username}
                onChange={onChange}
                error={
                  errors.hasOwnProperty('username') && {
                    content: errors.username,
                    pointing: 'above',
                  }
                }
                required
                className="rtl-form-field"
              />
              <Form.Select
                fluid
                name="type"
                label="نوع ورودی"
                options={options}
                placeholder="نوع ورودی"
                value={values.type}
                onChange={onChangeSelect}
                className="rtl-form-field"
              />
              <Form.Input
                fluid
                name="possibleReference"
                label="پاسخ‌دهنده احتمالی"
                placeholder="برای مثال آموزش..."
                value={values.possibleReference}
                onChange={onChange}
                className="rtl-form-field"
              />
            </Form.Group>
            <Form.TextArea
              required
              name="text"
              label="متن ورودی"
              placeholder="سوال یا درخواست خود را در اینجا وارد کنید..."
              value={values.text}
              onChange={onChange}
              error={
                errors.hasOwnProperty('text') && {
                  content: errors.text,
                  pointing: 'above',
                }
              }
              className="rtl-form-field"
            />
            {mutationData && (
              <Message
                success
                header={`از همکاری شما متشکریم...`}
                content={`به کاربر با نام‌کاربری ${mutationData.addUserRequest.user.username} پنج امتیاز اضافه شد و امتیاز کلی برابر است با: ${mutationData.addUserRequest.user.points}`}
                className="rtl-form-field"
              />
            )}
            <Form.Button className="rtl-form-field" primary>
              ثبت
            </Form.Button>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Home
