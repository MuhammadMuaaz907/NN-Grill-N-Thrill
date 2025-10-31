# NN Restaurant - Online Food Ordering System

A modern, responsive restaurant website built with Next.js 15, TypeScript, and Tailwind CSS. This project provides a complete online food ordering experience with cart management, checkout process, and order tracking.

## 🚀 Features

### Core Features
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Menu Management**: Category-based menu with search functionality
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Complete guest checkout with form validation
- **Order Tracking**: Real-time order status tracking
- **Product Details**: Modal with detailed product information

### Technical Features
- **Next.js 15**: Latest App Router with TypeScript
- **Tailwind CSS**: Modern styling with responsive design
- **React Context**: State management for cart functionality
- **Error Handling**: Error boundaries and fallback UI
- **Loading States**: Skeleton loading and spinners
- **SEO Optimized**: Meta tags, structured data, and accessibility

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.14
- **State Management**: React Context + Zustand
- **UI Components**: Custom components with Headless UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nn-restaurant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── guestcheckout/     # Checkout page
│   ├── menu/              # Menu page
│   ├── order-confirmation/ # Order confirmation
│   ├── order-tracking/    # Order tracking
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── CartDrawer.tsx     # Shopping cart drawer
│   ├── CheckoutForm.tsx   # Checkout form
│   ├── ErrorBoundary.tsx  # Error handling
│   ├── LoadingSpinner.tsx # Loading components
│   └── ...               # Other components
├── context/              # React Context
│   └── CartContext.tsx   # Cart state management
├── lib/                  # Data and utilities
│   ├── data.ts          # Restaurant info and categories
│   └── menuData.ts      # Menu items data
└── types/               # TypeScript definitions
    └── index.ts         # Type interfaces
```

## 🎯 Key Components

### Cart Management
- Add/remove items with quantity control
- Real-time price calculations
- Session storage for persistence
- Recommended items suggestions

### Checkout Process
- Guest checkout (no registration required)
- Form validation with React Hook Form
- Order confirmation with tracking ID
- API integration for order processing

### Order Tracking
- Real-time order status updates
- Delivery time estimation
- Order history lookup
- Customer support integration

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 📱 Mobile Responsiveness

The website is fully responsive and optimized for:
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up

## 🎨 Customization

### Branding
- Update restaurant info in `src/lib/data.ts`
- Modify colors in Tailwind configuration
- Replace logo and images in `public/` folder

### Menu Management
- Add/remove categories in `src/lib/data.ts`
- Update menu items in `src/lib/menuData.ts`
- Customize pricing and descriptions

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SITE_NAME="NN Restaurant"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### API Integration
- Menu API: `/api/menu`
- Orders API: `/api/orders`
- Customize API routes as needed

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript types and imports
2. **Styling Issues**: Verify Tailwind CSS configuration
3. **API Errors**: Check network requests and error handling

### Development Tips
- Use `npm run build` to test production build
- Check browser console for errors
- Use React Developer Tools for debugging

## 📈 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Caching**: Optimized for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- **Phone**: 0325 3652040
- **Email**: info@nnrestaurant.com
- **Address**: Gadap Town, Karachi

---

**Built with ❤️ for NN Restaurant**
