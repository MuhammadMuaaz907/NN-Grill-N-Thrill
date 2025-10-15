import ProductCard from '@/components/ProductCard';
// Fetch data (simulate API)

export default function Menu() {
  const products = getProducts(); // Implement fetch
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Our Menu</h1>
        {/* Filters: <select> for category, price slider with @headlessui/react */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </section>
  );
}