# FTP — Linux

> Setup **vsftpd** (Very Secure FTP Daemon) in Linux for file transfer via FTP/FTPS.

## Overview

vsftpd is a lightweight and secure FTP server. This guide configures FTP with user isolation and optional FTPS (FTP over SSL).

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install vsftpd -y
sudo systemctl enable vsftpd
```

Backup configuration:

```bash
sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak
```

## Step 2 — Konfigurasi vsftpd

```bash
sudo nano /etc/vsftpd.conf
```

Konfigurasi that recommended:

```ini
# Izinkan koneksi lokal dan tulis
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022

# Chroot user ke home directory
chroot_local_user=YES
allow_writeable_chroot=YES

# Passive mode (penting untuk firewall)
pasv_enable=YES
pasv_min_port=10000
pasv_max_port=10100
pasv_address=YOUR_SERVER_IP

# Logging
xferlog_enable=YES
xferlog_file=/var/log/vsftpd.log

# Batasi ke user tertentu
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO
```

## Step 3 — Create an FTP User

```bash
# Create a user khusus FTP
sudo useradd -m ftpuser -s /bin/bash
sudo passwd ftpuser

# Add to the allowed users list
echo "ftpuser" | sudo tee -a /etc/vsftpd.userlist

# Buat folder dan atur permission
sudo mkdir -p /home/ftpuser/files
sudo chown ftpuser:ftpuser /home/ftpuser/files
```

## Step 4 — Firewall and Restart

```bash
sudo ufw allow 20/tcp
sudo ufw allow 21/tcp
sudo ufw allow 10000:10100/tcp
sudo systemctl restart vsftpd
```

## Step 5 — FTPS (FTP over SSL)

```bash
# Generate self-signed cert
sudo openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout /etc/ssl/private/vsftpd.key \
  -out /etc/ssl/certs/vsftpd.crt
```

Add to vsftpd.conf:

```ini
ssl_enable=YES
rsa_cert_file=/etc/ssl/certs/vsftpd.crt
rsa_private_key_file=/etc/ssl/private/vsftpd.key
force_local_data_ssl=YES
force_local_logins_ssl=YES
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| 530 Login incorrect | User is not in the userlist | Cek `/etc/vsftpd.userlist` |
| 500 OOPS: chroot | Permissions issue | Set `allow_writeable_chroot=YES` |
| Connection timeout | Passive port tertutup | Open ports 10000–10100 in your firewall |
| 227 Entering Passive | Wrong IP in pasv_address | Set the server's public IP |
