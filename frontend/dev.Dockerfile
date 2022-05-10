# release
FROM node:16.15.0-alpine AS dev 
WORKDIR /app
ENV PORT 3000 
EXPOSE 3000 
ENTRYPOINT npm run start 

