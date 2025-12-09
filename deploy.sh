#!/bin/bash

# LuxOra E-Commerce Deployment Script
# Run on VPS: sudo bash deploy.sh
# or: ssh root@10.10.20.91 "bash -s" < deploy.sh

set -e  # Exit on any error

echo "========================================="
echo "LuxOra Deployment Script"
echo "========================================="

PROJECT_DIR="/var/www/final-year-project"
USER="deploy"
LOG_DIR="/var/log/final-year-project"

# 1. Ensure user and directories exist
echo "[1] Setting up user and directories..."
useradd -m -s /bin/bash $USER 2>/dev/null || true
mkdir -p $LOG_DIR
chown -R $USER:$USER $PROJECT_DIR
chown -R $USER:$USER $LOG_DIR
chmod 755 $LOG_DIR

# 2. Go to project directory
echo "[2] Navigating to project directory..."
cd $PROJECT_DIR

# 3. Pull latest code
echo "[3] Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main

# 4. Install dependencies (already done, but ensure it's fresh)
echo "[4] Installing dependencies..."
sudo -u $USER npm ci

# 5. Build the app
echo "[5] Building the Next.js application..."
sudo -u $USER npm run build

# 6. Update systemd service file (remove ExecStartPre that was failing)
echo "[6] Updating systemd service configuration..."
cat > /etc/systemd/system/final-year-project.service << 'SYSTEMD_EOF'
[Unit]
Description=LuxOra E-Commerce Application
Documentation=https://github.com/NishadApi25/final-year-project
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/final-year-project
EnvironmentFile=/var/www/final-year-project/.env.local
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/final-year-project/out.log
StandardError=append:/var/log/final-year-project/err.log
SyslogIdentifier=final-year-project

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/final-year-project /var/log/final-year-project

[Install]
WantedBy=multi-user.target
SYSTEMD_EOF

# 7. Reload systemd daemon
echo "[7] Reloading systemd configuration..."
systemctl daemon-reload

# 8. Stop old process if running
echo "[8] Stopping any existing process..."
systemctl stop final-year-project.service 2>/dev/null || true
sleep 2

# 9. Start the service
echo "[9] Starting final-year-project service..."
systemctl start final-year-project.service

# 10. Enable service on boot
echo "[10] Enabling service on system boot..."
systemctl enable final-year-project.service

# 11. Check status
echo "[11] Checking service status..."
systemctl status final-year-project.service --no-pager

# 12. Show recent logs
echo ""
echo "========================================="
echo "Recent Service Logs (last 30 lines):"
echo "========================================="
journalctl -u final-year-project.service -n 30 --no-pager

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "App should be running at:"
echo "  http://10.10.20.91:4007"
echo ""
echo "To tail logs in real-time:"
echo "  journalctl -u final-year-project.service -f"
echo ""
echo "To check if app is responding:"
echo "  curl -I http://10.10.20.91:4007"
echo ""
