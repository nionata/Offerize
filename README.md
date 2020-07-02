# Offerize
![Release Latest Version](https://github.com/nionata/Offerize/workflows/Release%20Latest%20Version/badge.svg) 
![Build and Update Server](https://github.com/nionata/Offerize/workflows/Build%20and%20Update%20Server/badge.svg)
![](https://img.shields.io/docker/pulls/nionata/offerize.svg)

a [Visa Global Intern Hackathon](https://www.hackerearth.com/challenges/hackathon/visa-hackathon-2020/) project

<br/>

## Structure

### Client
powered by [React](https://reactjs.org/)

### Server
powered by [Strapi](https://strapi.io/)

#### API
[Documentation](https://documenter.getpostman.com/view/3570478/Szzn6wMY?version=latest)

<br/>

## Setup
### Client
> This requires [Node](https://nodejs.org/en/download/) 
>
> Before your first start run `npm install`

``` bash
npm run start
```
### Server
> This requires [docker desktop](https://www.docker.com/products/docker-desktop) 
``` bash
docker-compose up
```

> If you are having related to dependencies, delete the `node_modules` folder and run up

<br/>

## Deployment

- The [build and update server]([https://github.com/nionata/Offerize/actions?query=workflow%3A%22Build+and+Update+Server%22](https://github.com/nionata/Offerize/actions?query=workflow%3A"Build+and+Update+Server")) workflow will be kicked off every time code is pushed to the `/server` directory on the `develop` and `master` branches
- The [release latest version]([https://github.com/nionata/Offerize/actions?query=workflow%3A%22Release+Latest+Version%22](https://github.com/nionata/Offerize/actions?query=workflow%3A"Release+Latest+Version")) workflow will be kicked off every time a GitHub release is published to the `master` branch

### Client - [offerize.xyz](https://offerize.xyz)

### Server - [api.offerize.xyz](http://api.offerize.xyz)

The [api](https://hub.docker.com/repository/docker/nionata/offerize) and [web](https://hub.docker.com/repository/docker/nionata/offerize-web) images are built and tagged as `latest` on all new commits to `develop` and `master`. Additionally, the old containers on the EC2 instance will be replaced with the `latest` builds. On release, the images are tagged with the version and pushed back to [Dockerhub](https://hub.docker.com/).

<br/>

## Contributing

## Branching

### Protected
- `master` - all commits must be made to a non-protected branch and submitted via a pull request with 1 approving reviews

### Non-Protected
- `develop` - working branch - please refrain from commiting directly
- `feature/<client/server>-<feature>` - branch off of develop
- `hotfix/<client/server>-<bug>` - branch off of master

### Git flow
![](https://camo.githubusercontent.com/7f2539ff6001fe7700853313e7cdb7fd4602e16a/68747470733a2f2f6e7669652e636f6d2f696d672f6769742d6d6f64656c4032782e706e67)
