# WMGTSS API

## Description

This is the server/backend component of the WMGTSS project for WM393 Assignment 2. This application uses [NestJS](https://github.com/nestjs/nest); a Typescript based framework for creating scalable server-side applications.

**This project requires a large amount of configuration. To view the live app, I strongly suggest navigating to https://wmgtss.com/ to see the production application already running.**

---

## Setup

Before starting the application for the first time, several steps **must** be carried out to ensure it works correctly.

### PostgreSQL

A Postgres server must be available, with a database created ready to receive connections. Once it has been created, the _uuid-ossp_ extension must be installed using the command below:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Environment

Create file named `.env` at the same directory level as this README. This will contain a number of configuration overrides read by the application when it starts. Below is a list of all available overrides, along with their defaults. The ones marked 'NOT SET' **must be set** in the `.env` file.

#### **Notes:**

`JWT_SECRET` may be set to any string of characters.

`REACT_DOMAIN` and `REACT_URL` refer to the location of the frontend application. This cannot be localhost, due to constraints on cookies. See steps to fix this further down this page.

```
DATABASE_HOST=localhost
DATABASE_NAME=wmgtss
DATABASE_USER=app_user
DATABASE_PASSWORD=NOT SET
DATABASE_NAME=wmgtss
JWT_SECRET=NOT SET
PORT=5000
REACT_DOMAIN=wmgtss.com
REACT_URL=https://wmgtss.com/
```

### Hosts Fix

As already mentioned, for authentication to work, the app must be running on a 'real' domain, and not localhost. To resolve this, until a better fix can be found, edit the `/etc/hosts` file and add the following content to the bottom. On Windows this can be found at `C:\Windows\System32\Drivers\etc\hosts`.

```bash
# WMGTSS Local Development
127.0.0.1 app.com
127.0.0.1 api.app.com
```

Now set the `REACT_DOMAIN` and `REACT_URL` appropriately in the `.env` file:

```
REACT_DOMAIN=app.com
REACT_URL=http://app.com/
```

### Installation

Finally, to install npm dependencies, run the following command in this (the project root) folder.

```bash
# install npm dependencies
$ npm install

# build the application
$ npm run build
```

---

## Running the app

```bash
# development mode (recommended)
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

### Testing

```bash
# unit tests
$ npm run test
```
