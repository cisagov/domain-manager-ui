FROM nginx:1.19

WORKDIR /app

RUN apt update -y
RUN apt install npm -y

COPY ./src/domainManagementUI/package.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY ./src/domainManagementUI .

COPY ./etc/default.conf /etc/nginx/conf.d/default.conf
COPY ./etc/mime.types /etc/nginx/mime.types

COPY ./etc/entrypoint.sh /usr/share/nginx/entrypoint.sh
RUN chmod 755 /usr/share/nginx/entrypoint.sh

ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
