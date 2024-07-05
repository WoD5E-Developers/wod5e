/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  console.log('Schrecknet : loading subroutines')

  // Define template paths to load
  const templatePaths = [
    // Base Sheet Partials
    'systems/vtm5e/templates/shared/actors/parts/biography.hbs',
    'systems/vtm5e/templates/shared/actors/parts/exp.hbs',
    'systems/vtm5e/templates/shared/actors/parts/features.hbs',
    'systems/vtm5e/templates/shared/actors/parts/health.hbs',
    'systems/vtm5e/templates/shared/actors/parts/profile-img.hbs',
    'systems/vtm5e/templates/shared/actors/parts/other.hbs',
    'systems/vtm5e/templates/shared/actors/parts/stats.hbs',
    'systems/vtm5e/templates/shared/actors/parts/willpower.hbs',
    'systems/vtm5e/templates/shared/actors/parts/notes.hbs',
    'systems/vtm5e/templates/shared/actors/parts/skill-dialog.hbs',
    'systems/vtm5e/templates/shared/actors/parts/specialty-display.hbs',

    // Hunter Sheet Partials
    'systems/vtm5e/templates/htr/actors/parts/danger.hbs',
    'systems/vtm5e/templates/htr/actors/parts/despair.hbs',
    'systems/vtm5e/templates/htr/actors/parts/desperation.hbs',
    'systems/vtm5e/templates/htr/actors/parts/edges.hbs',

    // Vampire Sheet Partials
    'systems/vtm5e/templates/vtm/actors/parts/disciplines.hbs',
    'systems/vtm5e/templates/vtm/actors/parts/blood.hbs',
    'systems/vtm5e/templates/vtm/actors/parts/frenzy.hbs',
    'systems/vtm5e/templates/vtm/actors/parts/humanity.hbs',
    'systems/vtm5e/templates/vtm/actors/parts/hunger.hbs',
    'systems/vtm5e/templates/vtm/actors/parts/rouse.hbs',

    // Werewolf Sheet Partials
    'systems/vtm5e/templates/wta/actors/parts/gifts-rites.hbs',
    'systems/vtm5e/templates/wta/actors/parts/wolf.hbs',
    'systems/vtm5e/templates/wta/actors/parts/balance.hbs',
    'systems/vtm5e/templates/wta/actors/parts/frenzy.hbs',
    'systems/vtm5e/templates/wta/actors/parts/rage-button.hbs',
    'systems/vtm5e/templates/wta/actors/parts/rage-value.hbs',
    'systems/vtm5e/templates/wta/actors/parts/renown.hbs',
    'systems/vtm5e/templates/wta/actors/parts/forms.hbs',

    // SPC Sheet Partials
    'systems/vtm5e/templates/shared/actors/parts/spc/standard-dice-pools.hbs',
    'systems/vtm5e/templates/shared/actors/parts/spc/exceptional-dice-pools.hbs',
    'systems/vtm5e/templates/shared/actors/parts/spc/generaldifficulty.hbs',
    'systems/vtm5e/templates/shared/actors/parts/spc/spc-disciplines.hbs',
    'systems/vtm5e/templates/shared/actors/parts/spc/spc-gifts.hbs',
    'systems/vtm5e/templates/shared/actors/parts/spc/spc-edges.hbs',
    'systems/vtm5e/templates/shared/actors/parts/spc/type-selector.hbs',

    // Group Sheet Partials
    'systems/vtm5e/templates/shared/actors/parts/group/type-selector.hbs',
    'systems/vtm5e/templates/shared/actors/parts/group/group-members.hbs',
    'systems/vtm5e/templates/shared/actors/parts/group/description.hbs',

    // Item Sheet Partials
    'systems/vtm5e/templates/shared/items/parts/skills.hbs',
    'systems/vtm5e/templates/shared/items/parts/disciplines.hbs',
    'systems/vtm5e/templates/shared/items/parts/edges.hbs',
    'systems/vtm5e/templates/shared/items/parts/attributes.hbs',
    'systems/vtm5e/templates/shared/items/parts/gifts.hbs',
    'systems/vtm5e/templates/shared/items/parts/renown.hbs',
    'systems/vtm5e/templates/shared/items/parts/bonuses.hbs',
    'systems/vtm5e/templates/shared/items/parts/bonus-display.hbs',
    'systems/vtm5e/templates/shared/items/parts/macro.hbs',

    // Dice Tray Partials
    // 'systems/vtm5e/templates/ui/parts/select-character.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool1-select-attribute.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool1-select-skill.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool1-select-discipline.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool2-select-attribute.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool2-select-skill.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool2-select-discipline.hbs',
    // 'systems/vtm5e/templates/ui/parts/pool2-nothing.hbs',

    // Roll dialog Partials
    'systems/vtm5e/templates/ui/parts/roll-dialog-base.hbs',
    'systems/vtm5e/templates/ui/parts/situational-modifiers.hbs',
    'systems/vtm5e/templates/ui/mortal-roll-dialog.hbs',
    'systems/vtm5e/templates/ui/vampire-roll-dialog.hbs',
    'systems/vtm5e/templates/ui/werewolf-roll-dialog.hbs',
    'systems/vtm5e/templates/ui/hunter-roll-dialog.hbs',

    // Chat Message Partials
    'systems/vtm5e/templates/ui/chat/roll-message.hbs',
    'systems/vtm5e/templates/ui/chat/willpower-damage.hbs',
    'systems/vtm5e/templates/ui/chat/willpower-reroll.hbs',

    // Menu Partials
    'systems/vtm5e/templates/ui/automation-menu.hbs',
    'systems/vtm5e/templates/ui/storyteller-menu.hbs',
    'systems/vtm5e/templates/ui/parts/storyteller-menu/modification-menu.hbs',
    'systems/vtm5e/templates/ui/parts/storyteller-menu/custom-menu.hbs',
    'systems/vtm5e/templates/ui/select-dialog.hbs'
  ]

  /* Load the template parts
  */
  return loadTemplates(templatePaths) // eslint-disable-line no-undef
}
