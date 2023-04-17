FROM --platform=linux/amd64 ubuntu:22.04

ENV PNPM_VERSION=7.21.0
ENV TMPDIR=/tmp
WORKDIR /app

RUN apt-get update && \
  apt-get install -y curl git && \
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs && \
  npm install --global pnpm@$PNPM_VERSION

COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY . .
RUN ls -la

RUN pnpm i --frozen-lockfile --offline
RUN pnpm make --arch=x64 --platform=linux
