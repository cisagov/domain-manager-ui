FROM node:13-alpine

WORKDIR /app

COPY ./client/domainManagementUI/package.json /app/package.json

RUN npm install --loglevel=error
RUN npm install -g @angular/cli@9.1.8

ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/domainManagementUI /app

RUN ng build

CMD ng serve --host 0.0.0.0 --disable-host-check
