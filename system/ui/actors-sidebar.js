/* Various Support for group sheets injected as the actor sidebar rerenders */
export const RenderActorSidebar = async () => {
  // Altering the ActorDirectory in order to support group sheet layouts
  Hooks.on('renderActorDirectory', async (object, html) => {
    // Define the list of groups we're going to be modifying
    const groups = object.groups

    // Define the directory list so that we can modify its structure
    const directoryList = html.querySelector('.directory-list')

    // Iterate through each group and make a "folder-like" element out of them
    Object.entries(groups).forEach(([, group]) => {
      const groupElement = document.querySelector(`[data-entry-id='${group.id}']`)
      if (!groupElement) return

      const groupMembers = group.system?.members

      // Header element for the "folder"
      const headerElement =
        `<header class='group-header ${group.system.groupType} flexrow'>
        <h3 class='noborder'>
          <i class='fas fa-folder-open fa-fw'></i>
          ${group.name}
        </h3>
        <a class='create-button open-sheet' data-uuid='Actor.${group.id}' title='` +
        game.i18n.localize('WOD5E.OpenSheet') +
        `'>
          <i class="fas fa-user"></i>
        </a>
      </header>`
      const subdirectoryElement = '<ol class="subdirectory"></ol>'

      // Append the above elements to the group element and turn it into a folder
      groupElement.setAttribute('data-uuid', `Actor.${group.id}`)
      groupElement.setAttribute('class', 'directory-item group-item flexcol document')
      // GMs follow the collapsed value, players don't
      if (group.system?.collapsed && game.user.isGM) {
        groupElement?.classList.add('collapsed')
      }

      // Remove the entry-name and thumbnail elements
      groupElement.querySelectorAll('.entry-name, .thumbnail').forEach((el) => el.remove())

      // Append the headerElement and subdirectoryElement
      groupElement.insertAdjacentHTML('beforeend', headerElement)
      groupElement.insertAdjacentHTML('beforeend', subdirectoryElement)

      // Add an event listener for toggling the group collapse
      groupElement.querySelector('.group-header')?.addEventListener('click', async (event) => {
        event.preventDefault()

        const collapsed = !group.system.collapsed

        groupElement.classList.toggle('collapsed')

        // Players don't have to update the system.collapsed value
        if (game.user.isGM) {
          await group.update({ 'system.collapsed': collapsed })
        }
      })

      // Add an event listener for opening the group sheet
      groupElement.querySelector('.open-sheet')?.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()

        game.actors.get(group.id)?.sheet.render(true)
      })

      // Move each group member's element to be a child of this group
      // Additionally, we need to give the actor Limited
      if (groupMembers) {
        groupMembers.forEach((actorUuid) => {
          const actorObject = fromUuidSync(actorUuid)

          // Check to verify the actor exists
          if (actorObject) {
            const actorElement = document.querySelector(`[data-entry-id='${actorObject.id}']`)
            const groupListElement = document
              .querySelector(`[data-entry-id='${group.id}']`)
              ?.querySelector('.subdirectory')

            if (actorElement && groupListElement) {
              groupListElement.appendChild(actorElement)
            }
          } else {
            // If the actor doesn't exist, remove it from the group
            // Filter out the UUID from the members list
            const membersList = groupMembers.filter((actor) => actor !== actorUuid)

            // Update the group sheet with the new members list
            group.update({ 'system.members': membersList })
          }
        })
      }

      // If Ownership Viewer is enabled, adjust the group sheet's ownership viewer
      const ownershipViewer = groupElement.querySelector('.ownership-viewer')
      const groupHeader = groupElement.querySelector('header.group-header')
      if (ownershipViewer && groupHeader) {
        groupHeader.appendChild(ownershipViewer)
      }

      // Add to the directory list
      directoryList.prepend(groupElement)
    })
  })

  // Handle actor updates
  Hooks.on('updateActor', (actor) => {
    if (actor.type === 'group') {
      // Re-render the actors directory
      game.actors.render()
    }

    // Only do this if the actor has an associated group with them
    if (actor.system?.group) {
      // Update the group sheet
      game.actors.get(actor.system.group).sheet.render()
    }
  })
}
