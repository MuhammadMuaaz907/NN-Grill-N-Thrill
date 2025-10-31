// Test Cloudinary Integration
// Run this with: node test-cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryConnection() {
  console.log('🔍 Testing Cloudinary connection...');
  
  try {
    // Test 1: Check configuration
    console.log('📋 Configuration:');
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY}`);
    console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'}`);
    
    // Test 2: Test API connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary API connection successful!');
    console.log(`   Status: ${result.status}`);
    
    // Test 3: Test upload functionality (with a simple test)
    console.log('\n🧪 Testing upload functionality...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'nn-restaurant/test',
      public_id: `test-${Date.now()}`,
      overwrite: true
    });
    
    console.log('✅ Test upload successful!');
    console.log(`   Uploaded to: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}`);
    
    // Test 4: Test image transformation
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
    
    console.log('✅ Image transformation test successful!');
    console.log(`   Transformed URL: ${transformedUrl}`);
    
    // Clean up test image
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('🧹 Test image cleaned up');
    
    console.log('\n🎉 All Cloudinary tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database enhancement script in Supabase');
    console.log('2. Test the image upload API endpoint');
    console.log('3. Start the development server: npm run dev');
    console.log('4. Test image upload in the admin interface');
    
  } catch (error) {
    console.log('❌ Cloudinary test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local file has correct credentials');
    console.log('2. Verify your Cloudinary account is active');
    console.log('3. Check your internet connection');
  }
}

testCloudinaryConnection();
