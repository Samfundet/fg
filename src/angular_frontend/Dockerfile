FROM alexsuch/angular-cli

#RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app

COPY package.json $HOME/angular/
#RUN chown -R app:app $HOME/*

#USER app
WORKDIR $HOME/angular
RUN npm install &&\
	npm cache clean

