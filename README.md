# Affinity

The affinity progressive communities network app is a social network for progressive movements and initiatives and their followers.

## Development

## Contributing

See [the Contributions Guide](./.github/CONTRIBUTING.md). Tl;dr:

1. Raise an atomic PR with your changes - one fix/feature per PR
   Please add tests whenever possible!
2. Sign the CLA
3. All Tests/CI checks must pass
4. Review crumbles must be addressed.


### CI checks: tests, i18n and code formatting

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Code Style check](https://github.com/TeamFranka/affinity/actions/workflows/check-style.yml/badge.svg)](https://github.com/TeamFranka/affinity/actions/workflows/check-style.yml) [![i18n check EN & DE](https://github.com/TeamFranka/affinity/actions/workflows/check-i18n.yml/badge.svg)](https://github.com/TeamFranka/affinity/actions/workflows/check-i18n.yml)

Aside from the test suite and CLA we have two other checks enforcing quality: i18n and code style.

#### Code style with prettier

We are styling our code in [prettier](https://prettier.io/) formatting, using eslint and the plugins to enforce it. If you are using VS Code, there's some handy [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions.

#### Localisation (de/en)

All static visible strings (including `title` and `alt` tags) must be localisable. The project has support for [i18n via vue-18n-next](https://vue-i18n-next.intlify.dev/guide/advanced/component.html#slots-syntax-usage) and the CI check enforces that localised strings are present for `de` and `en`.


## License

This code is licensed under the Affinity Code License (see LICENSE.txt), based on the Business Code License, which is an _eventually Open Source License_, meaning the code is available under the GNU AFFERO GENERAL PUBLIC LICENSE 3.0 (see LICENSE-AGPL.txt) two years after being published for the first time.

Before that time you are welcome to contribute to the code here - granted you allow the Affinity Council to reign over the copyright by [signing the Contributor License Agreement ("CLA") and follow the code of conduct](./.github/CONTRIBUTING.md). Further you are permitted to use this internally, for personal and educational purpose with up to a hundred registered users in a non-public-setting. For all other uses you need to acquire a separate license. To do so, please contact the Affinity Council.
