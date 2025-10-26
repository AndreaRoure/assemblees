
import React from 'react';

const Logo = () => {
  return (
    <video 
      src="/logo.webm"
      autoPlay
      loop
      muted
      playsInline
      className="h-16 md:h-20 mb-4"
      aria-label="Observatori d'Assamblees"
    />
  );
};

export default Logo;
