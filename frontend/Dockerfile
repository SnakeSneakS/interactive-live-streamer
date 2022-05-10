# frontend for release by nginx

FROM node:16.15.0-alpine AS builder
WORKDIR /app
COPY . /app 
RUN npm install 
RUN npm run build


FROM nginx:latest as release
COPY --from=builder /app/build /var/www/html 
COPY nginx-default.conf /etc/nginx/conf.d/default.conf 
RUN nginx -t
RUN service nginx restart 


