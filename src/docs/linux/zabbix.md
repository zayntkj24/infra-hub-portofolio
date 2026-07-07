# Nginx — Linux

> Configuration guide for **Nginx** as a web server and reverse proxy on Ubuntu/Debian.

## Overview

Nginx is a high-performance web server that juga berfungsi sebagai reverse proxy, load balancer, and HTTP cache. This guide covers instalasi, configuration virtual host, and setup SSL.

## Prerequisites

- Ubuntu 20.04 / 22.04 / Debian 11+
- Akses root or sudo
- Domain or IP publik

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

Check the status:

```bash
sudo systemctl status nginx
nginx -v
```

## Step 2 — Konfigurasi Virtual Host

Create a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/mysite.conf
```

Fill it with:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/mysite;
    index index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
    }

    access_log /var/log/nginx/mysite_access.log;
    error_log  /var/log/nginx/mysite_error.log;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 3 — Reverse Proxy

Konfigurasi Nginx as a reverse proxy to an app running on port 3000:

```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 4 — SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

Auto-renewal is already configured automatically. Test renew:

```bash
sudo certbot renew --dry-run
```

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| 502 Bad Gateway | Backend not jalan | Check the service on the target port |
| 403 Forbidden | Permission file salah | `chmod -R 755 /var/www/mysite` |
| Config error | Syntax salah | Run `nginx -t` |
| Port 80 ditolak | Firewall block | `ufw allow 'Nginx Full'` |
