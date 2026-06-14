# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build-time arguments for Vite env vars
# Set these in Dokploy: App > Build > Build Arguments
ARG VITE_SHOPIFY_STORE_DOMAIN
ARG VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN

# Expose them as ENV so Vite can read them during build
ENV VITE_SHOPIFY_STORE_DOMAIN=$VITE_SHOPIFY_STORE_DOMAIN
ENV VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=$VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the app (VITE_ vars are now baked into the JS bundle)
RUN npm run build

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
