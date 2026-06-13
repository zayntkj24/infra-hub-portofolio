# Infra Hub — Documentation

> A self-hosted, admin-editable infrastructure knowledge base for sysadmins and cloud engineers.

## Purpose

Infra Hub is a centralized reference for the configuration procedures most commonly needed when managing infrastructure — without the noise of SEO-bloated tutorials. Every page is a direct, command-first guide that covers installation, configuration, and troubleshooting.

The goal is simple: open the sidebar, find the service, copy the command. No account required, no ads, no paywalls.

## Coverage

| Category | What's documented |
|---|---|
| **AWS** | VPC, EC2, RDS, IAM, NAT Gateway, Security Groups, S3, Load Balancer, CloudWatch |
| **Linux** | Nginx, Apache, SSH, Docker, Samba, FTP, DNS (BIND9), DHCP, Monitoring, Firewall |
| **MikroTik** | Hotspot, Queue, Firewall, NAT, VLAN, Routing, Wireless, PPPoE, Bridge, DHCP Server |
| **Cisco IOS** | DHCP, Static Routing, OSPF, VLAN, Trunk, ACL, NAT, Switch & Router Config |

## How to use

- Browse by category using the left sidebar
- Use **⌘K** (or Ctrl+K) to search across all topics
- Navigate between pages with the **Previous / Next** buttons at the bottom of each doc

## Admin

Admins can create, edit, and delete documentation entries via the `/admin` panel. Admin-created entries override the built-in seed docs for the same category and slug.

To access the admin panel, sign in with an account that has been granted the `admin` role in Supabase.

## Adding content

Built-in docs live in `src/docs/<category>/<slug>.md`. To add or edit a topic:

1. Open the corresponding `.md` file
2. Edit the markdown — headings, code blocks, and tables are fully supported
3. Save and the change is reflected immediately on the next build

For runtime edits without a redeploy, use the admin panel.
