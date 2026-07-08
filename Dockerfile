FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV CI=true
ENV NODE_ENV=development

EXPOSE 3000

CMD ["pnpm", "dev:vercel", "--yes"]
