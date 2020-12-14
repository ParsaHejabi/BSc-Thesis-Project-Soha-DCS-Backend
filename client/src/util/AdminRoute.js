import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function AdminRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext)

  const admin = user && user.username === 'admin'

  return (
    <Route
      {...rest}
      render={(props) =>
        admin ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  )
}

export default AdminRoute
