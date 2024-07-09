import React, { useEffect, useState, useCallback } from 'react'
import { isSameDay, parseISO } from 'date-fns'
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

  const filterForTargetDate = useCallback((events: JobActivity[], target: Date) => {
    return events.filter((event: JobActivity) => {
      const startDate = parseISO(event.start)
      const endDate = parseISO(event.end)
      return isSameDay(startDate, target) && isSameDay(endDate, target)
    })
  }, [])

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
        const resourceActivities = activityAllocations.filter(
          actAlloc => actAlloc.resourceId.toString() === res.id.toString()
        )

        const resourceJobs = jobAllocations.filter(jobAlloc => jobAlloc.resourceId.toString() === res.id.toString())

        const allocations: Allocation[] = []

        resourceActivities.forEach(resAct => {
          const activityToAllocation: Allocation[] = relevantActivities
            .filter(relAct => relAct.id.toString() === resAct.activityId.toString())
            .map(a => ({
              allocType: 'activity',
              name: a.name,
              start: a.start,
              end: a.end
            }))
          allocations.push(...activityToAllocation)
        })

        resourceJobs.forEach(resJob => {
          const jobToAllocation: Allocation[] = relevantJobs
            .filter(relJob => relJob.id.toString() === resJob.jobId.toString())
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
          resourceId: res.id,
          allocations
        }
      })

      setResourceSchedules(finalBlob)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SectionGroup>
      <SectionPanel>{JSON.stringify(resourceSchedules)}</SectionPanel>
    </SectionGroup>
  )
}
