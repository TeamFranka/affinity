---
layout: default
title: Getting started
nav_order: 2
has_children: true
---

# Getting started

This project is developed using [Ionic]() for mobile integration of the [Vue3]() (with [VueX]() for state transitions and [VueRouter]() for routing) frontend to the [Parse Platform]() backend. It is a responsive single page app in Typescript using the [Parse Javascript SDK]() to communicate with said backend, with some external widgets that can be embedded into regular webpages. We use [cypress]() to run end to end tests against the application.

## Development Setup

Thus, in order to develop, an development backend service is required. You can either use the cloud-based gitpod setup or set up a local development environment using `docker-compose`. Please follow the respective guides in this section.

## Introduction

To understand the concept and basic ideas behind the application, please watch this introduction video (while things build):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/KKDVhntCL3s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Development accounts

The mock data creates some default data and logins for the development and testing environments. The password always equals the username (also for other accounts created during e2e-tests). Here are the most important accounts to tests with:

 - River Song (user & password: `river`) is admin of the default main team "Team Doctor Who";
 - Clara Oswald (`clara`) is a regular user in the same team
 - Graham (`graham`) is a regular user in the default team and admin of the default subteam "Team Earth",
 - Yaz (`yaz`) is member of both the default team and the subteam "Team Earth"