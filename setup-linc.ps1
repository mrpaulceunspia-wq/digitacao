\
# 📁 ARQUIVO: setup-linc.ps1
# 🧠 RESPONSÁVEL POR: Criar/validar estrutura e instalar dependências (padrão LINC)
# 🔗 DEPENDÊNCIAS: PowerShell, Node.js >= 18, npm

param(
  [Parameter(Mandatory=$true)]
  [string]$project
)

function Fail($msg) {
  Write-Host "❌ $msg" -ForegroundColor Red
  exit 1
}

function Ok($msg) {
  Write-Host "✅ $msg" -ForegroundColor Green
}

function Info($msg) {
  Write-Host "ℹ️  $msg" -ForegroundColor Cyan
}

Info "Iniciando setup do projeto: $project"

# Node.js version check
try {
  $nodeVersion = node -v
} catch {
  Fail "Node.js não encontrado. Instale Node.js >= 18."
}

$ver = $nodeVersion.TrimStart("v")
$major = [int]($ver.Split(".")[0])
if ($major -lt 18) {
  Fail "Node.js $nodeVersion encontrado. Necessário Node.js >= 18."
}
Ok "Node.js OK ($nodeVersion)"

# Perguntas (mantendo padrão Eng)
$dbChoice = Read-Host "Banco de dados (1) SQLite + SQL Server Protheus [padrão] | (2) Somente SQLite"
if ([string]::IsNullOrWhiteSpace($dbChoice)) { $dbChoice = "1" }

$backendBase = Read-Host "Porta base BACKEND (começa em 4100) [padrão 4100]"
if ([string]::IsNullOrWhiteSpace($backendBase)) { $backendBase = "4100" }

$frontendBase = Read-Host "Porta base FRONTEND (começa em 3100) [padrão 3100]"
if ([string]::IsNullOrWhiteSpace($frontendBase)) { $frontendBase = "3100" }

Info "Criando pasta: $project"
if (!(Test-Path $project)) {
  New-Item -ItemType Directory -Path $project | Out-Null
}
Set-Location $project

Info "Instalando dependências na raiz"
npm install

Info "Instalando dependências do backend"
Set-Location backend
npm install
Set-Location ..

Info "Instalando dependências do frontend"
Set-Location frontend
npm install
Set-Location ..

# Gerar portas runtime
Info "Gerando .env.runtime (portas automáticas)"
$env:BACKEND_PORT_BASE = $backendBase
$env:FRONTEND_PORT_BASE = $frontendBase
node scripts/ports.mjs

Ok "Setup concluído!"
Info "Para rodar: npm run dev"
