---
layout: default
title: Architecture
nav_order: 3
has_children: true
---

# Design Introduction

To understand the concept and basic ideas behind the application, please watch this introduction video:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/KKDVhntCL3s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Folder structure:

```
+
|- ...
|- android                # Capacitor files for Android
|- backend                # Parse Cloud Code and Triggers, see below
|- bin                    # helpers, mainly for data mocking
|   |-- mock-data/           # Mock data for tests and initial setup
|   |   |-- files/             # static files for the mock data
|   |   +-- index.ts           # the actual definition of mocked data
|   |-- mock-data.js         # script to read the mock data and send it to the parse server
|   |-- ts-cli-setup.js      # helper allowing us to run typescript cli
|   +-- update-db.js         # Apply the database schema on the parse server
|- docs                   # You are looking at it
|- ios                    # Capacitor files for iOS
|- public                 # Static assets
|- src                    # Vue.js/Ionic App, see below
|- tests
|   |-- e2e/              # Cypress Test environment
|   |   |-- fixtures/        # fixtures for tests
|   |   |-- specs/           # The actual tests
|   |   |-- support/         # helper functions for the tests
|   |-- ...
```


### Backend

```
|- ...
|- backend/
|   |-- cloud/
|   |   |-- models/           # <-- Parse.Object-Models
|   |   |-- activity.js       # <-- each Data Model has its own file
|   |   |-- common.js         # <-- Reused Components
|   |   |-- consts.js         # <-- System-wide constants
|   |   |-- ...
|   |   |-- main.js           # <-- Server Code entry point
|   |   |-- ...
|   |   |-- package.json      # <-- the npm installation with extra dependencies
|   |   |-- ...
|   |   |-- team.js           # <-- Team related cloud code
|   |   +-- utils.js          # <-- Server utilities
|   |-- public
|- ...
```

### Frontend

```src
|-- components                           # Vue Components
|   |-- generic                             # Generic Components, not connected to store
|   |   |-- inline-link-list.vue
|   |   `-- selector.vue
|   |-- settings                            # Settings related components, not connected to store
|   |   |-- create-subteam.vue
|   |   |-- ...
|   |   `-- push-notification.vue
|   |-- activity.vue
|   |-- ...                                 # Various components, might be tied to store
|   `-- user-icon.vue
|-- config                               # Vue Entry Points
|   |-- App.vue                             # Default App
|   |-- Consts.ts                           # System wide shared constants
|   `-- Widget.vue                          # Chat-Widget entry point (defunc)
|-- db
|   |-- schemas                           # Database model schemas
|   |   |-- activity.ts
|   |   |-- ...                             # one schema per file
|   |   `-- video.ts
|   |-- buildSchema.ts                    # pulling the schemas together
|   `-- models.js                         # Parse.Object Models for the frontend
|-- locales                            # Locales / Translations
|   |-- de.json
|   `-- en.json
|-- router
|   `-- index.ts                      # main app routing definitions
|-- statics
|   |-- ...                            # various static files, svgs, etc
|-- stores                            # VueX Store definitions, connecting the Data via Parse-SDK to the backend
|   |-- auth.ts
|   |-- ...                             # various namespaced specific stores
|   |-- globals.ts                      # non-namespace global objects manager
|   |-- ...
|   |-- index.ts                        # putting it all together
|   `-- ...
|-- templates                         # The different HTML targets we build
|   |-- app.html                        # default app
|   `-- chat-widget.html                # chat widget example
|-- theme
|   `-- variables.css
|-- utils                             # various reusable utilities
|   |-- camera.ts                        # ionic camera related
|   |-- env.ts                           # node env
|   |-- gestures.ts                      # ionic gestures
|   |-- i18n.ts                          # localisation and translations
|   |-- md.ts                            # markdown
|   |-- model.ts                         # local json-model to Parse.Object helpers
|   |-- setup.ts                         # various startup helpers
|   |-- time.ts                          # day.js parser and formatting helpers
|   `-- url.ts                           # URL support
|-- views                            # Vue Components that act as full pages
|   `-- ...
|-- chat-widget.js                   # Chat widget Starting Point
|-- main.ts                          # Main App starting point
|-- registerServiceWorker.ts         # PWA service worker
|-- shims-vue.d.ts                   # Typescript definition for Vue Shims
`-- vue.d.ts                         # Typescript definiiton for our localised Vue Components
```