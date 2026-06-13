# DHCP — Linux

> Setup **isc-dhcp-server** in Ubuntu/Debian for automatic IP distribution on local networks.

## Overview

DHCP Server automatically assigns IP addresses to devices on the network. ISC DHCP adalah implementasi most commonly used on Linux.

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install isc-dhcp-server -y
```

Specify the interface that will serve DHCP:

```bash
sudo nano /etc/default/isc-dhcp-server
```

```
INTERFACESv4="eth0"
```

## Step 2 — Konfigurasi DHCP

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

```
# Global settings
default-lease-time 600;
max-lease-time 7200;
authoritative;

# DNS options
option domain-name "lan.example.com";
option domain-name-servers 192.168.1.10, 8.8.8.8;

# Subnet definition
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.1.255;
}

# IP statis berdasarkan MAC address
host printer {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.1.50;
}
```

## Step 3 — Start and Verify

```bash
sudo systemctl enable isc-dhcp-server
sudo systemctl start isc-dhcp-server
sudo systemctl status isc-dhcp-server
```

View active leases:

```bash
cat /var/lib/dhcp/dhcpd.leases
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Service gagal start | Config error or wrong interface | `journalctl -u isc-dhcp-server` |
| Klien not dapat IP | Subnet mismatch | Cek subnet in dhcpd.conf |
| IP sudah habis | Range too small | Expand the `range` directive |
| Conflict with another DHCP server | Another DHCP server is present | Disable DHCP on your router |
