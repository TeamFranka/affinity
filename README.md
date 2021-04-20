# Affinity

The affinity progressive communities network app is a social network for progressive movements and initiatives and their followers.

## Development

### on Gitpod
[![Gitpod click to start](https://img.shields.io/badge/Gitpod:-click%20to%20get%20started-lightblue?logo=gitpod)](https://gitpod.io/#https://github.com/TeamFranka/affinity)

We have a full Gitpod setup ready for you, you can use it to develop the app. It will setup all necessary backend services and requirements for you, start the live development server (available in the second termminal) and make the app availalbe to you at port `8080`.

#### Restarting the dev server

Under rare circumstances you have to restart the live-dev server. For that you can just `ctr+c` in that terminal and do `UP`+`enter` to start it again. The first compile might takes a while.

#### Running tests

You can run the test suite against your gitpod environment as well. Please take into account, that this does not reset the db and will continously add data to it. You can run it by opening another terminal and run `npx cypress run` (to learn more about this command, just add `--help`). You can run a specific test by attaching `--spec tests/e2e/spec/polls.js`.

If you are using a different shell it might be missing the correct base-url environment variable. For that run it as ```CYPRESS_BASE_URL=`(gp url 8080)` npx cypresss run``` or export it as ```export CYPRESS_BASE_URL=`(gp url 8080)` ```



### Local Development Environment

The App needs a backend (using docker-compose) and some initial data to work. For thath you will need a [NodeJS](https://nodejs.org/en/download/) and `npm` installation. If you want to contribute you'll also need [git](https://ionicframework.com/docs/intro/environment#git) and a Github setup.

To run the database / application server you'll need docker & [docker-compose](https://docs.docker.com/compose/install/). For windows and Mac, docker-compose is included in the regular [Docker Desktop installation](https://docs.docker.com/docker-for-windows/install/).

#### Setup

On first run, this is downloading some images and other dependendcies, which might takes some time. Number 2 and 3 can be done at the same time.

1. Install ionic:
```
npm install -g @ionic/cli
```
2. Install the local dependencies
```
npm install
```
3. start the application server/backend (`parse`) via
```
npm run dev:run-parse
```
4. Now configure the database structure via
```
npm run dev:db
```
5. load sample data
```
npm run dev:db:mock-data
```
6. configure the default Team as the script told you
```
cp .env.development.local.template .env.development.local
```


#### Running the dev frontend

Now run
```
npm run serve
```

To start the local development frontend, it should open a webbrowser to the UI. The UI is mobile-friendly, use the browsers developer tools to switch into responsive mode.

This is a live-server: whenever you make changes to the source code, the server recompiles and updates the website _live_. Observe the terminal closely to learn about any errors in it. You can stop it by pressing `CTRL+C`.

#### Re-/Starting the application backend

If it isn't running yet, start the local backend
to run locally:

```
npm run dev:run-parse

```

It will then be made accessible through the browser at `http://localhost:4040/`.

If you've done changes to the cloud-code, you have to restart the parse backend for it to take effect. Do that by running:

```
npm run dev:restart-parse
```

#### Running Tests

We use `cypress` (can be found in `tests/e2e/specs`) for end-2-end-integration testing. You can run them manually by running `npx cypress open tests/e2e/specs/`. You can also run the entire suite with `npx cypress run` or any  specific test by attaching `--spec tests/e2e/spec/polls.js` (to learn more about this command, just add `--help`).

You need to have the backend (docker) and frontend runnig and served at `localhost:8080` for that to work. It relies heavily for the mock-data in the assertions, so if it fails that might not be a bug but different state you currently have locally. To reset the database (CAREFUL THIS PERMANANTLY DELETES YOUR CURRENT DATA!) you can run `npm run dev:db:reset`. Be sure to restart any dev-serve `npm run serve` after, because the default Team ID will have changed.

## Development accounts

The mock data creates some default data and logins for the development and testing environments. The password always equals the username (also for other accounts created during e2e-tests). Here are the most important accounts to tests with:

 - River Song (user & password: `river`) is admin of the default main team "Team Doctor Who";
 - Clara Oswald (`clara`) is a regular user in the same team
 - Graham (`graham`) is a regular user in the default team and admin of the default subteam "Team Earth",
 - Yaz (`yaz`) is member of both the default team and the subteam "Team Earth"


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
