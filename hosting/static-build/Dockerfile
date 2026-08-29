# Provider-neutral static build pipeline.
# The caller must check out an explicit Git revision before using this context.
FROM node:22-alpine AS build

ARG SOURCE_REVISION
ARG SOURCE_REPOSITORY=unknown
ARG FAIL_VERIFY=0
ENV CI=true FAIL_VERIFY=$FAIL_VERIFY

WORKDIR /app
COPY package*.json ./
RUN test -n "$SOURCE_REVISION"
RUN npm ci
COPY . .
RUN npm run verify
RUN npm run build
RUN mkdir -p /metadata && printf '{"source_revision":"%s","source_repository":"%s","node":"%s","npm":"%s","artifact":"static-dist"}\n' "$SOURCE_REVISION" "$SOURCE_REPOSITORY" "$(node --version)" "$(npm --version)" > /metadata/build-metadata.json

FROM scratch AS artifact
COPY --from=build /app/dist /dist
COPY --from=build /metadata/build-metadata.json /metadata/build-metadata.json
