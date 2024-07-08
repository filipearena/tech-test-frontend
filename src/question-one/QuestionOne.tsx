import React, { ChangeEvent, useState } from 'react'
import { IAppTabContainer, JobWithSearchTerm } from '../common/types'

import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

import './QuestionOne.css'
import { FormatDate } from './helpers'

export const QuestionOne = (props: IAppTabContainer) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [jobs, setJobs] = useState<JobWithSearchTerm[]>([])
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const [apiCalled, setApiCalled] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setSearchValue(inputValue)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (inputValue.length > 2) {
      const newDebounceTimer = setTimeout(async () => {
        setLoading(true)
        setApiCalled(true)
        try {
          const jobsWithSearchTerms = await props.service.getJobsWithSearchTerm(inputValue)
          setJobs(jobsWithSearchTerms)
        } catch (error) {
          console.error('Error fetching jobs:', error)
        } finally {
          setLoading(false)
        }
      }, 500)
      setDebounceTimer(newDebounceTimer)
    } else {
      setJobs([])
      setApiCalled(false)
    }
  }

  const clearField = () => {
    setSearchValue('')
    setJobs([])
    setApiCalled(false)
  }

  return (
    <SectionGroup>
      <SectionPanel>
        <div className="search__container">
          <input
            name="search"
            value={searchValue}
            onChange={handleChange}
            placeholder="Search jobs..."
            className="search__input"
          />
          <button onClick={clearField} className="clear__button">
            Clear
          </button>
        </div>
        {loading && <div className="loader">Loading...</div>}
        {jobs && jobs.length > 0 && (
          <table className="jobs__table">
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Start Date</th>
                <th>Finish Date</th>
                <th>Contact Name</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.name}>
                  <td>{job.name}</td>
                  <td>{FormatDate(job.start)}</td>
                  <td>{FormatDate(job.end)}</td>
                  <td>{job.contact.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {jobs && jobs.length === 0 && apiCalled && !loading && <div>No results match the criteria</div>}
      </SectionPanel>
    </SectionGroup>
  )
}
