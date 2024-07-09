import React from 'react'
import './JobCard.css'
import { JobDetails } from '../../common/types'

interface JobCardProps {
  job: JobDetails
}

export const JobCard: React.FunctionComponent<JobCardProps> = ({ job }) => {
  const statusClass = job.status === 'In Progress' ? 'in-progress' : 'complete'
  const jobId = `JOB-${String(job.id).padStart(3, '0')}`
  return (
    <div className="job-card">
      <div className="name">{job.name}</div>
      <div className="detail">{jobId}</div>
      <div className="detail">{job.location}</div>
      <div className="detail">{job.dateTime}</div>
      <div className="bottom">
        <div className={`status ${statusClass}`}>{job.status}</div>
        <div className="numAllocations">{job.numAllocations}</div>
      </div>
    </div>
  )
}
