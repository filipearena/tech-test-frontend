import { format, parseISO } from 'date-fns'

export const FormatDate = (startDate: string, endDate: string): string => {
  const parsedStart = parseISO(startDate)
  const parsedEnd = parseISO(endDate)
  const formattedStartDate = format(parsedStart, 'EEE d MMMM yyyy, h:mmaaa')
  const formattedEndDate = format(parsedEnd, 'h:mmaaa')
  return `${formattedStartDate} - ${formattedEndDate}`
}
