FROM parseplatform/parse-server:4.4.0

USER root

WORKDIR /parse-server

RUN ln -s /lib/ld-musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

# ----- Development-Only extras
RUN mkdir affinity-dev
COPY package*.json ./affinity-dev/
RUN npm install ./affinity-dev --production

# ---- Regular Dependencies
RUN mkdir affinity
COPY cloud/package*.json ./affinity/
RUN npm install ./affinity --production

USER node
CMD ["./bin/parse-server"]
ENTRYPOINT ["node"]

EXPOSE 1337