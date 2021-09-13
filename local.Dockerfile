FROM nginx:1.21.3

# Set working directory
WORKDIR /app

# Install build requirements
RUN apt update -y
RUN apt install npm -y
RUN npm install -g npm@latest
RUN npm install -g @angular/cli

# Install Packages
COPY ./src/domainManagementUI/package*.json ./
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm install --loglevel=error
ENV PATH /app/node_modules/.bin:$PATH

# Copy source code
COPY ./src/domainManagementUI .

# Build angular
RUN ng build

# Copy entrypoint
COPY ./etc/local.entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

# Define entrypoint
ENTRYPOINT ["/entrypoint.sh"]
