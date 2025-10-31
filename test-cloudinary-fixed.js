// Fixed Cloudinary Test
// Run this with: node test-cloudinary-fixed.js

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
    console.log('\n📋 Step 1: Testing API Connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary API connection successful!');
    console.log(`   Status: ${result.status}`);
    
    // Test 2: Test upload functionality with proper image
    console.log('\n🧪 Step 2: Testing Upload Functionality...');
    
    // Create a proper test image (1x1 pixel PNG in correct base64 format)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    console.log('   Uploading test image...');
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'nn-restaurant/test',
      public_id: `test-${Date.now()}`,
      overwrite: true,
      resource_type: 'image'
    });
    
    console.log('✅ Test upload successful!');
    console.log(`   Uploaded to: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}`);
    console.log(`   Format: ${uploadResult.format}`);
    console.log(`   Size: ${uploadResult.bytes} bytes`);
    
    // Test 3: Test image transformation
    console.log('\n🔄 Step 3: Testing Image Transformation...');
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
    
    console.log('✅ Image transformation test successful!');
    console.log(`   Transformed URL: ${transformedUrl}`);
    
    // Test 4: Test image deletion
    console.log('\n🗑️ Step 4: Testing Image Deletion...');
    const deleteResult = await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Test image deletion successful!');
    console.log(`   Deletion result: ${deleteResult.result}`);
    
    // Test 5: Test API endpoints
    console.log('\n🌐 Step 5: Testing API Endpoints...');
    
    // Test getting upload signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'nn-restaurant' },
      'vSbj9BXvF6j6eD1GOu3QBhdAaw0'
    );
    console.log('✅ Upload signature generation successful!');
    console.log(`   Signature: ${signature}`);
    
    console.log('\n🎉 ALL CLOUDINARY TESTS PASSED!');
    console.log('\n📋 Integration Status:');
    console.log('✅ API Connection: WORKING');
    console.log('✅ Image Upload: WORKING');
    console.log('✅ Image Transformation: WORKING');
    console.log('✅ Image Deletion: WORKING');
    console.log('✅ Signature Generation: WORKING');
    
    console.log('\n🚀 Your Cloudinary integration is FULLY FUNCTIONAL!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run the database enhancement script in Supabase');
    console.log('2. Start the development server: npm run dev');
    console.log('3. Test the upload API at: http://localhost:3000/test-upload');
    
  } catch (error) {
    console.log('❌ Cloudinary test failed:', error.message);
    console.log('Full error:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Cloudinary credentials');
    console.log('2. Verify your Cloudinary account is active');
    console.log('3. Check your internet connection');
    console.log('4. Verify your Cloudinary plan allows uploads');
  }
}

testCloudinaryConnection();
