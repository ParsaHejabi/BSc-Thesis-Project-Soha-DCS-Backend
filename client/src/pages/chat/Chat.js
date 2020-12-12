import React, { useEffect, useRef, useContext } from 'react'
import { useSubscription, useMutation, gql } from '@apollo/client'
import { AuthContext } from '../../context/auth'
import { animateScroll } from 'react-scroll'
import { Input, Button } from 'semantic-ui-react'
import './Chat.css'
const GET_MESSAGES = gql`
  subscription($receiver: String!, $other: String!) {
    messages(receiver: $receiver, other: $other) {
      id
      content
      user
    }
  }
`

const POST_MESSAGE = gql`
  mutation($user: String!, $receiver: String!, $content: String!) {
    postMessage(user: $user, receiver: $receiver, content: $content)
  }
`

const Messages = ({ user, other }) => {
  const { data } = useSubscription(GET_MESSAGES, {
    variables: { receiver: user, other: other },
  })
  if (!data) {
    return null
  }
  animateScroll.scrollToBottom({
    containerId: 'ContainerElementID',
  })
  return (
    <div class="chat" id="ContainerElementID">
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div class="message-row">
          <div
            class={
              'message message--' + (user === messageUser ? 'sent' : 'recieved')
            }
          >
            <div class="message-avatar">
              {user === messageUser ? 'You' : 'Them'}
            </div>
            <div class="message-bubble">
              <p className="message-text rtl-form-field ">{content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
const Chat = () => {
  const { user } = useContext(AuthContext)

  const [state, stateSet] = React.useState({
    user: user.username,
    receiver: 'parastoo',
    content: '',
  })
  const [postMessage] = useMutation(POST_MESSAGE)
  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      })
    }
    stateSet({
      ...state,
      content: '',
    })
  }

  return (
    <div>
      <Messages className="content" user={state.user} other={state.receiver} />

      <footer className="chat-footer">
        <Input
          className="chat-input rtl-form-field"
          placeholder="چیزی بگو..."
          value={state.content}
          onChange={(evt) =>
            stateSet({
              ...state,
              content: evt.target.value,
            })
          }
          onKeyUp={(evt) => {
            if (evt.keyCode === 13) {
              onSend()
            }
          }}
        />
        <div>
          <Button className="form-field" primary onClick={() => onSend()}>
            ارسال
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default Chat
