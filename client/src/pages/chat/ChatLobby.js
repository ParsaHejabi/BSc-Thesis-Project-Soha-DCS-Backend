import React, { useEffect, useRef, useContext } from 'react'
import { useQuery, gql, useSubscription, useMutation } from '@apollo/client'
import { AuthContext } from '../../context/auth'
import { animateScroll } from 'react-scroll'
import { Input, Button, Dropdown } from 'semantic-ui-react'
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
  const [sendRequest] = useMutation(SEND_CHAT_REQUESTS)
  if (requestsSub.error) alert(JSON.stringify(requestsSub.error, null, 2))

  if (
    requestsSub?.data?.chatRequestSub &&
    requestsSub.data.chatRequestSub !== ''
  )
    alert('REQUEST FROM: ' + requestsSub.data.chatRequestSub)
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
      alert(user.username + ' ====== ' + other)
      sendRequest({
        variables: { user: user.username, receiver: other },
      })
    }

    // history.push('/chat', { otherUser: other })
  }
  const isLoading = () => {
    return (
      leaderboardQuery.loading || onlineInitQuery.loading || pointQuery.loading
    )
  }

  return !isLoading() ? (
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
  ) : (
    <div>LOADING...</div>
  )
}

export default ChatLobby
