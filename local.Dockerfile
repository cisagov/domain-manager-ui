FROM nginx:1.22

# Set working directory
WORKDIR /app

# Install build requirements
RUN apt update && apt install -y nodejs npm
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs
RUN npm install -g @angular/cli@14.1.0

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
