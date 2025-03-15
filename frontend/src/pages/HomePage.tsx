import { Link } from 'react-router-dom';
import { Gavel, Clock, Shield, TrendingUp, ArrowRight, Package, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

const FEATURED_ITEMS = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=800&q=80',
    currentBid: 16500,
    timeLeft: '2d 4h',
  },
  {
    id: '2',
    title: 'Limited Edition Art Print',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
    currentBid: 890,
    timeLeft: '16h',
  },
  {
    id: '3',
    title: 'Rare Vinyl Collection',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
    currentBid: 450,
    timeLeft: '1d 8h',
  },
];

const FEATURES = [
  {
    icon: <Gavel className="h-6 w-6" />,
    title: 'Real-time Bidding',
    description: 'Place bids instantly and receive live updates on auction status.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure Transactions',
    description: 'Advanced security measures to protect your payments and data.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Timed Auctions',
    description: 'Clear countdown timers and automatic auction closing.',
  },
];

const CATEGORIES = [
  {
    name: 'Electronics',
    icon: <Package className="h-6 w-6" />,
    count: 245,
  },
  {
    name: 'Collectibles',
    icon: <TrendingUp className="h-6 w-6" />,
    count: 189,
  },
  {
    name: 'Art',
    icon: <Users className="h-6 w-6" />,
    count: 324,
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-600 py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Discover Unique Items at <span className="text-blue-300">Auction</span>
            </h1>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of collectors and enthusiasts in bidding on exclusive items.
              Start your journey into the world of online auctions today.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/marketplace">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Explore Auctions
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured Auctions</h2>
            <Link to="/marketplace" className="flex items-center text-blue-600 hover:text-blue-700">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={`/marketplace/${item.id}`}
                className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current Bid</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${item.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {item.timeLeft}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">
            Why Choose Our Platform
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            Popular Categories
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <Link
                key={index}
                to={`/marketplace?category=${category.name}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-blue-500 hover:text-blue-600"
              >
                <div className="flex items-center">
                  <div className="mr-4 rounded-lg bg-gray-100 p-3">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} items</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Bidding?</h2>
          <p className="mb-8 text-blue-100">
            Join our community of buyers and sellers today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}