# IBVAP landing page: a tiny static Nginx image (about 50 MB).
# Build: docker build -t ibvap-landing .
# Run:   docker run -d --name ibvap-landing -p 8080:80 --restart unless-stopped ibvap-landing
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/ibvap-landing.conf
COPY index.html og-image.png /var/www/ibvap-landing/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
