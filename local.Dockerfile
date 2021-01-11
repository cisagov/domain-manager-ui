FROM nginx:1.19

WORKDIR /app
RUN apt update -y
RUN apt install npm -y

COPY ./src/domainManagementUI/package.json ./
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm install --loglevel=error
RUN npm install -g @angular/cli

ENV PATH /app/node_modules/.bin:$PATH

COPY ./src/domainManagementUI .

RUN ng build

COPY ./etc/local.entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
