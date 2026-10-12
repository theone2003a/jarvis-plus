#!/usr/bin/env bash
# ==============================================================================
# J.A.R.V.I.S Plus — 60-Second Automated Setup Wizard
# ==============================================================================
set -e

BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
AMBER='\033[0;33m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "    ██╗ █████╗ ██████╗ ██╗   ██╗██╗███████╗    ██████╗ ██╗     ██╗   ██╗███████╗"
echo "    ██║██╔══██╗██╔══██╗██║   ██║██║██╔════╝    ██╔══██╗██║     ██║   ██║██╔════╝"
echo "    ██║███████║██████╔╝██║   ██║██║███████╗    ██████╔╝██║     ██║   ██║███████╗"
echo "██╗ ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║    ██╔═══╝ ██║     ██║   ██║╚════██║"
echo "╚█████║██║  ██║██║  ██║ ╚████╔╝ ██║███████║    ██║     ███████╗╚██████╔╝███████║"
echo " ╚════╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝    ╚═╝     ╚══════╝ ╚═════╝ ╚══════╝"
echo -e "${NC}"
echo -e "${GREEN}★ Autonomous Voice Assistant & Multilingual Holographic HUD ★${NC}\n"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Generate TLS Certificates for secure LAN microphone access
mkdir -p server/certs server/logs server/config
if [ ! -f server/certs/cert.pem ] || [ ! -f server/certs/key.pem ]; then
  echo -e "${CYAN}🔐 Generating self-signed TLS certificates for LAN microphone access...${NC}"
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout server/certs/key.pem \
    -out server/certs/cert.pem \
    -days 365 \
    -subj "/CN=jarvis-plus/O=JarvisPlus/C=US" 2>/dev/null
  echo -e "${GREEN}✓ Certificates generated in server/certs/${NC}"
fi

# 2. Setup .env file
if [ ! -f .env ]; then
  echo -e "${CYAN}⚙️ Creating .env configuration from template...${NC}"
  cp .env.example .env
  # Generate random HUD access token
  RAND_TOKEN=$(python3 -c 'import secrets; print("jarvis-"+secrets.token_hex(4))' 2>/dev/null || openssl rand -hex 4)
  sed -i.bak "s/jarvis-plus-secret-token/$RAND_TOKEN/" .env 2>/dev/null || sed -i "" "s/jarvis-plus-secret-token/$RAND_TOKEN/" .env 2>/dev/null || true
  rm -f .env.bak
  echo -e "${GREEN}✓ Configured .env with random secure token: ${BOLD}$RAND_TOKEN${NC}"
else
  echo -e "${AMBER}ℹ️ Existing .env detected, preserving your keys.${NC}"
fi

# 3. Setup server.yaml
if [ ! -f server/config/server.yaml ]; then
  echo -e "${CYAN}📄 Creating server/config/server.yaml from example...${NC}"
  cp server/config/server.example.yaml server/config/server.yaml
  echo -e "${GREEN}✓ Default configuration ready.${NC}"
fi

# 4. Detect LAN IP
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo "127.0.0.1")
TOKEN=$(grep JARVIS_HUD_TOKEN .env | cut -d '=' -f2 | tr -d ' ' || echo "jarvis-token")

echo -e "\n${GREEN}${BOLD}=================================================================${NC}"
echo -e "${GREEN}${BOLD}  J.A.R.V.I.S Plus is Ready to Launch!${NC}"
echo -e "${GREEN}${BOLD}=================================================================${NC}"
echo -e "\n${BOLD}Choose your deployment method:${NC}"
echo -e "  ${CYAN}1) Docker Compose (Recommended)${NC} -> run: ${BOLD}docker compose up -d${NC}"
echo -e "  ${CYAN}2) Native Python${NC}                -> run: ${BOLD}cd server && python3 -m venv .venv && source .venv/bin/activate && pip install -r ../requirements.txt && python server.py${NC}"
echo -e "\n${BOLD}Access HUD in any browser on your network:${NC}"
echo -e "  👉 Local:  ${CYAN}https://localhost:8766/hud/?token=${TOKEN}${NC}"
echo -e "  👉 LAN/Phone: ${CYAN}https://${LAN_IP}:8766/hud/?token=${TOKEN}${NC}"
echo -e "\n${AMBER}Tip: On first load, accept the self-signed certificate in your browser to grant mic access.${NC}\n"
