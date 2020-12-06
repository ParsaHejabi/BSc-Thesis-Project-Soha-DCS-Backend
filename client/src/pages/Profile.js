import { Message } from 'semantic-ui-react'
function Profile() {
  return (
    <Message
      error
      header="Action Forbidden"
      content="You can only sign up for an account once with a given e-mail address."
    />
  )
}

export default Profile
