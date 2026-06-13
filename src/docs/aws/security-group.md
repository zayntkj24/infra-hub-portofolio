# Security Group — AWS

> Configuration guide for **SECURITY GROUP** in Amazon Web Services.

## Overview

This guide covers setup and configuration security group in AWS for production environments.

## Prerequisites

- AWS Account with permissions that cukup
- AWS CLI terinstal and configured
- VPC that sudah available

## Step 1 — Persiapan

Make sure AWS CLI is configured:

```bash
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: ap-southeast-1
# Default output: json
```

## Step 2 — Konfigurasi

Buat resource via AWS Console or CLI as needed environment.

```bash
# Verify resource yang ada
aws ec2 describe-vpcs --query 'Vpcs[*].{ID:VpcId,CIDR:CidrBlock,Name:Tags[?Key==`Name`]|[0].Value}'
```

## Step 3 — Verify

```bash
# Cek status resource
aws ec2 describe-instances --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name}'
```

> **Note:** Always tag AWS resources with name, environment (prod/staging/dev), and owner for easier management.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Access Denied | Insufficient IAM policy | Review and update the IAM policy |
| Resource limit | AWS quota exceeded | Request a limit increase via AWS Support |
| Config not apply | Wrong region | Set the correct region in the CLI |
