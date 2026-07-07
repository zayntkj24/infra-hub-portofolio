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
Fungsi : 
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

Fungsi : 
Membuat konfigurasi APT Pinning untuk memberikan prioritas lebih tinggi kepada paket PowerDNS yang berasal dari repository resmi repo.powerdns.com.

## Step 5 — Mendaftarkan repositori resmi PowerDNS

```bash
sudo install -d /etc/apt/keyrings
curl -fsSL https://repo.powerdns.com/FD380FBB-pub.asc | sudo tee /etc/apt/keyrings/auth-51-pub.asc
```

Fungsi :
Membuat direktori penyimpanan GPG key APT dan mengunduh kunci publik PowerDNS untuk memverifikasi keaslian paket dari repository resmi PowerDNS.

## Step 6 — Install Mysql Server (mariadb)

```bash
sudo apt install mariadb-server
```

Fungsi :
Sebagai sistem manajemen basis data relasional (RDBMS) yang mengelola, menyimpan, dan menyajikan data terstruktur dalam jumlah besar

## Step 7 — Install PowerDNS

```bash
sudo apt install pdns-server pdns-backend-mysql
```
Fungsi :
Menginstal aplikasi PowerDNS dan modul penghubungnya ke database MySQL/MariaDB di sistem operasi berbasis Ubuntu.

## Step 8 — Install Apache dan php library

```bash
sudo apt install apache2 php php-mysql php-intl php-xml php-mbstring libapache2-mod-php -y
```

Fungsi :
Menginstal LAMP Stack (Linux, Apache, PHP) versi standar tanpa database servernya

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

Fungsi : 
Memasukkan struktur tabel default PowerDNS ke dalam database MySQL bernama powerdns

## Step 11 - Mengkonfigurasi file **/etc/powerdns/pdns.conf**

```bash
sudo nano /etc/powerdns/pdns.conf
```

Lalu klik shortcut CTRL+W lalu cari kata launch, setelah itu Enter

```bash
launch=gmysql

gmysql-host=127.0.0.1
gmysql-port=3306
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=AbelXO
```

## Step 12 - Mengkonfigurasi file konfigurasi layanan systemd-resolved

```bash
sudo nano /etc/systemd/resolved.conf
```
```bash
Uncomment #DNSStubListener=yes
menjadi DNSStubListener=yes

dan juga ubah DNSStubListener=yes
menjadi DNSStubListener=no
```

## Step 13 - Restart layanan systemd-resolved

```bash
sudo systemctl restart systemd-resolved
```

## Step 14 - Restart dan cek status layanan powerdns

```bash
sudo systemctl restart pdns
sudo systemctl status pdns
```

Log status powerdns harus Running

```bash
● pdns.service - PowerDNS Authoritative Server
     Loaded: loaded (/usr/lib/systemd/system/pdns.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-07-06 22:13:09 UTC; 2h 2min ago
       Docs: man:pdns_server(1)
             man:pdns_control(1)
             https://doc.powerdns.com
   Main PID: 23004 (pdns_server)
      Tasks: 8 (limit: 2205)
     Memory: 46.8M (peak: 47.2M)
        CPU: 514ms
     CGroup: /system.slice/pdns.service
             └─23004 /usr/sbin/pdns_server --guardian=no --daemon=no --disable-syslog --log-timestamp=no --write-pid>

Jul 06 22:13:09 powerdns pdns_server[23004]: PowerDNS Authoritative Server 5.1.3 (C) PowerDNS.COM BV
Jul 06 22:13:09 powerdns pdns_server[23004]: Using 64-bits mode. Built using gcc 13.3.0 on Jun 29 2026 17:44:07 by r>
Jul 06 22:13:09 powerdns pdns_server[23004]: PowerDNS comes with ABSOLUTELY NO WARRANTY. This is free software, and >
Jul 06 22:13:09 powerdns pdns_server[23004]: Polled security status of version 5.1.3 at startup, no known issues rep>
Jul 06 22:13:09 powerdns pdns_server[23004]: [bindbackend] Parsing 0 domain(s), will report when done
Jul 06 22:13:09 powerdns pdns_server[23004]: [bindbackend] Done parsing domains, 0 rejected, 0 new, 0 removed
Jul 06 22:13:09 powerdns pdns_server[23004]: Creating backend connection for TCP
Jul 06 22:13:09 powerdns pdns_server[23004]: About to create 3 backend threads for UDP
Jul 06 22:13:09 powerdns systemd[1]: Started pdns.service - PowerDNS Authoritative Server.
Jul 06 22:13:09 powerdns pdns_server[23004]: Done launching threads, ready to distribute questions
```

## Step 15 - Masuk direktori /var/www/html

```bash
cd /var/www/html
```

Lalu clone repository Poweradmin dari github

```bash
sudo git clone https://github.com/poweradmin/poweradmin.git
```

```bash
Cloning into 'poweradmin'...
remote: Enumerating objects: 109430, done.
remote: Counting objects: 100% (313/313), done.
remote: Compressing objects: 100% (69/69), done.
remote: Total 109430 (delta 285), reused 244 (delta 244), pack-reused 109117 (from 2)
Receiving objects: 100% (109430/109430), 243.04 MiB | 4.10 MiB/s, done.
Resolving deltas: 100% (68501/68501), done.
Updating files: 100% (10273/10273), done.
```

## Step 16 - Mengatur hak kepemilikan dan hak akses file web Poweradmin

```bash
sudo chown -R www-data:www-data /var/www/html/poweradmin
sudo chmod -R 755 /var/www/html/poweradmin
```

dan restart layanan apache2

```bash
sudo systemctl restart apache2
```

## Step 17 - Mengsetup Poweradmin di web browser
Buka web browser Edge dan ketik **http://192.168.220.128/poweradmin/**

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/1pdns.png)

Memilih bahasa utama poweradmin, pilih bahasa Indonesia

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/2pdns.png)

System requirement poweradmin

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/3pdns.png)

Jika pada saat setup Poweradmin di web browser muncul error atau peringatan seperti ini:
> **mod rewrite : Not Detected - Required for URL routing**

Ikuti langkah-langkah berikut untuk mengaktifkannya di server Apache:

Aktifkan modul rewrite di Apache

Jalankan perintah ini di terminal untuk mengaktifkan modul `mod_rewrite`:

```bash
sudo a2enmod rewrite
```

Mengubah konfigurasi AllowOverride Apache2 file /etc/apache2/apache2.conf

```bash
sudo nano /etc/apache2/apache2.conf
```

Ubah bagian AllowOverride none

```bash
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride none
        Require all granted
</Directory>
```

menjadi AllowOverride All

```bash
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>
```

Lalu Save file
**CTRL+X**

```bash
 Save modified buffer?                                                                                                
 Y Yes
 N No           C Cancel
```
 
> Klik Tombol Y dan enter

Mengkonfigurasi koneksi database

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/4pdns.png)

> Untuk mengisi database, perlu disesuaikan dengan pembuatan database powerdns pada sebelumnya!

```bash
Database type              : Pilih opsi MySQL
Nama Pengguna              : powerdns
DBSSEC dinonaktifkan       : AbelXO
Nama Host                  : localhost
DB Port                    : 3306
Basis Data                 : powerdns

Poweradmin Account
Administrator password     : Nanda_123 (untuk login web poweradmin)
```

Setup akun dan domain

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/5pdns.png)

> Setup database untuk poweradmin sebagai berikut!

```bash
Database User
Nama Pengguna              : poweradmin
DBSSEC dinonaktifkan       : NandaPower_123

DNS Settings
Hostmaster                 : www.nanda24.com
Primary nameserver         : dns1.nanda24.com
Secondary nameserver       : dns2.nanda24.com
```

Konfigurasi dan menambah database poweradmin

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/6pdns.png)

Masukan perintah

```bash
sudo mysql -u root
```

```bash
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 159
Server version: 10.11.14-MariaDB-0ubuntu0.24.04.1 Ubuntu 24.04

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> CREATE USER 'poweradmin'@'localhost' IDENTIFIED BY 'NandaPower_123';
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> CREATE USER 'poweradmin'@'127.0.0.1' IDENTIFIED BY 'NandaPower_123';
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> GRANT SELECT, INSERT, UPDATE, DELETE ON powerdns.* TO 'poweradmin'@'localhost';
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> GRANT SELECT, INSERT, UPDATE, DELETE ON powerdns.* TO 'poweradmin'@'127.0.0.1';
Query OK, 0 rows affected (0.003 sec)

MariaDB [(none)]> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> EXIT;
Bye
```

Buat konfigurasi file settings.php

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/7pdns.png)

Masuk ke file poweradmin

```bash
cd /var/www/html/poweradmin
```

lalu edit dan tambah file settings.php di direktori config

```bash
sudo nano config/settings.php
```

Salin text pada kolom hitam diatas

```bash
<?php

/**
 * Poweradmin Settings Configuration File
 *
 * Generated by the installer on 2026-07-07 01:17:56
 */

return [
    /**
     * Database Settings
     */
    'database' => [
        'host' => 'localhost',
        'name' => 'powerdns',
        'user' => 'poweradmin',
        'password' => 'NandaPower_123',
        'type' => 'mysql',
    ],

    /**
     * Security Settings
     */
    'security' => [
        'session_key' => 'Zh2x8*N!bWUUc1fhR_)-5W!Okya3GtxCQU(I-7P)3UmojI',
    ],

    /**
     * Interface Settings
     */
    'interface' => [
        'language' => 'id_ID',
        'base_url_prefix' => '/poweradmin',  // Auto-detected subfolder deployment
    ],

    /**
     * DNS Settings
     */
    'dns' => [
        'hostmaster' => 'www.nanda24.com',
        'ns1' => 'dns1.nanda24.com',
        'ns2' => 'dns2.nanda24.com',
    ],
];
```

Lalu Save file
**CTRL+X**

```bash
 Save modified buffer?                                                                                                
 Y Yes
 N No           C Cancel
```
 
> Klik Tombol Y dan enter

Installasi selesai dan hapus direktori install

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/8pdns.png)

> Pastikan sudah masuk direktori poweradmin!
masukan perintah untuk menghapus direktori install

```bash
sudo rm -rf install
```

Refresh browser dan masuk ke **http://192.168.220.128/poweradmin/**

![PowerDNS Web Setup](https://raw.githubusercontent.com/zayntkj24/infra-hub-portofolio/main/public/9(1)pdns.png)

