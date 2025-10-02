# NextAuth.js Preview Testing Script
# This script tests Netlify preview deployments for NextAuth.js integration

param(
    [string]$PreviewUrl = "",
    [switch]$AutoDetect,
    [switch]$SkipBrowser,
    [switch]$Help
)

if ($Help) {
    Write-Host "🔍 NextAuth.js Preview Testing Script" -ForegroundColor Blue
    Write-Host "=====================================" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\test-preview-auth.ps1 -PreviewUrl 'https://deploy-preview-123--buildjira.netlify.app'"
    Write-Host "  .\test-preview-auth.ps1 -AutoDetect               # Try to detect from git/netlify"
    Write-Host "  .\test-preview-auth.ps1 -SkipBrowser              # Test without opening browser"
    Write-Host "  .\test-preview-auth.ps1 -Help                     # Show this help"
    Write-Host ""
    Write-Host "Preview URLs typically follow format:" -ForegroundColor Yellow
    Write-Host "  https://deploy-preview-[PR#]--[site-name].netlify.app"
    Write-Host "  https://[branch-name]--[site-name].netlify.app"
    exit 0
}

Write-Host "🔍 Testing Preview NextAuth.js Setup" -ForegroundColor Blue
Write-Host "====================================" -ForegroundColor Blue
Write-Host ""

# Auto-detect preview URL if requested
if ($AutoDetect -and -not $PreviewUrl) {
    Write-Host "🔍 Auto-detecting preview URL..." -ForegroundColor Cyan
    
    # Try to get current git branch
    try {
        $gitBranch = git branch --show-current 2>$null
        if ($gitBranch -and $gitBranch -ne "main" -and $gitBranch -ne "master") {
            $PreviewUrl = "https://$gitBranch--buildjira.netlify.app"
            Write-Host "   Found git branch: $gitBranch" -ForegroundColor Green
            Write-Host "   Generated URL: $PreviewUrl" -ForegroundColor Green
        }
    } catch {
        Write-Host "   Git branch detection failed" -ForegroundColor Yellow
    }
    
    # Try to detect from netlify config
    if (-not $PreviewUrl -and (Test-Path "netlify.toml")) {
        Write-Host "   Checking netlify.toml..." -ForegroundColor Gray
        $netlifyConfig = Get-Content "netlify.toml" -Raw
        if ($netlifyConfig -match 'publish\s*=\s*"([^"]+)"') {
            Write-Host "   Found Netlify config" -ForegroundColor Green
        }
    }
}

# Validate preview URL
if (-not $PreviewUrl) {
    Write-Host "❌ Error: No preview URL provided" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please provide a preview URL using one of these methods:" -ForegroundColor Yellow
    Write-Host "  1. -PreviewUrl 'https://deploy-preview-123--buildjira.netlify.app'" -ForegroundColor White
    Write-Host "  2. -AutoDetect (tries to detect from git branch)" -ForegroundColor White
    Write-Host "  3. Get URL from Netlify dashboard or GitHub PR" -ForegroundColor White
    Write-Host ""
    Write-Host "Common preview URL formats:" -ForegroundColor Cyan
    Write-Host "  • https://deploy-preview-[PR#]--buildjira.netlify.app" -ForegroundColor Gray
    Write-Host "  • https://[branch-name]--buildjira.netlify.app" -ForegroundColor Gray
    exit 1
}

Write-Host "🌐 Testing Preview URL: $PreviewUrl" -ForegroundColor Cyan
Write-Host ""

# Validate URL format
if ($PreviewUrl -notmatch "^https://.*\.netlify\.app$") {
    Write-Host "⚠️  Warning: URL doesn't match Netlify preview format" -ForegroundColor Yellow
    Write-Host "   Expected: https://[preview]--[site].netlify.app" -ForegroundColor Gray
    Write-Host "   Provided: $PreviewUrl" -ForegroundColor Gray
    Write-Host ""
}

# Test basic connectivity
Write-Host "🔍 Testing Preview Deployment..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $PreviewUrl -Method Head -TimeoutSec 30
    Write-Host "✅ Preview accessible: HTTP $($response.StatusCode)" -ForegroundColor Green
    
    # Check for build info
    if ($response.Headers['X-Nf-Request-Id']) {
        Write-Host "✅ Netlify deployment detected" -ForegroundColor Green
        Write-Host "   Request ID: $($response.Headers['X-Nf-Request-Id'])" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Preview not accessible: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*404*") {
        Write-Host "   This could mean:" -ForegroundColor Yellow
        Write-Host "   • Preview deployment hasn't finished building" -ForegroundColor White
        Write-Host "   • Incorrect preview URL" -ForegroundColor White
        Write-Host "   • Build failed during deployment" -ForegroundColor White
    } elseif ($_.Exception.Message -like "*timeout*") {
        Write-Host "   This could mean:" -ForegroundColor Yellow
        Write-Host "   • Netlify is still deploying" -ForegroundColor White
        Write-Host "   • Network connectivity issues" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Cyan
    Write-Host "   • Check Netlify dashboard for build status" -ForegroundColor White
    Write-Host "   • Verify URL from GitHub PR or Netlify deploy log" -ForegroundColor White
    Write-Host "   • Wait for deployment to complete" -ForegroundColor White
    exit 1
}

# Test NextAuth.js endpoints
Write-Host "🔐 Testing NextAuth.js Configuration..." -ForegroundColor Cyan

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
        $response = Invoke-WebRequest -Uri "$PreviewUrl$($endpoint.Path)" -TimeoutSec 20 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "    ✅ HTTP $($response.StatusCode)" -ForegroundColor Green
            
            # Check content type
            $contentType = $response.Headers['Content-Type']
            if ($contentType -and $contentType -like "*$($endpoint.ContentType)*") {
                Write-Host "    ✅ Content-Type: $contentType" -ForegroundColor Green
            }
            
            # Check expected content
            if ($response.Content -like "*$($endpoint.ExpectedContent)*") {
                Write-Host "    ✅ Expected content found" -ForegroundColor Green
                $passedTests++
            } else {
                Write-Host "    ⚠️  Expected content not found" -ForegroundColor Yellow
                
                # For providers endpoint, show actual response
                if ($endpoint.Path -eq "/api/auth/providers") {
                    try {
                        $providers = $response.Content | ConvertFrom-Json
                        Write-Host "       Available providers: $($providers.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray
                    } catch {
                        Write-Host "       Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))" -ForegroundColor Gray
                    }
                }
            }
        } else {
            Write-Host "    ❌ HTTP $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "    ❌ Failed to load: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Check environment variables (if accessible)
Write-Host "🔧 Checking Environment Configuration..." -ForegroundColor Cyan
try {
    $envResponse = Invoke-WebRequest -Uri "$PreviewUrl/.netlify/functions/env-check" -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($envResponse.StatusCode -eq 200) {
        Write-Host "✅ Environment check endpoint available" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ️  Environment check not available (expected)" -ForegroundColor Gray
}

# Extract preview metadata
$uri = [System.Uri]$PreviewUrl
$previewParts = $uri.Host -split '--'
if ($previewParts.Count -ge 2) {
    $previewType = $previewParts[0]
    $siteName = $previewParts[1] -replace '\.netlify\.app$', ''
    
    Write-Host "📊 Preview Deployment Info:" -ForegroundColor Blue
    Write-Host "   Preview Type: $previewType" -ForegroundColor Cyan
    Write-Host "   Site Name: $siteName" -ForegroundColor Cyan
    
    if ($previewType -like "deploy-preview-*") {
        $prNumber = $previewType -replace "deploy-preview-", ""
        Write-Host "   Pull Request: #$prNumber" -ForegroundColor Cyan
    } else {
        Write-Host "   Branch: $previewType" -ForegroundColor Cyan
    }
}

Write-Host ""

# OAuth Configuration Check
Write-Host "🔧 OAuth Configuration Requirements" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: Preview deployments have dynamic URLs!" -ForegroundColor Red
Write-Host ""
Write-Host "For OAuth to work, add these to Google OAuth Console:" -ForegroundColor White
Write-Host ""
Write-Host "Authorized JavaScript Origins:" -ForegroundColor White
Write-Host "  $PreviewUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Authorized Redirect URIs:" -ForegroundColor White
Write-Host "  $PreviewUrl/api/auth/callback/google" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Alternative: Use wildcard patterns (if Google supports):" -ForegroundColor Yellow
Write-Host "   https://*.netlify.app" -ForegroundColor Gray
Write-Host "   https://*--buildjira.netlify.app" -ForegroundColor Gray
Write-Host ""

# Display test summary
Write-Host "📊 Preview Test Summary" -ForegroundColor Blue
Write-Host "======================" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Preview URL: $PreviewUrl" -ForegroundColor Cyan
Write-Host "📈 Endpoint Tests: $passedTests/$totalTests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

if ($passedTests -eq $totalTests) {
    Write-Host "✅ All tests passed! Preview is ready for OAuth testing." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Check deployment status." -ForegroundColor Yellow
}

Write-Host ""

# Open browser for manual testing
if (-not $SkipBrowser -and $passedTests -gt 0) {
    Write-Host "🌍 Opening Browser for Manual Testing..." -ForegroundColor Green
    Start-Process "$PreviewUrl/auth/signin"
    Write-Host ""
}

Write-Host "📝 Preview Testing Checklist:" -ForegroundColor Yellow
Write-Host "  1. ✓ Verify preview URL is accessible" -ForegroundColor White
Write-Host "  2. ✓ Add preview URL to Google OAuth Console" -ForegroundColor White
Write-Host "  3. ✓ Test sign-in with Google (may require OAuth setup)" -ForegroundColor White
Write-Host "  4. ✓ Check that preview environment variables are correct" -ForegroundColor White
Write-Host "  5. ✓ Test features specific to this branch/PR" -ForegroundColor White
Write-Host "  6. ✓ Verify responsive design and UI changes" -ForegroundColor White
Write-Host ""

Write-Host "🚨 Common Preview Issues:" -ForegroundColor Yellow
Write-Host "  • 'redirect_uri_mismatch': Preview URL not in OAuth Console" -ForegroundColor White
Write-Host "  • Build errors: Check Netlify deploy logs" -ForegroundColor White
Write-Host "  • Environment variables: May differ from production" -ForegroundColor White
Write-Host "  • Caching: Preview may serve stale content" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
if ($passedTests -eq $totalTests) {
    Write-Host "  ✅ Preview testing complete!" -ForegroundColor Green
    Write-Host "  • Add OAuth URLs to Google Console for full testing" -ForegroundColor White
    Write-Host "  • Test OAuth flow with preview URL" -ForegroundColor White
    Write-Host "  • Verify preview-specific features" -ForegroundColor White
    Write-Host "  • Ready for merge if all tests pass" -ForegroundColor White
} else {
    Write-Host "  ⚠️  Fix issues before proceeding:" -ForegroundColor Yellow
    Write-Host "  • Check Netlify build logs" -ForegroundColor White
    Write-Host "  • Verify environment configuration" -ForegroundColor White
    Write-Host "  • Re-run test after fixes" -ForegroundColor White
}

Write-Host ""
Write-Host "📊 Test completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray