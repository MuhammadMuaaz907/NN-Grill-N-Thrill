'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/hero1.jpg', '/hero2.jpg']; // Download placeholders from site or use Unsplash café images.

  return (
    <main>
      <section className="relative h-screen overflow-hidden">
        {slides.map((src, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 ${i === currentSlide ? 'block' : 'hidden'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image src={src} alt="Café Hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-serif mb-4">Your Favorite Café Picks</h1>
                <p className="text-xl mb-8">Just a Click Away</p>
                <a href="/menu" className="bg-coffee px-8 py-4 rounded-full text-lg hover:bg-sand/80">Order Now</a>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Dots for carousel */}
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-8">Featured Picks</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Render products from data */}
            {featuredProducts.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        </div>
      </section>

      {/* Category Banners */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-6 container mx-auto px-4">
          {categories.map((cat) => (
            <div key={cat.name} className="relative h-64 overflow-hidden rounded-lg">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a href={`/menu/${cat.slug}`} className="text-white text-xl font-serif">{cat.name}</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// Sample data (move to lib/data.ts later)
const featuredProducts = [
  { id: 1, name: 'Espresso', price: 5.99, image: '/espresso.jpg', category: 'Coffee' },
  // Add 3-5 more
];

const categories = [
  { name: 'Coffee', slug: 'coffee', image: '/coffee.jpg' },
  { name: 'Tea', slug: 'tea', image: '/tea.jpg' },
  { name: 'Pastries', slug: 'pastries', image: '/pastries.jpg' },
];