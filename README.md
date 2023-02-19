<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center"> RESTful API </p>

## Description

RESTful API for management of users and their posts.

## Technologies

Nodejs, Nest.js framework, Postgresql, prisma, passport, pactumJS, docker etc...

## Installation

```bash
$ npm install
```

## Running the app

Server listening 3333 port and Swagger documentation on http://localhost:3333/api.

```bash

# --watch dev mode

$ npm run db:dev:up

# then this to restart db when you need it
$ npm run db:dev:restart

$ npm run start:dev

# remove db when you end
$ npm run db:dev:rm

```

## Test

I wrote some e2e tests to test all REST API.

```bash

# e2e tests

$ npm run db:test:up

# then this to restart test db when you need it
$ npm run pretest:e2e

$ npm run test:e2e

# remove test db when you end
$ npm run db:test:rm

```

## Stay in touch

- Author - [Edvard Solomon](https://www.linkedin.com/in/eduard-solomonov-2b85ab259/)

## License

Nest is [MIT licensed](LICENSE).
