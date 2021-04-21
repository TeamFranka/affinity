---
layout: default
title: Contributing
nav_order: 4
has_children: true
---

# Contribution Guide

Awesome, you've decided to contribute to Affinity. Please make sure your contribution is wanted by
first discussing the change you wish to make via issue, email, or any other method with the owners
of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

Further more, we are releasing the code under an eventually-free-software-license (see LICENSE.TXT
in root). For that to legally work, all contributors have to sign the CLA. See below how that works.


# Contributing

When contributing to this repository...

## Pull Request Process

1. Please choose a descriptive title for the PR and explain the changes you are doing and the
   reasoning for them, including all information to understand the contribution. If that has already
   beend discussed in an issues, you may also only link that issue. Keep the PR atomic: only one fix or feature per PR - you the changes happen to fix another bug/are related to the code, keep it but make sure to reference the bug accordingly.
2. Whenever possible, provide sufficient tests for the code added
3. Every PR must pass all checks, most importantly the automated test suite. It is the contributors
   obligation to follow up on those, if they do not.
4. All contributors of a PR must have signed the latests CLA (see below) for contributions to be
   considered.
5. A PR with tests for the feature in question, may be merged by any core contributor, all others
   require another core contributors positive review before being merged.
5. PRs that have not seen any updates in more than 4 weeks, may be closed as `stale`.

## Contributor License Agreement

You need to sign the contributor licences agreement for any code changes made to
this repository. If you have not agreed to the latest version of that agreement
an automatic bot will inform you at the time you post the Pull Request and must
sign it before being considered

### Rational behind the CLA
We are running this project under an eventually-free-software Licensing scheme
(see LICENSE.txt in root for details), where all code can be seen immediately
and used two years after publications under a free-software license. Up to that
point people may use this under certain conditions outlined in the same license.
However, we don't know for sure this will cover the cases we want to support, so
by signing the CLA you allow the Affinity Council to license the code in other
ways as well. Because this license is new and we don't know the coniditions that
fit well, this is a necessary step to protect the project and keeping the scheme
flexible enough.



## CI checks: tests, i18n and code formatting

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Code Style check](https://github.com/TeamFranka/affinity/actions/workflows/check-style.yml/badge.svg)](https://github.com/TeamFranka/affinity/actions/workflows/check-style.yml) [![i18n check EN & DE](https://github.com/TeamFranka/affinity/actions/workflows/check-i18n.yml/badge.svg)](https://github.com/TeamFranka/affinity/actions/workflows/check-i18n.yml)

Aside from the test suite and CLA we have two other checks enforcing quality: i18n and code style.

### Code style with prettier

We are styling our code in [prettier](https://prettier.io/) formatting, using eslint and the plugins to enforce it. If you are using VS Code, there's some handy [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions.

### Localisation (de/en)

All static visible strings (including `title` and `alt` tags) must be localisable. The project has support for [i18n via vue-18n-next](https://vue-i18n-next.intlify.dev/guide/advanced/component.html#slots-syntax-usage) and the CI check enforces that localised strings are present for `de` and `en`.
