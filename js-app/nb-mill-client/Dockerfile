FROM node:18
WORKDIR /nb-mill-client
COPY . .
RUN npm ci
ENTRYPOINT ["npm", "run", "dev"]
