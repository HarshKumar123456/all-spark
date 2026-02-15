###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:24-alpine AS base
WORKDIR /usr/local/app








################## UI STAGES ##################

###################################################
# Stage: ui-base
#
# This stage is used as the base for the ui-dev and ui-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS ui-base
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./ ./

###################################################
# Stage: ui-dev
# 
# This stage is used for development of the ui application. It sets 
# the default command to start the Node.js development server.
###################################################
FROM ui-base AS ui-dev
CMD ["npm", "run", "dev"]