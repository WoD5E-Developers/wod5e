import { Skills } from '../../api/def/skills.js'

export const prepareSkills = async function (actor) {
  // Loop through each entry in the skills list, get the data (if available), and then push to the containers
  const skillsList = Skills.getList({})
  const skills = actor.system?.skills
  const sortedSkills = {
    physical: [],
    social: [],
    mental: []
  }

  if (skills) {
    // Clean up non-existent skills, such as custom ones that no longer exist
    const validSkills = new Set(Object.keys(skillsList))
    for (const id of Object.keys(skills)) {
      if (!validSkills.has(id)) {
        delete skills[id]
      }
    }

    for (const [id, value] of Object.entries(skillsList)) {
      let skillData = {}
      let hasSpecialties = false
      const specialtiesList = []

      if (skills[id]?.bonuses?.length > 0) {
        hasSpecialties = true

        for (const bonus of skills[id].bonuses) {
          specialtiesList.push(bonus.source)
        }
      }

      // If the actor has a skill with the key, grab its current values
      if (Object.prototype.hasOwnProperty.call(skills, id)) {
        skillData = Object.assign({
          id,
          value: skills[id].value,
          hasSpecialties,
          specialtiesList,
          macroid: skills[id].macroid
        }, value)
      } else { // Otherwise, add it to the actor and set it as some default data
        await actor.update({ [`system.skills.${id}`]: { value: 0 } })

        skillData = Object.assign({
          id,
          value: 0,
          hasSpecialties,
          specialtiesList
        }, value)
      }

      // Push to the container in the appropriate type
      // as long as the skill isn't "hidden"
      if (!skillData.hidden) {
        if (!sortedSkills[value.type]) sortedSkills[value.type] = [] // Ensure the type exists
        sortedSkills[value.type].push(skillData)
      }
    }
  }

  return { skills, sortedSkills }
}
