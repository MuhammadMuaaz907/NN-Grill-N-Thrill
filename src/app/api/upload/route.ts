// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxbtmzs6l',
  api_key: process.env.CLOUDINARY_API_KEY || '577772887119253',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'vSbj9BXvF6j6eD1GOu3QBhdAaw0',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'nn-restaurant';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' },
            { format: 'auto' }
          ],
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: {
        url: (result as any).secure_url,
        public_id: (result as any).public_id,
        width: (result as any).width,
        height: (result as any).height,
        format: (result as any).format
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// Get upload signature for client-side uploads
export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'nn-restaurant' },
      process.env.CLOUDINARY_API_SECRET || 'vSbj9BXvF6j6eD1GOu3QBhdAaw0'
    );

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dxbtmzs6l',
        apiKey: process.env.CLOUDINARY_API_KEY || '577772887119253'
      }
    });
  } catch (error) {
    console.error('Signature error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
