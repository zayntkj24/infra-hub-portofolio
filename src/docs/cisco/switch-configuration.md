# Switch Configuration — Cisco

> Konfigurasi **SWITCH CONFIGURATION** in Cisco IOS.

## Overview

Step-by-step guide for configuring switch configuration in Cisco IOS router and switch.

## Prerequisites

- Cisco router or switch with IOS
- Akses console or SSH
- Hak akses enable/privileged EXEC

## Mode Konfigurasi

```cisco
! Enter privileged EXEC mode
Router> enable
Router# 

! Enter global configuration mode
Router# configure terminal
Router(config)#
```

## Konfigurasi

```cisco
! Save configuration before you begin
Router# copy running-config startup-config
```

## Step 1 — Setup

```cisco
! Konfigurasi switch configuration
Router(config)# hostname MyRouter

! Verify
Router# show running-config
Router# show interfaces
```

> **Note:** Always save the configuration after changes with `copy running-config startup-config`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Command not found | Wrong CLI mode | Ensure you are in the correct mode |
| Configuration lost after reboot | Not saved | `copy run start` |
| Interface is down | Missing `no shutdown` command | `Router(config-if)# no shutdown` |
