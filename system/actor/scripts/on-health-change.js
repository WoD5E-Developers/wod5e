// Handle changes to health
export const getDerivedHealth = async function (systemData) {
  // Define the healthData
  const healthData = systemData.health

  if (!healthData) return

  // Derive the character's "health value" by taking
  // the sum of the current aggravated and superficial
  // damage taken and subtracting the max by that;
  // superficial damage is reduced by half to represent
  // its lesser effect
  healthData.value = healthData.max - (healthData.aggravated + healthData.superficial / 2)

  return healthData
}
