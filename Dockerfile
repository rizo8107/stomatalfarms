# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build-time arguments for Vite env vars
# Set these in Dokploy: App > Build > Build Arguments
ARG VITE_SHOPIFY_STORE_DOMAIN=pay.stomatalfarms.com
ARG VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=f530389d7d4160a046bd5b3f736a2121
ARG VITE_INSFORGE_URL=https://d6yqray7.us-east.insforge.app
ARG VITE_INSFORGE_ANON_KEY=anon_87226cf8482da6e25b95278ee72334ea4e59a2a7e0a2a5422b31774599720159

# Expose them as ENV so Vite can read them during build
ENV VITE_SHOPIFY_STORE_DOMAIN=$VITE_SHOPIFY_STORE_DOMAIN
ENV VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=$VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
ENV VITE_INSFORGE_URL=$VITE_INSFORGE_URL
ENV VITE_INSFORGE_ANON_KEY=$VITE_INSFORGE_ANON_KEY

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Cache-busting: forces Docker to re-run npm run build on every deploy
# so VITE_ env vars are always baked in fresh (not served from cache)
ARG CACHEBUST=1
RUN echo "Cache bust: $CACHEBUST" && npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
