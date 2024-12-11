import { Skills } from '../../api/def/skills.js'

export const prepareSkills = async function (actor) {
  // Loop through each entry in the skills list, get the data (if available), and then push to the containers
  const skillsList = Skills.getList({})
  const actorSkills = actor.system?.skills
  const computedSkills = {}
  const sortedSkills = {
    physical: [],
    social: [],
    mental: []
  }

  for (const [id, value] of Object.entries(skillsList)) {
    let skillData = {}
    let hasSpecialties = false
    const specialtiesList = []

    if (actorSkills[id]?.bonuses?.length > 0) {
      hasSpecialties = true

      for (const bonus of actorSkills[id].bonuses) {
        specialtiesList.push(bonus.source)
      }
    }

    // If the actor has a skill with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(actorSkills, id)) {
      skillData = Object.assign({
        id,
        value: actorSkills[id].value || 0,
        hasSpecialties,
        specialtiesList,
        macroid: actorSkills[id].macroid,
        bonuses: actorSkills[id].bonuses
      }, value)
    } else { // Otherwise, add it to the actor and set it as some default data
      skillData = Object.assign({
        id,
        value: 0,
        hasSpecialties,
        specialtiesList
      }, value)
    }

    // Ensure the skill exists
    if (!computedSkills[id]) computedSkills[id] = {}
    // Apply the skill's data
    computedSkills[id] = skillData

    // Push to the container in the appropriate type
    // as long as the skill isn't "hidden"
    if (!skillData.hidden) {
      if (!sortedSkills[value.type]) sortedSkills[value.type] = [] // Ensure the type exists

      // Create a shallow copy of the skillData - excluding the 'bonuses' property
      // eslint-disable-next-line no-unused-vars
      const { bonuses, ...filteredSkillData } = skillData
      sortedSkills[value.type].push(filteredSkillData)
    }
  }

  return {
    skills: computedSkills,
    sortedSkills
  }
}
