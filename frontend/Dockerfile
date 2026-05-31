FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev && chown -R appuser:appgroup /app
USER appuser
EXPOSE 80
CMD ["npx", "serve", "-s", "dist", "-l", "80"]
