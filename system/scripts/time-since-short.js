export function timeSinceShort(timeStamp) {
  timeStamp = new Date(timeStamp)
  const now = new Date()
  const seconds = (now - timeStamp) / 1000
  const components = game.time.earthCalendar.timeToComponents(seconds)
  const formatted = game.time.earthCalendar.format(components, 'duration', {
    short: true,
    separator: ' ',
    maxTerms: 1
  })

  if (formatted) {
    return game.i18n.format('WOD5E.StringAgo', {
      string: formatted
    })
  } else {
    return game.i18n.localize('WOD5E.Now')
  }
}
