import React, { useEffect, useState, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'

import { AuthContext } from '../context/auth'

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext)

  const admin = user && user.username === 'admin'

  let location = useLocation()
  const path = location.pathname === '/' ? 'home' : location.pathname.substr(1)

  const [activeItem, setActiveItem] = useState(path)

  useEffect(() => {
    setActiveItem(path)
  }, [location, path])

  const handleItemClick = (e, { name }) => setActiveItem(name)

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      {admin && (
        <Menu.Item
          name="admin"
          active={activeItem === 'admin'}
          onClick={handleItemClick}
          as={Link}
          to="/admin"
        />
      )}
      {/* <Menu.Item
        name={`My Profile`}
        active={activeItem === 'profile'}
        onClick={handleItemClick}
        as={Link}
        to="/profile"
      />
      <Menu.Item
        name="about"
        active={activeItem === 'about'}
        onClick={handleItemClick}
        as={Link}
        to="/about"
      /> */}
      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      {/* <Menu.Item
        name="about"
        active={activeItem === 'about'}
        onClick={handleItemClick}
        as={Link}
        to="/about"
      /> */}
      <Menu.Menu position="right">
        <Menu.Item
          name="register"
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  )

  return menuBar
}

export default MenuBar
