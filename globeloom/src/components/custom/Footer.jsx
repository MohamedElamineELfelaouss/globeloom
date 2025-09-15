import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-midnight-900 to-midnight-950 border-t border-midnight-700 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-aurora-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-aurora-400 to-emerald-400 bg-clip-text text-transparent">
                GlobeLoom
              </h3>
              <p className="text-platinum-300 text-base leading-relaxed max-w-md">
                Discover the world with AI-powered travel planning. Create unforgettable journeys, connect with fellow travelers, and explore destinations like never before.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h5 className="text-platinum-200 font-medium text-sm uppercase tracking-wider">Follow Us</h5>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/globeloom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
                >
                  <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://twitter.com/globeloom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-platinum-100 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="/features" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Features</a></li>
              <li><a href="/pricing" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Pricing</a></li>
              <li><a href="/api" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">API</a></li>
              <li><a href="/mobile" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Mobile App</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-platinum-100 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="/about" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">About</a></li>
              <li><a href="/blog" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Blog</a></li>
              <li><a href="/careers" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Careers</a></li>
              <li><a href="/press" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-platinum-100 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="/help" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Help Center</a></li>
              <li><a href="/contact" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Contact</a></li>
              <li><a href="/community" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Community</a></li>
              <li><a href="/status" className="text-platinum-400 hover:text-aurora-400 transition-all duration-200 hover:translate-x-1">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-midnight-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-platinum-400 text-sm">
                © 2025 GlobeLoom. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-xs text-platinum-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>All systems operational</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6">
              <a href="/terms" className="text-platinum-400 hover:text-aurora-400 text-sm transition-colors">
                Terms
              </a>
              <a href="/privacy" className="text-platinum-400 hover:text-aurora-400 text-sm transition-colors">
                Privacy
              </a>
              <a href="/cookies" className="text-platinum-400 hover:text-aurora-400 text-sm transition-colors">
                Cookies
              </a>
              <a href="/security" className="text-platinum-400 hover:text-aurora-400 text-sm transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;