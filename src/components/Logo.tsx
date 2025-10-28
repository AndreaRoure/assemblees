import React from 'react';
import logo from '@/assets/logo.png';

const Logo = () => {
  return (
    <img 
      src={logo}
      alt="Observatori d'Assemblees"
      className="h-16 md:h-20 mb-4"
      style={{ 
        filter: 'brightness(0) saturate(100%)',
        color: 'rgb(147, 51, 234)'
      }}
    />
  );
};

export default Logo;
