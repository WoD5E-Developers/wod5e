import { Skills } from '../../api/def/skills.js'

export const prepareSkills = async function (actor) {
  const skills = {
    physical: [],
    social: [],
    mental: []
  }

  // Loop through each entry in the skills list, get the data (if available), and then push to the containers
  const skillsList = Skills.getList({})
  const actorSkills = actor.system?.skills

  if (actorSkills) {
    // Clean up non-existent skills, such as custom ones that no longer exist
    const validSkills = new Set(Object.keys(skillsList))
    for (const id of Object.keys(actorSkills)) {
      if (!validSkills.has(id)) {
        delete actorSkills[id]
      }
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
          value: actorSkills[id].value,
          hasSpecialties,
          specialtiesList,
          macroid: actorSkills[id].macroid
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
        if (!skills[value.type]) skills[value.type] = [] // Ensure the type exists
        skills[value.type].push(skillData)
      }
    }
  }

  return skills
}
