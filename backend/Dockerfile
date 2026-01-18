# 📁 ARQUIVO: backend/Dockerfile
# 🧠 RESPONSÁVEL POR: Build do backend em container
# 🔗 DEPENDÊNCIAS: Docker, Node.js

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

# Persistência
RUN mkdir -p /app/logs /app/data

ENV HOST=0.0.0.0
ENV PORT=4100

EXPOSE 4100

CMD ["node", "src/server.js"]
