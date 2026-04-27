# 🚀 Quick Start Guide - ResumeForge

## What Was Added

Your Resume Builder now has:
✅ Authentication (Login/Signup)
✅ Draft saving functionality
✅ Resume history tracking
✅ PDF storage in Supabase
✅ Complete backend integration

## Files Created/Updated

### New Files:
- `landing.html` - Landing page with login/signup buttons
- `login.html` - Login page
- `signup.html` - Sign-up page
- `js/supabase-config.js` - Supabase client configuration
- `js/auth.js` - Authentication management
- `js/storage.js` - Draft and history management
- `SUPABASE_SETUP.sql` - Database setup script
- `README.md` - Full documentation

### Updated Files:
- `index.html` - Added auth checks, save draft, history, logout features

## 🔑 Supabase Credentials Already Added

Your credentials are already configured in:
- **File**: `js/supabase-config.js`
- **URL**: https://kuymqrxlghqekmsbuspz.supabase.co
- **Key**: Configured (anon key added)

## ⚡ Next Steps (IMPORTANT!)

### 1. Set Up Database Tables

**Go to Supabase Dashboard:**
1. Open https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy all text from `SUPABASE_SETUP.sql` file
6. Paste into the query editor
7. Click **Run**

### 2. Create Storage Bucket

**In Supabase Dashboard:**
1. Go to **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Name: `resume-pdfs`
4. **Uncheck** "Public bucket"
5. Click **"Create Bucket"**

### 3. Add Storage Policies

**⚠️ IMPORTANT: Run each policy separately (one at a time)**

**Best Method: Use Supabase Dashboard UI**

1. Go to: https://app.supabase.com → Your Project
2. Click: **Storage** (left sidebar)
3. Click: **resume-pdfs** bucket
4. Click: **Policies** tab
5. Click: **New Policy**
6. Select: **For inserts** → Create
7. In the policy editor, set:
   - Allowed operation: INSERT
   - For authenticated users
   - With condition: `(storage.foldername(name))[1] = auth.uid()::text`
8. Save policy
9. Repeat steps 5-8 for SELECT (download) and DELETE operations

**Alternative: SQL Method (if dashboard method fails)**

Go to SQL Editor and run **EACH ONE SEPARATELY** (don't paste all three):

⚠️ **IMPORTANT:** Only copy the SQL code inside the box, NOT the gray box borders

**Query 1 - Copy ONLY the lines between here:**

```
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resume-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
```

Steps:
1. Click: New Query in SQL Editor
2. Select: The SQL text above (NOT the gray box)
3. Copy: Ctrl+C
4. Paste: Into SQL Editor
5. Run: Click Run button
6. ✓ Wait for success

**Query 2 - After Query 1 completes, click New Query and paste this:**

```
CREATE POLICY "Users can download their own PDFs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resume-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
```

1. Click: New Query
2. Paste: The SQL above
3. Run: Click Run
4. ✓ Wait for success

**Query 3 - After Query 2 completes, click New Query and paste this:**

```
CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resume-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
```

1. Click: New Query
2. Paste: The SQL above
3. Run: Click Run
4. ✓ Wait for success

**✓ Done!** All three policies created.

## 🌐 How to Use

### For Testing:

1. **Start**: Open `landing.html` in browser
2. **Sign Up**: Create test account
3. **Use App**: Fill in resume details
4. **Save Draft**: Click "💾 Save Draft" button
5. **View History**: Click "📋 History" to see saved drafts
6. **Download**: Click "⬇ Download PDF"
7. **Logout**: Click "🚪 Logout"

### User Flow:

```
landing.html (Sign Up / Login)
    ↓
signup.html / login.html (Create account or sign in)
    ↓
index.html (Main builder - requires auth)
    ↓
Can: Save drafts, view history, download PDFs
    ↓
logout() - Return to landing.html
```

## 📋 Features Overview

| Feature | Button | What It Does |
|---------|--------|-------------|
| Save Draft | 💾 Save Draft | Saves current progress |
| View History | 📋 History | Shows all drafts & resumes |
| Download PDF | ⬇ Download PDF | Exports as PDF & saves to history |
| Logout | 🚪 Logout | Sign out & return to landing |

## 🔒 Security

- ✅ User authentication required for main app
- ✅ Each user can only see their own data
- ✅ Passwords encrypted by Supabase
- ✅ All data protected with Row Level Security (RLS)
- ✅ PDFs stored securely in storage bucket

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (Firebase alternative)
- **Auth**: Supabase Auth (email/password)
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (for PDFs)
- **PDF**: html2pdf.js library

## ✅ Checklist

After setup, verify everything works:

- [ ] Database tables created (check Supabase SQL)
- [ ] Storage bucket created (`resume-pdfs`)
- [ ] Storage policies added
- [ ] Can sign up in `signup.html`
- [ ] Can login in `login.html`
- [ ] Redirected to builder after login
- [ ] Can save drafts
- [ ] Can view history
- [ ] Can download PDF
- [ ] Can logout

## 🐛 If Something Doesn't Work

**Issue: "Redirects to landing immediately after login"**
- Check Supabase credentials in `js/supabase-config.js`
- Open browser console (F12) for errors
- Verify user created in Supabase Auth

**Issue: "Can't save draft"**
- Check database tables exist (run SUPABASE_SETUP.sql again)
- Check RLS policies are enabled
- Open console to see error message

**Issue: "PDF download fails"**
- Verify `resume-pdfs` bucket exists
- Check storage policies are added
- File might be too large

**Issue: Console shows CORS errors**
- This is normal - Supabase handles it
- Errors won't affect functionality

## 📞 Need Help?

Check:
1. Browser console (F12) for error messages
2. Supabase dashboard → Logs for database errors
3. README.md for detailed documentation

---

**You're all set! 🎉**

Your Resume Builder is now fully integrated with:
- ✅ User authentication
- ✅ Cloud storage
- ✅ Draft management
- ✅ Resume history
- ✅ PDF exports

Start by opening `landing.html`
