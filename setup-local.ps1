Write-Host "Iniciando setup do Gatas do Babado..." -ForegroundColor Cyan

# 1. Subir Docker
Write-Host "`n[1/5] Subindo PostgreSQL, Redis e MinIO..." -ForegroundColor Yellow
docker compose up -d

# 2. Aguardar PostgreSQL
Write-Host "`n[2/5] Aguardando banco de dados ficar pronto..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    $result = docker exec babado_postgres pg_isready -U postgres 2>&1
    if ($result -match "accepting connections") {
        $ready = $true
        break
    }
    Start-Sleep 2
}
if ($ready) {
    Write-Host "Banco de dados pronto!" -ForegroundColor Green
} else {
    Write-Host "Timeout aguardando banco. Tente novamente." -ForegroundColor Red
    exit 1
}

# 3. Instalar dependencias
Write-Host "`n[3/5] Instalando dependencias npm..." -ForegroundColor Yellow
npm install

# 4. Criar tabelas
Write-Host "`n[4/5] Criando tabelas no banco de dados..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://postgres:babados2026111111@localhost:5432/babado"
npx prisma db push

# 5. MinIO bucket
Write-Host "`n[5/5] Configurando armazenamento de arquivos..." -ForegroundColor Yellow
Start-Sleep 3
docker exec babado_minio mc alias set local http://localhost:9000 minioadmin minioadmin123 2>$null
docker exec babado_minio mc mb local/babado-media 2>$null
docker exec babado_minio mc anonymous set public local/babado-media 2>$null

Write-Host "`n✅ Setup concluido!" -ForegroundColor Green
Write-Host "Para iniciar o projeto, execute:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nAcessos:" -ForegroundColor Cyan
Write-Host "  App:          http://localhost:3000" -ForegroundColor White
Write-Host "  MinIO Painel: http://localhost:9001  (minioadmin / minioadmin123)" -ForegroundColor White
