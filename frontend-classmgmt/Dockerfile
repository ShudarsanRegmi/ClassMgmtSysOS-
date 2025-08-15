FROM node:20 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build
 
#serve the app with nginx
FROM nginx:alpine

#copy the build folder to the nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80



