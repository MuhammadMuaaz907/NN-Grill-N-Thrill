'use client';
import { useState } from 'react';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-2xl font-serif text-coffee">Florentine</a>
          <ul className="hidden md:flex space-x-6">
            <li><a href="/" className="hover:text-coffee">Home</a></li>
            <li className="relative group">
              <a href="/menu" className="hover:text-coffee">Menu</a>
              <ul className="absolute hidden group-hover:block bg-white shadow-lg mt-2 rounded-lg p-2 space-y-1">
                <li><a href="/menu/coffee" className="block px-4 py-2 hover:bg-sand">Coffee</a></li>
                <li><a href="/menu/tea" className="block px-4 py-2 hover:bg-sand">Tea</a></li>
                <li><a href="/menu/pastries" className="block px-4 py-2 hover:bg-sand">Pastries</a></li>
              </ul>
            </li>
            <li><a href="/about" className="hover:text-coffee">About</a></li>
            <li><a href="/contact" className="hover:text-coffee">Contact</a></li>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
          <User className="w-5 h-5 cursor-pointer" />
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>
      {isMenuOpen && <MobileMenu />} {/* Implement simple mobile dropdown */}
    </header>
  );
}