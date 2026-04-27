# ResumeForge - Resume Builder with Supabase Backend

A modern, full-featured resume builder application with authentication, draft saving, and PDF export capabilities.

## ✨ Features

- **Authentication**: Secure sign-up and login using Supabase Auth
- **Multiple Templates**: Classic, Modern, and Minimal resume templates
- **Auto-Save Drafts**: Save incomplete resumes as drafts and continue later
- **Resume History**: Access all previously created resumes
- **PDF Export**: Download resume as PDF instantly
- **Cloud Storage**: Resumes and PDFs stored securely in Supabase

## 🚀 Setup Instructions

### Step 1: Set Up Supabase Database

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to the **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `SUPABASE_SETUP.sql`
5. Click **Run**

This will create:
- `resume_drafts` table - for saving incomplete resumes
- `resume_history` table - for storing completed resumes
- Row Level Security (RLS) policies to protect user data

### Step 2: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it: `resume-pdfs`
4. **Uncheck** "Public bucket"
5. Click **Create bucket**

### Step 3: Configure Storage Policies

In the **resume-pdfs** bucket settings:

1. Click on the bucket
2. Go to **Policies**
3. Add policy with these rules:
   - For **SELECT**: Users can download their own files
   - For **INSERT**: Users can upload to their user folder
   - For **DELETE**: Users can delete their own files

Or use SQL Editor (run **each one separately**):

**Query 1:**
```sql
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resume-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
```

**Query 2:**
```sql
CREATE POLICY "Users can download their own PDFs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resume-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
```

**Query 3:**
```sql
CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resume-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
```

⚠️ **Important:** Run each query separately - don't paste all three at once!

### Step 4: File Overview

The project structure:

```
Resume Builder/
├── landing.html          # Landing page with login/signup buttons
├── login.html            # Login page
├── signup.html           # Sign-up page
├── index.html            # Main resume builder (requires auth)
├── css/
│   └── style.css         # Application styles
├── js/
│   ├── supabase-config.js   # Supabase initialization
│   ├── auth.js             # Authentication logic
│   ├── storage.js          # Draft & history management
│   └── script.js           # Resume builder logic
└── SUPABASE_SETUP.sql    # Database setup script
```

## 🔐 How Authentication Works

1. **Sign Up** (`signup.html`): Create account with email/password
2. **Login** (`login.html`): Sign in with credentials
3. **Protected Routes**: Main builder requires authentication
4. **Auto-Redirect**: Unauthenticated users redirected to landing page
5. **Logout**: Clear session and return to landing page

## 💾 Features Explained

### Save Draft
- Click **"💾 Save Draft"** button
- Optionally name your draft
- Resume data saved to `resume_drafts` table
- Can load and edit saved drafts anytime

### Resume History
- Click **"📋 History"** button
- View all saved drafts and completed resumes
- Load any previous resume
- Download PDFs directly
- Delete unwanted entries

### Download PDF
- Click **"⬇ Download PDF"** button
- Resume saved to history with PDF URL
- PDF link stored in `resume_history` table
- Access PDF from history anytime

## 📊 Database Schema

### resume_drafts table
```
id          UUID (primary key)
user_id     UUID (foreign key → auth.users)
name        TEXT
content     JSONB (resume data structure)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### resume_history table
```
id          UUID (primary key)
user_id     UUID (foreign key → auth.users)
name        TEXT
content     JSONB (resume data structure)
template    TEXT (classic, modern, minimal)
pdf_url     TEXT (link to PDF in storage)
created_at  TIMESTAMP
```

## 🛡️ Security

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication Required**: Main app protected by auth check
- **Secure Credentials**: Supabase URL and key in config file
- **HTTPS Only**: All communication encrypted

## 🔧 API Methods

### Authentication (AuthManager)
- `checkAuth()` - Check if user is authenticated
- `getCurrentUser()` - Get current user object
- `logout()` - Sign out user

### Storage (StorageManager)
- `saveDraft(resumeData, draftName)` - Create new draft
- `updateDraft(draftId, resumeData)` - Update existing draft
- `getDrafts()` - Fetch all user's drafts
- `getDraft(draftId)` - Fetch single draft
- `deleteDraft(draftId)` - Delete draft
- `saveToHistory(resumeData, pdfFile, templateName)` - Save completed resume
- `getHistory()` - Fetch all completed resumes
- `deleteHistory(historyId)` - Delete history entry

## 🚀 Usage Flow

1. Visit `landing.html`
2. Click "Sign Up" or "Login"
3. Create account or sign in
4. Redirected to main builder (`index.html`)
5. Build resume using form fields
6. Click "💾 Save Draft" to save progress
7. Click "📋 History" to manage drafts and resumes
8. Click "⬇ Download PDF" to export resume
9. Click "🚪 Logout" to sign out

## 🐛 Troubleshooting

### "Redirect to landing page" - Auth check failing
- Clear browser cache
- Check Supabase credentials in `js/supabase-config.js`
- Verify user is logged in

### "Error saving draft"
- Check user authentication
- Verify database tables created (run `SUPABASE_SETUP.sql`)
- Check RLS policies are enabled

### PDF download fails
- Verify storage bucket `resume-pdfs` exists
- Check storage policies are configured
- PDF file size < 100MB

## 📝 Notes

- Resume data stored as JSON in database for flexibility
- Photos stored as base64 in draft content
- PDFs uploaded to separate storage bucket
- All data encrypted in transit (HTTPS)
- Automatic timestamps on all records

## 🎨 Customization

You can customize:
- **Colors**: Edit CSS variables in `style.css`
- **Templates**: Modify resume rendering in `script.js`
- **Fields**: Add/remove form sections in `index.html`

## 📞 Support

For issues with:
- **Supabase**: Visit https://supabase.com/docs
- **Authentication**: Check auth.js implementation
- **Storage**: Review storage.js methods

---

**Version**: 1.0  
**Last Updated**: 2024  
**Framework**: Vanilla JavaScript + Supabase
