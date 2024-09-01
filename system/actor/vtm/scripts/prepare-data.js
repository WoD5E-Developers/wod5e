/* global WOD5E, TextEditor */
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
        powers: disciplines[id].powers || [],
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

    // Enrich discipline description
    disciplines[id].enrichedDescription = await TextEditor.enrichHTML(disciplines[id].description)
  }

  return disciplines
}

export const prepareDisciplinePowers = async function (disciplines) {
  for (const disciplineType in disciplines) {
    if (Object.prototype.hasOwnProperty.call(disciplines, disciplineType)) {
      const discipline = disciplines[disciplineType]

      if (discipline && Array.isArray(discipline.powers)) {
        // Check if the discipline has powers
        if (discipline.powers.length > 0) {
          // Ensure visibility is set correctly
          if (!discipline.visible && !discipline.hidden) discipline.visible = true

          // Sort the discipline containers by the level of the power
          discipline.powers = discipline.powers.sort(function (power1, power2) {
            // Ensure power1 and power2 have the necessary properties
            const level1 = power1.system ? power1.system.level : 0
            const level2 = power2.system ? power2.system.level : 0

            // If levels are the same, sort alphabetically instead
            if (level1 === level2) {
              return power1.name.localeCompare(power2.name)
            }

            // Sort by level
            return level1 - level2
          })
        }
      } else {
        console.warn(`Discipline ${disciplineType} is missing or powers is not an array.`)
      }
    }
  }

  return disciplines
}
