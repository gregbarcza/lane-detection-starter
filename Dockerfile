# TODO FINISH Docker
FROM node:6
MAINTAINER Gergo Barcza <gergo@barcza.hu>
RUN apt-get update
RUN apt-get install opencv ffmpeg
COPY package.json app/package.json
RUN cd app && npm install
COPY . app
RUN node app/ffmpeg.js
CMD ["node ffmpeg.js"]