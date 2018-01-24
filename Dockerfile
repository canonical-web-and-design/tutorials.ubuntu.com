FROM ubuntu:xenial

# System dependencies
RUN apt-get update && apt-get install --yes curl xz-utils

# Get nodejs
RUN mkdir /usr/lib/nodejs && \
    curl https://nodejs.org/dist/v6.11.3/node-v6.11.3-linux-x64.tar.xz | tar -xJ -C /usr/lib/nodejs && \
    mv /usr/lib/nodejs/node-v6.11.3-linux-x64 /usr/lib/nodejs/node-v6.11.3

# Set nodejs paths
ENV NODEJS_HOME=/usr/lib/nodejs/node-v6.11.3
ENV PATH=$NODEJS_HOME/bin:$PATH

# Node dependencies
RUN npm install --global yarn

# Set git commit ID
ARG COMMIT_ID
ENV COMMIT_ID=$COMMIT_ID
RUN test -n "${COMMIT_ID}"

# Import code, install code dependencies
WORKDIR /srv
ADD . .

# Setup commands to run server
ENTRYPOINT ["yarn", "run", "start-server"]
CMD [""]
