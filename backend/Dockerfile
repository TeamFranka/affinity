FROM parseplatform/parse-server:4.4.0

USER root

WORKDIR /parse-server
RUN mkdir affinity
COPY cloud/package*.json ./affinity/
RUN npm install ./affinity

USER node

EXPOSE 1337