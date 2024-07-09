import React, { useEffect, useState } from 'react'
import { IDataService, JobDetails } from '../common/types'

import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

import './QuestionThree.css'
import { FormatDate } from '../question-one/helpers'
import { JobCard } from './JobCard/JobCard'
import { Header } from './Header'

export const QuestionThree = ({ service }: { service: IDataService }) => {
  const [jobCards, setJobCards] = useState<JobDetails[]>([])
  const rightColumnBoxes = Array.from({ length: 10 }, (_, index) => index + 1)
  const leftPanelCircles = Array.from({ length: 4 }, (_, index) => index + 1)

  const fetchData = async () => {
    try {
      const [jobs, jobAllocations] = await Promise.all([service.getJobs(), service.getJobAllocations()])
      const jobCards: JobDetails[] = jobs.map(job => {
        const numAllocations = jobAllocations.filter(
          allocation => allocation.jobId.toString() === job.id.toString()
        ).length
        return {
          id: job.id,
          name: job.name,
          location: job.location,
          dateTime: FormatDate(job.start, job.end),
          status: job.status,
          numAllocations: numAllocations
        }
      })

      setJobCards(jobCards)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SectionGroup>
      <SectionPanel>
        <div className="container">
          <div className="left-panel">
            {leftPanelCircles.map(circle => (
              <div key={circle} className="circle"></div>
            ))}
          </div>
          <div className="inner-container">
            <Header>
              <h2>Header</h2>
            </Header>
            <div className="body-container">
              <div className="left-column" data-testid="left-column">
                {jobCards && jobCards.length > 0 && jobCards.map(job => <JobCard key={job.id} job={job}></JobCard>)}
              </div>
              <div className="right-column" data-testid="right-column">
                {rightColumnBoxes.map(box => (
                  <div key={box} className="box"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>
    </SectionGroup>
  )
}
