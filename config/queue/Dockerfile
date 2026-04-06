###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:24-alpine AS base
WORKDIR /usr/local/app








################## QUEUE STAGES ##################

###################################################
# Stage: queue-base
#
# This stage is used as the base for the queue-dev and queue-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS queue-base
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./ ./


###################################################
# Stage: queue-dev
# 
# This stage is used for ADMIN Operations of the queue. It sets 
# the default command to start the Node.js development server.
###################################################
FROM queue-base AS queue-dev
CMD ["npm", "run", "dev"]
