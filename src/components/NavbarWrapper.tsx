// src/components/NavbarWrapper.tsx
'use client';

import { Navbar } from './Navbar';

interface NavbarWrapperProps {
  onLocationClick?: () => void;
  location?: string;
  phoneNumber?: string;
  hasBanner?: boolean;
}

export function NavbarWrapper({ hasBanner = false, ...props }: NavbarWrapperProps) {
  // Banner is approximately 60-70px tall (py-3 + content)
  const bannerHeight = '4.5rem'; // ~72px
  
  return (
    <div 
      className="fixed left-0 right-0 z-50 transition-all duration-300"
      style={{ 
        top: hasBanner ? bannerHeight : '0'
      }}
    >
      <Navbar {...props} />
    </div>
  );
}

