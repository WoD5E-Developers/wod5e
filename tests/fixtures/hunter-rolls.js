export const hunterBasicOnlySuccess = {
  _formula: '3dh',
  basicDice: {
    total: 2,
    results: [
      { result: 6, discarded: false },
      { result: 7, discarded: false },
      { result: 2, discarded: false }
    ]
  },
  advancedDice: null
}

export const hunterMixedDesperationSuccess = {
  _formula: '2dh + 1ds',
  basicDice: {
    total: 1,
    results: [
      { result: 6, discarded: false },
      { result: 4, discarded: false }
    ]
  },
  advancedDice: {
    total: 1,
    results: [{ result: 7, discarded: false }]
  }
}
