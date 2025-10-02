# Netlify Environment Variables Setup Script# Netlify Environment Variables Setup Script

# This script helps configure environment variables for NextAuth.js OAuth integration# This script configures all necessary environment variables for Plane project deployment



param(param(

    [Parameter(Mandatory=$true)]    [string]$Domain = "https://www.goodhope.au",

    [string]$SiteName,    [string]$SiteName = "buildjira",

        [switch]$Production,

    [Parameter(Mandatory=$true)]    [switch]$Development,

    [string]$Domain,    [switch]$LinkSite,

        [switch]$Help

    [Parameter(Mandatory=$false)])

    [string]$NetlifyToken = $env:NETLIFY_AUTH_TOKEN

)# Display help information

if ($Help) {

# Validate inputs    Write-Host "🚀 Netlify Environment Variables Setup Script" -ForegroundColor Blue

if (-not $NetlifyToken) {    Write-Host "=============================================" -ForegroundColor Blue

    Write-Error "Netlify token is required. Set NETLIFY_AUTH_TOKEN environment variable or pass -NetlifyToken parameter."    Write-Host ""

    exit 1    Write-Host "Usage:" -ForegroundColor Cyan

}    Write-Host "  .\set-netlify-env.ps1                    # Use default domain and buildjira site"

    Write-Host "  .\set-netlify-env.ps1 -Domain 'https://yourdomain.com'"

if (-not $Domain.StartsWith("https://")) {    Write-Host "  .\set-netlify-env.ps1 -SiteName 'your-site-name'"

    Write-Error "Domain must start with 'https://'"    Write-Host "  .\set-netlify-env.ps1 -LinkSite          # Link current folder to buildjira site"

    exit 1    Write-Host "  .\set-netlify-env.ps1 -Production        # Set production-optimized values"

}    Write-Host "  .\set-netlify-env.ps1 -Development       # Set development-friendly values"

    Write-Host "  .\set-netlify-env.ps1 -Help              # Show this help"

Write-Host "Setting up Netlify environment variables for site: $SiteName" -ForegroundColor Green    Write-Host ""

Write-Host "Domain: $Domain" -ForegroundColor Blue    Write-Host "Examples:" -ForegroundColor Yellow

    Write-Host "  .\set-netlify-env.ps1 -LinkSite -Domain 'https://buildjira.netlify.app'"

# Function to set Netlify environment variable    Write-Host "  .\set-netlify-env.ps1 -Production -SiteName 'buildjira'"

function Set-NetlifyEnvVar {    exit 0

    param(}

        [string]$Key,

        [string]$Value,Write-Host "🚀 Setting up Netlify Environment Variables" -ForegroundColor Blue

        [string]$SiteId,Write-Host "===========================================" -ForegroundColor Blue

        [string]$TokenWrite-Host ""

    )

    # Link to Netlify site if requested

    $headers = @{if ($LinkSite) {

        "Authorization" = "Bearer $Token"    Write-Host "🔗 Linking to Netlify site: $SiteName" -ForegroundColor Cyan

        "Content-Type" = "application/json"    try {

    }        netlify link --name $SiteName

            if ($LASTEXITCODE -eq 0) {

    $body = @{            Write-Host "✅ Successfully linked to $SiteName" -ForegroundColor Green

        "key" = $Key        } else {

        "values" = @(            Write-Host "❌ Failed to link to $SiteName" -ForegroundColor Red

            @{            Write-Host "   You may need to run: netlify sites:list" -ForegroundColor Yellow

                "value" = $Value            Write-Host "   Then use the exact site name/slug shown" -ForegroundColor Yellow

                "context" = "all"        }

            }    }

        )    catch {

    } | ConvertTo-Json -Depth 3        Write-Host "❌ Error linking site: $($_.Exception.Message)" -ForegroundColor Red

        }

    try {    Write-Host ""

        $response = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$SiteId/env" -Method POST -Headers $headers -Body $body}

        Write-Host "✓ Set $Key" -ForegroundColor Green

        return $true# Check if netlify CLI is installed and logged in

    }Write-Host "📋 Checking Netlify CLI..." -ForegroundColor Cyan

    catch {try {

        Write-Host "✗ Failed to set $Key`: $($_.Exception.Message)" -ForegroundColor Red    $netlifyStatus = netlify status 2>$null

        return $false    if ($LASTEXITCODE -ne 0) {

    }        Write-Host "❌ Not logged in to Netlify CLI" -ForegroundColor Red

}        Write-Host "   Please run: netlify login" -ForegroundColor Yellow

        exit 1

# Get site ID from site name    }

$headers = @{    Write-Host "✅ Netlify CLI ready" -ForegroundColor Green

    "Authorization" = "Bearer $NetlifyToken"}

}catch {

    Write-Host "❌ Netlify CLI not found" -ForegroundColor Red

try {    Write-Host "   Please install: npm install -g netlify-cli" -ForegroundColor Yellow

    $sites = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites" -Headers $headers    exit 1

    $site = $sites | Where-Object { $_.name -eq $SiteName }}

    

    if (-not $site) {# Validate domain format

        Write-Error "Site '$SiteName' not found. Available sites:"if (-not $Domain.StartsWith("https://")) {

        $sites | ForEach-Object { Write-Host "  - $($_.name)" }    Write-Host "⚠️  Domain should start with https://" -ForegroundColor Yellow

        exit 1    $Domain = "https://" + $Domain.TrimStart("http://").TrimStart("https://")

    }    Write-Host "   Updated domain to: $Domain" -ForegroundColor Yellow

    }

    $siteId = $site.id

    Write-Host "Found site ID: $siteId" -ForegroundColor BlueWrite-Host "🌐 Target Domain: $Domain" -ForegroundColor Cyan

}Write-Host "🏗️  Target Site: $SiteName" -ForegroundColor Cyan

catch {Write-Host ""

    Write-Error "Failed to get site information: $($_.Exception.Message)"

    exit 1# Define environment variables

}$envVars = @{

    # Core NextAuth Configuration

# Define environment variables with placeholder values    "NEXTAUTH_URL" = $Domain

$envVars = @{    "NEXTAUTH_SECRET" = "your-nextauth-secret-key-here"

    # NextAuth Configuration    

    "NEXTAUTH_URL" = $Domain    # Google OAuth - Replace with your actual credentials

    "NEXTAUTH_SECRET" = "your-nextauth-secret-key-here"    "GOOGLE_CLIENT_ID" = "your-google-client-id-here"

        "GOOGLE_CLIENT_SECRET" = "your-google-client-secret-here"

    # Google OAuth - Replace with your actual credentials    

    "GOOGLE_CLIENT_ID" = "your-google-client-id-here"    # API Configuration

    "GOOGLE_CLIENT_SECRET" = "your-google-client-secret-here"    "NEXT_PUBLIC_API_BASE_URL" = $Domain

        "NEXT_PUBLIC_WEB_BASE_URL" = $Domain

    # API Configuration    "NEXT_PUBLIC_ADMIN_BASE_URL" = "$Domain/god-mode"

    "NEXT_PUBLIC_API_BASE_URL" = $Domain    "NEXT_PUBLIC_SPACE_BASE_URL" = "$Domain/spaces"

        "NEXT_PUBLIC_LIVE_BASE_URL" = "$Domain/live"

    # Additional Plane Configuration    

    "NEXT_PUBLIC_SITE_URL" = $Domain    # Paths

    "NEXT_PUBLIC_WEB_BASE_URL" = $Domain    "NEXT_PUBLIC_ADMIN_BASE_PATH" = "/god-mode"

}    "NEXT_PUBLIC_SPACE_BASE_PATH" = "/spaces"

    "NEXT_PUBLIC_LIVE_BASE_PATH" = "/live"

Write-Host "`nSetting environment variables..." -ForegroundColor Yellow    "APP_BASE_PATH" = ""

}

$successCount = 0

$totalCount = $envVars.Count# Add production-specific variables

if ($Production) {

foreach ($envVar in $envVars.GetEnumerator()) {    Write-Host "🎯 Setting Production Configuration" -ForegroundColor Green

    if (Set-NetlifyEnvVar -Key $envVar.Key -Value $envVar.Value -SiteId $siteId -Token $NetlifyToken) {    $envVars += @{

        $successCount++        "NODE_ENV" = "production"

    }        "DEBUG" = "0"

    Start-Sleep -Milliseconds 100  # Rate limiting        "NEXT_PUBLIC_ENVIRONMENT" = "production"

}    }

}

Write-Host "`nEnvironment variable setup complete!" -ForegroundColor Green

Write-Host "Successfully set: $successCount/$totalCount variables" -ForegroundColor Blue# Add development-specific variables

if ($Development) {

if ($successCount -lt $totalCount) {    Write-Host "🧪 Setting Development Configuration" -ForegroundColor Yellow

    Write-Host "`nSome variables failed to set. Please check manually in Netlify dashboard." -ForegroundColor Yellow    $envVars += @{

}        "NODE_ENV" = "development"

        "DEBUG" = "1"

# Provide next steps        "NEXT_PUBLIC_ENVIRONMENT" = "development"

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Cyan    }

Write-Host "1. Replace placeholder values with actual credentials:"}

Write-Host "   - NEXTAUTH_SECRET: Generate with 'openssl rand -base64 32'"

Write-Host "   - GOOGLE_CLIENT_ID: From Google Cloud Console"Write-Host "📝 Setting Environment Variables..." -ForegroundColor Cyan

Write-Host "   - GOOGLE_CLIENT_SECRET: From Google Cloud Console"Write-Host ""

Write-Host ""

Write-Host "2. Configure Google OAuth redirect URIs:"$successCount = 0

Write-Host "   - $Domain/api/auth/callback/google"$errorCount = 0

Write-Host ""

Write-Host "3. Test your authentication:"foreach ($key in $envVars.Keys) {

Write-Host "   - $Domain/api/auth/signin"    $value = $envVars[$key]

Write-Host ""    Write-Host "Setting $key..." -ForegroundColor Gray

Write-Host "4. Deploy your site to apply changes"    

    try {

# Function to validate current environment setup        if ($SiteName) {

function Test-EnvironmentSetup {            $result = netlify env:set $key $value --name $SiteName 2>&1

    Write-Host "`n=== ENVIRONMENT VALIDATION ===" -ForegroundColor Cyan        } else {

                $result = netlify env:set $key $value 2>&1

    $requiredVars = @("NEXTAUTH_URL", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET")        }

    $placeholderValues = @("your-nextauth-secret-key-here", "your-google-client-id-here", "your-google-client-secret-here")        

            if ($LASTEXITCODE -eq 0) {

    try {            Write-Host "✅ $key" -ForegroundColor Green

        $response = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$siteId/env" -Headers $headers            $successCount++

                } else {

        foreach ($varName in $requiredVars) {            Write-Host "❌ $key - $result" -ForegroundColor Red

            $envVar = $response | Where-Object { $_.key -eq $varName }            $errorCount++

            if ($envVar) {        }

                $value = $envVar.values[0].value    }

                if ($value -in $placeholderValues) {    catch {

                    Write-Host "⚠️  $varName is using placeholder value" -ForegroundColor Yellow        Write-Host "❌ $key - $($_.Exception.Message)" -ForegroundColor Red

                } else {        $errorCount++

                    Write-Host "✓ $varName is configured" -ForegroundColor Green    }

                }}

            } else {

                Write-Host "✗ $varName is missing" -ForegroundColor RedWrite-Host ""

            }Write-Host "📊 Summary:" -ForegroundColor Blue

        }Write-Host "  ✅ Successful: $successCount" -ForegroundColor Green

    }Write-Host "  ❌ Failed: $errorCount" -ForegroundColor Red

    catch {

        Write-Host "Failed to validate environment: $($_.Exception.Message)" -ForegroundColor Redif ($errorCount -eq 0) {

    }    Write-Host ""

}    Write-Host "🎉 All environment variables set successfully!" -ForegroundColor Green

    Write-Host ""

# Run validation    Write-Host "📋 Next Steps:" -ForegroundColor Cyan

Test-EnvironmentSetup    Write-Host "1. Update Google OAuth console with redirect URI:" -ForegroundColor White

    Write-Host "   $Domain/api/auth/callback/google" -ForegroundColor Gray

Write-Host "`nFor detailed setup instructions, see: NETLIFY_OAUTH_CONFIG.md" -ForegroundColor Blue    Write-Host "2. Deploy your site:" -ForegroundColor White
    Write-Host "   netlify deploy --prod" -ForegroundColor Gray
    Write-Host "3. Test OAuth login at:" -ForegroundColor White
    Write-Host "   $Domain" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "⚠️  Some variables failed to set. Please check errors above." -ForegroundColor Yellow
    Write-Host "   You may need to set them manually in Netlify dashboard." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 To verify your settings:" -ForegroundColor Cyan
Write-Host "   netlify env:list" -ForegroundColor Gray