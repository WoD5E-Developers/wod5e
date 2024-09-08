export const _onToggleLimited = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const dataset = event.currentTarget.dataset
  const field = dataset.name

  // Secondary variables
  let currentValue = actor
  const fieldParts = field.split('.')

  // Iterate through the fieldParts to get the current value
  for (const part of fieldParts) {
    currentValue = currentValue[part]
  }

  if (field) {
    await actor.update({ [field]: !currentValue })
  }
}
