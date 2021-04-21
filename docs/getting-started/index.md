---
layout: default
title: Getting started
nav_order: 2
has_children: true
---

# Getting started

This project is developed using [Ionic](https://ionicframework.com/) for mobile integration of the [Vue3](https://v3.vuejs.org/) (with [VueX](https://vuex.vuejs.org/) for state transitions and [VueRouter](https://router.vuejs.org/) for routing) frontend to the [Parse Platform](https://parseplatform.org/) backend. It is a responsive single page app in Typescript using the [Parse Javascript SDK](https://docs.parseplatform.org/js/guide/) ([API Ref](https://parseplatform.org/Parse-SDK-JS/api/master/)) to communicate with the backend running [Parse Cloud Code in Javascript](https://docs.parseplatform.org/cloudcode/guide/), with some external widgets that can be embedded into regular webpages. We use [cypress](https://www.cypress.io/) to run end to end tests against the application.

## Development Setup

Thus, in order to develop, an development backend service is required. You can either use the cloud-based gitpod setup or set up a local development environment using `docker-compose`. Please follow the respective guides in this section.

## Development accounts

The mock data creates some default data and logins for the development and testing environments. The password always equals the username (also for other accounts created during e2e-tests). Here are the most important accounts to tests with:

 - River Song (user & password: `river`) is admin of the default main team "Team Doctor Who";
 - Clara Oswald (`clara`) is a regular user in the same team
 - Graham (`graham`) is a regular user in the default team and admin of the default subteam "Team Earth",
 - Yaz (`yaz`) is member of both the default team and the subteam "Team Earth"