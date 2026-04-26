#!/bin/bash
set -e

echo "🚀 Setup completo do Gatas do Babado - Ambiente Local"
echo "======================================================"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}1. Subindo serviços Docker (PostgreSQL + Redis + MinIO)...${NC}"
docker compose up -d

echo -e "\n${YELLOW}2. Aguardando PostgreSQL ficar pronto...${NC}"
until docker exec babado_postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo -e "${GREEN}✅ PostgreSQL pronto!${NC}"

echo -e "\n${YELLOW}3. Instalando dependências...${NC}"
npm install

echo -e "\n${YELLOW}4. Criando tabelas no banco de dados...${NC}"
DATABASE_URL="postgresql://postgres:babados2026111111@localhost:5432/babado" npx prisma db push

echo -e "${GREEN}✅ Tabelas criadas!${NC}"

echo -e "\n${YELLOW}5. Criando bucket no MinIO...${NC}"
sleep 3
docker exec babado_minio mc alias set local http://localhost:9000 minioadmin minioadmin123 2>/dev/null || true
docker exec babado_minio mc mb local/babado-media 2>/dev/null || true
docker exec babado_minio mc anonymous set public local/babado-media 2>/dev/null || true
echo -e "${GREEN}✅ Bucket MinIO criado!${NC}"

echo -e "\n${GREEN}======================================================"
echo -e "✨ Setup concluído! Para iniciar o projeto:"
echo -e ""
echo -e "  npm run dev"
echo -e ""
echo -e "Acessos:"
echo -e "  App:         http://localhost:3000"
echo -e "  MinIO Painel: http://localhost:9001  (minioadmin / minioadmin123)"
echo -e "======================================================${NC}\n"
