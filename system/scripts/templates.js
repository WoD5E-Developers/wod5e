/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  console.log('Schrecknet : loading subroutines')

  // Define template paths to load
  const templatePaths = [
    // Generic partials
    'templates/generic/tab-navigation.hbs',

    // Base Sheet Partials
    'systems/vtm5ec/display/shared/actors/parts/lock-button.hbs',
    'systems/vtm5ec/display/shared/actors/parts/header-profile.hbs',
    'systems/vtm5ec/display/shared/actors/parts/biography.hbs',
    'systems/vtm5ec/display/shared/actors/parts/features.hbs',
    'systems/vtm5ec/display/shared/actors/parts/health.hbs',
    'systems/vtm5ec/display/shared/actors/parts/notepad.hbs',
    'systems/vtm5ec/display/shared/actors/parts/stats.hbs',
    'systems/vtm5ec/display/shared/actors/parts/willpower.hbs',
    'systems/vtm5ec/display/shared/actors/parts/actor-settings.hbs',
    'systems/vtm5ec/display/shared/actors/parts/core-features.hbs',
    'systems/vtm5ec/display/shared/actors/parts/core-details.hbs',
    'systems/vtm5ec/display/shared/actors/parts/chronicle-tenets.hbs',
    'systems/vtm5ec/display/shared/actors/parts/touchstones-convictions.hbs',
    'systems/vtm5ec/display/shared/actors/parts/experience.hbs',
    'systems/vtm5ec/display/shared/actors/limited-sheet.hbs',

    // Hunter Sheet Partials
    'systems/vtm5ec/display/htr/actors/parts/danger.hbs',
    'systems/vtm5ec/display/htr/actors/parts/despair.hbs',
    'systems/vtm5ec/display/htr/actors/parts/desperation.hbs',
    'systems/vtm5ec/display/htr/actors/parts/edges.hbs',
    'systems/vtm5ec/display/htr/actors/parts/features.hbs',
    'systems/vtm5ec/display/htr/actors/parts/redemption.hbs',
    'systems/vtm5ec/display/htr/actors/parts/creed-fields.hbs',

    // Vampire Sheet Partials
    'systems/vtm5ec/display/vtm/actors/parts/disciplines.hbs',
    'systems/vtm5ec/display/vtm/actors/parts/blood.hbs',
    'systems/vtm5ec/display/vtm/actors/parts/frenzy.hbs',
    'systems/vtm5ec/display/vtm/actors/parts/humanity.hbs',
    'systems/vtm5ec/display/vtm/actors/parts/hunger.hbs',
    'systems/vtm5ec/display/vtm/actors/parts/rouse.hbs',

    // Changeling Sheet Partials
    'systems/vtm5ec/display/ctd/actors/parts/nightmare.hbs',
    'systems/vtm5ec/display/ctd/actors/parts/powers.hbs',
    'systems/vtm5ec/display/ctd/actors/parts/unleash.hbs',
    'systems/vtm5ec/display/ctd/actors/parts/wyrd.hbs',

    // Werewolf Sheet Partials
    'systems/vtm5ec/display/wta/actors/parts/gifts-rites.hbs',
    'systems/vtm5ec/display/wta/actors/parts/wolf.hbs',
    'systems/vtm5ec/display/wta/actors/parts/balance.hbs',
    'systems/vtm5ec/display/wta/actors/parts/frenzy.hbs',
    'systems/vtm5ec/display/wta/actors/parts/rage-button.hbs',
    'systems/vtm5ec/display/wta/actors/parts/rage-value.hbs',
    'systems/vtm5ec/display/wta/actors/parts/renown.hbs',
    'systems/vtm5ec/display/wta/actors/parts/forms.hbs',
    'systems/vtm5ec/display/wta/actors/parts/features.hbs',
    'systems/vtm5ec/display/wta/actors/parts/patron-spirit.hbs',
    'systems/vtm5ec/display/wta/actors/parts/favor.hbs',
    'systems/vtm5ec/display/wta/actors/parts/ban.hbs',

    // SPC Sheet Partials
    'systems/vtm5ec/display/shared/actors/parts/spc/stats.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/standard-dice-pools.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/exceptional-dice-pools.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/generaldifficulty.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/spc-disciplines.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/spc-gifts.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/spc-edges.hbs',
    'systems/vtm5ec/display/shared/actors/parts/spc/blood-potency.hbs',

    // Group Sheet Partials
    'systems/vtm5ec/display/vtm/actors/coterie-sheet.hbs',
    'systems/vtm5ec/display/htr/actors/cell-sheet.hbs',
    'systems/vtm5ec/display/wta/actors/pack-sheet.hbs',
    'systems/vtm5ec/display/shared/actors/parts/group/group-members.hbs',
    'systems/vtm5ec/display/shared/actors/parts/group/features.hbs',

    // Application Partials
    'systems/vtm5ec/display/wta/applications/wereform-application/wereform-application.hbs',
    'systems/vtm5ec/display/shared/applications/skill-application/skill-application.hbs',
    'systems/vtm5ec/display/shared/applications/skill-application/parts/specialty-display.hbs',

    // Item Sheet Partials (Tabs)
    'systems/vtm5ec/display/shared/items/parts/description.hbs',
    'systems/vtm5ec/display/shared/items/parts/dicepool.hbs',
    'systems/vtm5ec/display/shared/items/parts/macro.hbs',
    'systems/vtm5ec/display/shared/items/parts/modifiers.hbs',
    'systems/vtm5ec/display/shared/items/parts/modifier-display.hbs',
    'systems/vtm5ec/display/shared/items/parts/data-item-id.hbs',
    'systems/vtm5ec/display/shared/items/parts/item-uses.hbs',

    // Item Sheet Partials (Dropdowns)
    'systems/vtm5ec/display/shared/items/parts/skills.hbs',
    'systems/vtm5ec/display/shared/items/parts/disciplines.hbs',
    'systems/vtm5ec/display/shared/items/parts/edges.hbs',
    'systems/vtm5ec/display/shared/items/parts/attributes.hbs',
    'systems/vtm5ec/display/shared/items/parts/gifts.hbs',
    'systems/vtm5ec/display/shared/items/parts/renown.hbs',

    // Dice Tray Partials
    // 'systems/vtm5ec/display/ui/parts/select-character.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool1-select-attribute.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool1-select-skill.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool1-select-discipline.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool2-select-attribute.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool2-select-skill.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool2-select-discipline.hbs',
    // 'systems/vtm5ec/display/ui/parts/pool2-nothing.hbs',

    // Roll dialog Partials
    'systems/vtm5ec/display/ui/parts/roll-dialog-base.hbs',
    'systems/vtm5ec/display/ui/parts/situational-modifiers.hbs',
    'systems/vtm5ec/display/ui/mortal-roll-dialog.hbs',
    'systems/vtm5ec/display/ui/vampire-roll-dialog.hbs',
    'systems/vtm5ec/display/ui/werewolf-roll-dialog.hbs',
    'systems/vtm5ec/display/ui/hunter-roll-dialog.hbs',

    // Chat Message Partials
    'systems/vtm5ec/display/ui/chat/roll-message.hbs',
    'systems/vtm5ec/display/ui/chat/willpower-reroll.hbs',

    // Menu Partials
    'systems/vtm5ec/display/ui/automation-menu.hbs',
    'systems/vtm5ec/display/ui/storyteller-menu.hbs',
    'systems/vtm5ec/display/ui/parts/storyteller-menu/modification-menu.hbs',
    'systems/vtm5ec/display/ui/parts/storyteller-menu/custom-menu.hbs',
    'systems/vtm5ec/display/ui/select-dialog.hbs'
  ]

  /* Load the template parts
  */
  return loadTemplates(templatePaths) // eslint-disable-line no-undef
}
