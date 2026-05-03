export const _onConfigureSources = async function () {
  const currentUser = game.users.current
  const currentSources = currentUser.flags?.wod5e?.compendiumBrowser?.sources || {}

  // Below, we get all the sources that are relevant to the current instance;
  // aka, all compendiums in the currently active game
  const allSources = {
    world: {
      id: 'world',
      label: game.i18n.localize('PACKAGE.Type.world'),
      active: true
    }
  }
  const compendiumsItemsList = game.packs.filter(
    (compendium) => compendium.metadata.type === 'Item'
  )
  for (const compendium of compendiumsItemsList) {
    allSources[`${compendium.metadata.packageName}-${compendium.metadata.name}`] = {
      id: compendium.metadata.id,
      label: compendium.metadata.label,
      packageType: compendium.metadata.packageType,
      packageName: compendium.metadata.packageName,
      active: true
    }
  }
  const mergedSources = foundry.utils.mergeObject(allSources, currentSources)

  // Mark old saved sources as hidden
  // Basically the concern is if someone deactivates a module
  // and it isn't in the list then we're gonna get a lot of "undefined"s
  // but we also want to 'save' the user's choice if the module gets re-enabled
  // And thus, we have this pre-processing check that "hides" (doesn't show)
  // options if they aren't in the allSources list but are in the currentSources list
  for (const [sourceKey, sourceData] of Object.entries(currentSources)) {
    if (!allSources[sourceKey]) {
      mergedSources[sourceKey] = {
        ...sourceData,
        id: sourceData.id ?? sourceKey,
        hidden: true
      }
    }
  }

  // Gather and push the list of non-hidden options and whether they're checked or not
  let options = ''
  for (const [id, value] of Object.entries(mergedSources).filter((source) => !source.hidden)) {
    const checkedStatus = value.active ? ' checked' : ''
    options += `
      <div class="flexrow source-option">
        <input type="checkbox" class="source-checkbox" name="${id}"${checkedStatus}>
        <span>
          ${value.label} ${value.packageName ? `(` + value.packageName + `)` : ''}
        </span>
      </div>`
  }

  // Define the template to be used
  const content = `
    <form>
      <div class="form-group sources-list">
        ${options}
      </div>
    </form>`

  // Prompt the dialog
  const updatedSources = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.CompendiumBrowser.ConfigureSources')
    },
    classes: ['wod5e', 'dialog'],
    content,
    ok: {
      callback: (event, button) => {
        const formData = new foundry.applications.ux.FormDataExtended(button.form).object
        const sources = {}

        for (const [id] of Object.entries(mergedSources)) {
          sources[id] = {
            active: !!formData[id]
          }
        }

        return sources
      }
    },
    modal: true
  })

  if (updatedSources) {
    // Update the sources on the user flag
    await currentUser.update({
      ['flags.wod5e.compendiumBrowser.sources']: updatedSources
    })

    // Re-render the compendium browser once settings are updated if it's open
    const CompendiumBrowserApplication = foundry.applications.instances.get(
      'wod5e-compendium-browser'
    )
    if (CompendiumBrowserApplication) {
      CompendiumBrowserApplication.render()
    }
  }
}
