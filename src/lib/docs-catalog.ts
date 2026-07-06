export type CategorySlug = "aws" | "linux" | "mikrotik" | "cisco";

export interface CategoryDef {
  slug: CategorySlug;
  name: string;
  tagline: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "linux",
    name: "Linux",
    tagline: "Server administration and services",
    subcategories: [
      "Nginx", "Apache", "SSH", "Docker", "Samba",
      "FTP", "DNS", "DHCP", "Monitoring", "Firewall",
    ],
  },
  {
    slug: "mikrotik",
    name: "Mikrotik",
    tagline: "RouterOS configuration and networking",
    subcategories: [
      "Hotspot", "Queue", "Firewall", "NAT", "VLAN",
      "Routing", "Wireless", "PPPoE", "Bridge", "DHCP Server",
    ],
  },
  {
    slug: "cisco",
    name: "Cisco",
    tagline: "IOS routing, switching and security",
    subcategories: [
      "DHCP", "Static Routing", "OSPF", "VLAN", "Trunk",
      "ACL", "NAT", "Switch Configuration", "Router Configuration",
    ],
  },
];

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findSubcategoryByDocSlug(category: CategoryDef, docSlug: string): string | undefined {
  return category.subcategories.find((sc) => slugify(sc) === docSlug);
}
