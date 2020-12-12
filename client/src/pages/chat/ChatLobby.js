import React, { useEffect, useRef, useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import { AuthContext } from '../../context/auth'
import { animateScroll } from 'react-scroll'
import { Input, Button, Dropdown } from 'semantic-ui-react'

const GET_USERS = gql`
  {
    users {
      username
      updatedAt
    }
  }
`

const ChatLobby = () => {
  const { user } = useContext(AuthContext)
  let { loading, error, data } = useQuery(GET_USERS)
  const [other, setOther] = React.useState('')
  const [usernameError, setUsernameError] = React.useState(null)

  const submit = () => {
    if (!data.users.map((u) => u.username).includes(other))
      setUsernameError('کاربر مورد نظر یافت نشد')
  }

  return (
    <div className="chat-lobby-container ">
      <div className="chat-lobby-card">
        <div className="form-field">
          نام کاربری کاربر مورد نظرتان را وارد کنید
        </div>

        <Input
          placeholder="Username:"
          className="chat-input-margined"
          onChange={(evt) => setOther(evt.target.value)}
        />
        {(usernameError || error) && (
          <div className="form-field chat-field-error">
            {usernameError + '\n' + (error ? 'خطایی رخ داد' : '')}
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
    </div>
  )
}

export default ChatLobby
