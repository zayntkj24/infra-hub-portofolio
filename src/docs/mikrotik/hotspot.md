# Hotspot — Mikrotik

> Konfigurasi **Hotspot** in MikroTik RouterOS untuk captive portal WiFi with login page.

## Overview

MikroTik Hotspot membuat captive portal in mana pengguna harus login before bisa mengakses internet. Cocok untuk cafe, hotel, or kantor.

## Step 1 — Persiapan Interface

```routeros
# Pastikan interface LAN/WiFi sudah punya IP
/ip address add address=192.168.2.1/24 interface=ether2

# Buat DHCP pool untuk hotspot
/ip pool add name=hotspot-pool ranges=192.168.2.10-192.168.2.200

# Setup DHCP Server
/ip dhcp-server add address-pool=hotspot-pool disabled=no interface=ether2 name=hotspot-dhcp
/ip dhcp-server network add address=192.168.2.0/24 dns-server=8.8.8.8 gateway=192.168.2.1
```

## Step 2 — Setup Hotspot

```routeros
/ip hotspot setup
# Interface: ether2
# Local address: 192.168.2.1/24
# Masquerade: yes
# Pool: 192.168.2.10-192.168.2.200
# Certificate: none
# SMTP: (kosongkan)
# DNS: 8.8.8.8
# DNS name: hotspot.lan
# Admin username: admin
```

## Step 3 — User Profile

```routeros
# Buat profile dengan rate limit
/ip hotspot user profile add name=basic rate-limit=2M/2M session-timeout=8h idle-timeout=30m

/ip hotspot user profile add name=premium rate-limit=10M/10M session-timeout=24h

# Create a user
/ip hotspot user add name=user1 password=pass123 profile=basic
/ip hotspot user add name=vip password=vip123 profile=premium
```

## Step 4 — Walled Garden (Akses Tanpa Login)

```routeros
# Izinkan akses ke domain tertentu tanpa login
/ip hotspot walled-garden add dst-host=*.example.com action=allow
/ip hotspot walled-garden ip add dst-address=8.8.8.8 action=accept
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Login page not muncul | DNS redirect failed | Cek DNS in hotspot profile |
| User cannot log in | Password salah / user not aktif | Cek in `/ip hotspot user` |
| Internet lambat | Rate limit is too low | Edit profile rate-limit |
| Session logs out immediately | Session timeout terlalu pendek | Addkan session-timeout |
