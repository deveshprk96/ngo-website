import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Bawaliya Seva Sansthan Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div> */}
              <span className="text-xl font-bold">Bawaliya Seva Sansthan</span>
            </div>
            <p className="text-gray-300 text-sm">
              Making a difference in our community through dedicated service, 
              compassion, and sustainable programs that create lasting positive change.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link href="/events" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Our Programs
              </Link>
              <Link href="/gallery" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Gallery
              </Link>
              <Link href="/team" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Our Team
              </Link>
              <Link href="/documents" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Documents
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <div className="space-y-2">
              <Link href="/donate" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Donate
              </Link>
              <Link href="/volunteer" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Volunteer
              </Link>
              <Link href="/posts" className="block text-gray-300 hover:text-white transition-colors text-sm">
                News & Updates
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Community Street, Civic Center, Mumbai - 400001, Maharashtra, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@hopefoundation.org</span>
              </div>
            </div>
            
            {/* Registration Details */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Registration Details</h4>
              <p className="text-xs text-gray-400">
                Reg. No: REG/2024/NGO/001<br />
                80G Registration: Available<br />
                FCRA: Pending
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Bawaliya Seva Sansthan. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
