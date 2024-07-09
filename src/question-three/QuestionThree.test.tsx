import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { QuestionThree } from './QuestionThree'
import '@testing-library/jest-dom/jest-globals'
import '@testing-library/jest-dom'
import { Job, JobAllocations } from '../common/types'

const mockJobs: Job[] = [
  {
    id: 0,
    name: 'Build a fence',
    contactId: 0,
    start: '2018-09-01T10:00:00Z',
    end: '2018-09-01T11:00:00Z',
    location: 'Brisbane',
    status: 'In Progress'
  },
  {
    id: 1,
    name: 'Build a shed',
    contactId: 1,
    start: '2018-09-01T10:15:00Z',
    end: '2018-09-01T11:00:00Z',
    location: 'Brisbane',
    status: 'Complete'
  },
  {
    id: 2,
    name: 'Repair roof tiles',
    contactId: 2,
    start: '2018-09-02T09:00:00Z',
    end: '2018-09-02T12:00:00Z',
    location: 'Sydney',
    status: 'In Progress'
  },
  {
    id: 3,
    name: 'Paint exterior walls',
    contactId: 3,
    start: '2018-09-03T08:00:00Z',
    end: '2018-09-03T15:00:00Z',
    location: 'Melbourne',
    status: 'Complete'
  },
  {
    id: 4,
    name: 'Install kitchen cabinets',
    contactId: 0,
    start: '2018-09-04T11:00:00Z',
    end: '2018-09-04T13:00:00Z',
    location: 'Perth',
    status: 'In Progress'
  },
  {
    id: 5,
    name: 'Lay wooden flooring',
    contactId: 1,
    start: '2018-09-05T10:30:00Z',
    end: '2018-09-05T14:30:00Z',
    location: 'Adelaide',
    status: 'Complete'
  }
]

const mockJobAllocations: JobAllocations[] = [
  {
    id: 0,
    resourceId: 1,
    jobId: 1
  },
  {
    id: 1,
    resourceId: 0,
    jobId: 2
  },
  {
    id: 2,
    resourceId: 2,
    jobId: 1
  },
  {
    id: 3,
    resourceId: 2,
    jobId: 1
  }
]

const mockService = {
  getJobs: jest.fn(() => Promise.resolve([] as Job[])),
  getJobAllocations: jest.fn(() => Promise.resolve([] as JobAllocations[])),
  getActivities: jest.fn(() => Promise.resolve([])),
  getActivityAllocations: jest.fn(() => Promise.resolve([])),
  getResources: jest.fn(() => Promise.resolve([])),
  getJobsWithSearchTerm: jest.fn((searchTerm: string) => Promise.resolve([]))
}

const mockProps = {
  service: mockService
}

describe('QuestionThree', () => {
  beforeEach(() => {
    jest.useFakeTimers() // Use fake timers to control setTimeout in handleChange
    mockService.getJobs.mockImplementation(() => Promise.resolve(mockJobs))
    mockService.getJobAllocations.mockImplementation(() => Promise.resolve(mockJobAllocations))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', async () => {
    render(<QuestionThree {...mockProps} />)

    //hold until api is complete and data is processed
    await waitFor(() => {
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    await waitFor(() => {
      //Correct number of allocations is displayed
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    const leftColumn = screen.getByTestId('left-column')
    const rightColumn = screen.getByTestId('right-column')

    expect(leftColumn.children.length).toBe(6)
    expect(rightColumn.children.length).toBe(10)
  })
})
