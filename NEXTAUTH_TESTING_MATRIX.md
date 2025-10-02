# NextAuth.js Testing Matrix

## 🧪 **Complete Testing Workflow for Google OAuth**

This testing matrix ensures your NextAuth.js Google OAuth integration works across all deployment environments.

---

## 📋 **Testing Matrix Overview**

| Environment | URL | Google OAuth Setup | Test Status |
|-------------|-----|-------------------|-------------|
| **Local Development** | `http://localhost:3000` | ✅ Configured | Ready to Test |
| **Netlify Preview** | `https://[branch]--buildjira.netlify.app` | ⏳ Configure per deploy | As needed |
| **Production** | `https://buildjira.netlify.app` | ✅ Configured | Ready to Deploy |

---

## 🏠 **1. Local Development Testing**

### **Setup Status:** ✅ Ready
Your local environment is already configured with NextAuth.js.

### **Testing Steps:**
```bash
# 1. Start development server
cd apps/web
npm run dev

# 2. Visit sign-in page
# Open browser: http://localhost:3000/auth/signin

# 3. Test Google OAuth
# Click "Sign in with Google" button
```

### **Expected URLs:**
- **Sign-in Page**: `http://localhost:3000/auth/signin`
- **API Auth**: `http://localhost:3000/api/auth/signin`
- **Google Callback**: `http://localhost:3000/api/auth/callback/google`

### **Google OAuth Console Setup:**
```
Authorized JavaScript Origins:
  http://localhost:3000

Authorized Redirect URIs:
  http://localhost:3000/api/auth/callback/google
```

### **Test Checklist:**
- [ ] Development server starts without errors
- [ ] Sign-in page loads with Google button
- [ ] Clicking Google redirects to OAuth consent
- [ ] After approval, redirects back to localhost
- [ ] User session is created successfully
- [ ] Sign-out works properly

---

## 🔍 **2. Netlify Preview Deploy Testing**

### **Setup Status:** ⏳ Configure per preview
Each preview deploy gets a unique URL that needs Google OAuth configuration.

### **Preview URL Pattern:**
```
https://[branch-name]--buildjira.netlify.app
https://[deploy-id]--buildjira.netlify.app
```

### **Dynamic Setup Process:**

#### **Step 1: Deploy Preview**
```powershell
# Deploy preview branch
git checkout feature-branch
git push origin feature-branch

# Or manual preview deploy
netlify deploy --dir apps/web/.next
```

#### **Step 2: Get Preview URL**
```powershell
# Get the preview URL from Netlify
netlify status
# Note the preview URL (e.g., https://abc123--buildjira.netlify.app)
```

#### **Step 3: Update Google OAuth Console**
```
Add to Authorized JavaScript Origins:
  https://[your-preview-url]--buildjira.netlify.app

Add to Authorized Redirect URIs:
  https://[your-preview-url]--buildjira.netlify.app/api/auth/callback/google
```

### **Testing Steps:**
```bash
# 1. Visit preview URL
https://[preview-url]--buildjira.netlify.app/auth/signin

# 2. Test OAuth flow
# Click "Sign in with Google"

# 3. Verify callback works
# Should redirect back to preview URL after OAuth
```

### **Preview Test Checklist:**
- [ ] Preview URL accessible
- [ ] Environment variables loaded correctly
- [ ] Google OAuth redirects to correct preview URL
- [ ] Authentication completes successfully
- [ ] Session persists across preview pages

---

## 🚀 **3. Production Testing**

### **Setup Status:** ✅ Ready
Production environment is configured for `https://buildjira.netlify.app`.

### **Google OAuth Console Setup:**
```
Authorized JavaScript Origins:
  https://buildjira.netlify.app
  https://www.goodhope.au

Authorized Redirect URIs:
  https://buildjira.netlify.app/api/auth/callback/google
  https://www.goodhope.au/api/auth/callback/google
```

### **Production Deploy:**
```powershell
# Deploy to production
.\netlify-setup.ps1

# Or manual production deploy
netlify deploy --prod --dir apps/web/.next
```

### **Testing Steps:**
```bash
# 1. Visit production site
https://buildjira.netlify.app/auth/signin

# 2. Test full OAuth flow
# Complete Google sign-in process

# 3. Test user session
# Navigate around the app while signed in

# 4. Test sign-out
# Verify sign-out clears session
```

### **Production Test Checklist:**
- [ ] Production URL loads correctly
- [ ] SSL certificate valid (HTTPS)
- [ ] Google OAuth completes successfully
- [ ] User data persists correctly
- [ ] Sign-out clears session
- [ ] Performance acceptable
- [ ] No console errors

---

## 🚨 **Google App Testing Status**

### **"This app is in testing" Message**
If you see this warning during OAuth flow:

#### **For Development/Testing:**
```
1. Go to Google Cloud Console
2. OAuth consent screen
3. Add test users:
   - Add your Google account email
   - Add team member emails
4. Save changes
```

#### **For Public Use:**
```
1. Go to Google Cloud Console
2. OAuth consent screen
3. Click "Publish App"
4. Complete verification if requested
5. May require Google review for sensitive scopes
```

### **OAuth Consent Screen Configuration:**
```
App Information:
  App name: Plane Project Management
  User support email: [your-email]
  Developer contact: [your-email]

App domain:
  Application home page: https://buildjira.netlify.app
  Application privacy policy: https://buildjira.netlify.app/privacy
  Application terms of service: https://buildjira.netlify.app/terms

Authorized domains:
  buildjira.netlify.app
  goodhope.au
```

---

## 🔧 **Environment-Specific Configurations**

### **Local Development (.env)**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-nextauth-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### **Netlify Production (Environment Variables)**
```env
NEXTAUTH_URL=https://buildjira.netlify.app
NEXTAUTH_SECRET=your-secure-nextauth-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### **Custom Domain (www.goodhope.au)**
```env
NEXTAUTH_URL=https://www.goodhope.au
NEXTAUTH_SECRET=your-secure-nextauth-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

---

## 🛠️ **Automated Testing Scripts**

### **Local Testing Script**
```powershell
# test-local-auth.ps1
Write-Host "🧪 Testing Local NextAuth.js Setup" -ForegroundColor Blue

# Start dev server in background
Start-Process powershell -ArgumentList "cd apps/web; npm run dev" -WindowStyle Minimized

# Wait for server to start
Start-Sleep -Seconds 5

# Open browser to test
Start-Process "http://localhost:3000/auth/signin"

Write-Host "✅ Local test initiated. Check browser for OAuth flow." -ForegroundColor Green
```

### **Production Testing Script**
```powershell
# test-production-auth.ps1
Write-Host "🚀 Testing Production NextAuth.js Setup" -ForegroundColor Blue

$productionUrl = "https://buildjira.netlify.app"

# Test if site is accessible
try {
    $response = Invoke-WebRequest -Uri "$productionUrl/auth/signin" -Method Head
    Write-Host "✅ Production site accessible: $($response.StatusCode)" -ForegroundColor Green
    
    # Open browser for manual testing
    Start-Process "$productionUrl/auth/signin"
    Write-Host "🔍 Browser opened for manual OAuth testing" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Production site not accessible: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## 📊 **Testing Checklist Matrix**

### **Pre-Deployment Checklist:**
- [ ] Local development server runs without errors
- [ ] Google OAuth Console configured for all environments
- [ ] Environment variables set correctly
- [ ] NextAuth.js configuration files created
- [ ] SSL certificates configured for production

### **OAuth Flow Testing:**
- [ ] **Local**: Sign-in page loads and OAuth works
- [ ] **Preview**: OAuth redirects to correct preview URL
- [ ] **Production**: Complete OAuth flow works end-to-end
- [ ] **Session Management**: Sign-in/sign-out works correctly
- [ ] **Error Handling**: Graceful handling of OAuth errors

### **Cross-Browser Testing:**
- [ ] **Chrome**: OAuth flow works correctly
- [ ] **Firefox**: OAuth flow works correctly
- [ ] **Safari**: OAuth flow works correctly
- [ ] **Edge**: OAuth flow works correctly
- [ ] **Mobile**: OAuth works on mobile devices

### **Security Validation:**
- [ ] HTTPS enforced in production
- [ ] JWT tokens properly signed
- [ ] Session cookies secure and httpOnly
- [ ] CSRF protection active
- [ ] No sensitive data in client-side logs

---

## 🎯 **Quick Test Commands**

### **Start Local Testing:**
```powershell
# Quick local test
cd apps/web
npm run dev
# Visit: http://localhost:3000/auth/signin
```

### **Deploy and Test Production:**
```powershell
# Deploy and test production
.\netlify-setup.ps1
# Visit: https://buildjira.netlify.app/auth/signin
```

### **Update Google OAuth for New URL:**
```bash
# When you get a new preview URL, add these to Google Console:
# Origin: https://[new-url]--buildjira.netlify.app
# Callback: https://[new-url]--buildjira.netlify.app/api/auth/callback/google
```

---

## 📈 **Success Criteria**

### **✅ Passing Tests:**
- User can sign in with Google across all environments
- Sessions persist correctly
- Sign-out clears sessions properly
- No JavaScript errors in browser console
- OAuth redirects work correctly
- Performance is acceptable (< 3 seconds for auth flow)

### **🎉 Ready for Production When:**
- All environments pass OAuth testing
- Google app published (if needed for public use)
- SSL certificates properly configured
- Error monitoring setup and working
- User acceptance testing completed

Your NextAuth.js implementation is ready for comprehensive testing across all environments! 🚀