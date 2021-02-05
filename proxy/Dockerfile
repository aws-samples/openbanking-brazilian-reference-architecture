FROM nginx:alpine

COPY ./proxy.conf.template /proxy.conf.template

COPY ./ssl/bank.key /etc/ssl/bank.key
COPY ./ssl/bank.crt /etc/ssl/bank.crt
COPY ./client/ssl/client.crt /etc/ssl/client.crt

CMD ["/bin/sh" , "-c" , "envsubst < /proxy.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]