# DNS — Linux

> Konfigurasi **BIND9** sebagai DNS Server in Ubuntu/Debian for local networks maupun publik.

## Overview

BIND9 adalah implementasi DNS paling banyak used. This guide covers setup DNS resolver and authoritative DNS untuk domain internal.

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc -y
sudo systemctl enable named
```

## Step 2 — Konfigurasi DNS Resolver Lokal

Edit `/etc/bind/named.conf.options`:

```bash
sudo nano /etc/bind/named.conf.options
```

```
options {
    directory "/var/cache/bind";

    # Izinkan query dari jaringan lokal
    allow-query { localhost; 192.168.1.0/24; };

    # Forwarders ke DNS publik
    forwarders {
        8.8.8.8;
        8.8.4.4;
        1.1.1.1;
    };

    forward only;
    dnssec-validation auto;
    listen-on { any; };
};
```

## Step 3 — Zona DNS Internal

Add a zone to `/etc/bind/named.conf.local`:

```
zone "lan.example.com" {
    type master;
    file "/etc/bind/zones/db.lan.example.com";
};

zone "1.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/zones/db.192.168.1";
};
```

Buat file zona forward:

```bash
sudo mkdir -p /etc/bind/zones
sudo nano /etc/bind/zones/db.lan.example.com
```

```dns
$TTL    604800
@       IN  SOA ns1.lan.example.com. admin.lan.example.com. (
                2024010101  ; Serial
                604800      ; Refresh
                86400       ; Retry
                2419200     ; Expire
                604800 )    ; Negative Cache TTL

@       IN  NS  ns1.lan.example.com.
ns1     IN  A   192.168.1.10
server1 IN  A   192.168.1.20
router  IN  A   192.168.1.1
```

## Step 4 — Restart and Test

```bash
sudo named-checkconf
sudo named-checkzone lan.example.com /etc/bind/zones/db.lan.example.com
sudo systemctl restart named

# Test
dig @192.168.1.10 server1.lan.example.com
nslookup server1.lan.example.com 192.168.1.10
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| SERVFAIL | Zone configuration is incorrect | `named-checkzone` |
| REFUSED | IP is not in allow-query | Addkan IP to `allow-query` |
| Service gagal start | Syntax error | `named-checkconf` |
| NXDOMAIN | Record does not exist | Check the contents of file zona |
