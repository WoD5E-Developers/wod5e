/* global WOD5E */
import { Disciplines } from '../../../api/def/disciplines.js'

export const prepareDisciplines = async function (actor) {
  // Secondary variables
  const disciplinesList = Disciplines.getList({})
  const disciplines = actor.system?.disciplines

  // Clean up non-existent disciplines, such as custom ones that no longer exist
  const validDisciplines = new Set(Object.keys(disciplinesList))
  for (const id of Object.keys(disciplines)) {
    if (!validDisciplines.has(id)) {
      delete disciplines[id]
    }
  }

  for (const [id, value] of Object.entries(disciplinesList)) {
    let disciplineData = {}

    // If the actor has a discipline with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(disciplines, id)) {
      disciplineData = Object.assign({
        value: disciplines[id].value,
        powers: [],
        description: disciplines[id].description,
        visible: disciplines[id].visible
      }, value)
    } else { // Otherwise, add it to the actor and set it as some default data
      await actor.update({
        [`system.disciplines.${id}`]: {
          value: 0,
          visible: false,
          description: '',
          powers: []
        }
      })

      disciplineData = Object.assign({
        value: 0,
        visible: false,
        description: '',
        powers: []
      }, value)
    }

    // Ensure the discipline exists
    if (!disciplines[id]) disciplines[id] = {}
    // Apply the discipline's data
    disciplines[id] = disciplineData

    // Make it forced invisible if it's set to hidden
    if (disciplineData.hidden) {
      disciplines[id].visible = false
    }

    // Localize the discipline name
    disciplines[id].label = WOD5E.api.generateLabelAndLocalize({ string: id, type: 'discipline' })

    // Wipe old discipline powers so they doesn't duplicate
    disciplines[id].powers = []
  }

  return disciplines
}
