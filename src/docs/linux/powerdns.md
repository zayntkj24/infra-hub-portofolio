# Installasi PowerDNS

> Konfigurasi **PowerDNS** sebagai DNS Server in Ubuntu/Debian for local networks maupun publik.

## Overview

PowerDNS adalah perangkat lunak Domain Name System (DNS) open-source tingkat lanjut yang berfungsi untuk mengelola dan menerjemahkan nama domain ke alamat IP dengan cepat. Perangkat lunak ini sangat populer di kalangan penyedia layanan cloud, hosting, dan operator jaringan skala besar karena skalabilitas dan keamanannya.

## Step 1 — Update System

```bash
sudo apt update && sudo apt upgrade -y
```
Fungsi :
Memastikan sistem menggunakan paket terbaru, mendapatkan update keamanan, dan mengurangi kemungkinan konflik saat proses instalasi software seperti PowerDNS, MariaDB, atau Apache.

## Step 2 — Install paket curl dan git

```bash
sudo apt install curl git
```
Fungsi :
Menyiapkan tools yang dibutuhkan untuk mengambil repository, mengunduh file konfigurasi, atau melakukan instalasi software dari sumber eksternal seperti repository resmi PowerDNS.

## Step 3 — Menambah repository powerdns (Ubuntu 24.04)

```bash
echo "deb [signed-by=/etc/apt/keyrings/auth-51-pub.asc] http://repo.powerdns.com/ubuntu noble-auth-51 main" | sudo tee /etc/apt/sources.list.d/pdns.list
```
Fungsi: 
Menambahkan repository resmi PowerDNS ke daftar sumber paket APT Ubuntu agar sistem dapat menginstall dan mendapatkan update PowerDNS dari repository tersebut.

## Step 4 — Mengatur prioritas sumber paket APT

```bash
sudo mkdir -p /etc/apt/preferences.d/

cat <<EOF | sudo tee /etc/apt/preferences.d/auth-51
Package: pdns-*
Pin: origin repo.powerdns.com
Pin-Priority: 600
EOF
```

Fungsi: 
Membuat konfigurasi APT Pinning untuk memberikan prioritas lebih tinggi kepada paket PowerDNS yang berasal dari repository resmi repo.powerdns.com.

## Step 5 — Mendaftarkan repositori resmi PowerDNS

```bash
sudo install -d /etc/apt/keyrings
curl -fsSL https://repo.powerdns.com/FD380FBB-pub.asc | sudo tee /etc/apt/keyrings/auth-51-pub.asc
```

Fungsi:
Membuat direktori penyimpanan GPG key APT dan mengunduh kunci publik PowerDNS untuk memverifikasi keaslian paket dari repository resmi PowerDNS.

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

## Step 9 — Membuat database di mariadb-server

```bash
sudo mysql -u root
```

Buat database

```bash
CREATE DATABASE powerdns;
```

Buat username dan password

```bash
CREATE USER 'powerdns'@'localhost' IDENTIFIED BY 'AbelXO';
```

Beri hak akses control

```bash
GRANT ALL PRIVILEGES ON powerdns.* TO 'powerdns'@'localhost';
```

Memperbarui (refresh) hak akses

```bash
FLUSH PRIVILEGES;
```

Keluar dari mariadb

```bash
EXIT;
```

## Step 10 - Memasukkan (import) struktur tabel

```bash
sudo mysql powerdns < /usr/share/doc/pdns-backend-mysql/schema.mysql.sql
```

## Step 11 - Mengkonfigurasi file **/etc/powerdns/pdns.conf**

```bash
sudo nano /etc/powerdns/pdns.conf
```

Isi konfigurasi

```bash
launch=gmysql

gmysql-host=127.0.0.1
gmysql-port=3306
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=AbelXO
```
