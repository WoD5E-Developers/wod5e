/**
 * Random character generator by Nim on the FoundryVTT Discord.
 */

const valuesToDistribute = [4, 3, 3, 3, 2, 2, 2, 2, 1]

const attributeKeys = [
  'strength',
  'dexterity',
  'stamina',
  'charisma',
  'manipulation',
  'composure',
  'intelligence',
  'wits',
  'resolve'
]

const skillKeys = [
  'athletics',
  'brawl',
  'craft',
  'drive',
  'firearms',
  'melee',
  'larceny',
  'stealth',
  'survival',
  'animalken',
  'etiquette',
  'insight',
  'intimidation',
  'leadership',
  'performance',
  'persuasion',
  'streetwise',
  'subterfuge',
  'academics',
  'awareness',
  'finance',
  'investigation',
  'medicine',
  'occult',
  'politics',
  'science',
  'technology'
]

const skillDistributions = {
  specialist: {
    label: game.i18n.localize(
      'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Options.Specialist'
    ),
    values: [4, 3, 3, 3, 2, 2, 2, 1, 1, 1],
    count: 10
  },
  balanced: {
    label: game.i18n.localize(
      'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Options.Balanced'
    ),
    values: [3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    count: 15
  },
  jack: {
    label: game.i18n.localize(
      'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Options.JackOfAllTrades'
    ),
    values: [3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    count: 19
  }
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

async function createRandomCharacter() {
  const result = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Title'),
      icon: 'fas fa-user-plus'
    },
    position: {
      width: 450
    },
    content: `
            <form>
                <div class="form-group">
                    <label>${game.i18n.localize('WOD5E.Name')}</label>
                    <input type="text" name="actorName" value="${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.NewCharacter')}" autofocus/>
                </div>
                <div class="form-group">
                    <label>${game.i18n.localize('WOD5E.ItemsList.Type')}</label>
                    <select name="actorType">
                        <option value="mortal">${game.i18n.localize('TYPES.Actor.mortal')}</option>
                        <option value="vampire">${game.i18n.localize('TYPES.Actor.vampire')}</option>
                        <option value="ghoul">${game.i18n.localize('TYPES.Actor.ghoul')}</option>
                        <option value="werewolf">${game.i18n.localize('TYPES.Actor.werewolf')}</option>
                        <option value="hunter">${game.i18n.localize('TYPES.Actor.hunter')}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.SkillDistribution')}</label>
                    <select name="skillDistribution">
                        <option value="specialist">${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Options.Specialist')}</option>
                        <option value="balanced" selected>${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Options.Balanced')}</option>
                        <option value="jack">${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Options.JackOfAllTrades')}</option>
                    </select>
                </div>
                <p style="font-style: italic; margin-top: 1em; font-size: 0.9em;">
                  ${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.AutoDistribute')}
                </p>
            </form>
        `,
    ok: {
      label: 'Erstellen',
      icon: 'fas fa-check',
      callback: (event, button) => {
        const formData = new FormData(button.form)
        return {
          actorName:
            formData.get('actorName') ||
            game.i18n.localize(
              'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.NewCharacter'
            ),
          actorType: formData.get('actorType') || 'vampire',
          skillDistribution: formData.get('skillDistribution') || 'balanced'
        }
      }
    },
    cancel: {
      label: 'Abbrechen',
      icon: 'fas fa-times'
    },
    rejectClose: false,
    modal: true
  })

  if (!result) return

  const { actorName, actorType, skillDistribution } = result

  // Create a new actor
  const newActor = await Actor.create({
    name: actorName,
    type: actorType
  })

  if (!newActor) {
    ui.notifications.error(
      game.i18n.localize(
        'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.ErrorCreatingActor'
      )
    )
    return
  }

  // 2. Grab the data structure
  const sys = newActor.system

  // Check to make sure attributes and skills exist
  if (!sys.attributes || !sys.skills) {
    ui.notifications.warn(
      game.i18n.localize(
        'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.PathNotFound'
      )
    )
    console.log(
      'World of Darkness 5e | ' +
        game.i18n.localize(
          'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.Notifications.ActorSystemData'
        ),
      sys
    )
    console.log(
      'World of Darkness 5e | ' +
        game.i18n.localize(
          'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.AvailableProperties'
        ),
      Object.keys(sys)
    )
    return
  }

  // Attribute generation
  const shuffledAttributes = shuffleArray(valuesToDistribute)
  let updateData = {
    system: {
      attributes: {},
      skills: {}
    }
  }

  let chatContent = `<h3>${actorName}</h3>`
  chatContent += `<p><strong>${game.i18n.localize('WOD5E.ItemsList.Type')}</strong> ${actorType} | <strong>${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Dialog.SkillDistribution')}</strong> ${skillDistributions[skillDistribution].label}</p>`
  chatContent += `<h4>Attribute:</h4><ul style="columns: 2;">`

  // Attribute generation
  attributeKeys.forEach((key, index) => {
    const val = shuffledAttributes[index]
    updateData.system.attributes[key] = { value: val }

    const label = key.charAt(0).toUpperCase() + key.slice(1)
    chatContent += `<li><strong>${label}:</strong> ${val}</li>`
  })
  chatContent += `</ul>`

  // Skill generation
  const distribution = skillDistributions[skillDistribution]
  const shuffledSkills = shuffleArray([...skillKeys])
  const selectedSkills = shuffledSkills.slice(0, distribution.count)
  const shuffledValues = shuffleArray([...distribution.values])

  chatContent += `<h4>${game.i18n.localize('WOD5E.SkillsList.Label')}</h4><ul style="columns: 2;">`
  selectedSkills.forEach((key, index) => {
    const val = shuffledValues[index]
    updateData.system.skills[key] = { value: val }

    const label = key.charAt(0).toUpperCase() + key.slice(1)
    chatContent += `<li><strong>${label}:</strong> ${val}</li>`
  })
  chatContent += `</ul>`

  // Health and Willpower calculation
  const staminaValue = shuffledAttributes[attributeKeys.indexOf('stamina')]
  const composureValue = shuffledAttributes[attributeKeys.indexOf('composure')]
  const resolveValue = shuffledAttributes[attributeKeys.indexOf('resolve')]

  const healthMax = staminaValue + 3
  const willpowerMax = composureValue + resolveValue

  // Update the actor's health and willpower
  if (sys.health !== undefined) {
    updateData.system.health = {
      max: healthMax,
      superficial: 0,
      aggravated: 0,
      value: healthMax
    }
  }

  if (sys.willpower !== undefined) {
    updateData.system.willpower = {
      max: willpowerMax,
      superficial: 0,
      aggravated: 0,
      value: willpowerMax
    }
  }

  // Construct the chat message contents
  chatContent += `<h4>${game.i18n.localize('WOD5E.Compendiums.Macros.RandomCharacterGenerator.Chat.DerivedValues')}</h4><ul>`
  chatContent += `<li><strong>${game.i18n.localize('WOD5E.Health')}</strong> ${healthMax} (Stamina ${staminaValue} + 3)</li>`
  chatContent += `<li><strong>${game.i18n.localize('WOD5E.Willpower')}</strong> ${willpowerMax} (Composure ${composureValue} + Resolve ${resolveValue})</li>`
  chatContent += `</ul>`

  // Update the actor
  try {
    await newActor.update(updateData)

    // Send message in chat
    await ChatMessage.create({
      content: chatContent,
      speaker: ChatMessage.getSpeaker({ actor: newActor })
    })

    ui.notifications.info(
      game.i18n.format(
        'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.StringCreated',
        {
          string: newActor.name
        }
      )
    )
    newActor.sheet.render(true)
  } catch (error) {
    ui.notifications.error(
      game.i18n.localize(
        'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.ErrorSettingValues'
      )
    )
    console.error(
      `World of Darkness 5e | ${game.i18n.localize(
        'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.UpdateError'
      )}`,
      error
    )
    console.log(
      `World of Darkness 5e | ${game.i18n.localize(
        'WOD5E.Compendiums.Macros.RandomCharacterGenerator.Notifications.AttemptedUpdateData'
      )}`,
      updateData
    )
  }
}

createRandomCharacter()
