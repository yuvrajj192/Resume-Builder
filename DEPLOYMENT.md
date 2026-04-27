# Environment & Deployment Guide

## Current Configuration

Your Supabase credentials are configured in: **js/supabase-config.js**

```javascript
const SUPABASE_URL = 'https://kuymqrxlghqekmsbuspz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🔒 Security Best Practices

### ✅ Safe to Use in Frontend (Anon Key)
- The **Anon Key** is safe to expose in your frontend code
- It only allows authenticated users to access their own data
- Supabase RLS policies protect user data

### ❌ Never Expose (Secret Key)
- Never add your **Service Role Key** to frontend code
- Keep secret keys only on backend servers
- Use environment variables for deployment

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Deploy automatically
4. No environment variables needed (credentials in frontend)

### Option 2: Netlify

1. Push code to GitHub
2. Connect GitHub to Netlify
3. Deploy automatically
4. Works same as Vercel

### Option 3: GitHub Pages

1. No backend needed
2. All data stored in Supabase
3. Simple static hosting
4. Supports all features

### Option 4: Self-Hosted

1. Upload to your server
2. Ensure HTTPS enabled
3. Keep Supabase credentials as is
4. All data secure in Supabase

## 🔐 Protecting Credentials for Production

If you want to hide credentials behind environment variables:

### Step 1: Create .env.local file (LOCAL ONLY)

Create file: `.env.local` (do NOT commit to git)

```
VITE_SUPABASE_URL=https://kuymqrxlghqekmsbuspz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Update supabase-config.js

Replace with:

```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Step 3: Add to .gitignore

```
.env.local
.env
.env.*.local
```

### Step 4: Add to deployment platform

On Vercel/Netlify:
1. Go to Environment Variables
2. Add same variables
3. Deploy

## 📊 Monitoring & Maintenance

### Check Database
1. Supabase Dashboard → Database
2. Monitor storage usage
3. View active sessions

### View Logs
1. Supabase Dashboard → Logs
2. Check for errors
3. Monitor user activity

### Database Backups
1. Supabase provides automatic backups
2. Check Settings → Backups
3. Can restore if needed

## 🔄 Data Management

### Export Data

```sql
-- Export all drafts
SELECT * FROM resume_drafts;

-- Export all resumes
SELECT * FROM resume_history;
```

### Delete User Data

```sql
-- Delete user's drafts and resumes
DELETE FROM resume_drafts WHERE user_id = 'USER_ID';
DELETE FROM resume_history WHERE user_id = 'USER_ID';

-- Supabase will auto-delete auth user on cascade
```

## 📈 Scalability

### Current Limits (Supabase Free Tier)

- Database: Up to 500 MB
- Storage: 1 GB (PDFs)
- Auth: Unlimited users
- Connections: Sufficient for small apps

### Upgrade Path

If you exceed limits:
1. Supabase Dashboard → Billing
2. Upgrade to Pro tier
3. 2-3X resources included
4. No code changes needed

## 🆘 Troubleshooting Deployment

### CORS Errors

**Cause**: Browser blocking requests  
**Solution**: Supabase handles CORS automatically

### Auth Not Working

**Cause**: Credentials misconfigured  
**Solution**: Verify js/supabase-config.js has correct values

### PDFs Not Uploading

**Cause**: Storage policies not configured  
**Solution**: Run storage policy SQL in Supabase

### Slow Performance

**Cause**: Database queries  
**Solution**: 
- Check database indexes (already created)
- Optimize queries
- Upgrade tier if needed

## 📱 Testing Deployment

### Test Checklist

- [ ] Open landing page
- [ ] Sign up new account
- [ ] Fill resume form
- [ ] Save draft
- [ ] View history
- [ ] Download PDF
- [ ] Logout and login again
- [ ] Verify old data still there

## 🔗 Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| VITE_SUPABASE_URL | https://... | Yes |
| VITE_SUPABASE_ANON_KEY | eyJ... | Yes |

## 🎯 Production Checklist

- [ ] Database tables created
- [ ] Storage bucket configured
- [ ] RLS policies enabled
- [ ] Storage policies set
- [ ] Environment variables added
- [ ] HTTPS enabled
- [ ] Tested all features
- [ ] Error handling tested
- [ ] Performance tested
- [ ] Deployed and verified

## 📞 Support

For deployment issues:
1. Check Supabase status: https://status.supabase.com
2. Review deployment platform docs
3. Check browser console for errors
4. Review Supabase logs

## 🚀 You're Ready!

Your app is production-ready with:
- ✅ Scalable backend (Supabase)
- ✅ Secure authentication
- ✅ Cloud storage
- ✅ Easy deployment
- ✅ Monitoring & backups

Deploy with confidence! 🎉
