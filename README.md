# Barefoot Nomad - Making company travel and accomodation easy and convinient.
[![Maintainability](https://api.codeclimate.com/v1/badges/e4f2f989e61455bf391a/maintainability)](https://codeclimate.com/github/Stackup-Rwanda/stackup2-barefoot-backend/maintainability)   [![Build Status](https://travis-ci.org/Stackup-Rwanda/stackup2-barefoot-backend.svg?branch=develop)](https://travis-ci.org/Stackup-Rwanda/stackup2-barefoot-backend)
[![Coverage Status](https://coveralls.io/repos/github/Stackup-Rwanda/stackup2-barefoot-backend/badge.svg?branch=develop)](https://coveralls.io/github/Stackup-Rwanda/stackup2-barefoot-backend?branch=develop)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

## Vision

Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

## Deployments

* This application is deployed on heroku, we have two different versions, which are different by the app status, *__in testing mode__* or *__ready for production__*.

    * When the app is in testing mode is available on this link [stackup2-barefoot-backend-staging](https://stackup2-barefoot-backend-stag.herokuapp.com/)

    This deployment happens automatically, whenever there is a new merging to __develop__ branch

    => This helps whoever wants to test our application if it is giving the accurate outputs

    * When the app is ready for production is available on this link [stackup2-barefoot-backend](https://stackup2-barefoot-backend.herokuapp.com/)

* Whenever a new PR is opened, there is a new review app which is created and accessible in the browser which helps to access visualize your PR in the browser to check if it working as you wanted it to work.

* If your PR needs some environment variables, click [here](https://dashboard.heroku.com/pipelines/45438218-0719-4c45-8d9f-50d610d24ed5/settings) and click on the *__Reveal Config Vars__* button, a new small window opens which shows you where to enter your env variable key and value. Those env variables are accessed ass __process.env.{VARIABLE_NAME}__
=>Make sure you don't delete other env variables which were there previously.

_If the aforementioned link says *ACCESS DENIED*, then contact me _[here](mailto:emmanuellamugi@gmail.com)_ to add you_

* After raising a PR, and after setting up everything, you can click [here](https://dashboard.heroku.com/pipelines/45438218-0719-4c45-8d9f-50d610d24ed5/) and look at the tab called __REVIEW APPS__ and scroll down to find your PR and click on __Open App__ button.

* Another easy way to check your PR's deployment, after TravisCI build passes, scroll down to the PR's page and click on the `View Deployment` button.

## Sequelize and Sequelize-cli

This API uses Sequelize as its ORM. To get you started, we will configure sequelize using .sequelizerc file.

The .sequelizerc file will in turn be used by sequelize-cli to setup the the sequelize folder structure.

### 1. Configure environment variables

The following are example environment variables needed:

#### Database

* DEV_DB_USERNAME
* DEV_DB_PASSWORD
* DEV_DB_NAME
* DEV_DB_HOSTNAME
* DEV_DB_PORT

#### General

* NODE_ENV=development

### 2. Creating first Model (and Migration)

We will use `npm sequelize-cli model:generate` command to generate a new model. This command requires two options:

* `--name`, Name of the model
* `--attributes`, List of model attributes

Let's create a model named User.

`$ npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`

This above will do following:

* Create a model file `user.js` in `src/database/models` folder
* Create a migration file with name like `XXXXXXXXXXXXXX-create-user.js` in `src/database/migrations` folder

According to [the docs](https://sequelize.org/v5/manual/migrations.html), sequelize will only use Model files, it's the table representation. On the other hand, the migration file is a change in that model or more specifically that table, used by CLI. Treat migrations like a commit or a log for some change in database.

### 3. Running Migrations

Until this step, we haven't inserted anything into the database. We have just created required model and migration files for our first model User. Now to actually create that table in database you need to run `db:migrate` command.

`$ npx sequelize-cli db:migrate`

This command will execute these steps:

* Will ensure a table called SequelizeMeta in database. This table is used to record which migrations have run on the current database
* Start looking for any migration files which haven't run yet. This is possible by checking `SequelizeMeta table`. In this case it will run `XXXXXXXXXXXXXX-create-user.js` migration, which we created in last step.
* Creates a table called `Users` with all columns as specified in its migration file.

### 4. Undoing Migrations

Now our table has been created and saved in database. With migration you can revert to old state by just running a command.

You can use `db:migrate:undo`, this command will revert most recent migration.

`$ npx sequelize-cli db:migrate:undo`

You can revert back to initial state by undoing all migrations with `db:migrate:undo:all` command. You can also revert back to a specific migration by passing its name in `--to` option.

`$ npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-user.js`

Refer to the [sequelize](https://sequelize.org/v5/) and [sequelize-cli](https://github.com/sequelize/cli/tree/master/docs) docs for more information.

## BarefootNomad API endpoints Specifications

- Api Roots : https://stackup2-barefoot-backend-stag.herokuapp.com/

| Endpoint | Request | Status | Description |
| --- | --- | --- | --- |
| / | GET | 200 OK | Helps users to access to the parent api for the whole application|
| /api/auth/signup | POST | 201 CREATED | Makes a post request to signup a new user and return access token |
| /api/auth/login | POST | 200 OK | Makes a post request to login an existing user and return an access token |
| /api/auth/resetpassword | POST | 200 OK | Makes a post request, for for requesting to reset a password by sending the user's email and it returns a token to send with the next route of resetting password |
| /api/auth/resetpassord/:token | POST | 200 OK | Makes a POST request reset user's password |
| /api/profile | GET | 200 OK | Makes a GET request, to help a logged-in user to see his profile after successful login |
| /api/profile/:username | GET | 200 OK | Makes a GET request to help a user to see other users' profiles by adding their usernames in URL |
| /api/profile | PATCH | 200 OK | Makes a PATCH request when a user wants to update his profile |
| /api/profile/password | PATCH | 200 OK | Makes a PATCH request to help password changes, whenever a user needs to change his/her password directly from his/her profile|
| /api/auth/verify?token=eyWWWSDHFGC | GET | 200 OK | Makes a GET request when a user clicks on the link that is sent to him/her via Email to verify his/her email |
| /api/trips/inapp/notification | POST | 200 OK | It shows the inApp notifications to manager and requester |
| api/auth/disable?mode=inapp | POST | 200 OK | It enables/disables inApp notifications |
| api/auth/disable?mode=email | POST | 200 OK | It enables/disables email notifications |
| ||More Details about all of the above endpoints, their responses form, and when there is an error how they respond, please click here for further documentation [Documentation](https://stackup2-barefoot-backend-stag.herokuapp.com/public/api-docs/#/) ||
