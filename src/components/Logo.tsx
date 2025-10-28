import React from 'react';
import logo from '@/assets/logo.png';

const Logo = () => {
  return (
    <img 
      src={logo}
      alt="Observatori d'Assemblees"
      className="h-16 md:h-20 mb-4 brightness-0 saturate-100 invert-0"
      style={{ filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)' }}
    />
  );
};

export default Logo;
