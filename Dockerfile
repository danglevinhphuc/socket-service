FROM node:14.15.5-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 
RUN npm install -g pm2 
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

COPY . /usr/src/app
EXPOSE 7071

ENV REDIS_HOST=redis-15502.c283.us-east-1-4.ec2.cloud.redislabs.com \
    REDIS_PORT=15502 \
    REDIS_PASS=Fdc6LmJM7r77uRqDdoUjfgKodTuAwPVP \
    DOMAIN_CONNECTION=https://msapi.template.net
CMD  pm2 start --no-daemon  processes.json