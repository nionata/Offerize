# Offerize
a [Visa Global Intern Hackathon](https://www.hackerearth.com/challenges/hackathon/visa-hackathon-2020/) project

<br/>

## Structure

### Client
powered by [React](https://reactjs.org/)

### Server
powered by [Strapi](https://strapi.io/)

#### API
Current documentation is available [here](https://documenter.getpostman.com/view/3570478/Szzn6wMY?version=latest)
> A full SwaggerUI documentation is coming soon

<br/>

## Setup
### Client
### Server
> This requires [docker desktop](https://www.docker.com/products/docker-desktop) 
``` bash
docker-compose up
```

> If you are having related to dependencies, delete the `node_modules` folder and run up

<br/>

## Deployment

The [release](/.github/workflows/release.yml) workflow will be kicked off every time a GitHub release is published to the master branch

### Client

On release, the client will be built to static files and uploaded to an S3 bucket. Those files will then be served on requests to [offerize.xyz](http://offerize.xyz)

### Server

The [server docker image](https://hub.docker.com/repository/docker/nionata/offerize) is built on all new commits to `develop` and tagged as `latest`. On release, the image is tagged with the explicit version and pushed back to [dockerhub](https://hub.docker.com/). The following steps detail deploying the freshly tagged image:

1. SSH into the EC2 instance with a perm file

2. Remove the existing container, `docker rm --force offerize-server-prod`

3. Run a new container with the following options, `docker run`

   1. `--name offerize-server-prod`

   2. `-p 80:1337` 

      > maps the host port 80 (http default port) with the container port 1337 (strapi server port)

   3. `-e DATABASE_HOST=hostFromRDS` 

   4. `-e DATABASE_PASSWORD=passwordFromRDS` 

   5. `nionata/offerize:releaseVersion`  

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
