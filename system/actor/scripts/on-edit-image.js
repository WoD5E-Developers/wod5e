export const _onEditImage = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const FilePicker = foundry.applications.apps.FilePicker.implementation

  await new FilePicker({
    type: 'image',
    current: actor.img,
    callback: async (path) => {
      await actor.update({
        img: path
      })
    },
    top: this.position.top + 40,
    left: this.position.left + 10
  }).browse()
}
