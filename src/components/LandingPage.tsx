
import React from 'react';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import BenefitsSection from './landing/BenefitsSection';
import FeaturesSection from './landing/FeaturesSection';
import UseCasesSection from './landing/UseCasesSection';
import Footer from './landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <UseCasesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
