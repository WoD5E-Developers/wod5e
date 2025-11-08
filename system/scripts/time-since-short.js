/* global game */

export function timeSinceShort(timeStamp) {
  timeStamp = new Date(timeStamp)
  const now = new Date()
  const seconds = (now - timeStamp) / 1000
  const components = game.time.earthCalendar.timeToComponents(seconds)

  return game.time.earthCalendar.format(components, 'ago', {
    short: true,
    separator: ' ',
    maxTerms: 1
  })
}
