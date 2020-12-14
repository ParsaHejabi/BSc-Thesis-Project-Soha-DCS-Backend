import React, { useEffect, useRef, useContext } from 'react'
import { useQuery, gql, useSubscription, useMutation } from '@apollo/client'
import { AuthContext } from '../../context/auth'
import { animateScroll } from 'react-scroll'
import {
  Input,
  Button,
  Dropdown,
  Header,
  Image,
  Modal,
} from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import PrizesBar from '../../components/ChatPrizeProgress'
import ChatLeaderBoad from '../../components/ChatLeaderBoard'
const GET_CHAT_REQUESTS = gql`
  subscription($receiver: String!) {
    chatRequestSub(receiver: $receiver)
  }
`

const SEND_CHAT_REQUESTS = gql`
  mutation($user: String!, $receiver: String!) {
    chatRequest(user: $user, receiver: $receiver)
  }
`
const GET_CHAT_REQUESTS_ANSWER = gql`
  subscription($receiver: String!) {
    chatRequestAnswerSub(receiver: $receiver)
  }
`
const SEND_CHAT_REQUEST_ANSWER = gql`
  mutation($user: String!, $receiver: String!) {
    chatRequestAnswer(user: $user, receiver: $receiver)
  }
`

const GET_ONLINE_USERS = gql`
  subscription {
    onlineUsers
  }
`

const GET_ONLINE_USERS_INIT = gql`
  {
    onlineUsersInit
  }
`
const ALL_CHAT_POINTS = gql`
  {
    allChatPoints
  }
`
const GET_CHAT_LEADERBOARD = gql`
  {
    topChatUsers {
      username
      chatPoints
    }
  }
`

function RequestModal({ open, setOpen, user, onAccept }) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        <p className="modal-text">درخواست چت</p>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            <p className="modal-text">از طرف ‌{user}</p>
          </Header>
          <p className="modal-text">کاربر {user} می‌خواهد با شما وارد چت شود</p>
          <p className="modal-text">موافقید؟</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setOpen(false)}>
          خیر
        </Button>
        <Button
          content="بلی"
          labelPosition="right"
          icon="checkmark"
          color="blue"
          onClick={() => {
            setOpen(false)
            onAccept(user)
          }}
          primary
        />
      </Modal.Actions>
    </Modal>
  )
}
const sentRequest = {
  to: '',
  didSend: false,
}
const ChatCard = ({
  user,
  usersList,
  onDropdownChange,
  other,
  usernameError,
  submit,
  error,
}) => {
  return user.username != '' ? (
    <div className="chat-lobby-card">
      <div className="form-field">
        نام کاربری کاربر مورد نظرتان را پیدا کنید
      </div>

      <Dropdown
        button
        floating
        labeled
        options={usersList}
        search
        placeholder="Username:"
        className="chat-input-margined"
        onChange={onDropdownChange}
        text={other}
      />
      {usernameError && (
        <div className="form-field chat-field-error">
          {usernameError
            ? usernameError
            : '' + '\n' + (error ? 'خطایی رخ داد' : '')}
        </div>
      )}
      <Button
        className="form-field chat-field-submit "
        primary
        onClick={submit}
      >
        چت
      </Button>
    </div>
  ) : (
    <div></div>
  )
}
const ChatLobby = () => {
  let { user } = useContext(AuthContext)
  if (!user) user = { username: '' }
  const history = useHistory()

  const [modalOpen, setModalOpen] = React.useState(false)
  const closeModalWithCallBack = () => {
    setModalOpen(false)
    requestsSub.data.chatRequestSub = ''
  }
  const [allPoints, setAllPoints] = React.useState(0)
  let pointQuery = useQuery(ALL_CHAT_POINTS, {
    onCompleted: (data) => {
      setAllPoints(data.allChatPoints)
    },
  })

  let leaderboardQuery = useQuery(GET_CHAT_LEADERBOARD)

  let onlineInitQuery = useQuery(GET_ONLINE_USERS_INIT)

  let onlinesSub = useSubscription(GET_ONLINE_USERS)
  let requestsSub = useSubscription(GET_CHAT_REQUESTS, {
    variables: { receiver: user.username },
  })

  let requestsAnswerSub = useSubscription(GET_CHAT_REQUESTS_ANSWER, {
    variables: { receiver: user.username },
  })
  const [sendRequest] = useMutation(SEND_CHAT_REQUESTS)
  const [sendRequestAnswer] = useMutation(SEND_CHAT_REQUEST_ANSWER)
  if (requestsAnswerSub.error) alert(JSON.stringify(requestsSub.error, null, 2))

  const getRequestAnswerMaker = () => {
    return requestsAnswerSub?.data?.chatRequestAnswerSub &&
      requestsAnswerSub.data.chatRequestAnswerSub !== ''
      ? requestsAnswerSub.data.chatRequestAnswerSub
      : null
  }
  const answerMaker = getRequestAnswerMaker()
  if (answerMaker && answerMaker === sentRequest.to) {
    history.push('/chat', { otherUser: answerMaker })
  }

  const getRequestMaker = () => {
    return requestsSub?.data?.chatRequestSub &&
      requestsSub.data.chatRequestSub !== ''
      ? requestsSub.data.chatRequestSub
      : null
  }
  if (
    requestsSub?.data?.chatRequestSub &&
    requestsSub.data.chatRequestSub !== '' &&
    !modalOpen
  ) {
    setModalOpen(true)
  }
  const [other, setOther] = React.useState('')

  const getOnlineUsers = () => {
    let onLineList = []
    if (onlinesSub.data) onLineList = onlinesSub.data.onlineUsers
    else if (onlineInitQuery.data)
      onLineList = onlineInitQuery.data.onlineUsersInit
    return onLineList
      .filter((uname) => uname !== user.username)
      .map((uname) => {
        return { key: uname, text: uname, value: uname }
      })
  }

  const getErrors = () => {
    let error = {}
    if (onlinesSub.error) error = onlinesSub.error
    else if (onlineInitQuery.error) error = onlineInitQuery.error
    return error
  }

  const error = getErrors()
  const usersList = getOnlineUsers()
  const [usernameError, setUsernameError] = React.useState(null)

  const onDropdownChange = (e, data) => {
    setOther(data.value)
  }
  const submit = () => {
    if (!usersList.map((item) => item.value).includes(other))
      setUsernameError('کاربر مورد نظر در لیست آنلاین‌ها یافت نشد')
    else {
      sendRequest({
        variables: { user: user.username, receiver: other },
      })
      sentRequest.didSend = true
      sentRequest.to = other
    }

    // history.push('/chat', { otherUser: other })
  }
  const onAccept = (targetUser) => {
    sendRequestAnswer({
      variables: { user: user.username, receiver: targetUser },
    })
    history.push('/chat', { otherUser: targetUser })
  }
  const isLoading = () => {
    return (
      leaderboardQuery.loading || onlineInitQuery.loading || pointQuery.loading
    )
  }

  return !isLoading() ? (
    <>
      <div className="chat-lobby-container ">
        <div className="lobby-container-left">
          <ChatCard
            user={user}
            usersList={usersList}
            onDropdownChange={onDropdownChange}
            other={other}
            usernameError={usernameError}
            submit={submit}
            error={error}
          />
          <ChatLeaderBoad
            leaderboardData={leaderboardQuery.data?.topChatUsers}
            username={user.username}
          />
        </div>
        <PrizesBar totalPoints={allPoints}></PrizesBar>
      </div>
      <RequestModal
        open={modalOpen}
        setOpen={closeModalWithCallBack}
        user={getRequestMaker()}
        onAccept={onAccept}
      />
    </>
  ) : (
    <div>LOADING...</div>
  )
}

export default ChatLobby
