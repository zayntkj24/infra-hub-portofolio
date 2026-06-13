# Docker — Linux

> Instalasi and configuration **Docker Engine** in Linux for containerizing applications.

## Overview

Docker enables packaging an application alongside its dependencies in portable and consistent containers across all environments.

## Step 1 — Instalasi Docker Engine

```bash
# Remove old versions if present
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt update
sudo apt install ca-certificates curl gnupg lsb-release -y

# Add Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add repo Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```

## Step 2 — Post-install Setup

```bash
# Run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Enable on boot
sudo systemctl enable docker
sudo systemctl start docker

# Verify
docker run hello-world
```

## Step 3 — Docker Compose

Contoh `docker-compose.yml` untuk web app + database:

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
```

```bash
docker compose up -d
docker compose ps
docker compose logs -f
```

## Step 4 — Perintah Docker Dasar

```bash
# List container yang jalan
docker ps

# List semua container (termasuk stopped)
docker ps -a

# Stop / Start / Remove container
docker stop CONTAINER_ID
docker start CONTAINER_ID
docker rm CONTAINER_ID

# List images
docker images

# Remove image
docker rmi IMAGE_ID

# Enter the container
docker exec -it CONTAINER_ID bash

# View logs
docker logs -f CONTAINER_ID
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| permission denied | User belum in group docker | `sudo usermod -aG docker $USER` lalu logout/login |
| Port already in use | Port is already in use by another process | `sudo lsof -i :PORT` |
| Cannot connect to daemon | Docker service mati | `sudo systemctl start docker` |
| No space left | Disk full from accumulated images/containers | `docker system prune -a` |
