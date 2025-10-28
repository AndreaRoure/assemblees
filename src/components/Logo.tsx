import React from 'react';
import logo from '@/assets/logo.png';

const Logo = () => {
  return (
    <div className="relative h-16 md:h-20 mb-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
      <img 
        src={logo}
        alt="Observatori d'Assemblees"
        className="relative h-full w-auto mix-blend-overlay brightness-0 invert"
      />
    </div>
  );
};

export default Logo;
