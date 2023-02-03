FROM node:18 as build-frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

ARG STATIC_ROOT
RUN echo VITE_BASE_PATH=${STATIC_ROOT} >> .env.production
RUN npm run build -- --base=${STATIC_ROOT}

# ------------------------------------------------------------------------------- #
FROM nginx:1.22
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/ /etc/nginx/
COPY --from=build-frontend /app/dist/ /var/www/public/app
#COPY --from=backend /app/dist /var/www/public/django