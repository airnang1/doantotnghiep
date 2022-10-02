FROM node:14-alpine AS base

COPY package.json yarn.lock ./
RUN yarn

FROM base AS dist
COPY . ./
RUN yarn prisma generate
RUN yarn build

FROM dist as node_modules

RUN npm prune --production
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map
RUN rm -rf node_modules/couchbase/src/

FROM node:14-alpine as final

RUN addgroup -S eztub && adduser -S eztub -G eztub
USER eztub

RUN mkdir -p /home/eztub/app

WORKDIR /home/eztub/app

COPY --from=base package.json /home/eztub/app/package.json
COPY --from=dist dist /home/eztub/app/dist
COPY --from=dist prisma /home/eztub/app/prisma
COPY --from=node_modules node_modules /home/eztub/app/node_modules

CMD yarn "start:prod"
