export const FormatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }

  return new Intl.DateTimeFormat('en-AU', options).format(date)
}
