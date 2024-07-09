import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import '@testing-library/jest-dom'

import { Header } from './Header'

describe('Header', () => {
  it('renders children correctly', () => {
    render(<Header>Test Children</Header>)
    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  it('applies the header class', () => {
    const { container } = render(<Header />)
    expect(container.firstChild).toHaveClass('header')
  })
})
