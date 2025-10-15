import { Instagram, Facebook } from 'lucide-react'; // Add more as needed

export default function Footer() {
  return (
    <footer className="bg-coffee text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-serif mb-4">Florentine</h3>
          <p>Your favorite café, delivered.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/menu">Menu</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <form className="flex"><input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-l" /><button className="bg-sand px-4 rounded-r">Subscribe</button></form>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4"><Instagram className="w-5 h-5" /><Facebook className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="border-t border-sand/30 mt-8 pt-4 text-center">© 2025 Florentine. All rights reserved.</div>
    </footer>
  );
}