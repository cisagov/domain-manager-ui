# Stage 1 - Build
FROM node:18-alpine as node

# Set working directory
WORKDIR /app

# Install dependencies
RUN npm install -g npm@latest
RUN npm install -g @angular/cli

# Install Packages
COPY ./src/domainManagementUI/package*.json ./
RUN npm install

# Copy source code
COPY ./src/domainManagementUI .

# Build angular
RUN ng build

# Serve project
CMD ng serve --host 0.0.0.0 --port 4200
