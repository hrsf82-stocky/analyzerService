#Grab the Node docker image
FROM node:9

#Set the directory
WORKDIR /app

#Copy the compiled source and config files
ADD . /app
ADD config.js /app
ADD package.json /app

#Install dependencies
RUN npm install

#Start the script when container launches
CMD ["npm", "start"]