# NextAuth.js Production Testing Script
# This script tests the production deployment for NextAuth.js integration

param(
    [string]$ProductionUrl = "https://buildjira.netlify.app",
    [string]$CustomUrl = "",
    [switch]$SkipBrowser,
    [switch]$Help
)

if ($Help) {
    Write-Host "🚀 NextAuth.js Production Testing Script" -ForegroundColor Blue
    Write-Host "=======================================" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\test-production-auth.ps1                           # Test default production URL"
    Write-Host "  .\test-production-auth.ps1 -CustomUrl 'https://...'  # Test custom URL"
    Write-Host "  .\test-production-auth.ps1 -SkipBrowser              # Test without opening browser"
    Write-Host "  .\test-production-auth.ps1 -Help                     # Show this help"
    exit 0
}

# Use custom URL if provided
if ($CustomUrl) {
    $ProductionUrl = $CustomUrl
}

Write-Host "🚀 Testing Production NextAuth.js Setup" -ForegroundColor Blue
Write-Host "=======================================" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Testing URL: $ProductionUrl" -ForegroundColor Cyan
Write-Host ""

# Validate URL format
if ($ProductionUrl -notmatch "^https://") {
    Write-Host "❌ Error: Production URL must use HTTPS" -ForegroundColor Red
    Write-Host "   Provided: $ProductionUrl" -ForegroundColor Red
    Write-Host "   Expected: https://..." -ForegroundColor Yellow
    exit 1
}

# Test basic connectivity
Write-Host "🔍 Testing Basic Connectivity..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $ProductionUrl -Method Head -TimeoutSec 30
    Write-Host "✅ Site accessible: HTTP $($response.StatusCode)" -ForegroundColor Green
    
    # Check for HTTPS redirect
    if ($response.BaseResponse.ResponseUri.Scheme -eq "https") {
        Write-Host "✅ HTTPS properly configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Site not using HTTPS" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Site not accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please check if the site is deployed and accessible" -ForegroundColor Yellow
    exit 1
}

# Test NextAuth.js endpoints
Write-Host "🔐 Testing NextAuth.js Endpoints..." -ForegroundColor Cyan

$authEndpoints = @(
    @{ 
        Path = "/api/auth/providers"
        Name = "Providers Endpoint"
        ExpectedContent = "google"
        ContentType = "application/json"
    },
    @{ 
        Path = "/api/auth/session"
        Name = "Session Endpoint"
        ExpectedContent = "{}"
        ContentType = "application/json"
    },
    @{ 
        Path = "/auth/signin"
        Name = "Sign-in Page"
        ExpectedContent = "Sign in"
        ContentType = "text/html"
    }
)

$passedTests = 0
$totalTests = $authEndpoints.Count

foreach ($endpoint in $authEndpoints) {
    Write-Host "  Testing $($endpoint.Name)..." -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "$ProductionUrl$($endpoint.Path)" -TimeoutSec 20 -UseBasicParsing
        
        # Check status code
        if ($response.StatusCode -eq 200) {
            Write-Host "    ✅ HTTP $($response.StatusCode)" -ForegroundColor Green
            
            # Check content type
            $contentType = $response.Headers['Content-Type']
            if ($contentType -and $contentType -like "*$($endpoint.ContentType)*") {
                Write-Host "    ✅ Content-Type: $contentType" -ForegroundColor Green
            } else {
                Write-Host "    ⚠️  Unexpected Content-Type: $contentType" -ForegroundColor Yellow
            }
            
            # Check expected content
            if ($response.Content -like "*$($endpoint.ExpectedContent)*") {
                Write-Host "    ✅ Expected content found" -ForegroundColor Green
                $passedTests++
            } else {
                Write-Host "    ⚠️  Expected content not found" -ForegroundColor Yellow
                Write-Host "       Looking for: $($endpoint.ExpectedContent)" -ForegroundColor Gray
            }
        } else {
            Write-Host "    ❌ HTTP $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "    ❌ Failed to load: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "       This may indicate a configuration issue" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# Test SSL certificate
Write-Host "🔒 Testing SSL Certificate..." -ForegroundColor Cyan
try {
    $uri = [System.Uri]$ProductionUrl
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($uri.Host, 443)
    
    $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream())
    $sslStream.AuthenticateAsClient($uri.Host)
    
    $cert = $sslStream.RemoteCertificate
    $cert2 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($cert)
    
    Write-Host "✅ SSL Certificate valid" -ForegroundColor Green
    Write-Host "   Subject: $($cert2.Subject)" -ForegroundColor Gray
    Write-Host "   Issuer: $($cert2.Issuer)" -ForegroundColor Gray
    Write-Host "   Expires: $($cert2.NotAfter)" -ForegroundColor Gray
    
    $sslStream.Close()
    $tcpClient.Close()
} catch {
    Write-Host "⚠️  SSL Certificate check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   This may be expected for some hosting providers" -ForegroundColor Gray
}

Write-Host ""

# Test OAuth configuration
Write-Host "🔧 Checking OAuth Configuration..." -ForegroundColor Cyan
$uri = [System.Uri]$ProductionUrl
$domain = $uri.Host

Write-Host "📋 Required Google OAuth Console Settings:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Authorized JavaScript Origins:" -ForegroundColor White
Write-Host "  $ProductionUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Authorized Redirect URIs:" -ForegroundColor White
Write-Host "  $ProductionUrl/api/auth/callback/google" -ForegroundColor Cyan
Write-Host ""

# Display test summary
Write-Host "📊 Production Test Summary" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Production URL: $ProductionUrl" -ForegroundColor Cyan
Write-Host "📈 Endpoint Tests: $passedTests/$totalTests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

if ($passedTests -eq $totalTests) {
    Write-Host "✅ All tests passed! Production site is ready." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please review the configuration." -ForegroundColor Yellow
}

Write-Host ""

# Open browser for manual testing
if (-not $SkipBrowser -and $passedTests -gt 0) {
    Write-Host "🌍 Opening Browser for Manual OAuth Testing..." -ForegroundColor Green
    Start-Process "$ProductionUrl/auth/signin"
    Write-Host ""
}

Write-Host "📝 Manual Testing Checklist:" -ForegroundColor Yellow
Write-Host "  1. ✓ Visit the production sign-in page" -ForegroundColor White
Write-Host "  2. ✓ Click 'Sign in with Google' button" -ForegroundColor White
Write-Host "  3. ✓ Complete Google OAuth consent" -ForegroundColor White
Write-Host "  4. ✓ Verify redirect back to production URL" -ForegroundColor White
Write-Host "  5. ✓ Check that user session is created" -ForegroundColor White
Write-Host "  6. ✓ Test navigation while authenticated" -ForegroundColor White
Write-Host "  7. ✓ Test sign-out functionality" -ForegroundColor White
Write-Host "  8. ✓ Verify session is properly cleared" -ForegroundColor White
Write-Host ""

Write-Host "🚨 Google OAuth Issues?" -ForegroundColor Yellow
Write-Host "  • 'This app is in testing': Add your email to Test users" -ForegroundColor White
Write-Host "  • 'redirect_uri_mismatch': Check OAuth Console redirect URIs" -ForegroundColor White
Write-Host "  • 'invalid_client': Verify Client ID and Secret are correct" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
if ($passedTests -eq $totalTests) {
    Write-Host "  ✅ Production testing complete - site is ready for users!" -ForegroundColor Green
    Write-Host "  • Monitor authentication metrics" -ForegroundColor White
    Write-Host "  • Test with multiple user accounts" -ForegroundColor White
    Write-Host "  • Consider publishing Google OAuth app for public use" -ForegroundColor White
} else {
    Write-Host "  ⚠️  Fix configuration issues before going live:" -ForegroundColor Yellow
    Write-Host "  • Review failed endpoint tests" -ForegroundColor White
    Write-Host "  • Check environment variables" -ForegroundColor White
    Write-Host "  • Verify Google OAuth Console settings" -ForegroundColor White
    Write-Host "  • Re-run this test after fixes" -ForegroundColor White
}

Write-Host ""
Write-Host "📊 Test completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray