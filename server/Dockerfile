FROM node:lts-alpine3.19


WORKDIR /roboapp/backend_node

COPY . .

RUN npm install

EXPOSE 8000
CMD [ "npm","start" ]