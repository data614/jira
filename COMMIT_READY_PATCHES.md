# Commit-Ready NextAuth.js Patches for data614/jira

## 📁 File Path Map

Based on your GitHub repository `https://github.com/data614/jira`, here are the exact file paths for NextAuth.js integration:

### 1. **NextAuth.js API Route Handler**
```
apps/web/app/api/auth/[...nextauth]/route.ts
```

### 2. **Authentication Configuration**
```
apps/web/lib/auth.ts
```

### 3. **Environment Variables** (Multiple files)
```
apps/web/.env.local
apps/admin/.env.local
apps/space/.env.local
.env (root level)
```

---

## 🔧 Commit-Ready Code Patches

### **PATCH 1: NextAuth.js API Route Handler**

**File**: `apps/web/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### **PATCH 2: Centralized Auth Configuration**

**File**: `apps/web/lib/auth.ts`

```typescript
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
```

### **PATCH 3: Environment Variables**

**File**: `apps/web/.env.local`

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**File**: `apps/admin/.env.local`

```bash
# NextAuth.js Configuration (if admin app needs auth)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**File**: `apps/space/.env.local`

```bash
# NextAuth.js Configuration (if space app needs auth)
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🌐 Google OAuth Console Configuration

### **For Development (Local)**
```
Authorized JavaScript Origins:
http://localhost:3000

Authorized Redirect URIs:
http://localhost:3000/api/auth/callback/google
```

### **For Production (Netlify)**
```
Authorized JavaScript Origins:
https://buildjira.netlify.app

Authorized Redirect URIs:
https://buildjira.netlify.app/api/auth/callback/google
```

### **For Preview Deployments (Netlify)**
```
Authorized JavaScript Origins:
https://deploy-preview-*--buildjira.netlify.app
https://*--buildjira.netlify.app

Authorized Redirect URIs:
https://deploy-preview-*--buildjira.netlify.app/api/auth/callback/google
https://*--buildjira.netlify.app/api/auth/callback/google
```

**Note**: Google OAuth Console may not support wildcards. You'll need to add specific preview URLs manually or configure a wildcard domain.

---

## 📦 Package.json Dependencies

**File**: `apps/web/package.json` (Add to dependencies)

```json
{
  "dependencies": {
    "next-auth": "^4.24.11",
    "@auth/core": "^0.18.0"
  }
}
```

---

## 🚀 Installation Commands

```bash
# Navigate to web app
cd apps/web

# Install NextAuth.js dependencies
npm install next-auth @auth/core

# Navigate back to root and install all dependencies
cd ../..
npm install
```

---

## 🔄 Git Commit Commands

```bash
# Add all NextAuth.js files
git add apps/web/app/api/auth/[...nextauth]/route.ts
git add apps/web/lib/auth.ts
git add apps/web/.env.local
git add apps/web/package.json

# Commit the changes
git commit -m "feat: add NextAuth.js with Google OAuth integration

- Add NextAuth.js API route handler for authentication
- Configure Google OAuth provider
- Add centralized auth configuration
- Set up environment variables for OAuth credentials
- Ready for Google OAuth Console setup"

# Push to repository
git push origin main
```

---

## 🎯 Post-Commit Steps

1. **Set up Google OAuth Console**:
   - Create new project or use existing
   - Enable Google+ API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized domains and redirect URIs

2. **Update Environment Variables**:
   - Replace placeholder values with actual OAuth credentials
   - Generate secure NEXTAUTH_SECRET

3. **Test Authentication**:
   ```bash
   cd apps/web
   npm run dev
   # Visit http://localhost:3000/api/auth/signin
   ```

4. **Deploy to Netlify**:
   - Add environment variables to Netlify dashboard
   - Update Google OAuth Console with production URLs
   - Test production authentication

---

## 🔐 Security Notes

- Never commit actual OAuth credentials to version control
- Use different OAuth credentials for development/production
- Generate a strong NEXTAUTH_SECRET (32+ characters)
- Regularly rotate OAuth credentials
- Monitor OAuth usage in Google Console

---

## 📋 Testing Checklist

- [ ] Local development authentication works
- [ ] Environment variables properly configured
- [ ] Google OAuth Console setup complete
- [ ] Production deployment authentication works
- [ ] Preview deployment authentication configured (optional)
- [ ] Sign-in and sign-out flows tested
- [ ] Session management working correctly

---

**Repository**: https://github.com/data614/jira  
**Architecture**: Next.js App Router  
**Generated**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  