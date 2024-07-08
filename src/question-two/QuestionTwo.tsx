import React, { useEffect, useState } from 'react'
import { IDataService } from '../common/types'
import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

interface Allocation {
  allocType: 'job' | 'activity'
  name: string
  start: string
  end: string
}

interface ResourceSchedule {
  resourceName: string
  resourceId: number
  allocations: Allocation[]
}

interface JobActivity {
  id: number
  name: string
  start: string
  end: string
}

export const QuestionTwo = ({ service }: { service: IDataService }) => {
  const [resourceSchedules, setResourceSchedules] = useState<ResourceSchedule[]>([])

  const filterForTargetDate = (events: JobActivity[], target: Date) => {
    return events.filter((event: JobActivity) => {
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)

      return (
        startDate.getUTCFullYear() === target.getUTCFullYear() &&
        startDate.getUTCMonth() === target.getUTCMonth() &&
        startDate.getUTCDate() === target.getUTCDate() &&
        endDate.getUTCFullYear() === target.getUTCFullYear() &&
        endDate.getUTCMonth() === target.getUTCMonth() &&
        endDate.getUTCDate() === target.getUTCDate()
      )
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, jobAllocations, activities, activityAllocations, resources] = await Promise.all([
          service.getJobs(),
          service.getJobAllocations(),
          service.getActivities(),
          service.getActivityAllocations(),
          service.getResources()
        ])

        const targetDate = new Date('2018-09-01')

        const relevantJobs: JobActivity[] = filterForTargetDate(jobs, targetDate)
        const relevantActivities: JobActivity[] = filterForTargetDate(activities, targetDate)

        const finalBlob = resources.map(res => {
          const resourcedId = res.id + ''

          const resourceActivities = activityAllocations.filter(
            actAlloc => actAlloc.resourceId.toString() === resourcedId.toString()
          )

          const resourceJobs = jobAllocations.filter(
            jobAlloc => jobAlloc.resourceId.toString() === resourcedId.toString()
          )

          const allocations: Allocation[] = []

          resourceActivities.forEach(resAct => {
            const activityId = resAct.activityId
            const activitityToAllocation: Allocation[] = relevantActivities
              .filter(relAct => relAct.id.toString() === activityId.toString())
              .map(a => ({
                allocType: 'activity',
                name: a.name,
                start: a.start,
                end: a.end
              }))
            allocations.push(...activitityToAllocation)
          })

          resourceJobs.forEach(resJob => {
            const jobId = resJob.jobId
            const jobToAllocation: Allocation[] = relevantJobs
              .filter(relJob => relJob.id.toString() === jobId.toString())
              .map(a => ({
                allocType: 'job',
                name: a.name,
                start: a.start,
                end: a.end
              }))
            allocations.push(...jobToAllocation)
          })

          return {
            resourceName: res.name,
            resourceId: parseInt(resourcedId),
            allocations: allocations
          }
        })

        setResourceSchedules(finalBlob)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [service])

  return (
    <SectionGroup>
      <SectionPanel>{JSON.stringify(resourceSchedules)}</SectionPanel>
    </SectionGroup>
  )
}
