# Fizik Problem Çözücü - Hızlı Başlatma Script
# Windows PowerShell için

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Fizik Problem Cozucu Platform" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Node.js kontrol ediliyor..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js bulundu: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "HATA: Node.js bulunamadi!" -ForegroundColor Red
    Write-Host "Lutfen Node.js yukleyin: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check backend port
if (Test-Port 5000) {
    Write-Host "UYARI: Port 5000 kullanilmakta!" -ForegroundColor Yellow
    Write-Host "Eger backend zaten calisiyorsa, bu normal." -ForegroundColor Yellow
    Write-Host ""
}

# Check frontend port
if (Test-Port 3000) {
    Write-Host "UYARI: Port 3000 kullanilmakta!" -ForegroundColor Yellow
    Write-Host "Eger frontend zaten calisiyorsa, bu normal." -ForegroundColor Yellow
    Write-Host ""
}

# Backend setup
Write-Host "Backend hazirlaniyor..." -ForegroundColor Yellow
cd backend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Backend bagimliliklari yukleniyor..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "HATA: Backend kurulumu basarisiz!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Backend bagimliliklari yuklendi!" -ForegroundColor Green
} else {
    Write-Host "Backend bagimliliklari mevcut." -ForegroundColor Green
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host ".env dosyasi olusturuluyor..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env dosyasi olusturuldu!" -ForegroundColor Green
}

Write-Host ""

# Frontend setup
Write-Host "Frontend hazirlaniyor..." -ForegroundColor Yellow
cd ../frontend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Frontend bagimliliklari yukleniyor (bu biraz zaman alabilir)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "HATA: Frontend kurulumu basarisiz!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Frontend bagimliliklari yuklendi!" -ForegroundColor Green
} else {
    Write-Host "Frontend bagimliliklari mevcut." -ForegroundColor Green
}

cd ..

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Kurulum tamamlandi!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Sunucular baslatiliyor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sunuculari durdurmak icin Ctrl+C basin" -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

# Wait a bit for frontend to start
Start-Sleep -Seconds 5

# Open browser
Write-Host "Tarayici aciliyor..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Platform baslatildi!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Notlar:" -ForegroundColor Yellow
Write-Host "- Backend ve Frontend ayri terminal pencerelerinde calisir" -ForegroundColor Gray
Write-Host "- Sunuculari durdurmak icin her terminal penceresinde Ctrl+C basin" -ForegroundColor Gray
Write-Host "- Admin paneli: admin / admin123" -ForegroundColor Gray
Write-Host ""
