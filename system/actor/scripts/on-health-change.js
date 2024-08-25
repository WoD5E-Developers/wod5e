// Handle changes to health
export const _onHealthChange = async function (actor) {
  // Define the healthData
  const healthData = actor.system.health

  // Derive the character's "health value" by taking
  // the sum of the current aggravated and superficial
  // damage taken and subtracting the max by that;
  // superficial damage is reduced by half to represent
  // its lesser effect
  const derivedHealth = healthData.max - (healthData.aggravated + (healthData.superficial / 2))

  // Update the actor's health.value
  await actor.update({ 'system.health.value': derivedHealth })
}
