# SSH — Linux

> Konfigurasi **OpenSSH Server** for secure remote access, termasuk key-based auth and hardening.

## Overview

SSH (Secure Shell) is an encrypted network protocol for remote server access. This guide covers instalasi, configuration keamanan, and SSH key setup.

## Prerequisites

- Ubuntu/Debian server
- Akses fisik or root untuk setup awal

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
```

Check which port is in use:

```bash
sudo ss -tlnp | grep sshd
```

## Step 2 — Konfigurasi Keamanan

Edit file configuration:

```bash
sudo nano /etc/ssh/sshd_config
```

Ubah/tambahkan pengaturan berikut:

```
# Ganti port default (opsional tapi recommended)
Port 2222

# Matikan login root
PermitRootLogin no

# Batasi login hanya ke user tertentu
AllowUsers deploy admin

# Matikan password auth (setelah SSH key terpasang)
PasswordAuthentication no
PubkeyAuthentication yes

# Timeout idle
ClientAliveInterval 300
ClientAliveCountMax 2

# Matikan X11 forwarding jika tidak perlu
X11Forwarding no
```

Restart SSH:

```bash
sudo systemctl restart ssh
```

## Step 3 — SSH Key Authentication

**Di komputer klien** (bukan server):

```bash
# Generate key pair
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key ke server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server_ip
```

Manual if ssh-copy-id not available:

```bash
# On the server
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Step 4 — SSH Config Client

Create `~/.ssh/config` on the client for a convenient alias:

```
Host myserver
    HostName 192.168.1.100
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

You can now connect with `ssh myserver`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Connection refused | SSH not running or wrong port | `sudo systemctl status ssh` |
| Permission denied (publickey) | Key is missing from authorized_keys | Check the contents of `~/.ssh/authorized_keys` |
| Too many auth failures | Too many key attempts | `ssh -o IdentitiesOnly=yes -i key user@host` |
| Host key verification failed | Server IP has changed | `ssh-keygen -R hostname` |
