# Apache — Linux

> Configuration guide for **Apache HTTP Server** in Ubuntu/Debian termasuk virtual host and modul.

## Overview

Apache is the most popular open-source web server in the world. Mendukung banyak modul untuk PHP, SSL, proxy, and lainnya.

## Prerequisites

- Ubuntu 20.04 / 22.04 / Debian 11+
- Akses root or sudo

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2
```

Open firewall ports:

```bash
sudo ufw allow 'Apache Full'
sudo ufw status
```

## Step 2 — Virtual Host

```bash
sudo mkdir -p /var/www/example.com/public_html
sudo chown -R $USER:$USER /var/www/example.com/public_html
sudo nano /etc/apache2/sites-available/example.com.conf
```

Add the following configuration:

```apache
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/example.com/public_html
    ErrorLog ${APACHE_LOG_DIR}/example_error.log
    CustomLog ${APACHE_LOG_DIR}/example_access.log combined

    <Directory /var/www/example.com/public_html>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Aktifkan:

```bash
sudo a2ensite example.com.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## Step 3 — Modul Penting

Enable modul that sering dipakai:

```bash
# Rewrite (untuk .htaccess)
sudo a2enmod rewrite

# SSL
sudo a2enmod ssl

# Headers
sudo a2enmod headers

# Proxy (untuk reverse proxy)
sudo a2enmod proxy proxy_http

sudo systemctl restart apache2
```

## Step 4 — SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d example.com -d www.example.com
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| AH00558 warning | ServerName not in-set | Addkan `ServerName` in apache2.conf |
| 403 Forbidden | Permission salah | `chmod 755` on direktori web |
| .htaccess not aktif | mod_rewrite off | `sudo a2enmod rewrite` |
| Port sudah dipakai | Nginx / service lain jalan | `sudo lsof -i :80` |
