# Installasi PowerDNS

> Konfigurasi **PowerDNS** sebagai DNS Server in Ubuntu/Debian for local networks maupun publik.

## Overview

PowerDNS adalah perangkat lunak Domain Name System (DNS) open-source tingkat lanjut yang berfungsi untuk mengelola dan menerjemahkan nama domain ke alamat IP dengan cepat. Perangkat lunak ini sangat populer di kalangan penyedia layanan cloud, hosting, dan operator jaringan skala besar karena skalabilitas dan keamanannya.

## Step 1 — Update System

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2 — Install paket curl dan git

```bash
sudo apt install curl git
```

## Step 3 — Menambah repository powerdns (Ubuntu 24.04)

```bash
echo "deb [signed-by=/etc/apt/keyrings/auth-51-pub.asc] http://repo.powerdns.com/ubuntu noble-auth-51 main" | sudo tee /etc/apt/sources.list.d/pdns.list
```

## Step 4 — Mengatur prioritas sumber paket APT

```bash
sudo mkdir -p /etc/apt/preferences.d/

cat <<EOF | sudo tee /etc/apt/preferences.d/auth-51
Package: pdns-*
Pin: origin repo.powerdns.com
Pin-Priority: 600
EOF
```

## Step 5 — Mendaftarkan repositori resmi PowerDNS

```bash
sudo install -d /etc/apt/keyrings
curl -fsSL https://repo.powerdns.com/FD380FBB-pub.asc | sudo tee /etc/apt/keyrings/auth-51-pub.asc
```

## Step 6 — Install Mysql Server (mariadb)

```bash
sudo apt install mariadb-server
```

## Step 7 — Install PowerDNS

```bash
sudo apt install pdns-server pdns-backend-mysql
```
#

## Step 8 — Install Apache dan php library

```bash
sudo apt install apache2 php php-mysql php-intl php-xml php-mbstring libapache2-mod-php -y
```

## Step 9 — Install Apache dan php library
