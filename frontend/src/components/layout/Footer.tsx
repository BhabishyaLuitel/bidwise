import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Safety Center', href: '/safety' },
    { label: 'Community Guidelines', href: '/guidelines' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

const SOCIAL_LINKS = [
  { icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com' },
  { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com' },
  { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com' },
  { icon: <Youtube className="h-5 w-5" />, href: 'https://youtube.com' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-white">
              AuctionHub
            </Link>
            <p className="text-sm text-gray-400">
              Your trusted platform for online auctions. Discover unique items and bid with confidence.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-gray-700"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <a href="mailto:support@auctionhub.com" className="hover:text-white">
                  support@auctionhub.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <a href="tel:+1-888-555-0123" className="hover:text-white">
                  +1 (888) 555-0123
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 translate-y-1" />
                <p>
                  123 Auction Street<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm md:flex-row md:space-y-0">
            <div className="flex space-x-4">
              {FOOTER_LINKS.legal.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} AuctionHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}