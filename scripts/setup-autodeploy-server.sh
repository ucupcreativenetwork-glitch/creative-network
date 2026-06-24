#!/bin/bash
# =============================================================================
# Setup autodeploy sekali di server aaPanel (Ubuntu)
# Jalankan di server sebagai root atau user deploy:
#   bash setup-autodeploy-server.sh
# =============================================================================
set -euo pipefail

DOMAIN="${1:-creativenetwork.my.id}"
DEPLOY_PATH="${2:-/www/wwwroot/${DOMAIN}}"
DEPLOY_USER="${3:-www}"

echo "==> Creative Network — Setup autodeploy"
echo "    Domain     : $DOMAIN"
echo "    Deploy path: $DEPLOY_PATH"

mkdir -p "$DEPLOY_PATH"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "$DEPLOY_PATH" 2>/dev/null || true

# Buat SSH key khusus GitHub Actions (jika belum ada)
KEY_DIR="/root/.ssh/creative-network-deploy"
if [ ! -f "$KEY_DIR/id_ed25519" ]; then
  mkdir -p "$KEY_DIR"
  ssh-keygen -t ed25519 -f "$KEY_DIR/id_ed25519" -N "" -C "github-actions-creative-network"
  echo ""
  echo "==> PUBLIC KEY — tambahkan ke authorized_keys user deploy:"
  cat "$KEY_DIR/id_ed25519.pub"
  echo ""
  echo "==> PRIVATE KEY — salin ke GitHub Secret SSH_PRIVATE_KEY:"
  cat "$KEY_DIR/id_ed25519"
  echo ""
fi

echo ""
echo "==> Langkah berikutnya (GitHub):"
echo "  1. Repo → Settings → Secrets and variables → Actions"
echo "  2. Tambah secrets:"
echo "       SSH_HOST      = IP server / domain SSH"
echo "       SSH_USER      = user SSH (biasanya root atau www)"
echo "       SSH_PRIVATE_KEY = private key di atas"
echo "       DEPLOY_PATH   = $DEPLOY_PATH"
echo "  3. Push ke branch main → deploy otomatis jalan"
echo ""
echo "==> Opsional: pasang nginx security dari deploy/nginx-security.conf di aaPanel"