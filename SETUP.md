
# Precision Wheel Alignment Hub - Setup Guide

This guide explains how to configure key features of your Precision Wheel Alignment Hub application.

## Table of Contents
1. [Setting up Demo Video](#setting-up-demo-video)
2. [Admin User Role Setup](#admin-user-role-setup)
3. [Creating Admin Portal Subdomain](#creating-admin-portal-subdomain)
4. [Additional Configuration](#additional-configuration)

## Setting up Demo Video

The "Watch Demo" button on the homepage opens a video modal. To configure your demo video:

### Option 1: YouTube Video
1. Open `src/components/VideoModal.tsx`
2. Find the `videoUrl` prop or iframe src
3. Replace with your YouTube embed URL:
   ```typescript
   const videoUrl = "https://www.youtube.com/embed/YOUR_VIDEO_ID";
   ```

### Option 2: Direct Video File
1. Upload your video file to the `public` folder (e.g., `public/demo-video.mp4`)
2. Update the VideoModal component to use the video element:
   ```typescript
   <video controls width="100%" height="400">
     <source src="/demo-video.mp4" type="video/mp4" />
   </video>
   ```

### Option 3: External Video Service
Replace the iframe src with your preferred video hosting service URL (Vimeo, Wistia, etc.)

## Admin User Role Setup

### Prerequisites
- Supabase project connected
- User authentication working
- Database migrations applied

### Step 1: Create Admin User Account
1. Navigate to your application's signup page
2. Create a user account with your admin email
3. Verify the email if email confirmation is enabled

### Step 2: Assign Admin Role via Database
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Run the following query to assign admin role:

```sql
-- Replace 'admin@example.com' with your actual admin email
INSERT INTO public.user_roles (user_id, role)
SELECT 
  p.id,
  'admin'::app_role
FROM public.profiles p
WHERE p.email = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Step 3: Verify Admin Access
1. Log in with your admin account
2. Navigate to `/admin` route
3. You should see the admin portal interface

### Alternative: Using the Admin Assignment Function
You can also use the secure function created in the database:

```sql
SELECT public.assign_admin_role('admin@example.com');
```

## Creating Admin Portal Subdomain

### Option 1: Subdomain via Lovable (Recommended)
1. Go to your Lovable project settings
2. Navigate to Domains section
3. Add a custom domain like `admin.yourdomain.com`
4. Configure your DNS to point to Lovable
5. Update your application routing to detect subdomain

### Option 2: Route-based Admin Portal
Currently, the admin portal is accessible at `/admin`. To enhance security:

1. **Update Route Protection**:
   ```typescript
   // In App.tsx, add admin route protection
   <Route path="/admin/*" element={
     <ProtectedAdminRoute>
       <AdminPortal />
     </ProtectedAdminRoute>
   } />
   ```

2. **Create Protected Admin Component**:
   ```typescript
   const ProtectedAdminRoute = ({ children }) => {
     const { userRole } = useAuth();
     return userRole === 'admin' ? children : <Navigate to="/auth" />;
   };
   ```

### Option 3: Separate Admin Application
For maximum security, deploy a separate admin application:

1. Create a new Lovable project for admin-only features
2. Use the same Supabase backend
3. Deploy to `admin.yourdomain.com`
4. Implement stricter authentication policies

## Additional Configuration

### Environment Variables
If using external services, configure these in your Supabase Edge Functions:

```bash
# For video analytics (optional)
VIDEO_ANALYTICS_KEY=your_key_here

# For enhanced security (optional)
ADMIN_SECRET_KEY=your_secret_here
```

### Security Recommendations
1. **Enable MFA for Admin Accounts**: Consider implementing multi-factor authentication
2. **IP Restriction**: Restrict admin access to specific IP addresses
3. **Audit Logging**: Monitor all admin actions (already implemented via useSecurityAudit)
4. **Session Timeout**: Implement shorter session timeouts for admin users

### Database Indexes (Optional)
For better performance with large datasets:

```sql
-- Create index on user_roles for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role 
ON public.user_roles(user_id, role);

-- Create index on alignment_records for user queries
CREATE INDEX IF NOT EXISTS idx_alignment_records_user_id_created 
ON public.alignment_records(user_id, created_at DESC);
```

## Troubleshooting

### Admin Role Not Working
1. Check if user exists in `profiles` table
2. Verify role exists in `user_roles` table
3. Check RLS policies are enabled
4. Verify `has_role()` function is working

### Video Not Loading
1. Check video URL is publicly accessible
2. Verify CORS settings for external videos
3. Test video URL directly in browser
4. Check browser console for errors

### Subdomain Issues
1. Verify DNS settings are correct
2. Check SSL certificate is valid
3. Ensure routing logic handles subdomain detection
4. Test subdomain access without authentication first

## Support
- Check the browser console for errors
- Review Supabase logs for backend issues
- Test each component individually
- Verify database permissions and policies

---

For additional help, refer to the main README.md or contact your development team.
