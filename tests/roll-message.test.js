import { vi, describe, it, expect } from 'vitest'

import { generateRollMessageData } from '#system/scripts/rolls/roll-message.js'
import { mortalBasicSuccess, mortalNoSuccess } from './fixtures/mortal-rolls.js'
import {
  vampireMixedHungerSuccess,
  vampireBasicOnlySuccess,
  vampireHungerOnlyFailure
} from './fixtures/vampire-rolls.js'
import { werewolfMixedRageSuccess, werewolfBasicOnlySuccess } from './fixtures/werewolf-rolls.js'
import { hunterMixedDesperationSuccess, hunterBasicOnlySuccess } from './fixtures/hunter-rolls.js'

vi.mock('#system/scripts/system-rolls.js', () => {
  return {
    WOD5eRoll: class {
      constructor(data) {
        Object.assign(this, data)
      }

      static fromJSON(data) {
        return new this(data)
      }
    }
  }
})

/**
 * Mortal Rolls
 */
describe('generateRollMessage - Mortal', () => {
  it('calculates total result correctly for a basic mortal success', async () => {
    const result = await generateRollMessageData({
      roll: mortalBasicSuccess,
      title: 'Mortal Test Roll'
    })

    expect(result.totalResult).toBe(2)
  })

  it('handles a mortal roll with zero successes', async () => {
    const result = await generateRollMessageData({
      roll: mortalNoSuccess,
      title: 'Mortal Failure'
    })

    expect(result.totalResult).toBe(0)
  })
})

/**
 * Vampire Rolls
 */
describe('generateRollMessage - Vampire', () => {
  it('handles vampire rolls with only basic dice', async () => {
    const result = await generateRollMessageData({
      roll: vampireBasicOnlySuccess,
      system: 'vampire',
      title: 'Stealth Roll'
    })

    expect(result.totalResult).toBeGreaterThan(0)
    expect(result.advancedDice).toBeNull
  })

  it('handles mixed vampire + hunger dice success', async () => {
    const result = await generateRollMessageData({
      roll: vampireMixedHungerSuccess,
      system: 'vampire',
      title: 'Feeding Roll'
    })

    expect(result.totalResult).toBe(2)
  })

  it('handles hunger dice with no successes', async () => {
    const result = await generateRollMessageData({
      roll: vampireHungerOnlyFailure,
      system: 'vampire',
      title: 'Starving Roll'
    })

    expect(result.totalResult).toBe(0)
  })
})

/**
 * Werewolf Rolls
 */
describe('generateRollMessage - Werewolf', () => {
  it('handles werewolf rolls with only basic dice', async () => {
    const result = await generateRollMessageData({
      roll: werewolfBasicOnlySuccess,
      system: 'werewolf',
      title: 'Tracking Roll'
    })

    expect(result.totalResult).toBeGreaterThan(0)
    expect(result.advancedDice).toBeNull()
  })

  it('handles mixed werewolf + rage dice success', async () => {
    const result = await generateRollMessageData({
      roll: werewolfMixedRageSuccess,
      system: 'werewolf',
      title: 'Frenzy Roll'
    })

    expect(result.totalResult).toBeGreaterThan(0)
  })
})

/**
 * Hunter Rolls
 */
describe('generateRollMessage - Hunter', () => {
  it('handles hunter rolls with only basic dice', async () => {
    const result = await generateRollMessageData({
      roll: hunterBasicOnlySuccess,
      system: 'hunter',
      title: 'Prepared Shot'
    })

    expect(result.totalResult).toBeGreaterThan(0)
    expect(result.advancedDice).toBeNull()
  })

  it('handles mixed hunter + desperation dice success', async () => {
    const result = await generateRollMessageData({
      roll: hunterMixedDesperationSuccess,
      system: 'hunter',
      title: 'Last Stand'
    })

    expect(result.totalResult).toBeGreaterThan(0)
  })
})
