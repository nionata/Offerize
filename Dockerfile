FROM strapi/base

WORKDIR /usr/src/app

# Install app dependencies
COPY ./server/package.json .
COPY ./server/yarn.lock .
RUN yarn install

# Bundle app source
COPY ./server .

# Set the env to prod for build
ENV NODE_ENV production

# Build admin
RUN yarn build

# Port mapping
EXPOSE 1337

# Run when the container is started
CMD yarn start