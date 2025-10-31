# 🚀 Supabase Database Setup Guide

## **📋 Prerequisites**
- Node.js installed
- Supabase account (free at [supabase.com](https://supabase.com))

## **🔧 Step-by-Step Setup**

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: `nn-restaurant`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
7. Click "Create new project"

### **2. Get Project Credentials**
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Save these for environment variables

### **3. Setup Database Schema**
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database-setup.sql`
3. Paste and run the SQL script
4. This will create all tables, indexes, and sample data

### **4. Configure Environment Variables**
Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_NAME=NN Restaurant
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **5. Setup Storage Bucket**
1. Go to **Storage** in Supabase dashboard
2. The `menu-images` bucket should be created automatically
3. If not, create it manually with public access

### **6. Test the Setup**
1. Run `npm run dev`
2. Visit `http://localhost:3000/admin/login`
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

## **📊 Database Schema**

### **Tables Created:**
- **`categories`** - Menu categories
- **`menu_items`** - Food items with prices
- **`orders`** - Customer orders
- **`admin_users`** - Admin authentication

### **Features Included:**
- ✅ Row Level Security (RLS)
- ✅ Automatic timestamps
- ✅ JSONB for flexible data storage
- ✅ Proper indexes for performance
- ✅ Sample data for testing

## **🔐 Security Features**
- Row Level Security enabled
- Admin-only access to sensitive data
- Public read access for menu items
- Secure authentication system

## **📈 Free Tier Limits**
- **50,000 rows** (plenty for restaurant orders)
- **500MB database storage**
- **1GB file storage** (for menu images)
- **2GB bandwidth** per month

## **🚀 Next Steps**
1. **Customize menu items** via admin panel
2. **Upload food images** to storage
3. **Configure real authentication** (JWT tokens)
4. **Add email notifications** for orders
5. **Implement real-time updates**

## **🛠️ Troubleshooting**

### **Common Issues:**
1. **Environment variables not loading**
   - Restart development server
   - Check `.env.local` file location

2. **Database connection errors**
   - Verify Supabase URL and key
   - Check if tables were created properly

3. **Authentication issues**
   - Ensure admin user exists in database
   - Check password in database

### **Support:**
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**🎉 Your restaurant ordering system is now powered by Supabase!**
