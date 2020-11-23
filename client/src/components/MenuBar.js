import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const MenuBar = () => {
  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substr(1)

  const [activeItem, setActiveItem] = useState(path)

  const handleItemClick = (e, { name }) => setActiveItem(name)

  return (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Item
        name="about"
        active={activeItem === 'about'}
        onClick={handleItemClick}
        as={Link}
        to="/about"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="users"
          active={activeItem === 'users'}
          onClick={handleItemClick}
          as={Link}
          to="/users"
        />
      </Menu.Menu>
    </Menu>
  )
}

export default MenuBar