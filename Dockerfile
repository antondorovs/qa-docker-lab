FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /tests

COPY package.json package-lock.json ./
RUN npm ci

COPY playwright.config.js ./
COPY tests ./tests

CMD ["npm", "test"]
