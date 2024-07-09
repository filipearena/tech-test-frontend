import React, { useMemo } from 'react'
import './JobCard.css'
import { JobDetails } from '../../common/types'

interface JobCardProps {
  job: JobDetails
}

export const JobCard: React.FunctionComponent<JobCardProps> = ({ job }) => {
  const statusClass = useMemo(() => {
    return job.status === 'In Progress' ? 'in-progress' : 'complete'
  }, [job.status])

  const jobId = useMemo(() => {
    return `JOB-${String(job.id).padStart(3, '0')}`
  }, [job.id])

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
