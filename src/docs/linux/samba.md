# Samba — Linux

> Konfigurasi **Samba** for sharing files between Linux and Windows on the same network.

## Overview

Samba implements the SMB/CIFS protocol on Linux sehingga folder Linux bisa diakses from Windows, macOS, maupun Linux lainnya.

## Step 1 — Instalasi

```bash
sudo apt update
sudo apt install samba -y
sudo systemctl enable smbd nmbd
```

Back up the default configuration:

```bash
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
```

## Step 2 — Konfigurasi Share

Edit `/etc/samba/smb.conf`:

```bash
sudo nano /etc/samba/smb.conf
```

Append to the bottom of the file:

```ini
[global]
   workgroup = WORKGROUP
   server string = Samba Server
   security = user
   map to guest = bad user

# Share publik (tanpa password)
[Public]
   path = /srv/samba/public
   browseable = yes
   read only = no
   guest ok = yes
   create mask = 0664
   directory mask = 0775

# Share private (butuh login)
[Private]
   path = /srv/samba/private
   browseable = yes
   read only = no
   valid users = sambauser
   create mask = 0660
   directory mask = 0770
```

Create the directory and set permissions:

```bash
sudo mkdir -p /srv/samba/public /srv/samba/private
sudo chmod -R 0775 /srv/samba/public
sudo chmod -R 0770 /srv/samba/private
sudo chown -R nobody:nogroup /srv/samba/public
```

## Step 3 — Add User Samba

```bash
# User Linux harus ada dulu
sudo useradd -M -s /sbin/nologin sambauser

# Set password Samba
sudo smbpasswd -a sambauser
sudo smbpasswd -e sambauser
```

## Step 4 — Restart and Test

```bash
sudo testparm
sudo systemctl restart smbd nmbd

# Firewall
sudo ufw allow samba
```

Test from Linux:

```bash
smbclient //localhost/Public -U guest
smbclient //SERVER_IP/Private -U sambauser
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Share is not visible | nmbd is not running | `sudo systemctl start nmbd` |
| Access denied | Wrong password or user does not exist | `sudo smbpasswd -a username` |
| Unable to write | Directory permissions | `chmod 0775` on folder share |
| Windows not detect | Workgroup mismatch | Match the workgroup setting in smb.conf |
