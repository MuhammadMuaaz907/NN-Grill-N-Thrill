// Simple Cloudinary Test
// Run this with: node test-cloudinary-simple.js

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxbtmzs6l',
  api_key: '577772887119253',
  api_secret: 'vSbj9BXvF6j6eD1GOu3QBhdAaw0',
});

async function testCloudinaryConnection() {
  console.log('🔍 Testing Cloudinary connection...');
  
  try {
    // Test 1: Check API connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary API connection successful!');
    console.log(`   Status: ${result.status}`);
    
    // Test 2: Test upload functionality
    console.log('\n🧪 Testing upload functionality...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJ playg==';
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'nn-restaurant/test',
      public_id: `test-${Date.now()}`,
      overwrite: true
    });
    
    console.log('✅ Test upload successful!');
    console.log(`   Uploaded to: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}`);
    
    // Test 3: Test image transformation
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
    
  } catch (error) {
    console.log('❌ Cloudinary test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Cloudinary credentials');
    console.log('2. Verify your Cloudinary account is active');
    console.log('3. Check your internet connection');
  }
}

testCloudinaryConnection();
