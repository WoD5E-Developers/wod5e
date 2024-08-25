/** Handle adding a new discipline to the sheet */
export const _onRemoveDiscipline = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const discipline = dataset.discipline

  await actor.update({
    [`system.disciplines.${discipline}.visible`]: false
  })
}
