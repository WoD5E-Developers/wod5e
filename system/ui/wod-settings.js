export class WoDSettings extends foundry.applications.sidebar.tabs.Settings {
  async _onRender(context, options) {
    await super._onRender(context, options)

    const html = this.element

    // Additional system information resources
    const systemRow = html.querySelectorAll('.settings-sidebar .info .system')

    const systemLinks = `<div class='external-system-links'>
        <a href='https://github.com/WoD5E-Developers/wod5e/releases' target='_blank'>${game.i18n.localize('WOD5E.Changelog')}</a>
        |
        <a href='https://wod5e-developers.github.io/' target='_blank'>${game.i18n.localize('WOD5E.Wiki')}</a>
        |
        <a href='https://github.com/WoD5E-Developers/wod5e/issues' target='_blank'>${game.i18n.localize('WOD5E.Issues')}</a>
      </div>`

    systemRow.forEach((row) => {
      row.insertAdjacentHTML('afterend', systemLinks)
    })

    // License Section
    const accessSection = html.querySelectorAll('.settings-sidebar .access')
    const licenseInformation = `<section class="license flexcol">
      <h4 class="divider">${game.i18n.localize('WOD5E.LicensedUnderDarkPack')}</h4>
        <section class="info" id='license-information'>
          ${game.i18n.localize('WOD5E.LicensedUnderDarkPackFulltext')}
        </section>
    </section>`
    accessSection.forEach((section) => {
      section.insertAdjacentHTML('afterend', licenseInformation)
    })
  }
}
