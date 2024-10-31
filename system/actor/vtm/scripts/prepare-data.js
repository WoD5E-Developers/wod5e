import { Disciplines } from '../../../api/def/disciplines.js'

export const prepareDisciplines = async function (actor) {
  // Secondary variables
  const disciplinesList = Disciplines.getList({})
  const actorDisciplines = actor.system?.disciplines
  const computedDisciplines = {}

  for (const [id, value] of Object.entries(disciplinesList)) {
    let disciplineData = {}

    // If the actor has a discipline with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(actorDisciplines, id)) {
      disciplineData = Object.assign({
        id,
        value: actorDisciplines[id].value || 0,
        powers: actorDisciplines[id].powers || [],
        description: actorDisciplines[id]?.description || '',
        visible: actorDisciplines[id].visible,
        selected: actorDisciplines[id].selected || false
      }, value)
    } else { // Otherwise, add it to the actor and set it as some default data
      disciplineData = Object.assign({
        id,
        value: 0,
        visible: false,
        description: '',
        powers: [],
        selected: false
      }, value)
    }

    // Ensure the discipline exists
    if (!computedDisciplines[id]) computedDisciplines[id] = {}
    // Apply the discipline's data
    computedDisciplines[id] = disciplineData

    // Make it forced invisible if it's set to hidden
    if (disciplineData.hidden) {
      computedDisciplines[id].visible = false
    }

    // Assign all matching powers to the discipline
    computedDisciplines[id].powers = actor.items.filter(item =>
      item.type === 'power' && item.system.discipline === id
    )
  }

  return computedDisciplines
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
