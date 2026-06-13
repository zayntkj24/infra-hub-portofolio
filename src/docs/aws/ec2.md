# EC2 — AWS

> Guide to creating and configuring **EC2 Instance** in AWS termasuk security group and key pair.

## Overview

Amazon EC2 (Elastic Compute Cloud) menyediakan virtual server in cloud. Kamu bisa memilih OS, spesifikasi hardware, and network as needed.

## Step 1 — Buat Key Pair

```bash
# Buat key pair
aws ec2 create-key-pair \
  --key-name my-key \
  --query 'KeyMaterial' \
  --output text > my-key.pem

chmod 400 my-key.pem
```

## Step 2 — Buat Security Group

```bash
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Web server security group" \
  --vpc-id vpc-XXXXXX

# Allow SSH dari IP kamu
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXXX \
  --protocol tcp --port 22 \
  --cidr YOUR_IP/32

# Allow HTTP dan HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXXX \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXXX \
  --protocol tcp --port 443 --cidr 0.0.0.0/0
```

## Step 3 — Launch Instance

```bash
aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --instance-type t3.micro \
  --key-name my-key \
  --security-group-ids sg-XXXXXX \
  --subnet-id subnet-XXXXXX \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-server}]'
```

## Step 4 — Connect to Instance

```bash
# Wait for instance to be running
aws ec2 wait instance-running --instance-ids i-XXXXXX

# Get the public IP
aws ec2 describe-instances \
  --instance-ids i-XXXXXX \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text

# SSH
ssh -i my-key.pem ubuntu@PUBLIC_IP
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Connection timeout | Security group is blocking port 22 | Check inbound rules on the Security Group |
| Permission denied (publickey) | Wrong key pair | Ensure you're using the correct .pem file |
| Instance unreachable | No public IP assigned | Enable auto-assign public IP |
| High CPU usage | Instance type is too small | Upgrade the instance type |
