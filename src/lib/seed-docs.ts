// Built-in starter documentation. Each subcategory has its own source file.
// Admin-created docs in Supabase override these by (category, slug).
//
// Files are imported with Vite's ?raw suffix → plain string at build time.
// To edit content: open src/docs/<category>/<slug>.md

import { CATEGORIES, slugify } from "./docs-catalog";

// ── Linux ──────────────────────────────────────────────────────────────────
import nginxMd          from "../docs/linux/nginx.md?raw";
import apacheMd         from "../docs/linux/apache.md?raw";
import sshMd            from "../docs/linux/ssh.md?raw";
import dockerMd         from "../docs/linux/docker.md?raw";
import sambaMd          from "../docs/linux/samba.md?raw";
import ftpMd            from "../docs/linux/ftp.md?raw";
import dnsMd            from "../docs/linux/dns.md?raw";
import dhcpLinuxMd      from "../docs/linux/dhcp.md?raw";
import monitoringMd     from "../docs/linux/monitoring.md?raw";
import firewallLinuxMd  from "../docs/linux/firewall.md?raw";

// ── AWS ───────────────────────────────────────────────────────────────────
import vpcMd            from "../docs/aws/vpc.md?raw";
import ec2Md            from "../docs/aws/ec2.md?raw";
import rdsMd            from "../docs/aws/rds.md?raw";
import iamMd            from "../docs/aws/iam.md?raw";
import routeTableMd     from "../docs/aws/route-table.md?raw";
import natGatewayMd     from "../docs/aws/nat-gateway.md?raw";
import internetGwMd     from "../docs/aws/internet-gateway.md?raw";
import securityGroupMd  from "../docs/aws/security-group.md?raw";
import s3Md             from "../docs/aws/s3.md?raw";
import lbMd             from "../docs/aws/load-balancer.md?raw";
import cloudwatchMd     from "../docs/aws/cloudwatch.md?raw";

// ── MikroTik ──────────────────────────────────────────────────────────────
import hotspotMd        from "../docs/mikrotik/hotspot.md?raw";
import queueMd          from "../docs/mikrotik/queue.md?raw";
import firewallMkMd     from "../docs/mikrotik/firewall.md?raw";
import natMkMd          from "../docs/mikrotik/nat.md?raw";
import vlanMkMd         from "../docs/mikrotik/vlan.md?raw";
import routingMkMd      from "../docs/mikrotik/routing.md?raw";
import wirelessMd       from "../docs/mikrotik/wireless.md?raw";
import pppoeMd          from "../docs/mikrotik/pppoe.md?raw";
import bridgeMd         from "../docs/mikrotik/bridge.md?raw";
import dhcpServerMd     from "../docs/mikrotik/dhcp-server.md?raw";

// ── Cisco ─────────────────────────────────────────────────────────────────
import dhcpCiscoMd      from "../docs/cisco/dhcp.md?raw";
import staticRoutingMd  from "../docs/cisco/static-routing.md?raw";
import ospfMd           from "../docs/cisco/ospf.md?raw";
import vlanCiscoMd      from "../docs/cisco/vlan.md?raw";
import trunkMd          from "../docs/cisco/trunk.md?raw";
import aclMd            from "../docs/cisco/acl.md?raw";
import natCiscoMd       from "../docs/cisco/nat.md?raw";
import switchConfigMd   from "../docs/cisco/switch-configuration.md?raw";
import routerConfigMd   from "../docs/cisco/router-configuration.md?raw";

export interface SeedDoc {
  category: string;
  subcategory: string;
  slug: string;
  title: string;
  description: string;
  body_md: string;
}

// Map: "category/slug" → markdown string
const DOC_MAP: Record<string, string> = {
  // Linux
  "linux/nginx":      nginxMd,
  "linux/apache":     apacheMd,
  "linux/ssh":        sshMd,
  "linux/docker":     dockerMd,
  "linux/samba":      sambaMd,
  "linux/ftp":        ftpMd,
  "linux/dns":        dnsMd,
  "linux/dhcp":       dhcpLinuxMd,
  "linux/monitoring": monitoringMd,
  "linux/firewall":   firewallLinuxMd,

  // AWS
  "aws/vpc":              vpcMd,
  "aws/ec2":              ec2Md,
  "aws/rds":              rdsMd,
  "aws/iam":              iamMd,
  "aws/route-table":      routeTableMd,
  "aws/nat-gateway":      natGatewayMd,
  "aws/internet-gateway": internetGwMd,
  "aws/security-group":   securityGroupMd,
  "aws/s3":               s3Md,
  "aws/load-balancer":    lbMd,
  "aws/cloudwatch":       cloudwatchMd,

  // MikroTik
  "mikrotik/hotspot":     hotspotMd,
  "mikrotik/queue":       queueMd,
  "mikrotik/firewall":    firewallMkMd,
  "mikrotik/nat":         natMkMd,
  "mikrotik/vlan":        vlanMkMd,
  "mikrotik/routing":     routingMkMd,
  "mikrotik/wireless":    wirelessMd,
  "mikrotik/pppoe":       pppoeMd,
  "mikrotik/bridge":      bridgeMd,
  "mikrotik/dhcp-server": dhcpServerMd,

  // Cisco
  "cisco/dhcp":                 dhcpCiscoMd,
  "cisco/static-routing":       staticRoutingMd,
  "cisco/ospf":                 ospfMd,
  "cisco/vlan":                 vlanCiscoMd,
  "cisco/trunk":                trunkMd,
  "cisco/acl":                  aclMd,
  "cisco/nat":                  natCiscoMd,
  "cisco/switch-configuration": switchConfigMd,
  "cisco/router-configuration": routerConfigMd,
};

/** Derive title and description from the markdown body */
function parseMeta(body: string): { title: string; description: string } {
  const lines = body.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : "Untitled";

  // First non-empty line that isn't a heading or blockquote arrow
  const desc =
    lines
      .slice(1)
      .find((l) => l.trim() && !l.startsWith("#") && !l.startsWith(">"))
      ?.trim() ?? "";

  return { title, description: desc };
}

export const SEED_DOCS: SeedDoc[] = CATEGORIES.flatMap((cat) =>
  cat.subcategories.map<SeedDoc>((sub) => {
    const slug = slugify(sub);
    const key = `${cat.slug}/${slug}`;
    const body_md = DOC_MAP[key] ?? `# ${sub}\n\nDokumentasi belum tersedia.`;
    const { title, description } = parseMeta(body_md);
    return { category: cat.slug, subcategory: sub, slug, title, description, body_md };
  }),
);

export function getSeedDoc(category: string, slug: string): SeedDoc | undefined {
  return SEED_DOCS.find((d) => d.category === category && d.slug === slug);
}
