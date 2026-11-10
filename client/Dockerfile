FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV BACKEND_URL=http://api:5000
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]