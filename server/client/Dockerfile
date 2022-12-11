FROM node:15.2.0-alpine

# ENV NODE_ENV=production

WORKDIR /app

COPY package.json .
COPY package-lock.json .

ENV GENERATE_SOURCEMAP false

RUN npm install --legacy-peer-deps  --no-progress

# COPY . ./