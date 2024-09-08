export const _onToggleLimited = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const field = target.getAttribute('data-name')

  // Secondary variables
  let currentValue = actor
  const fieldParts = field.split('.')

  // Iterate through the fieldParts to get the current value
  for (const part of fieldParts) {
    currentValue = currentValue[part]
  }

  if (field) {
    actor.update({ [field]: !currentValue })
  }
}
