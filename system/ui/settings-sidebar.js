/* global game, Hooks */

/* Various additional information added to the Settings sidebar */
export const RenderSettings = async () => {
  Hooks.on('renderSettings', async (_app, html) => {
    // Additional system information resources
    const systemRow = html.querySelector('#settings .info .system')

    const systemLinks = `<div class='external-system-links'>
        <a href='https://github.com/WoD5E-Developers/wod5e/releases' target='_blank'>${game.i18n.localize('WOD5E.Changelog')}</a>
        |
        <a href='https://wod5e-developers.github.io/' target='_blank'>${game.i18n.localize('WOD5E.Wiki')}</a>
      </div>`

    systemRow.insertAdjacentHTML('afterend', systemLinks)

    // License Section
    const accessSection = html.querySelector('#settings .access')
    const licenseInformation = `<section class="license flexcol">
      <h4 class="divider">${game.i18n.localize('WOD5E.LicensedUnderDarkPack')}</h4>
        <section class="info" id='license-information'>
          ${game.i18n.localize('WOD5E.LicensedUnderDarkPackFulltext')}
        </section>
    </section>`
    accessSection.insertAdjacentHTML('afterend', licenseInformation)
  })
}
