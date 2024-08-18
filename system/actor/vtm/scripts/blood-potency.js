/* global game */

// Surge: Amount of dice added on a blood surge
// Mend: Amount mended on expenditure of vitae
// Power: Bonus to discipline powers
// Rouse: Max level of powers that can be rouse-rerolled
// Bane: Bane severity number
export const getBloodPotencyValues = async function (level) {
  const BLOOD_POTENCY_VALUES = [
    // Potency 0
    {
      surge: 1,
      mend: 1,
      power: 0,
      rouse: 0,
      bane: 0
    },
    // Potency 1
    {
      surge: 2,
      mend: 1,
      power: 0,
      rouse: 1,
      bane: 2
    },
    // Potency 2
    {
      surge: 2,
      mend: 2,
      power: 1,
      rouse: 1,
      bane: 2
    },
    // Potency 3
    {
      surge: 3,
      mend: 2,
      power: 1,
      rouse: 2,
      bane: 3
    },
    // Potency 4
    {
      surge: 3,
      mend: 3,
      power: 2,
      rouse: 2,
      bane: 3
    },
    // Potency 5
    {
      surge: 4,
      mend: 3,
      power: 2,
      rouse: 3,
      bane: 4
    },
    // Potency 6
    {
      surge: 4,
      mend: 3,
      power: 3,
      rouse: 3,
      bane: 4
    },
    // Potency 7
    {
      surge: 5,
      mend: 3,
      power: 3,
      rouse: 4,
      bane: 5
    },
    // Potency 8
    {
      surge: 5,
      mend: 4,
      power: 4,
      rouse: 4,
      bane: 5
    },
    // Potency 9
    {
      surge: 6,
      mend: 4,
      power: 4,
      rouse: 5,
      bane: 6
    },
    // Potency 10
    {
      surge: 6,
      mend: 5,
      power: 5,
      rouse: 5,
      bane: 6
    }
  ]
  return BLOOD_POTENCY_VALUES[level]
}

export function getBloodPotencyText (level) {
  // TODO : Some of this could be deducted from previous array.
  const BLOOD_POTENCY_TEXT = [
    {
      surge: game.i18n.localize('WOD5E.VTM.Add1Dice'),
      mend: game.i18n.localize('WOD5E.VTM.1SuperficialDamage'),
      power: game.i18n.localize('WOD5E.None'),
      rouse: game.i18n.localize('WOD5E.None'),
      bane: '0',
      feeding: game.i18n.localize('WOD5E.VTM.NoEffect')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add2Dice'),
      mend: game.i18n.localize('WOD5E.VTM.1SuperficialDamage'),
      power: game.i18n.localize('WOD5E.None'),
      rouse: game.i18n.localize('WOD5E.VTM.Level1'),
      bane: '2',
      feeding: game.i18n.localize('WOD5E.VTM.NoEffect')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add2Dice'),
      mend: game.i18n.localize('WOD5E.VTM.2SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add1Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level1'),
      bane: '2',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty1')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add3Dice'),
      mend: game.i18n.localize('WOD5E.VTM.2SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add1Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level2'),
      bane: '3',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty2')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add3Dice'),
      mend: game.i18n.localize('WOD5E.VTM.3SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add2Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level2'),
      bane: '3',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty3')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add4Dice'),
      mend: game.i18n.localize('WOD5E.VTM.3SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add2Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level3'),
      bane: '4',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty4')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add4Dice'),
      mend: game.i18n.localize('WOD5E.VTM.3SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add3Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level3'),
      bane: '4',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty5')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add5Dice'),
      mend: game.i18n.localize('WOD5E.VTM.3SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add3Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level4'),
      bane: '5',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty5')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add5Dice'),
      mend: game.i18n.localize('WOD5E.VTM.4SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add4Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level4'),
      bane: '5',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty6')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add6Dice'),
      mend: game.i18n.localize('WOD5E.VTM.4SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add4Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level5'),
      bane: '6',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty6')
    },
    {
      surge: game.i18n.localize('WOD5E.VTM.Add6Dice'),
      mend: game.i18n.localize('WOD5E.VTM.5SuperficialDamage'),
      power: game.i18n.localize('WOD5E.VTM.Add5Dice'),
      rouse: game.i18n.localize('WOD5E.VTM.Level5'),
      bane: '6',
      feeding: game.i18n.localize('WOD5E.VTM.FeedingPenalty7')
    }
  ]

  return BLOOD_POTENCY_TEXT[level]
}

export const potencyToRouse = async function (potency, level) {
  // Define whether to reroll dice based on the user's blood potency
  // and the power's level
  if (potency === 0) {
    // Potency 0 never rolls additional rouse dice for disciplines
    return false
  } else if (potency > 8) {
    // Potency of 9 and 10 always roll additional rouse dice for disciplines
    return true
  } else if (potency > 6 && level < 5) {
    // Potency 7 and 8 roll additional rouse dice on discipline powers below 5
    return true
  } else if (potency > 4 && level < 4) {
    // Potency 5 and 6 roll additional rouse dice on discipline powers below 4
    return true
  } else if (potency > 2 && level < 3) {
    // Potency 3 and 4 roll additional rouse dice on discipline powers below 3
    return true
  } else if (potency > 0 && level < 2) {
    // Potency 1 and 2 roll additional rouse dice on discipline powers below 2
    return true
  }

  // If none of the above are true, just roll 1 dice for the rouse check
  return false
}
