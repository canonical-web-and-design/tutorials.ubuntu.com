FROM ubuntu:bionic

# System dependencies
RUN apt-get update && \
    apt-get install xz-utils nodejs npm --yes

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
