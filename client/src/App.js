import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'
import AdminRoute from './util/AdminRoute'

import MenuBar from './components/MenuBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Switch>
            {/* <Route component={Profile} path="/profile" /> */}
            {/* <Route component={About} path="/about" /> */}
            <AuthRoute component={Register} path="/register" />
            <AuthRoute component={Login} path="/login" />

            <AdminRoute component={Admin} path="/admin" />
            <Route component={Home} path="/" />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  )
}

export default App
