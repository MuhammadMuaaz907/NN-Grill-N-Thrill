// src/components/Footer.tsx
'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/data';

interface FooterProps {
  restaurantName: string;
}

export const Footer: React.FC<FooterProps> = ({ restaurantName }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const followUs = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/florentine',
      label: 'Follow us on Facebook'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/florentine',
      label: 'Follow us on Instagram'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/florentine',
      label: 'Follow us on Twitter'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif italic text-pink-400">
              {restaurantName}
            </h3>
            <p className="text-gray-400 text-sm">
              Experience premium dining with our carefully crafted menu and exceptional service.
            </p>
            <div className="flex gap-3 pt-4">
              {followUs.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition duration-200"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-pink-400 transition duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Hours</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Monday - Friday: 8:00 AM - 11:00 PM</li>
              <li>Saturday: 9:00 AM - 12:00 AM</li>
              <li>Sunday: 10:00 AM - 10:00 PM</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 items-start text-gray-400">
                <Phone size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
                <a
                  href={`tel:${RESTAURANT_INFO.phoneNumber.replace(/\s/g, '')}`}
                  className="hover:text-pink-400 transition duration-200"
                >
                  {RESTAURANT_INFO.phoneNumber}
                </a>
              </div>
              <div className="flex gap-3 items-start text-gray-400">
                <Mail size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@florentine.pk"
                  className="hover:text-pink-400 transition duration-200"
                >
                  info@florentine.pk
                </a>
              </div>
              <div className="flex gap-3 items-start text-gray-400">
                <MapPin size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
                <span>
                  Clifton, Karachi
                  <br />
                  Sindh, Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p>
              &copy; {currentYear} {restaurantName}. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 md:justify-end">
            <a href="/privacy" className="hover:text-pink-400 transition duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-pink-400 transition duration-200">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};