# ---- Base Node ----
FROM node:14 AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install

# ---- Rebuild ----
FROM dependencies AS rebuild
COPY . .
RUN npm rebuild bcrypt --build-from-source

# ---- Release ----
FROM base AS release
COPY --from=rebuild /usr/src/app .
CMD ["node", "app.js"]
EXPOSE 8000
