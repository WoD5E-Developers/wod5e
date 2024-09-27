/* global WOD5E */

// Applications
import { SkillApplication } from './../applications/skill-application.js'

// Handle changes to health
export const _onEditSkill = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Top-level variables
  const skill = target.getAttribute('data-skill')

  await new SkillApplication({
    actor,
    skill
  },
  {
    classes: ['wod5e', system, 'dialog']
  }).render(true)
}
