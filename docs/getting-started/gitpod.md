---
layout: default
title: using Gitpod
nav_order: 1
parent: Getting started
---

# Getting started using gitpod

[![Gitpod click to start](https://img.shields.io/badge/Gitpod:-click%20to%20get%20started-lightblue?logo=gitpod)](https://gitpod.io/#https://github.com/TeamFranka/affinity)

We have a full Gitpod setup ready for you, you can use it to develop the app. It will setup all necessary backend services and requirements for you, start the live development server (available in the second termminal) and make the app availalbe to you at port `8080`.

## Restarting the dev server

Under rare circumstances you have to restart the live-dev server. For that you can just `ctr+c` in that terminal and do `UP`+`enter` to start it again. The first compile might takes a while.

## Running tests

You can run the test suite against your gitpod environment as well. Please take into account, that this does not reset the db and will continously add data to it. You can run it by opening another terminal and run `npx cypress run` (to learn more about this command, just add `--help`). You can run a specific test by attaching `--spec tests/e2e/spec/polls.js`.

If you are using a different shell it might be missing the correct base-url environment variable. For that run it as ```CYPRESS_BASE_URL=`(gp url 8080)` npx cypresss run``` or export it as ```export CYPRESS_BASE_URL=`(gp url 8080)` ```