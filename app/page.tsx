'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import EngagementFeatures from '../components/EngagementFeatures';
import SecuritySection from '../components/SecuritySection';
import { CallToAction, Footer } from '../components/Footer';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <EngagementFeatures />
      
      {/* 
      <SecuritySection />
      <CallToAction />
      <Footer /> 
      */}
    </main>
  );
}
