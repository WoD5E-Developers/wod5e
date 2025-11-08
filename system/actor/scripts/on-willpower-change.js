// Handle changes to willpower
export const getDerivedWillpower = async function (systemData) {
  // Define the willpowerData
  const willpowerData = systemData.willpower

  if (!willpowerData) return

  // Derive the character's "willpower value" by taking
  // the sum of the current aggravated and superficial
  // damage taken and subtracting the max by that;
  // superficial damage is reduced by half to represent
  // its lesser effect
  willpowerData.value =
    willpowerData.max - (willpowerData.aggravated + willpowerData.superficial / 2)

  // Update the actor's health.value
  return willpowerData
}
