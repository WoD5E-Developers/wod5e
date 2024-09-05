/* global WOD5E */

// Applications
import { SkillApplication } from './../applications/skill-application.js'

// Handle changes to health
export const _onEditSkill = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem in WOD5E.Systems.getList({}) ? actor.system.gamesystem : 'mortal'

  // Top-level variables
  const header = event.currentTarget
  const skill = header.dataset.skill

  await new SkillApplication({
    actor,
    skill
  },
  {
    classes: ['wod5e', system, 'dialog']
  }).render(true)
}
