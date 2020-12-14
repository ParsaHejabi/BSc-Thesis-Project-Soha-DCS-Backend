import { useQuery, gql, useMutation } from '@apollo/client'
import {
  Table,
  Grid,
  Placeholder,
  Button,
  Message,
  Form,
} from 'semantic-ui-react'
import moment from 'moment'
import React, { useState, useContext } from 'react'

import { AuthContext } from '../context/auth'

import { Link } from 'react-router-dom'

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
    $text: String!
    $possibleReference: String
    $type: RequestType
    $properties: [RequestProperty]
  ) {
    addUserRequest(
      userRequestInput: {
        text: $text
        type: $type
        possibleReference: $possibleReference
        properties: $properties
        place: WEBSITE
      }
    ) {
      id
      user
      text
      type
      possibleReference
      properties
      place
      createdAt
      updatedAt
    }
  }
`

function Home() {
  const { user } = useContext(AuthContext)

  let { loading, error, data } = useQuery(GET_TOP_USERS)

  const mapArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const options = [
    { key: 'QUESTION', text: 'سوال', value: 'QUESTION' },
    { key: 'REQUEST', text: 'درخواست', value: 'REQUEST' },
    { key: 'OPINION', text: 'نظر / انتقاد و پیشنهاد', value: 'OPINION' },
    { key: 'OTHER', text: 'سایر', value: 'OTHER' },
    { key: 'EMPTY', text: 'نوع ورودی', value: '' },
  ]

  // const possibleReferenceOptions = [
  //   { key: '1', text: 'رئیس دانشکده', value: 'رئیس دانشکده' },
  //   { key: '2', text: 'معاون پژوهشی', value: 'معاون پژوهشی' },
  //   { key: '3', text: 'معاون آموزشی', value: 'معاون آموزشی' },
  //   { key: '4', text: 'مسئول آموزش', value: 'مسئول آموزش' },
  //   { key: '5', text: 'آبدارچی', value: 'آبدارچی' },
  //   { key: '6', text: 'استاد راهنما', value: 'استاد راهنما' },
  //   { key: '7', text: 'سایر', value: '' },
  // ]

  const [values, setValues] = useState({
    properties: [],
    text: '',
    type: '',
    possibleReference: '',
  })
  const [errors, setErrors] = useState({})

  const [
    addUserRequest,
    { loading: mutationLoading, data: mutationData },
  ] = useMutation(ADD_USER_REQUEST, {
    variables:
      values.type === ''
        ? {
            properties: values.properties,
            text: values.text,
            possibleReference: values.possibleReference,
          }
        : values,
    // update(cache, mutationResult) {
    //   let { loading, error, data } = useQuery(GET_TOP_USERS)

    //   cache.writeQuery({ query: GET_TOP_USERS, data })
    // },
    refetchQueries: [{ query: GET_TOP_USERS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setErrors({})
      setValues({
        properties: [],
        text: '',
        type: '',
        possibleReference: '',
      })
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.exception.errors.errors)
      setValues({
        properties: [],
        text: '',
        type: '',
        possibleReference: '',
      })
    },
  })

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

  const onChangeCheckbox = (event, data) => {
    if (event.target.checked) {
      let newProperties = values.properties
      newProperties.push(event.target.name)
      setValues({ ...values, properties: newProperties })
    } else {
      let newProperties = values.properties
      let index = newProperties.indexOf(event.target.name)
      if (index >= 0) {
        newProperties.splice(index, 1)
      }
      setValues({ ...values, properties: newProperties })
    }
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
        <Grid.Column width={5}>
          <h2 className="rtl-h2">لیدربرد</h2>
          <Table className="rtl-table" celled textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>رتبه</Table.HeaderCell>
                <Table.HeaderCell>نام کاربری</Table.HeaderCell>
                <Table.HeaderCell>امتیازات</Table.HeaderCell>
                <Table.HeaderCell>آخرین فعالیت</Table.HeaderCell>
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
                      <Table.Cell>{index + 1}</Table.Cell>
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
        <Grid.Column width={11}>
          <h2 className="rtl-h2">هدف ما؟ 🎯</h2>
          <p className="rtl-p">
            هدف ما جمع‌آوری داده برای سامانه‌ای به نام سها است که در آزمایشگاه
            پردازش زبان طبیعی دانشگاه شهید بهشتی توسعه می‌یابد. سامانه سها چت
            باتی است که در آینده درخواست‌ها، سوالات و نظرات اعضای دانشکده مهندسی
            و علوم کامپیوتر را دریافت و بسته به نوع آن دسته‌بندی کرده و سپس یا
            خود پاسخ می‌دهد و یا برای پاسخگویی به مسئول مربوطه ارجاع می‌دهد.
          </p>
          <h2 className="rtl-h2">هر چه می‌خواهد دل تنگت بگو! 🎙</h2>
          <p className="rtl-p">
            شما با وارد کردن هرگونه درخواست، سوال، پیشنهاد و سایر موارد (هر چیزی
            به ذهنتون رسید) و به هر شکلی که خودتون احساس راحتی می‌کنید، می‌تونید
            به ما کمک کنید. بعضی از ورودی‌های احتمالیتون می‌تونه مثل مثال‌های
            زیر باشه:
          </p>
          <ul className="rtl-p">
            <li>
              <b className="rtl-b">نمونه سوال: </b>انتخاب واحد دوره ورودی ۹۵
              کیه؟
            </li>
            <li>
              <b className="rtl-b">نمونه درخواست: </b>می‌خواستم رتبه‌ی خودم رو
              در بین افراد ورودیم ببینم. شماره دانشجوییم هم ۹۱۱۱۱۱۱۱.
            </li>
            <li>
              <b className="rtl-b">نمونه نظر / انتقاد و پیشنهاد: </b>امروز کلاس
              برنامه‌نویسی پیشرفته چقدر خوب بود!
              <br />
              چرا دستشویی پایین شیرش خراب بود؟
            </li>
            <li>
              <b className="rtl-b">سایر موارد: </b>چقدر امروز هوا سرد بود.
            </li>
          </ul>
          {!user && (
            <>
              <h2 className="rtl-h2">ثبت‌نام کن و جایزه بگیر! 🏆</h2>
              <p className="rtl-p">
                برای کمک کردن به ما و گرفتن جایزه، اول باید در وبسایت ثبت‌نام
                کنید تا امتیازاتی که می‌گیرید به اکانت شما تعلق بگیره. برای
                ثبت‌نام هیچ اطلاعاتی جز یک <b className="rtl-b">نام کاربری</b> و
                یک <b className="rtl-b">گذرواژه</b> نیاز نیست! با یک نام کاربری
                که در گذشته استفاده نشده باشه در وبسایت ثبت‌نام کنید تا
                امتیازاتی که می‌گیرید به اکانت شما تعلق بگیره.
              </p>
              <p className="rtl-p">
                با هر بار وارد کردن داده در سامانه، داده ورودی شما بررسی شده و
                امتیازی به حساب شما تعلق می‌گیرد. در طول دو هفته اگر تعداد
                درخواست‌های ورودی از تعداد مشخصی بیشتر شود سقف جوایز بیشتر خواهد
                شد. در انتهای دو هفته به سه نفر اول جوایزی نقدی اهدا خواهد شد.
              </p>
              <Button primary className="rtl-button" as={Link} to="/login">
                ورود
              </Button>
              <Button
                basic
                color="blue"
                className="rtl-button"
                as={Link}
                to="/register"
              >
                ثبت‌نام
              </Button>
            </>
          )}
          {user && (
            <>
              <h2 className="rtl-h2">چند تا نکته! 💯</h2>
              <Message warning className="rtl-message">
                <Message.Header>حواستون به چند تا نکته باشه:</Message.Header>
                <ul className="rtl-p">
                  <li>
                    لیدربردی که سمت چپ این صفحه می‌بینید به صورت زنده ده نفر اول
                    سایت با بیشترین امتیاز رو نشون می‌ده.
                  </li>
                  <li>
                    موقع وارد کردن درخواست‌ها، سوال‌ها و ... فیلد‌هایی وجود داره
                    برای مشخص کردن:
                    <ul className="rtl-p">
                      <li>نوع اون ورودی (مثلا سوال، درخواست، نظر و ...)</li>
                      <li>
                        پاسخ‌دهنده‌ی احتمالی به ورودی شما (مثلا رئیس دانشکده،
                        معاون پژوهشی، معاون آموزشی، مسئول آموزش، آبدارچی، استاد
                        راهنما و ...)
                      </li>
                      <li>
                        وجود <b className="rtl-b">طنز، طعنه یا توهین</b> در متن
                        ورودی شما
                      </li>
                    </ul>
                    که البته این فیلد‌ها <b className="rtl-b">اختیاری</b> هستند.
                  </li>
                  <li>
                    امتیاز متن‌های وارد کرده شما بعد از ۱ یا ۲ ساعت به اکانتتون
                    اضافه می‌شه.
                  </li>
                  <li>
                    دقت کنید که امتیازی که می‌گیرید با سایز متن ورودی‌تون، تعداد
                    فیلد‌هایی که وارد کردید و میزان درست وارد کردن فیلد‌ها
                    ارتباط داره. برای مثال کسی که در متنش درخواست داشته اما نوع
                    ورودی رو سوال وارد کرده امتیاز کمتری نسبت به کسی که درست
                    وارد کرده می‌گیره.
                  </li>
                </ul>
              </Message>
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  addUserRequest()
                }}
                loading={mutationLoading}
                success={mutationData && Object.keys(mutationData).length !== 0}
              >
                <h2 className="rtl-h2">ارسال درخواست، سوال، نظر و ...</h2>
                <Form.Group widths="equal" className="rtl-form-field">
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
                    placeholder="برای مثال معاون پژوهشی..."
                    value={values.possibleReference}
                    onChange={onChange}
                    className="rtl-form-field"
                  />
                </Form.Group>
                <Form.TextArea
                  required
                  name="text"
                  label="متن ورودی"
                  placeholder="درخواست، سوال، نظر و ... را اینجا وارد کنید..."
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
                <Form.Group className="rtl-form-field" inline>
                  <label>این متن حاوی:</label>
                  <Form.Input
                    name="SARCASM"
                    label="طعنه"
                    onChange={onChangeCheckbox}
                    control="input"
                    type="checkbox"
                    checked={values.properties.indexOf('SARCASM') >= 0}
                  />
                  <Form.Input
                    name="HUMOR"
                    label="طنز"
                    onChange={onChangeCheckbox}
                    control="input"
                    type="checkbox"
                    checked={values.properties.indexOf('HUMOR') >= 0}
                  />
                  <Form.Input
                    name="INSULT"
                    label="توهین"
                    onChange={onChangeCheckbox}
                    control="input"
                    type="checkbox"
                    checked={values.properties.indexOf('INSULT') >= 0}
                  />
                  <label>است.</label>
                </Form.Group>
                {mutationData && (
                  <Message
                    success
                    header={`از همکاری شما متشکریم...`}
                    content={`ورودی شما بررسی خواهد شد و امتیاز آن پس از بررسی به حساب شما افزوده خواهد شد...`}
                    className="rtl-form-field"
                  />
                )}
                <Form.Button className="rtl-form-field" primary>
                  ثبت
                </Form.Button>
              </Form>
            </>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Home
