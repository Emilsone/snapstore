FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN mkdir -p data public/screenshots
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]