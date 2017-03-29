FROM node:6-alpine

RUN apk update \
  && apk add --update alpine-sdk \
  && npm install -g @angular/cli@1.0.0 \
  && ng set --global packageManager=yarn \
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache clear \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

ENV HOME=/home/app
COPY . $HOME/angular/
WORKDIR $HOME/angular



