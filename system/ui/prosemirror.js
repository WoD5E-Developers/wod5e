export const ProseMirrorSettings = async () => {
  // Add a "World of Darkness" tab to the menu dropdowns
  Hooks.on('getProseMirrorMenuDropDowns', (menu, dropdowns) => {
    // Each letter corresponds to one of the symbols in the /wod5e/assets/fonts/wod5e-symbols.ttf file
    // When new splats are added, both that file and this list have to be updated
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

    const children = letters.map((letter) => ({
      action: `wod-symbol-${letter}`,
      title: letter,
      class: 'wod5e-symbol',
      priority: 1,
      cmd: insertWodSymbol(letter)
    }))

    if (dropdowns.format?.entries) {
      dropdowns.format.entries.push({
        action: 'wod5e',
        title: 'World of Darkness',
        children
      })
    }
  })

  // Custom insertion function that leverages the innate span mark
  // Note, making custom marks in Foundry is a pain
  function insertWodSymbol(letter) {
    return function (state, dispatch) {
      const { tr, schema, selection } = state
      const { from, to } = selection

      const spanMark = schema.marks.span
      if (!spanMark) return false

      // Insert the selected letter
      tr.insertText(letter, from, to)

      // Apply the span mark with the 'wod5e-symbol' class
      // This is a custom class that turns letters into the WoD symbol
      tr.addMark(
        from,
        from + letter.length,
        spanMark.create({
          _preserve: {
            class: 'wod5e-symbol'
          }
        })
      )

      // This prevents any further typed text from continuing to use the same class
      tr.removeStoredMark(spanMark)

      // This actually inserts the mark
      dispatch(tr.scrollIntoView())
      return true
    }
  }
}
