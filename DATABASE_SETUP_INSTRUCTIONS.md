# 🗄️ Database Setup Instructions

## **Step 1: Run Database Enhancement Script**

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire content from `database-enhancement.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the script

## **Step 2: Verify Tables Created**

After running the script, you should see these new tables:
- ✅ `user_profiles`
- ✅ `customer_orders` 
- ✅ `restaurant_settings`
- ✅ `promotions`
- ✅ `carousel_items`
- ✅ `daily_analytics`

And these columns added to existing tables:
- ✅ `cloudinary_url` added to `menu_items`
- ✅ `image_optimized` added to `menu_items`
- ✅ `cloudinary_url` added to `categories`

## **Step 3: Test the Setup**

1. Visit: `http://localhost:3000/test-upload`
2. Try uploading an image
3. Check if the image appears and URL is generated
4. Verify the image is stored in your Cloudinary account

## **Step 4: Check Cloudinary Dashboard**

1. Go to your Cloudinary Dashboard
2. Check the **Media Library**
3. Look for the `nn-restaurant` folder
4. Verify uploaded images appear there

## **What's Next?**

Once the database setup is complete:
1. ✅ Image upload functionality will work
2. ✅ Admin can manage images through Cloudinary
3. ✅ Images will be automatically optimized
4. ✅ Global CDN will serve images fast worldwide

## **Troubleshooting**

If you encounter issues:
1. **Database errors**: Check if all tables were created successfully
2. **Upload errors**: Verify Cloudinary credentials in `.env.local`
3. **Image not appearing**: Check browser console for errors
4. **Permission errors**: Ensure RLS policies are properly set up

## **Success Indicators**

✅ Database enhancement script runs without errors  
✅ Test upload page loads successfully  
✅ Images upload to Cloudinary  
✅ Images display correctly on the page  
✅ Image URLs are generated and working  
