import { MorphingLogo } from "./morphing-logo";

export function Footer() {
  return (
    <footer className="mt-20 glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-t border-slate-200/20 dark:border-slate-700/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7.5 9H9V9h2.5v3zm3.5 0h-2.5V9H15v3zm-3.5 3H9v-2h2.5v2zm3.5 0h-2.5v-2H15v2z"/>
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CreatorCalc
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Empowering creators with accurate earnings insights and analytics.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Earnings Calculator</a></li>
              <li><a href="#trends" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Channel Analytics</a></li>
              <li><a href="#analytics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Competitor Research</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Creator Guide</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">RPM Database</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Industry Reports</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200/20 dark:border-slate-700/20 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2024 CreatorCalc. All rights reserved. Made with ❤️ for creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
