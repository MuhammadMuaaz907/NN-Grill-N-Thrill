'use client';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface Product { id: number; name: string; price: number; image: string; }

export default function ProductCard({ name, price, image }: Product) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2">{name}</h3>
        <p className="text-coffee font-bold">${price}</p>
        <button className="mt-4 flex items-center justify-center w-full bg-coffee text-white py-2 rounded hover:bg-sand/80">
          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
        </button>
      </div>
    </div>
  );
}