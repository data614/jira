# NextAuth.js Local Testing Script
# This script tests the local development environment for NextAuth.js integration

param(
    [switch]$SkipBrowser,
    [switch]$Help
)

if ($Help) {
    Write-Host "🧪 NextAuth.js Local Testing Script" -ForegroundColor Blue
    Write-Host "=================================" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\test-local-auth.ps1              # Full local test with browser"
    Write-Host "  .\test-local-auth.ps1 -SkipBrowser # Test without opening browser"
    Write-Host "  .\test-local-auth.ps1 -Help        # Show this help"
    exit 0
}

Write-Host "🧪 Testing Local NextAuth.js Setup" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "apps/web/package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Red
    Write-Host "   Expected: A directory containing apps/web/package.json" -ForegroundColor Yellow
    exit 1
}

# Check if NextAuth.js is installed
Write-Host "📦 Checking NextAuth.js Installation..." -ForegroundColor Cyan
$packageJson = Get-Content "apps/web/package.json" | ConvertFrom-Json
if ($packageJson.dependencies.'next-auth') {
    Write-Host "✅ NextAuth.js installed: $($packageJson.dependencies.'next-auth')" -ForegroundColor Green
} else {
    Write-Host "❌ NextAuth.js not found in package.json" -ForegroundColor Red
    Write-Host "   Please install with: cd apps/web && npm install next-auth @auth/core --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

# Check environment variables
Write-Host "🔧 Checking Environment Variables..." -ForegroundColor Cyan
$envPath = "apps/web/.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    $requiredVars = @("NEXTAUTH_URL", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "✅ $var configured" -ForegroundColor Green
        } else {
            Write-Host "❌ $var missing" -ForegroundColor Red
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "⚠️  Missing environment variables: $($missingVars -join ', ')" -ForegroundColor Yellow
        Write-Host "   Please configure these in apps/web/.env" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Environment file not found: $envPath" -ForegroundColor Red
    Write-Host "   Please run the setup script first: .\setup.sh" -ForegroundColor Yellow
    exit 1
}

# Check if port 3000 is available
Write-Host "🌐 Checking Port Availability..." -ForegroundColor Cyan
try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, 3000)
    $listener.Start()
    $listener.Stop()
    Write-Host "✅ Port 3000 is available" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Port 3000 may be in use" -ForegroundColor Yellow
    Write-Host "   This is normal if the dev server is already running" -ForegroundColor Gray
}

# Start development server
Write-Host "🚀 Starting Development Server..." -ForegroundColor Cyan
Write-Host "   This will start the Next.js development server on port 3000" -ForegroundColor Gray

# Start server in background
$serverProcess = Start-Process powershell -ArgumentList "-Command", "cd 'apps/web'; npm run dev" -WindowStyle Minimized -PassThru

Write-Host "⏳ Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test if server is responding
Write-Host "🔍 Testing Server Response..." -ForegroundColor Cyan
$maxAttempts = 10
$serverReady = $false

for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Development server is responding (attempt $i)" -ForegroundColor Green
            $serverReady = $true
            break
        }
    } catch {
        Write-Host "   Attempt $i/$maxAttempts - Server not ready yet..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
}

if (-not $serverReady) {
    Write-Host "❌ Server failed to start within timeout" -ForegroundColor Red
    Write-Host "   Please check the server logs and try again" -ForegroundColor Yellow
    if ($serverProcess -and -not $serverProcess.HasExited) {
        $serverProcess.Kill()
    }
    exit 1
}

# Test NextAuth.js endpoints
Write-Host "🔐 Testing NextAuth.js Endpoints..." -ForegroundColor Cyan

$authEndpoints = @(
    @{ Path = "/api/auth/providers"; Name = "Providers" },
    @{ Path = "/api/auth/session"; Name = "Session" },
    @{ Path = "/auth/signin"; Name = "Sign-in Page" }
)

foreach ($endpoint in $authEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000$($endpoint.Path)" -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ $($endpoint.Name): HTTP $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  $($endpoint.Name): Failed to load" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# Display test results
Write-Host ""
Write-Host "📋 Local Testing Summary" -ForegroundColor Blue
Write-Host "========================" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Development Server: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔐 Sign-in Page: http://localhost:3000/auth/signin" -ForegroundColor Cyan
Write-Host "📡 API Endpoints: http://localhost:3000/api/auth/*" -ForegroundColor Cyan
Write-Host ""

# Open browser for manual testing
if (-not $SkipBrowser) {
    Write-Host "🌍 Opening Browser for Manual Testing..." -ForegroundColor Green
    Start-Process "http://localhost:3000/auth/signin"
    Write-Host ""
}

Write-Host "📝 Manual Testing Checklist:" -ForegroundColor Yellow
Write-Host "  1. ✓ Visit the sign-in page" -ForegroundColor White
Write-Host "  2. ✓ Click 'Sign in with Google' button" -ForegroundColor White
Write-Host "  3. ✓ Complete Google OAuth consent" -ForegroundColor White
Write-Host "  4. ✓ Verify redirect back to localhost" -ForegroundColor White
Write-Host "  5. ✓ Check that user session is created" -ForegroundColor White
Write-Host "  6. ✓ Test sign-out functionality" -ForegroundColor White
Write-Host ""

Write-Host "📊 Expected OAuth URLs:" -ForegroundColor Cyan
Write-Host "  Origin: http://localhost:3000" -ForegroundColor Gray
Write-Host "  Callback: http://localhost:3000/api/auth/callback/google" -ForegroundColor Gray
Write-Host ""

Write-Host "⭐ Server is running! Press Ctrl+C in the server window to stop." -ForegroundColor Green
Write-Host ""

# Ask if user wants to continue monitoring
$response = Read-Host "Would you like to monitor the server logs? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "📊 Monitoring server... (Press Ctrl+C to stop)" -ForegroundColor Blue
    
    try {
        # Monitor the server process
        while (-not $serverProcess.HasExited) {
            Start-Sleep -Seconds 5
            Write-Host "🟢 Server running (PID: $($serverProcess.Id))" -ForegroundColor Green
        }
    } catch {
        Write-Host "🛑 Monitoring stopped" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Testing completed! Server continues running in background." -ForegroundColor Green
    Write-Host "   To stop the server, close the development server window." -ForegroundColor Gray
}