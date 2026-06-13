# Monitoring — Linux

> Setup monitoring server Linux using **Prometheus + Grafana** and **Node Exporter**.

## Overview

Stack monitoring that umum used: Node Exporter for collecting metrics, Prometheus as a time-series database, and Grafana untuk visualisasi.

## Step 1 — Install Node Exporter

Di every server you want to monitor:

```bash
# Download Node Exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvf node_exporter-1.7.0.linux-amd64.tar.gz
sudo mv node_exporter-1.7.0.linux-amd64/node_exporter /usr/local/bin/

# Create a service unit
sudo useradd --no-create-home --shell /bin/false node_exporter
sudo nano /etc/systemd/system/node_exporter.service
```

```ini
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

Node Exporter runs on port **9100**.

## Step 2 — Install Prometheus

On the monitoring server:

```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.49.0/prometheus-2.49.0.linux-amd64.tar.gz
tar xvf prometheus-2.49.0.linux-amd64.tar.gz
sudo mv prometheus-2.49.0.linux-amd64/{prometheus,promtool} /usr/local/bin/
sudo mkdir -p /etc/prometheus /var/lib/prometheus
sudo mv prometheus-2.49.0.linux-amd64/{consoles,console_libraries,prometheus.yml} /etc/prometheus/
```

Edit `/etc/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets:
        - '192.168.1.10:9100'
        - '192.168.1.11:9100'
```

## Step 3 — Install Grafana

```bash
sudo apt install -y apt-transport-https software-properties-common
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update && sudo apt install grafana -y
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

Access Grafana at `http://SERVER_IP:3000` (default credentials: admin / admin).

Addkan Prometheus sebagai data source, lalu import dashboard **Node Exporter Full** (ID: 1860).

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Target is DOWN in Prometheus | Node Exporter not running or blocked by firewall | Cek port 9100 and service status |
| Grafana is blank | Datasource not configured | Add Prometheus datasource in Grafana |
| Data is not updating | Scrape interval is too long | Reduce `scrape_interval` |
