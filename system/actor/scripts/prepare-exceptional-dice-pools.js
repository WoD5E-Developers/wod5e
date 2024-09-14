import { Skills } from '../../api/def/skills.js'

export const prepareExceptionalDicePools = async function (actor) {
  // Loop through each entry in the skills list, get the data (if available), and then push to the containers
  const skillsList = Skills.getList({})
  const skills = actor.system?.exceptionaldicepools

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

      // If the actor has a skill with the key, grab its current values
      if (Object.prototype.hasOwnProperty.call(skills, id)) {
        skillData = Object.assign({
          id,
          value: skills[id].value,
          active: skills[id].active
        }, value)
      } else { // Otherwise, add it to the actor and set it as some default data
        skillData = Object.assign({
          id,
          value: 0,
          active: false
        }, value)
      }

      // Push to the Exceptional Skills list as long as it's active and isn't hidden
      if (skillData.active && !skillData.hidden) {
        skills[id] = skillData
      }
    }
  }

  return skills
}
