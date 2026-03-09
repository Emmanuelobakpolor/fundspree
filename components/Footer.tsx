'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { XIcon, LinkedInIcon, GitHubIcon, TelegramIcon } from './icons/CryptoIcons';
import AuthModal from './AuthModal';

export function CallToAction() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
    <section id="get-started" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gold-gradient rounded-[3rem] p-12 md:p-20 text-center text-black relative overflow-hidden shadow-[0_20px_60px_rgba(212,175,55,0.3)] group transition-all hover:scale-[1.01]"
        >
          {/* Animated Background decorative bubbles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 transition-transform duration-1000 group-hover:scale-110"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Start Your Digital <br /> Finance <span className="italic">Journey</span> Today
            </h2>
            <p className="text-lg md:text-xl font-medium mb-12 opacity-80">
              Join thousands of elite investors using FundSphere for secure and seamless BTC & USDT transactions worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button onClick={() => setShowModal(true)} className="w-full sm:w-auto px-10 py-5 bg-black text-white font-bold rounded-full hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => setShowModal(true)}  className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-black/20 text-black font-bold rounded-full hover:bg-black/5 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} initialMode="register" />
    </>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="pt-20 pb-10 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center group">
  <img
    src="/assets/Screenshot_2026-03-01_104801-removebg-preview.png"
    alt="FundSphere"
    className="h-20 md:h-18 w-auto object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-md"
  />
</Link>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              The premium choice for digital asset management. Secure, elegant, and built for the future.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-dark-muted flex items-center justify-center text-gray-400 hover:text-gold hover:shadow-lg transition-all transform hover:-translate-y-1" aria-label="X / Twitter">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-dark-muted flex items-center justify-center text-gray-400 hover:text-gold hover:shadow-lg transition-all transform hover:-translate-y-1" aria-label="LinkedIn">
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-dark-muted flex items-center justify-center text-gray-400 hover:text-gold hover:shadow-lg transition-all transform hover:-translate-y-1" aria-label="GitHub">
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-dark-muted flex items-center justify-center text-gray-400 hover:text-gold hover:shadow-lg transition-all transform hover:-translate-y-1" aria-label="Telegram">
                <TelegramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 dark:text-white">Quick Links</h4>
            <ul className="space-y-4">
              {['Features', 'Security', 'Rewards', 'Loans', 'About Us'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-gray-500 dark:text-gray-400 hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          

          <div>
            <h4 className="font-bold text-lg mb-8 dark:text-white">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-3 text-gray-500 dark:text-gray-400">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span>support@fundsphere.com</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-500 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                <span>100 Wall St, New York, NY 10005, USA</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-500 dark:text-gray-400">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>+1 (800) FUNDSPHERE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} FundSphere. All Rights Reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="#" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
