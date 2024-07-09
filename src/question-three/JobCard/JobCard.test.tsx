import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import '@testing-library/jest-dom'

import { JobCard } from './JobCard'
import { JobDetails } from '../../common/types'

const fakeJob: JobDetails = {
  id: 1,
  name: 'Build a fence',
  location: 'Brisbane',
  dateTime: 'Tue 2 July 2024, 9:00am - 12:00pm',
  status: 'In Progress',
  numAllocations: 3
}

describe('JobCard', () => {
  it('renders job name correctly', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText(fakeJob.name)).toBeInTheDocument()
  })

  it('renders job ID correctly', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText('JOB-001')).toBeInTheDocument()
  })

  it('renders job location correctly', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText(fakeJob.location)).toBeInTheDocument()
  })

  it('renders job dateTime correctly', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText(fakeJob.dateTime)).toBeInTheDocument()
  })

  it('renders job status correctly', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText(fakeJob.status)).toBeInTheDocument()
  })

  it('renders number of allocations correctly', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText(fakeJob.numAllocations)).toBeInTheDocument()
  })

  it('applies the correct status class for "In Progress"', () => {
    render(<JobCard job={fakeJob} />)
    expect(screen.getByText(fakeJob.status)).toHaveClass('status in-progress')
  })

  it('applies the correct status class for "Complete"', () => {
    const completedJob = { ...fakeJob, status: 'Complete' }
    render(<JobCard job={completedJob} />)
    expect(screen.getByText('Complete')).toHaveClass('status complete')
  })
})
