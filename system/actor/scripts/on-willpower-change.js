// Handle changes to willpower
export const _onWillpowerChange = async function (actor) {
  // Define the willpowerData
  const willpowerData = actor.system.willpower

  // Derive the character's "willpower value" by taking
  // the sum of the current aggravated and superficial
  // damage taken and subtracting the max by that;
  // superficial damage is reduced by half to represent
  // its lesser effect
  const derivedWillpower = willpowerData.max - (willpowerData.aggravated + (willpowerData.superficial / 2))

  // Update the actor's health.value
  actor.update({ 'system.willpower.value': derivedWillpower })
}
