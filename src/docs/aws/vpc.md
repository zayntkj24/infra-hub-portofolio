# VPC — AWS

> Guide to creating and configuring **Virtual Private Cloud (VPC)** in AWS untuk isolasi network.

## Overview

VPC is an isolated virtual network within the AWS cloud. All AWS resources (EC2, RDS, etc.) must reside within a VPC.

## Arsitektur that Direkomendasikan

```
VPC: 10.0.0.0/16
├── Public Subnet  10.0.1.0/24  (us-east-1a) → Internet Gateway
├── Public Subnet  10.0.2.0/24  (us-east-1b) → Internet Gateway
├── Private Subnet 10.0.10.0/24 (us-east-1a) → NAT Gateway
└── Private Subnet 10.0.20.0/24 (us-east-1b) → NAT Gateway
```

## Step 1 — Buat VPC

Di AWS Console → VPC → Create VPC:

```
Name: prod-vpc
IPv4 CIDR: 10.0.0.0/16
Tenancy: Default
```

Atau via AWS CLI:

```bash
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc}]'
```

## Step 2 — Buat Subnets

```bash
# Public subnet - AZ 1
aws ec2 create-subnet \
  --vpc-id vpc-XXXXXX \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-1a}]'

# Private subnet - AZ 1
aws ec2 create-subnet \
  --vpc-id vpc-XXXXXX \
  --cidr-block 10.0.10.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-1a}]'
```

## Step 3 — Internet Gateway

```bash
# Buat IGW
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-igw}]'

# Attach ke VPC
aws ec2 attach-internet-gateway \
  --internet-gateway-id igw-XXXXXX \
  --vpc-id vpc-XXXXXX
```

## Step 4 — Route Tables

```bash
# Public route table
aws ec2 create-route-table --vpc-id vpc-XXXXXX
aws ec2 create-route \
  --route-table-id rtb-XXXXXX \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id igw-XXXXXX

# Associate dengan public subnet
aws ec2 associate-route-table \
  --route-table-id rtb-XXXXXX \
  --subnet-id subnet-XXXXXX
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| EC2 cannot reach the internet | Route table has no default route | Addkan 0.0.0.0/0 to IGW |
| Private subnet has no outbound access | NAT Gateway is not configured | Set up a NAT Gateway in the public subnet |
| Subnet overlap | CIDR conflict | Choose a non-overlapping CIDR |
