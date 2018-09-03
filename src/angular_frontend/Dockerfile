FROM node:10.9.0

# Set working dir
RUN mkdir /src/
WORKDIR /src/

ENV PATH '/src/node_modules/.bin' to $PATH

 # insatl and cache app dependencies
 COPY './package.json' '/src/package.json'
 RUN npm install
 RUN npm install -g @angular/cli@1.6.3
 # RUN npm install node-sass
 # RUN npm rebuild node-sass


# add app
 COPY ./ /src/

# start app
#CMD ng serve open --host localhost
CMD ng build --watch
