# How to contribute to World of Darkness 5e development

## **Did you find a bug?**

* **Ensure the bug hasn't already been reported** by searching the system repository's [issues list](https://github.com/WoD5E-Developers/wod5e/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/WoD5E-Developers/wod5e/issues/new). Be sure to include a **title and clear description and label it as bug** and as much relevant information as possible. **Steps to reproduce or a screenshot is a must!**

## **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

* Install development dependencies with `npm ci`. Pull requests run JavaScript, LESS, and Handlebars lint checks, as well as unit tests once approved.

### Local lint commands

* `npm run lint` runs all three lint checks.
* `npm run lint:js` runs the existing ESLint checks.
* `npm run lint:less` checks `display/**/*.less` with Stylelint and the LESS parser. Use `npm run lint:less -- --fix` to apply supported fixes.
* `npm run lint:hbs` checks all `.hbs` and `.handlebars` files under `display/` for Handlebars syntax errors, duplicate named helper arguments, and missing `systems/wod5e/` partial references (including incorrect filename casing)

## **Do you want to offer a suggestion to add a new feature or change an existing one?**

* Open an issue labelled as "Feature" or "Enhancement." One of the system's contributors will look over the request and prioritize it as needed, or provide insight into why it may not be able to be included in the system. Some features are just too large for the small team, others don't fit with the design of the system, and some are best handled as modules.
