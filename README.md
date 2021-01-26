# Affinity

The affinity progressive communities network app is a social network for progressive movements and initiatives and their followers.

## Requirements

You will need a [NodeJS](https://nodejs.org/en/download/) and `npm` installation. If you want to contribute you'll also need [git](https://ionicframework.com/docs/intro/environment#git) for a github setup.

To run the database / application server you'll need docker & [docker-compose](https://docs.docker.com/compose/install/). On windows, docker-compose is included in the regular [Docker Desktop installation](https://docs.docker.com/docker-for-windows/install/).

## Setup

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


### Running the dev frontend

Now run
```
npm run serve
```

To start the local development frontend, it should open a webbrowser to the UI. The UI is mobile-friendly, use the browsers developer tools to switch into responsive mode.

This is a live-server: whenever you make changes to the source code, the server recompiles and updates the website _live_. Observe the terminal closely to learn about any errors in it. You can stop it by pressing `CTRL+C`.

### Re-/Starting the application backend

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

### Running Tests

We use `cypress` (can be found in `tests/e2e/specs`) for end-2-end-integration testing. You can run them manually by running `npx cypress open tests/e2e/specs/`.

You need to have the backend (docker) and frontend runnig and served at `localhost:8080` for that to work. It relies heavily for the mock-data in the assertions, so if it fails that might not be a bug but different state you currently have locally. To reset the database (CAREFUL THIS PERMANANTLY DELETED YOUR CURRENT DATA!) you can run `npm run dev:db:reset`. Be sure to restart any dev-serve `npm run serve` after, because the default Team ID will have changed.


## License

This code is licensed under the Affinity Code License (see LICENSE.txt), based on the Business Code License, which is an _eventually Open Source License_, meaning the code is available under the GNU AFFERO GENERAL PUBLIC LICENSE 3.0 (see LICENSE-AGPL.txt) two years after being published for the first time. Before that time you are welcome to contribute to the code here - granted you allow the Affinity Council to reign over the copyright - and use this internally, for personal and educational purpose with up to a hundred registered users. For all other uses you need to acquire a separate license. To do so, please contact the Affinity Council.
