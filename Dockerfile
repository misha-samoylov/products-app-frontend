FROM node:17
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 9000
CMD ["npm", "run", "start"]
