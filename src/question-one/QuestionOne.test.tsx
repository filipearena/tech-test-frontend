import React from 'react'
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react'
import { QuestionOne } from './QuestionOne'
import '@testing-library/jest-dom/jest-globals'
import '@testing-library/jest-dom'
import { JobWithSearchTerm } from '../common/types'

const mockService = {
  getJobs: jest.fn(() => Promise.resolve([])),
  getActivities: jest.fn(() => Promise.resolve([])),
  getJobAllocations: jest.fn(() => Promise.resolve([])),
  getActivityAllocations: jest.fn(() => Promise.resolve([])),
  getResources: jest.fn(() => Promise.resolve([])),
  getJobsWithSearchTerm: jest.fn((searchTerm: string) => Promise.resolve([] as JobWithSearchTerm[]))
}

const mockProps = {
  service: mockService
}

describe('QuestionOne Component', () => {
  beforeEach(() => {
    jest.useFakeTimers() // Use fake timers to control setTimeout in handleChange
    mockService.getJobsWithSearchTerm.mockImplementation((searchTerm: string): Promise<JobWithSearchTerm[]> => {
      const mockJobs = [
        {
          name: 'Job A',
          start: '2023-07-10T09:00:00Z',
          end: '2023-07-10T17:00:00Z',
          contact: { id: 1, name: 'John Smith' }
        },
        {
          name: 'Job B',
          start: '2023-07-12T08:00:00Z',
          end: '2023-07-12T16:00:00Z',
          contact: { id: 2, name: 'Jane Doe' }
        }
      ]
      return Promise.resolve(mockJobs.filter(job => job.name.toLowerCase().includes(searchTerm.toLowerCase())))
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component correctly', () => {
    render(<QuestionOne {...mockProps} />)
    expect(screen.getByPlaceholderText('Search jobs...')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('changes to input invokes API call', async () => {
    render(<QuestionOne {...mockProps} />)
    const searchInput = screen.getByPlaceholderText('Search jobs...')
    fireEvent.change(searchInput, { target: { value: 'job' } })
    await waitFor(() => expect(mockService.getJobsWithSearchTerm).toHaveBeenCalledTimes(1))
  })

  it('changes to input triggers app to go into loading state until the api resolves', async () => {
    mockService.getJobsWithSearchTerm.mockClear()
    mockService.getJobsWithSearchTerm.mockImplementation((searchTerm: string) => {
      const mockJobs = [
        {
          name: 'Job A',
          start: '2023-07-10T09:00:00Z',
          end: '2023-07-10T17:00:00Z',
          contact: { id: 1, name: 'John Smith' }
        },
        {
          name: 'Job B',
          start: '2023-07-12T08:00:00Z',
          end: '2023-07-12T16:00:00Z',
          contact: { id: 2, name: 'Jane Doe' }
        }
      ]
      return new Promise(resolve => {
        setTimeout(() => {
          const filteredJobs = mockJobs.filter(job => job.name.toLowerCase().includes(searchTerm.toLowerCase()))
          resolve(filteredJobs)
        }, 1000) // 1 second delay
      })
    })
    render(<QuestionOne {...mockProps} />)

    const searchInput = screen.getByPlaceholderText('Search jobs...')

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'job' } })
      jest.advanceTimersByTime(500)
    })

    expect(screen.getByText('Loading...')).toBeVisible()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

    expect(screen.getByText('Job A')).toBeInTheDocument()
  })

  it('changes to input trigger a search', async () => {
    render(<QuestionOne {...mockProps} />)
    const searchInput = screen.getByPlaceholderText('Search jobs...')
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'job' } })
    })
    await waitFor(() => expect(mockService.getJobsWithSearchTerm).toHaveBeenCalledWith('job'))
    await waitFor(() => expect(mockService.getJobsWithSearchTerm).toHaveBeenCalledTimes(1))
    expect(screen.getByText('Job A')).toBeInTheDocument()
    expect(screen.queryByText('No results match the criteria')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('handles clearing the search field', async () => {
    render(<QuestionOne {...mockProps} />)
    const searchInput = screen.getByPlaceholderText('Search jobs...') as HTMLInputElement
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'job' } })
      await waitFor(() => expect(mockService.getJobsWithSearchTerm).toHaveBeenCalledTimes(1))
      const clearButton = screen.getByText('Clear')
      fireEvent.click(clearButton)
    })
    expect(searchInput.value).toBe('')
    expect(screen.queryByText('Job A')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.queryByText('No results match the criteria')).not.toBeInTheDocument()
  })
})
