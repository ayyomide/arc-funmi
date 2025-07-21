import { Facebook, Linkedin, Youtube, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Arcfunmi */}
          <div>
            <h3 className="text-xl font-bold mb-4">Arcfunmi</h3>
            <p className="text-gray-400 text-sm">
            Documenting Nigerian, African and Global Architecture, Engineering and Construction
            </p>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/architecture" className="text-gray-400 hover:text-white transition-colors">Architecture</Link></li>
              <li><Link href="/engineering" className="text-gray-400 hover:text-white transition-colors">Engineering</Link></li>
              <li><Link href="/construction" className="text-gray-400 hover:text-white transition-colors">Construction</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link></li>
              <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Social Media Icons and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-800">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-6 h-6" />
            </Link>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 Arcfunmi. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 