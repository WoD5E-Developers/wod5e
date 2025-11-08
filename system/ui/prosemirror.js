/* global Hooks, foundry */

// Add to the existing Prosemirror dropdowns
export const ProseMirrorSettings = async () => {
  const toggleMark = foundry.prosemirror.commands.toggleMark
  const spanMark = foundry.prosemirror.dom.parser.schema.marks.span

  // Add a "World of Darkness" tab to the menu dropdowns
  Hooks.on('getProseMirrorMenuDropDowns', (menu, dropdowns) => {
    if ('format' in dropdowns) {
      dropdowns.format.entries.push({
        action: 'wod5e',
        title: 'World of Darkness',
        children: [
          {
            action: 'wodSymbols',
            class: 'wod5e-symbol',
            title: 'abcdefghij',
            mark: spanMark,
            attrs: {
              _preserve: {
                class: 'wod5e-symbol'
              }
            },
            priority: 1,
            cmd: toggleMark(spanMark, {
              _preserve: {
                class: 'wod5e-symbol'
              }
            })
          }
        ]
      })
    }
  })
}
