FROM node:24-alpine

WORKDIR /app

COPY server.js .

EXPOSE 3000

HEALTHCHECK --interval=2s --timeout=2s --retries=10 CMD wget --quiet --tries=1 --spider "http://127.0.0.1:${PORT:-3000}/health" || exit 1

CMD ["node", "server.js"]
