FROM node:19 as builder

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY . .
RUN npm ci

RUN npx tsc -p .

# Exports
EXPOSE 3001

CMD [ "npm", "run", "start" ]