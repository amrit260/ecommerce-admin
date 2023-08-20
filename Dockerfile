FROM node:18
# folder to store code inside container
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
RUN npx prisma generate
RUN npm run build
CMD ["npm","start"]

