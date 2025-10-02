# NextAuth.js OAuth Configuration for Netlify# Netlify Deployment Configuration



This document provides step-by-step instructions for configuring NextAuth.js with Google OAuth on Netlify.## 🚀 OAuth Configuration Added



## OverviewYour Google OAuth credentials have been added to the following environment files for testing:



NextAuth.js has been integrated into the Plane project to provide secure authentication using Google OAuth. The integration supports both local development and production deployment on Netlify.### Configuration Details:

- **Domain**: https://your-domain.com

## Environment Variables Setup- **Google Client ID**: your-google-client-id

- **NextAuth Secret**: Added for session security

### 1. Required Environment Variables

### Files Updated:

Add these environment variables to your `.env.local` file for development:- ✅ `apps/web/.env` - Web application OAuth config

- ✅ `apps/admin/.env` - Admin panel OAuth config  

```env- ✅ `apps/space/.env` - Space application OAuth config

NEXTAUTH_URL=https://your-domain.com- ✅ `apps/api/.env` - API backend OAuth config

NEXTAUTH_SECRET=your-nextauth-secret-key-here- ✅ `.env` - Root environment with production URLs

GOOGLE_CLIENT_ID=your-google-client-id-here- ✅ `netlify.toml` - Netlify deployment configuration

GOOGLE_CLIENT_SECRET=your-google-client-secret-here

```## 🔧 Netlify Setup Instructions



### 2. Google OAuth Console Setup### 1. Netlify Dashboard Configuration



**Required Redirect URIs for Google OAuth:****Environment Variables to Set in Netlify:**

``````

http://localhost:3000/api/auth/callback/google  # For local developmentNEXTAUTH_URL=https://your-domain.com

https://your-domain.netlify.app/api/auth/callback/google  # For productionNEXTAUTH_SECRET=your-nextauth-secret-key-here

```GOOGLE_CLIENT_ID=your-google-client-id-here

GOOGLE_CLIENT_SECRET=your-google-client-secret-here

### 3. NextAuth Secret Generation```



Generate a secure secret for NextAuth:### 2. Google OAuth Console Setup



```bash**Required Redirect URIs for Google OAuth:**

openssl rand -base64 32```

```https://your-domain.com/api/auth/callback/google

https://your-domain.com/auth/callback/google

## Google OAuth Setup Steps```



### 1. Create Google OAuth Application**Authorized JavaScript Origins:**

```

1. Go to [Google Cloud Console](https://console.cloud.google.com/)https://your-domain.com

2. Create a new project or select existing project```

3. Enable Google+ API

4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"### 3. Netlify Build Settings

5. Set application type to "Web application"

6. Add authorized redirect URIs (see above)The `netlify.toml` has been configured with:

7. Note down Client ID and Client Secret- **Build Command**: `npm run build`

- **Publish Directory**: `.next`

### 2. Configure Authorized Origins- **Base Directory**: `apps/web`

- **Node Version**: 18

**Authorized JavaScript origins:**- **NextJS Plugin**: Enabled

```

http://localhost:3000  # For local development### 4. Domain Configuration

https://your-domain.netlify.app  # For production

```Update these URLs if your domain changes:

- Replace `https://www.goodhope.au` with your actual domain

**Authorized redirect URIs:**- Update in Google OAuth console

```- Update in all environment files

http://localhost:3000/api/auth/callback/google

https://your-domain.netlify.app/api/auth/callback/google## ⚠️ Security Considerations

```

### For Production Deployment:

## Netlify Configuration

1. **Move Secrets to Netlify Dashboard**

### 1. Environment Variables in Netlify   - Don't commit `GOOGLE_CLIENT_SECRET` to git

   - Set sensitive values in Netlify environment variables

Add the following environment variables in your Netlify site settings:   - Use different secrets for production vs development



1. Go to Site Settings → Environment Variables2. **Update CORS Settings**

2. Add each variable:   - Add your domain to `CORS_ALLOWED_ORIGINS` in API config

   - `NEXTAUTH_URL`: Your production domain   - Update all base URLs to use HTTPS

   - `NEXTAUTH_SECRET`: Generated secret

   - `GOOGLE_CLIENT_ID`: From Google Console3. **SSL Certificate**

   - `GOOGLE_CLIENT_SECRET`: From Google Console   - Ensure Netlify has SSL enabled for your domain

   - Update all HTTP references to HTTPS

### 2. Build Settings

## 🧪 Testing the OAuth Configuration

Ensure your Netlify build settings include:

### Local Testing:

```toml1. Start your development environment:

[build]   ```bash

  command = "cd apps/web && npm run build"   docker-compose up -d

  publish = "apps/web/.next"   ```

```

2. Visit: http://localhost:3000

## Security Considerations3. Look for Google login button

4. Test OAuth flow

1. **Never commit actual credentials** to version control

2. Use strong, unique secrets for production### Production Testing:

3. Regularly rotate OAuth credentials1. Deploy to Netlify

4. Monitor OAuth usage in Google Console2. Visit: https://www.goodhope.au

5. Use HTTPS in production environments3. Test Google OAuth login

4. Verify user authentication works

## Troubleshooting

## 🔍 Troubleshooting

### Common Issues:

### Common Issues:

1. **Invalid redirect URI**: Ensure redirect URIs match exactly in Google Console

2. **NextAuth secret missing**: Generate and set NEXTAUTH_SECRET1. **OAuth Redirect Mismatch**

3. **Environment variables not loading**: Check Netlify environment variable configuration   - Error: "redirect_uri_mismatch"

4. **CORS issues**: Verify authorized origins in Google Console   - Fix: Add correct redirect URIs in Google Console



### Testing Authentication:2. **NEXTAUTH_URL Missing**

   - Error: "NEXTAUTH_URL required"

1. Local: `http://localhost:3000/api/auth/signin`   - Fix: Ensure NEXTAUTH_URL is set in Netlify

2. Production: `https://your-domain.netlify.app/api/auth/signin`

3. **Invalid Client Error**

## Integration Files   - Error: "invalid_client"

   - Fix: Verify Google Client ID and Secret are correct

The NextAuth.js integration includes:

4. **CORS Errors**

- `apps/web/app/api/auth/[...nextauth]/route.ts`: NextAuth API route   - Error: Cross-origin requests blocked

- `apps/web/lib/auth.ts`: NextAuth configuration   - Fix: Update CORS_ALLOWED_ORIGINS in API config

- `apps/web/app/auth/signin/page.tsx`: Custom sign-in page

### Debug Steps:

## Support1. Check Netlify build logs

2. Verify environment variables in Netlify dashboard

For additional help:3. Test Google OAuth credentials in Google Console

- [NextAuth.js Documentation](https://next-auth.js.org/)4. Check browser network tab for failed requests

- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)

- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)## 📋 Deployment Checklist

### Pre-Deployment:
- [ ] Google OAuth app configured with correct redirect URIs
- [ ] All environment variables set in Netlify dashboard
- [ ] Domain name updated in all config files
- [ ] SSL certificate enabled

### Post-Deployment:
- [ ] Test OAuth login flow
- [ ] Verify user registration works
- [ ] Check API endpoints respond correctly
- [ ] Test file upload functionality
- [ ] Confirm email notifications work (if configured)

## 🔗 Important URLs

### Google OAuth Console:
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Netlify Configuration:
- Site Settings → Environment Variables
- Site Settings → Build & Deploy → Build Settings

### Testing URLs:
- **Production**: https://www.goodhope.au
- **OAuth Callback**: https://www.goodhope.au/api/auth/callback/google

---

**Status**: OAuth configuration complete for Netlify deployment
**Next Step**: Deploy to Netlify and test Google authentication