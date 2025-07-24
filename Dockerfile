# Use official Node.js image for build and runtime
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

COPY . .

RUN npm run build

# Production image: use Node.js to run vite preview
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 8080

CMD ["npm" , "run", "start"]