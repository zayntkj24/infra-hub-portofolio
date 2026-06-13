# Dhcp Server — Mikrotik

> Konfigurasi **DHCP SERVER** in MikroTik RouterOS.

## Overview

Practical guide for configuring dhcp server in MikroTik RouterOS for production networks.

## Prerequisites

- MikroTik with RouterOS v6.x / v7.x
- Akses to Winbox or SSH
- Interface sudah configured

## Konfigurasi Dasar

```routeros
# Check existing configuration
/system identity print
/interface print
/ip address print
```

## Step 1 — Setup

```routeros
# Konfigurasi as needed
/ip route print
/ip firewall filter print
```

> **Note:** Always back up configuration before making changes in network production.

```routeros
# Backup konfigurasi
/system backup save name=backup-before-dhcp_server
```

## Step 2 — Implementasi

```routeros
# Verify after configuration
/log print
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Config not apply | Syntax error | Check the logs at `/log print` |
| Traffic not melewati rule | Rule order salah | Check the rule order |
| Interface is down | Cable or hardware issue | Check the interface status |
