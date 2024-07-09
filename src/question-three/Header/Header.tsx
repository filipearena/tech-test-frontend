import React from 'react'
import './Header.css'

interface HeaderProps {
  children?: React.ReactNode
}

export const Header: React.FunctionComponent<HeaderProps> = ({ children }) => {
  return <div className="header">{children}</div>
}
