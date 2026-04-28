FROM nginx:alpine
COPY . /usr/share/nginx/html
# Cloud Run uses port 8080 by default. Update the nginx config to listen on 8080.
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
EXPOSE 8080
