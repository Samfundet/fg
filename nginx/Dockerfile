# Stage 1
FROM node:9-alpine as build-deps
RUN npm i @angular/cli@1.6.3 node-sass@4.9.3 -g --unsafe-perm

WORKDIR /src

# Copy files defining dependency first
COPY src/angular_frontend/package.json  .
COPY src/angular_frontend/package-lock.json  .
RUN npm i && npm rebuild node-sass

# Then copy over the rest of directory and build
COPY src/angular_frontend/ .
RUN ng build

# Stage 2
FROM nginx:1.15.0

COPY nginx/nginx.conf   /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /src/dist /static/angular/dist
