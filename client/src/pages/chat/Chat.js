import React, { useContext } from 'react'
import { useSubscription, useMutation, gql } from '@apollo/client'
import { AuthContext } from '../../context/auth'
const GET_MESSAGES = gql`
  subscription($receiver: String!) {
    messages(receiver: $receiver) {
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

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES, {
    variables: { receiver: user },
  })
  if (!data) {
    return null
  }

  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: 'flex',
            justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
            paddingBottom: '1em',
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: '0.5em',
                border: '2px solid #e5e6ea',
                borderRadius: 25,
                textAlign: 'center',
                fontSize: '18pt',
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? 'blue' : '#e5e6ea',
              color: user === messageUser ? 'white' : 'black',
              padding: '1em',
              borderRadius: '1em',
              maxWidth: '60%',
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
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
      <Messages user={state.user} />
      <div>
        <div xs={8}>
          <input
            label="Content"
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
        </div>
        <div xs={2} style={{ padding: 0 }}>
          <button onClick={() => onSend()} style={{ width: '100%' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
export default Chat
