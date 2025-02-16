#!/bin/bash

set -euo pipefail

setup_db() {
  local service_dir=$1
  local service_name=$2

  echo "Starting $service_name (in $service_dir)..."
  if [ ! -d "$service_dir" ]; then
    echo "ERROR: Service directory '$service_dir' not found."
    exit 1
  fi

  if [ ! -f "$service_dir/docker-compose.yaml" ]; then
    echo "ERROR: docker-compose.yaml not found in '$service_dir'."
    exit 1
  fi

  (
    cd "$service_dir"
    rm -rf drizzle
    pnpm install && pnpm run generate && pnpm run migrate
  )
  echo "SUCCESS: $service_name started."
}

echo "Starting all microservices..."
docker-compose up --build -d
echo "All microservices started."

echo "Setting up databases for all microservices..."
setup_db "authentication" "aaw-marketplace-microservice-marketplace-ms-authentication-1"
setup_db "orders" "aaw-marketplace-microservice-marketplace-ms-orders-1"
setup_db "products" "aaw-marketplace-microservice-marketplace-ms-products-1"
setup_db "tenant" "aaw-marketplace-microservice-marketplace-ms-tenant-1"
setup_db "wishlist" "aaw-marketplace-microservice-marketplace-ms-wishlist-1"
echo "All databases set up."
