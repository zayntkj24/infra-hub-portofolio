# Firewall — Linux

> Konfigurasi **UFW** and **iptables** untuk mengamankan server Linux from akses that not diinginkan.

## Overview

Linux memiliki dua tools firewall utama: UFW (Uncomplicated Firewall) that user-friendly, and iptables that more powerful. UFW sebenarnya adalah frontend untuk iptables.

## UFW — Setup Dasar

### Install and Enable

```bash
sudo apt install ufw -y

# Set default policy
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Izinkan SSH dulu SEBELUM enable
sudo ufw allow ssh
# or if you changed the port:
sudo ufw allow 2222/tcp
```

> **Warning:** Make sure to allow SSH **before** enabling UFW, or you will lock yourself out.

### Enable and Cek Status

```bash
sudo ufw enable
sudo ufw status verbose
```

### Rules Umum

```bash
# Web server
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Izinkan dari IP tertentu saja
sudo ufw allow from 192.168.1.0/24 to any port 3306

# Blokir IP
sudo ufw deny from 203.0.113.100

# Hapus rule
sudo ufw delete allow 80/tcp

# Reset semua rules
sudo ufw reset
```

## iptables — Konfigurasi Dasar

```bash
# Lihat rules yang aktif
sudo iptables -L -v -n --line-numbers

# Flush semua rules
sudo iptables -F

# Allow established connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Allow SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP dan HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop semua yang lain
sudo iptables -A INPUT -j DROP
```

### Simpan Rules iptables

```bash
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Locked out of the server | SSH is blocked | Use the physical console and reset UFW |
| Service is unreachable | Port tertutup | `sudo ufw allow PORT` |
| Rules lost after reboot | Rules not persisted | `sudo netfilter-persistent save` |
| UFW is inactive | Not yet enabled | `sudo ufw enable` |
