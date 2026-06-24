# Bantu generate SSH key untuk GitHub Actions autodeploy (jalankan di PC Windows)
# Setelah jalan, salin output ke GitHub Secrets

$KeyPath = Join-Path $env:USERPROFILE ".ssh\creative-network-deploy"
$PrivateKey = Join-Path $KeyPath "id_ed25519"
$PublicKey = "$PrivateKey.pub"

New-Item -ItemType Directory -Force -Path $KeyPath | Out-Null

if (-not (Test-Path $PrivateKey)) {
    ssh-keygen -t ed25519 -f $PrivateKey -N '""' -C "github-actions-creative-network"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " GITHUB SECRETS — salin ke repo GitHub" -ForegroundColor Cyan
Write-Host " https://github.com/ucupcreativenetwork-glitch/creative-network/settings/secrets/actions" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "SSH_PRIVATE_KEY - copy full file content:" -ForegroundColor Green
Get-Content $PrivateKey -Raw
Write-Host ""
Write-Host "PUBLIC KEY — pasang di server authorized_keys:" -ForegroundColor Green
Get-Content $PublicKey
Write-Host ""
Write-Host "Secrets lain yang perlu diisi manual:" -ForegroundColor Yellow
Write-Host "  SSH_HOST    = IP publik server aaPanel"
Write-Host "  SSH_USER    = root (atau user SSH aaPanel)"
Write-Host "  DEPLOY_PATH = /www/wwwroot/creativenetwork.my.id"
Write-Host "  SSH_PORT    = 22 (opsional)"
Write-Host ""