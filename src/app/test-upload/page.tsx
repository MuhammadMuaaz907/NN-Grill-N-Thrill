// src/app/test-upload/page.tsx
'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';

export default function TestUploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);

  const handleUpload = (url: string) => {
    setUploadedImage(url);
    console.log('Image uploaded:', url);
  };

  const handleRemove = () => {
    setUploadedImage(undefined);
    console.log('Image removed');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Image Upload</h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Upload Test Image</h2>
              <ImageUpload
                onUpload={handleUpload}
                onRemove={handleRemove}
                currentImage={uploadedImage}
                folder="nn-restaurant/test"
              />
            </div>

            {uploadedImage && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Upload Successful!</h3>
                <p className="text-green-700 mb-2">Image URL:</p>
                <code className="text-sm bg-green-100 p-2 rounded block break-all">
                  {uploadedImage}
                </code>
                <div className="mt-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded test image" 
                    className="max-w-full h-auto rounded-lg border border-green-200"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Drag and drop an image or click to select</li>
                <li>• Images will be automatically optimized by Cloudinary</li>
                <li>• Check the browser console for upload logs</li>
                <li>• Images are stored in the 'nn-restaurant/test' folder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
