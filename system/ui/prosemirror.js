/* global Hooks, foundry */

// Add to the existing Prosemirror dropdowns
export const ProseMirrorSettings = async () => {
  Hooks.on('getProseMirrorMenuDropDowns', (menu, dropdowns) => {
    const toggleMark = foundry.prosemirror.commands.toggleMark
    if ('format' in dropdowns) {
      dropdowns.format.entries.push({
        action: 'wod5e',
        title: 'World of Darkness',
        children: [{
          action: 'wod5e-symbol',
          class: 'wod5e-symbol',
          title: 'abcdefghij',
          mark: menu.schema.marks.span,
          attrs: {
            _preserve: {
              class: 'wod5e-symbol'
            }
          },
          priority: 1,
          cmd: toggleMark(menu.schema.marks.span, {
            _preserve: {
              class: 'wod5e-symbol'
            }
          })
        }]
      })
    }
  })
}
