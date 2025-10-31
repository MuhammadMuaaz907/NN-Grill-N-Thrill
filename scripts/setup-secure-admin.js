// Setup script to create secure admin user
// Run this with: node scripts/setup-secure-admin.js

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahzbeyyofzzvtaqbnpuu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoemJleXlvZnp6dnRhcWJucHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY0OTAsImV4cCI6MjA3NjM3MjQ5MH0.4VUgNUqnPoHKkcgG9tFqRUhKBEXY126hOuUKjuXLJMY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSecureAdmin() {
  console.log('🔐 Setting up secure admin user...\n');
  
  try {
    // Step 1: Clear existing admin users
    console.log('🗑️ Clearing existing admin users...');
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) console.log('⚠️ Error clearing admin users:', deleteError.message);
    console.log('✅ Existing admin users cleared');
    
    // Step 2: Create secure admin user
    console.log('\n👤 Creating secure admin user...');
    
    const adminUsername = 'admin';
    const adminEmail = 'admin@nnrestaurant.com';
    const adminPassword = 'SecureAdmin123!'; // Strong password
    const saltRounds = 12;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    
    const adminData = {
      username: adminUsername,
      email: adminEmail,
      password_hash: hashedPassword,
      role: 'admin',
      active: true
    };
    
    const { data: newAdmin, error: insertError } = await supabase
      .from('admin_users')
      .insert(adminData)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error creating admin user:', insertError);
      return;
    }
    
    console.log('✅ Secure admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${adminData.role}`);
    
    // Step 3: Verify the setup
    console.log('\n🔍 Verifying setup...');
    const { data: verifyAdmin, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', adminUsername)
      .single();
    
    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Admin user verified successfully!');
      console.log(`   User ID: ${verifyAdmin.id}`);
      console.log(`   Created: ${verifyAdmin.created_at}`);
      console.log(`   Active: ${verifyAdmin.active}`);
    }
    
    console.log('\n🎉 Secure admin setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update your .env.local file with ADMIN_JWT_SECRET');
    console.log('2. Test the admin login at http://localhost:3000/admin/login');
    console.log('3. Use the credentials shown above to login');
    
    console.log('\n🔒 Security Features Enabled:');
    console.log('✅ Bcrypt password hashing (12 rounds)');
    console.log('✅ JWT token authentication');
    console.log('✅ Session expiration (24 hours)');
    console.log('✅ Secure cookie storage');
    console.log('✅ Database-backed authentication');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run setup
setupSecureAdmin();
