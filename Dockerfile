FROM nginx:1.19

# Set working directory
WORKDIR /app

# Install build requirements
RUN apt update -y
RUN apt install npm -y
RUN npm install -g npm@latest
RUN npm install -g @angular/cli

# Install packages
COPY ./src/domainManagementUI/package*.json ./
RUN npm install

# Copy source code
COPY ./src/domainManagementUI .

# Build angular
RUN ng build --configuration production --output-path=/usr/share/nginx/html/

# Copy nginx config
COPY ./etc/default.conf /etc/nginx/conf.d/default.conf
COPY ./etc/mime.types /etc/nginx/mime.types

# Copy entrypoint
COPY ./etc/entrypoint.sh /usr/share/nginx/entrypoint.sh
RUN chmod 755 /usr/share/nginx/entrypoint.sh

# Define entrypoint
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
