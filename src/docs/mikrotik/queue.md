# Queue — Mikrotik

> Konfigurasi **Queue** in MikroTik untuk manajemen bandwidth and Quality of Service (QoS).

## Overview

MikroTik Queue controls bandwidth used by each user or network. There are two types: Simple Queue and Queue Tree.

## Simple Queue

Cara paling mudah untuk membatasi bandwidth per IP:

```routeros
# Limit 1 IP ke 5Mbps download / 2Mbps upload
/queue simple add name=user-PC1 target=192.168.1.100/32 max-limit=5M/2M

# Limit seluruh subnet
/queue simple add name=lan-queue target=192.168.1.0/24 max-limit=50M/20M
```

## Queue Tree with PCQ (Per-Connection Queue)

Lebih adil — bandwidth dibagi rata antar user:

```routeros
# Create PCQ queue types for download and upload
/queue type add name=pcq-download kind=pcq pcq-classifier=dst-address
/queue type add name=pcq-upload kind=pcq pcq-classifier=src-address

# Tandai koneksi
/ip firewall mangle
add action=mark-packet chain=forward new-packet-mark=download-traffic out-interface=ether2 passthrough=no
add action=mark-packet chain=forward new-packet-mark=upload-traffic in-interface=ether2 passthrough=no

# Buat queue tree
/queue tree
add name=total-download parent=ether2 max-limit=100M
add name=pcq-dl packet-mark=download-traffic parent=total-download queue=pcq-download

add name=total-upload parent=ether1 max-limit=50M
add name=pcq-ul packet-mark=upload-traffic parent=total-upload queue=pcq-upload
```

## Burst untuk Kecepatan Awal Tinggi

```routeros
/queue simple
add name=user-burst target=192.168.1.100/32 \
  max-limit=2M/1M \
  burst-limit=8M/4M \
  burst-threshold=1M/512k \
  burst-time=10s/10s
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Queue not aktif | Target IP is incorrect | Cek target in queue simple |
| Speed is still not limited | Queue order is wrong | Check the queue priority |
| Semua user kena limit | PCQ classifier is incorrect | Cek pcq-classifier setting |
