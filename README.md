# Offerize
a [Visa Global Intern Hackathon](https://www.hackerearth.com/challenges/hackathon/visa-hackathon-2020/) project

<br/>

## Structure

### Client
powered by [React](https://reactjs.org/)

### Server
powered by [Strapi](https://strapi.io/)

#### API
Current documentation is available [here](https://documenter.getpostman.com/view/3570478/Szzn4vmW?version=latest)
> A full SwagerUI documentation is coming soon

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
