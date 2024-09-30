FROM nginx:stable

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/myserver.crt /etc/ssl/myserver.crt
COPY ./nginx/myserver.key /etc/ssl/myserver.key

ENV ENV=production
