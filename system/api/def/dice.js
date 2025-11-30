export const DiceRegistry = {
  basic: {},
  advanced: {},

  registerBasic(system, config) {
    this.basic[system] = config
  },

  registerAdvanced(system, config) {
    this.advanced[system] = config
  }
}
