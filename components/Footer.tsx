import React from 'react';
import { Twitter, Instagram, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
             <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-brand-600 to-neon-blue flex items-center justify-center">
                  <span className="text-white font-bold text-xs">7</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  ARTINFINITY7
                </span>
            </div>
            <p className="mt-2 text-slate-500 text-sm">
              Empowering creators with premium digital assets.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-brand-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-pink-500 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-900 pt-8 text-center md:text-left">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} ArtInfinity7. All rights reserved. University Project Demo.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;