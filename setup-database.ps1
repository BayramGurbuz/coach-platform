# PostgreSQL Veritabanı Kurulum Scripti
# Bu script veritabanını oluşturur ve şemayı yükler

Write-Host "=== PostgreSQL Veritabanı Kurulumu ===" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL şifresini al
$password = Read-Host "PostgreSQL postgres kullanıcısının şifresini girin" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# PGPASSWORD environment variable'ı ayarla
$env:PGPASSWORD = $plainPassword

Write-Host "`nVeritabanı oluşturuluyor..." -ForegroundColor Yellow

# Veritabanının var olup olmadığını kontrol et
$dbExists = psql -U postgres -lqt 2>$null | Select-String -Pattern "coach_platform"

if ($dbExists) {
    Write-Host "Veritabanı zaten mevcut!" -ForegroundColor Green
    $recreate = Read-Host "Yeniden oluşturmak ister misiniz? (y/n)"
    if ($recreate -eq "y" -or $recreate -eq "Y") {
        Write-Host "Mevcut veritabanı siliniyor..." -ForegroundColor Yellow
        psql -U postgres -c "DROP DATABASE coach_platform;" 2>$null
        psql -U postgres -c "CREATE DATABASE coach_platform;"
        Write-Host "Veritabanı yeniden oluşturuldu!" -ForegroundColor Green
    }
} else {
    # Veritabanını oluştur
    psql -U postgres -c "CREATE DATABASE coach_platform;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Veritabanı başarıyla oluşturuldu!" -ForegroundColor Green
    } else {
        Write-Host "Hata: Veritabanı oluşturulamadı. Şifrenizi kontrol edin." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nŞema yükleniyor..." -ForegroundColor Yellow

# Şemayı yükle
$schemaPath = Join-Path $PSScriptRoot "server\database\schema.sql"
if (Test-Path $schemaPath) {
    psql -U postgres -d coach_platform -f $schemaPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Şema başarıyla yüklendi!" -ForegroundColor Green
        Write-Host "`nVeritabanı kurulumu tamamlandı!" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Şema yüklenirken hata oluştu!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Schema dosyası bulunamadı: $schemaPath" -ForegroundColor Red
    exit 1
}

# Şifreyi temizle
$env:PGPASSWORD = ""

