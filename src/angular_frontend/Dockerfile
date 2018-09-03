FROM node:10.9.0

# Set working dir
RUN mkdir /src/
WORKDIR /src/

# ENV PATH './src/angular_frontend/node_modules/.bin' to $PATH

 # insatl and cache app dependencies
 COPY './package.json' '/src/package.json'
 RUN npm install
 RUN npm install -g @angular/cli@1.7.3

# add app
 COPY ./ /src/

# start app
#CMD ng serve open --host localhost
CMD ng build --watch
