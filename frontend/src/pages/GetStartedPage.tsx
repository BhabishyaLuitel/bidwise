import { Link } from 'react-router-dom';
import { Gavel, Shield, DollarSign, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const FEATURES = [
  {
    icon: <Gavel className="h-12 w-12 text-blue-600" />,
    title: 'Place Bids',
    description: 'Participate in auctions and bid on items you love. Our real-time bidding system ensures a fair and exciting experience.',
  },
  {
    icon: <Shield className="h-12 w-12 text-green-600" />,
    title: 'Secure Transactions',
    description: 'Every transaction is protected by our secure payment system and buyer protection program.',
  },
  {
    icon: <DollarSign className="h-12 w-12 text-purple-600" />,
    title: 'Sell Items',
    description: 'Create listings and reach thousands of potential buyers. Set your terms and watch the bids roll in.',
  },
  {
    icon: <Award className="h-12 w-12 text-yellow-600" />,
    title: 'Build Reputation',
    description: 'Earn ratings and reviews from successful transactions. Build trust within our community.',
  },
];

const STEPS = [
  {
    number: 1,
    title: 'Create an Account',
    description: 'Sign up with your email and choose between a buyer or seller account.',
  },
  {
    number: 2,
    title: 'Complete Your Profile',
    description: 'Add your details and verify your account for enhanced security.',
  },
  {
    number: 3,
    title: 'Start Bidding or Selling',
    description: 'Browse listings or create your first auction listing.',
  },
];

export function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
              Welcome to <span className="text-blue-600">BidWise</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Your journey into smart bidding starts here. Learn how to make the most of our platform
              and start participating in exciting auctions.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/auth">
                <Button size="lg">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg">
                  Browse Auctions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Everything You Need to Succeed
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Get Started in Three Simple Steps
          </h2>
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-100 md:left-1/2"></div>
              {STEPS.map((step, index) => (
                <div key={index} className="relative mb-12 md:flex md:justify-between">
                  <div className={`mb-8 md:mb-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:order-2'}`}>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
                        Step {step.number}
                      </span>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white md:left-1/2 md:-ml-4">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of users who trust BidWise for their online auctions.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}